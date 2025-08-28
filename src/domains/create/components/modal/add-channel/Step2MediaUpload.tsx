import React, { useState, useEffect, useRef } from 'react';

interface Step1Data {
  name: string;
  description: string;
}

interface Step2Data {
  thumbnail_base64: string | null;
  banner_base64: string | null;
}

interface Step2MediaUploadProps {
  step1Data: Step1Data;
  data: Step2Data;
  onDataChange?: (data: Step2Data) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export function Step2MediaUpload({
  step1Data,
  data,
  onDataChange,
  onBack,
  isLoading,
  error,
}: Step2MediaUploadProps) {
  const [formData, setFormData] = useState<Step2Data>(data);
  const [previewData, setPreviewData] = useState<{
    thumbnail: string | null;
    banner: string | null;
  }>({
    thumbnail: data.thumbnail_base64 ? `data:image/jpeg;base64,${data.thumbnail_base64}` : null,
    banner: data.banner_base64 ? `data:image/jpeg;base64,${data.banner_base64}` : null,
  });

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(data);
    setPreviewData({
      thumbnail: data.thumbnail_base64 ? `data:image/jpeg;base64,${data.thumbnail_base64}` : null,
      banner: data.banner_base64 ? `data:image/jpeg;base64,${data.banner_base64}` : null,
    });
  }, [data]);

  const handleImageUpload = (field: 'thumbnail' | 'banner', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1]; // Remove data:image/...;base64, prefix

      const newData = {
        ...formData,
        [`${field}_base64`]: base64,
      };

      setFormData(newData);

      setPreviewData((prev) => ({
        ...prev,
        [field]: result,
      }));

      // Update parent component if callback is provided
      if (onDataChange) {
        onDataChange(newData);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (field: 'thumbnail' | 'banner') => {
    const newData = {
      ...formData,
      [`${field}_base64`]: null,
    };

    setFormData(newData);

    setPreviewData((prev) => ({
      ...prev,
      [field]: null,
    }));

    // Update parent component if callback is provided
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const handleFileSelect = (field: 'thumbnail' | 'banner') => {
    const inputRef = field === 'thumbnail' ? thumbnailInputRef : bannerInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = (
    field: 'thumbnail' | 'banner',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Only image files can be uploaded.');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be 5MB or less.');
        return;
      }

      handleImageUpload(field, file);
    }
  };

  const [bannerPosition, setBannerPosition] = useState({ x: 50, y: 50 });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Media Upload</h2>
        <p className="text-zinc-400">Upload thumbnail and banner images for your channel.</p>
      </div>
      {/* Channel Preview */}
      <h3 className="text-lg font-semibold text-white mb-4 p-6 pb-0">Channel Preview</h3>
      <div className="mb-8 bg-zinc-900/95 rounded-xl border border-zinc-700/50 overflow-hidden">
        {/* 상단 배너 섹션 */}
        <div className="h-full bg-zinc-800 relative overflow-hidden">
          {previewData.banner ? (
            <div className="relative w-full h-full">
              <img
                src={previewData.banner}
                alt="Banner preview"
                className="w-full h-32 object-cover opacity-60"
                style={{
                  objectPosition: `${bannerPosition.x}% ${bannerPosition.y}%`,
                }}
              />

              {/* 배너 위치 조정 컨트롤 */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={() =>
                    setBannerPosition((prev) => ({ ...prev, x: Math.max(0, prev.x - 10) }))
                  }
                  className="w-8 h-8 bg-zinc-800/70 hover:bg-zinc-700/70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                  title="Move banner left"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setBannerPosition((prev) => ({ ...prev, x: Math.min(100, prev.x + 10) }))
                  }
                  className="w-8 h-8 bg-zinc-800/70 hover:bg-zinc-700/70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                  title="Move banner right"
                >
                  →
                </button>
                <button
                  onClick={() =>
                    setBannerPosition((prev) => ({ ...prev, y: Math.max(0, prev.y - 10) }))
                  }
                  className="w-8 h-8 bg-zinc-800/70 hover:bg-zinc-700/70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                  title="Move banner up"
                >
                  ↑
                </button>
                <button
                  onClick={() =>
                    setBannerPosition((prev) => ({ ...prev, y: Math.min(100, prev.y + 10) }))
                  }
                  className="w-8 h-8 bg-zinc-800/70 hover:bg-zinc-70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                  title="Move banner down"
                >
                  ↓
                </button>
                <button
                  onClick={() => setBannerPosition({ x: 50, y: 50 })}
                  className="w-8 h-8 bg-zinc-800/70 hover:bg-zinc-700/70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                  title="Reset banner position"
                >
                  ⌂
                </button>
              </div>
              {/* 배너 편집 버튼 */}
              <button
                onClick={() => handleFileSelect('banner')}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 transition-colors backdrop-blur-sm"
                title="Change banner image"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* 배너 제거 버튼 */}
              <button
                onClick={() => handleImageRemove('banner')}
                className="absolute top-4 right-16 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                title="Remove banner image"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              onClick={() => handleFileSelect('banner')}
              className="w-full h-full border-2 border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-[#eafd66] transition-colors"
            >
              <div className="text-center">
                <div className="text-zinc-400 text-sm">Click to upload banner image</div>
                <div className="text-zinc-500 text-xs mt-1">Recommended size: 1200x300px</div>
              </div>
            </div>
          )}

          {/* 배너 파일 입력 필드 */}
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange('banner', e)}
            className="hidden"
          />
        </div>

        {/* 하단 정보 섹션 */}
        <div className="bg-zinc-900/95 backdrop-blur-sm px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 아바타 + 채널 정보 */}
            <div className="flex items-center">
              {/* 편집 가능한 큰 아바타 - 배너에서 튀어나오게 */}
              <div className="relative -mt-10">
                {previewData.thumbnail ? (
                  <div className="relative">
                    <img
                      src={previewData.thumbnail}
                      alt="Channel thumbnail"
                      className="w-20 h-20 rounded-full border-4 border-black bg-black object-cover"
                    />
                    {/* 썸네일 편집 버튼 */}
                    <button
                      onClick={() => handleFileSelect('thumbnail')}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#eafd66] to-[#d4e85c] text-black rounded-full flex items-center justify-center text-sm hover:from-[#d4e85c] hover:to-[#eafd66] transition-all"
                      title="Change thumbnail image"
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* 썸네일 제거 버튼 */}
                    <button
                      onClick={() => handleImageRemove('thumbnail')}
                      className="absolute -top-1 -left-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      title="Remove thumbnail image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => handleFileSelect('thumbnail')}
                    className="w-20 h-20 rounded-full border-4 border-black bg-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-600 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-zinc-400 text-xs">Click to upload</div>
                      <div className="text-zinc-500 text-xs mt-1">300x300px</div>
                    </div>
                  </div>
                )}

                {/* 썸네일 파일 입력 필드 */}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('thumbnail', e)}
                  className="hidden"
                />
              </div>

              {/* 채널 정보 */}
              <div className="ml-4">
                <h4 className="text-2xl font-bold text-white">{step1Data.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-zinc-400 mt-1">
                  <span>0 followers</span>
                  <span>•</span>
                  <span>0 editors</span>
                </div>
                {step1Data.description && (
                  <p className="text-zinc-400 text-sm mt-2 max-w-md">{step1Data.description}</p>
                )}
              </div>
            </div>

            {/* 오른쪽: 액션 버튼들 */}
            <div className="flex items-center space-x-3">
              <button
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-medium transition-colors"
                disabled
              >
                + Add Content
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Upload Instructions */}
      <div className="text-center text-zinc-400 text-sm">
        <p>Images are optional. You can modify them anytime later.</p>
        <p className="mt-1">Supported formats: JPG, PNG, WebP (max 5MB)</p>
      </div>
    </div>
  );
}
