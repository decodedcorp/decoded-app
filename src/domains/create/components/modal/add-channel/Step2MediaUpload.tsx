import React, { useState, useEffect, useRef } from 'react';

import { X } from 'lucide-react';
import { validateImageFile, compressImage } from '@/lib/utils/imageUtils';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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
  const t = useCommonTranslation();
  const [formData, setFormData] = useState<Step2Data>(data);
  const isMobile = useMediaQuery('(max-width: 768px)');
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

  const handleImageUpload = async (field: 'thumbnail' | 'banner', file: File) => {
    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      // Set compression options based on field type
      const compressionOptions =
        field === 'thumbnail'
          ? {
              maxSizeBytes: 500 * 1024, // 500KB
              maxWidth: 800,
              maxHeight: 800,
              quality: 0.8,
              format: 'jpeg' as const,
              includeDataPrefix: true,
            }
          : {
              maxSizeBytes: 800 * 1024, // 800KB for banner
              maxWidth: 1200,
              maxHeight: 400,
              quality: 0.85,
              format: 'jpeg' as const,
              includeDataPrefix: true,
            };

      // Compress image
      const compressedBase64 = await compressImage(file, compressionOptions);
      const base64 = compressedBase64.split(',')[1]; // Remove data:image/...;base64, prefix

      const newData = {
        ...formData,
        [`${field}_base64`]: base64,
      };

      setFormData(newData);

      setPreviewData((prev) => ({
        ...prev,
        [field]: compressedBase64,
      }));

      // Update parent component if callback is provided
      if (onDataChange) {
        onDataChange(newData);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert(t.globalContentUpload.addChannel.errors.imageProcessingFailed());
    }
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
      handleImageUpload(field, file);
    }
  };

  const [dragOver, setDragOver] = useState<{
    thumbnail: boolean;
    banner: boolean;
  }>({
    thumbnail: false,
    banner: false,
  });

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent, field: 'thumbnail' | 'banner') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver((prev) => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, field: 'thumbnail' | 'banner') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver((prev) => ({ ...prev, [field]: false }));
  };

  const handleDrop = (e: React.DragEvent, field: 'thumbnail' | 'banner') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver((prev) => ({ ...prev, [field]: false }));

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (imageFile) {
      handleImageUpload(field, imageFile);
    } else {
      alert(t.globalContentUpload.addChannel.errors.pleaseDropImage());
    }
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Title and Description */}
      <div className="text-left mb-6">
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white mb-2`}>
          {t.globalContentUpload.addChannel.step2.title()}
        </h2>
        <p className="text-zinc-400">{t.globalContentUpload.addChannel.step2.subtitle()}</p>
      </div>

      {isMobile ? (
        /* Mobile Layout: Title -> Preview -> Input */
        <div className="flex flex-col gap-6">
          {/* Preview Section */}
          <div className="flex-1">
            <div className="bg-zinc-900/50 rounded-xl border border-zinc-700/50 overflow-hidden">
              {/* Banner section */}
              <div className="h-32 bg-zinc-800 relative overflow-hidden">
                {previewData.banner ? (
                  <img
                    src={
                      previewData.banner.startsWith('data:')
                        ? previewData.banner
                        : `data:image/jpeg;base64,${previewData.banner}`
                    }
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ Banner preview error:', e);
                      console.error('❌ Banner src:', previewData.banner?.substring(0, 100));
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-zinc-700 to-zinc-600 flex items-center justify-center">
                    <div className="text-center text-zinc-500">
                      <svg
                        className="w-8 h-8 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="text-xs text-zinc-500">
                        {t.globalContentUpload.addChannel.step2.addBanner()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Channel info section */}
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                    {previewData.thumbnail ? (
                      <img
                        src={
                          previewData.thumbnail.startsWith('data:')
                            ? previewData.thumbnail
                            : `data:image/jpeg;base64,${previewData.thumbnail}`
                        }
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('❌ Thumbnail preview error:', e);
                          console.error(
                            '❌ Thumbnail src:',
                            previewData.thumbnail?.substring(0, 100),
                          );
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-600 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-zinc-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Channel name */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">
                      {step1Data.name ||
                        t.globalContentUpload.addChannel.step1.preview.channelName()}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-zinc-400">
                      <span>{t.globalContentUpload.addChannel.step1.preview.newChannel()}</span>
                      <span>•</span>
                      <span>0 {t.globalContentUpload.addChannel.step1.preview.subscribers()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-zinc-300 text-sm">
                  {step1Data.description ||
                    t.globalContentUpload.addChannel.step1.preview.descriptionPlaceholder()}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Options Section */}
          <div className="flex-1">
            <div className="space-y-6">
              {/* Banner Upload */}
              <div>
                <label className="text-lg font-medium text-white mb-3 block">
                  {t.globalContentUpload.addChannel.step2.banner()}
                </label>
                <div
                  onDragOver={(e) => handleDragOver(e, 'banner')}
                  onDragLeave={(e) => handleDragLeave(e, 'banner')}
                  onDrop={(e) => handleDrop(e, 'banner')}
                  className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer relative overflow-hidden ${
                    dragOver.banner
                      ? 'border-[#eafd66] bg-[#eafd66]/10'
                      : 'border-zinc-600 hover:border-[#eafd66] bg-zinc-800/30'
                  }`}
                  onClick={() => handleFileSelect('banner')}
                >
                  {previewData.banner ? (
                    <img
                      src={
                        previewData.banner.startsWith('data:')
                          ? previewData.banner
                          : `data:image/jpeg;base64,${previewData.banner}`
                      }
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-zinc-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <div className="text-zinc-300 font-medium mb-1">
                        {t.globalContentUpload.addChannel.step2.addBanner()}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {t.globalContentUpload.addChannel.step2.clickOrDrag()}
                      </div>
                    </div>
                  )}
                </div>
                {previewData.banner && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleImageRemove('banner')}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      {t.globalContentUpload.addChannel.step2.removeBanner()}
                    </button>
                  </div>
                )}
              </div>

              {/* Icon Upload */}
              <div>
                <label className="text-lg font-medium text-white mb-3 block">
                  {t.globalContentUpload.addChannel.step2.icon()}
                </label>
                <div
                  onDragOver={(e) => handleDragOver(e, 'thumbnail')}
                  onDragLeave={(e) => handleDragLeave(e, 'thumbnail')}
                  onDrop={(e) => handleDrop(e, 'thumbnail')}
                  className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer relative overflow-hidden ${
                    dragOver.thumbnail
                      ? 'border-[#eafd66] bg-[#eafd66]/10'
                      : 'border-zinc-600 hover:border-[#eafd66] bg-zinc-800/30'
                  }`}
                  onClick={() => handleFileSelect('thumbnail')}
                >
                  {previewData.thumbnail ? (
                    <img
                      src={
                        previewData.thumbnail.startsWith('data:')
                          ? previewData.thumbnail
                          : `data:image/jpeg;base64,${previewData.thumbnail}`
                      }
                      alt="Icon preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-zinc-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <div className="text-zinc-300 font-medium mb-1">
                        {t.globalContentUpload.addChannel.step2.addIcon()}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {t.globalContentUpload.addChannel.step2.clickOrDrag()}
                      </div>
                    </div>
                  )}
                </div>
                {previewData.thumbnail && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleImageRemove('thumbnail')}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      {t.globalContentUpload.addChannel.step2.removeIcon()}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Layout: Title -> Input and Preview side by side */
        <div className="flex gap-6">
          {/* Upload Options Section */}
          <div className="flex-1">
            <div className="space-y-6">
              {/* Banner Upload */}
              <div>
                <label className="text-lg font-medium text-white mb-3 block">
                  {t.globalContentUpload.addChannel.step2.banner()}
                </label>
                <div
                  onDragOver={(e) => handleDragOver(e, 'banner')}
                  onDragLeave={(e) => handleDragLeave(e, 'banner')}
                  onDrop={(e) => handleDrop(e, 'banner')}
                  className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer relative overflow-hidden ${
                    dragOver.banner
                      ? 'border-[#eafd66] bg-[#eafd66]/10'
                      : 'border-zinc-600 hover:border-[#eafd66] bg-zinc-800/30'
                  }`}
                  onClick={() => handleFileSelect('banner')}
                >
                  {previewData.banner ? (
                    <img
                      src={
                        previewData.banner.startsWith('data:')
                          ? previewData.banner
                          : `data:image/jpeg;base64,${previewData.banner}`
                      }
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-zinc-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <div className="text-zinc-300 font-medium mb-1">
                        {t.globalContentUpload.addChannel.step2.addBanner()}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {t.globalContentUpload.addChannel.step2.clickOrDrag()}
                      </div>
                    </div>
                  )}
                </div>
                {previewData.banner && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleImageRemove('banner')}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      {t.globalContentUpload.addChannel.step2.removeBanner()}
                    </button>
                  </div>
                )}
              </div>

              {/* Icon Upload */}
              <div>
                <label className="text-lg font-medium text-white mb-3 block">
                  {t.globalContentUpload.addChannel.step2.icon()}
                </label>
                <div
                  onDragOver={(e) => handleDragOver(e, 'thumbnail')}
                  onDragLeave={(e) => handleDragLeave(e, 'thumbnail')}
                  onDrop={(e) => handleDrop(e, 'thumbnail')}
                  className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer relative overflow-hidden ${
                    dragOver.thumbnail
                      ? 'border-[#eafd66] bg-[#eafd66]/10'
                      : 'border-zinc-600 hover:border-[#eafd66] bg-zinc-800/30'
                  }`}
                  onClick={() => handleFileSelect('thumbnail')}
                >
                  {previewData.thumbnail ? (
                    <img
                      src={
                        previewData.thumbnail.startsWith('data:')
                          ? previewData.thumbnail
                          : `data:image/jpeg;base64,${previewData.thumbnail}`
                      }
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-zinc-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div className="text-zinc-300 font-medium mb-1">
                        {t.globalContentUpload.addChannel.step2.addIcon()}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {t.globalContentUpload.addChannel.step2.clickOrDrag()}
                      </div>
                    </div>
                  )}
                </div>
                {previewData.thumbnail && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleImageRemove('thumbnail')}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      {t.globalContentUpload.addChannel.step2.removeIcon()}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex-1">
            <div className="bg-zinc-900/50 rounded-xl border border-zinc-700/50 overflow-hidden">
              {/* Banner section */}
              <div className="h-32 bg-zinc-800 relative overflow-hidden">
                {previewData.banner ? (
                  <img
                    src={
                      previewData.banner.startsWith('data:')
                        ? previewData.banner
                        : `data:image/jpeg;base64,${previewData.banner}`
                    }
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ Banner preview error:', e);
                      console.error('❌ Banner src:', previewData.banner?.substring(0, 100));
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-zinc-700 to-zinc-600 flex items-center justify-center">
                    <div className="text-center text-zinc-500">
                      <svg
                        className="w-8 h-8 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">
                        {t.globalContentUpload.addChannel.step2.addBanner()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Channel info section */}
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full -mt-12 border-4 border-zinc-900 bg-zinc-700 flex items-center justify-center relative">
                    {previewData.thumbnail ? (
                      <img
                        src={
                          previewData.thumbnail.startsWith('data:')
                            ? previewData.thumbnail
                            : `data:image/jpeg;base64,${previewData.thumbnail}`
                        }
                        alt="Channel icon"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          console.error('❌ Thumbnail preview error:', e);
                          console.error(
                            '❌ Thumbnail src:',
                            previewData.thumbnail?.substring(0, 100),
                          );
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {step1Data.name ||
                        t.globalContentUpload.addChannel.step1.preview.channelName()}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-zinc-400">
                      <span>1 {t.globalContentUpload.addChannel.step2.preview.member()}</span>
                      <span>•</span>
                      <span>1 {t.globalContentUpload.addChannel.step2.preview.online()}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
