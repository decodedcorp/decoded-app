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
    <div className="flex gap-6 max-w-full mx-auto">
      {/* Left side - Upload Options */}
      <div className="flex-1">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Style your channel</h2>
          <p className="text-zinc-400">Adding visual flair will catch new members attention and help establish your channel's culture! You can update this at any time.</p>
        </div>

        <div className="space-y-6">
          {/* Banner Upload */}
          <div>
            <label className="text-lg font-medium text-white mb-3 block">Banner</label>
            <button
              onClick={() => handleFileSelect('banner')}
              className="w-full h-32 border-2 border-dashed border-zinc-600 rounded-lg flex items-center justify-center hover:border-[#eafd66] transition-colors bg-zinc-800/30"
            >
              <div className="text-center">
                <svg className="w-8 h-8 text-zinc-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div className="text-zinc-300 font-medium">Add</div>
              </div>
            </button>
            {previewData.banner && (
              <button
                onClick={() => handleImageRemove('banner')}
                className="mt-2 text-red-400 text-sm hover:text-red-300"
              >
                Remove banner
              </button>
            )}
          </div>

          {/* Icon Upload */}
          <div>
            <label className="text-lg font-medium text-white mb-3 block">Icon</label>
            <button
              onClick={() => handleFileSelect('thumbnail')}
              className="w-full h-32 border-2 border-dashed border-zinc-600 rounded-lg flex items-center justify-center hover:border-[#eafd66] transition-colors bg-zinc-800/30"
            >
              <div className="text-center">
                <svg className="w-8 h-8 text-zinc-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div className="text-zinc-300 font-medium">Add</div>
              </div>
            </button>
            {previewData.thumbnail && (
              <button
                onClick={() => handleImageRemove('thumbnail')}
                className="mt-2 text-red-400 text-sm hover:text-red-300"
              >
                Remove icon
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Preview */}
      <div className="flex-1">
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-700/50 overflow-hidden">
          {/* Banner section */}
          <div className="h-32 bg-zinc-800 relative overflow-hidden">
            {previewData.banner ? (
              <img
                src={previewData.banner}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-zinc-700 to-zinc-600"></div>
            )}
          </div>

          {/* Channel info section */}
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full -mt-12 border-4 border-zinc-900 bg-zinc-700 flex items-center justify-center relative">
                {previewData.thumbnail ? (
                  <img
                    src={previewData.thumbnail}
                    alt="Channel icon"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">r/</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  r/{step1Data.name || 'adfadadfadfd'}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-zinc-400">
                  <span>1 member</span>
                  <span>•</span>
                  <span>1 online</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange('banner', e)}
        className="hidden"
      />
      <input
        ref={thumbnailInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange('thumbnail', e)}
        className="hidden"
      />
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
