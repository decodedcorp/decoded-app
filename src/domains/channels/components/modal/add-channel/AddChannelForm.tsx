'use client';

import React, { useRef, useState, useEffect } from 'react';

import {
  useAddChannelStore,
  selectAddChannelFormData,
  selectAddChannelError,
} from '@/store/addChannelStore';
import {
  compressImage,
  validateImageFile,
  logBase64Analysis,
  getCompressionRecommendations,
} from '@/lib/utils/imageUtils';

interface AddChannelFormProps {
  onSubmit: (data?: {
    name: string;
    description: string | null;
    thumbnail_base64?: string;
    banner_base64?: string;
  }) => void;
  isLoading: boolean;
  error?: string | null;
}

export function AddChannelForm({ onSubmit, isLoading, error }: AddChannelFormProps) {
  const formData = useAddChannelStore(selectAddChannelFormData);
  const storeError = useAddChannelStore(selectAddChannelError);
  const updateFormData = useAddChannelStore((state) => state.updateFormData);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
    thumbnail?: string;
    banner?: string;
  }>({});

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    updateFormData({ [field]: value });

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'thumbnail' | 'banner',
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`${type} file selected:`, file.name, file.type, file.size);

    // Validate file using utility function
    const validation = validateImageFile(file, {
      maxSizeBytes: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });

    if (!validation.isValid) {
      console.log('File validation failed:', validation.error);
      updateFormData({ [`${type}_base64`]: undefined });
      setValidationErrors((prev) => ({ ...prev, [type]: validation.error }));
      return;
    }

    try {
      console.log(`Starting ${type} image processing...`);
      // Different compression settings for thumbnail vs banner
      const compressionOptions =
        type === 'thumbnail'
          ? {
              maxSizeBytes: 500 * 1024, // 500KB
              maxWidth: 800,
              maxHeight: 600,
              quality: 0.8,
              format: 'jpeg' as const,
              includeDataPrefix: true,
            }
          : {
              maxSizeBytes: 800 * 1024, // 800KB for banner
              maxWidth: 1200,
              maxHeight: 400, // 300 → 400으로 증가
              quality: 0.85,
              format: 'jpeg' as const,
              includeDataPrefix: true,
            };

      const optimizedBase64 = await compressImage(file, compressionOptions);

      console.log(`${type} processed successfully, base64 length:`, optimizedBase64?.length);
      console.log('Base64 starts with data:', optimizedBase64?.startsWith('data:'));

      // 새로운 유틸 함수로 Base64 분석
      if (optimizedBase64) {
        logBase64Analysis(optimizedBase64, type);

        // 압축 권장사항 확인
        const compressionRecs = getCompressionRecommendations(optimizedBase64);
        if (compressionRecs.needsCompression) {
          console.warn(`🔧 ${type} 압축 권장사항:`, compressionRecs.reasons);
          console.log('💡 제안 설정:', {
            quality: compressionRecs.suggestedQuality,
            maxWidth: compressionRecs.suggestedMaxWidth,
            maxHeight: compressionRecs.suggestedMaxHeight,
            format: compressionRecs.suggestedFormat,
          });
        }
      }

      updateFormData({ [`${type}_base64`]: optimizedBase64 });
      console.log(`Form data updated with ${type}_base64`);
      console.log(`${type} base64 details:`, {
        length: optimizedBase64?.length,
        startsWithData: optimizedBase64?.startsWith('data:'),
        first50Chars: optimizedBase64?.substring(0, 50),
        last50Chars: optimizedBase64?.substring(-50),
      });
      setValidationErrors((prev) => ({ ...prev, [type]: undefined }));
    } catch (error) {
      console.error(`${type} processing error:`, error);
      updateFormData({ [`${type}_base64`]: undefined });
      setValidationErrors((prev) => ({ ...prev, [type]: `Failed to process ${type}` }));
    }
  };

  const handleRemoveImage = (type: 'thumbnail' | 'banner') => {
    updateFormData({ [`${type}_base64`]: undefined });
    const inputRef = type === 'thumbnail' ? thumbnailInputRef : bannerInputRef;
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const errors: { name?: string; description?: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Channel name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Channel name must be at least 3 characters';
    } else if (formData.name.trim().length > 50) {
      errors.name = 'Channel name must be less than 50 characters';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      thumbnail_base64: formData.thumbnail_base64,
      banner_base64: formData.banner_base64,
    };

    console.log('Submitting form data:', {
      name: submitData.name,
      description: submitData.description,
      thumbnail_base64: submitData.thumbnail_base64
        ? `${submitData.thumbnail_base64.substring(0, 50)}...`
        : 'undefined',
      banner_base64: submitData.banner_base64
        ? `${submitData.banner_base64.substring(0, 50)}...`
        : 'undefined',
    });

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Channel Name */}
      <div>
        <label htmlFor="channel-name" className="block text-sm font-medium text-white mb-2">
          Channel Name *
        </label>
        <input
          id="channel-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors ${
            validationErrors.name ? 'border-red-500' : 'border-zinc-700'
          }`}
          placeholder="Enter channel name"
          disabled={isLoading}
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
        )}
      </div>

      {/* Channel Description */}
      <div>
        <label htmlFor="channel-description" className="block text-sm font-medium text-white mb-2">
          Description
        </label>
        <textarea
          id="channel-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors resize-none ${
            validationErrors.description ? 'border-red-500' : 'border-zinc-700'
          }`}
          placeholder="Describe your channel (optional)"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-1">
          {validationErrors.description && (
            <p className="text-sm text-red-400">{validationErrors.description}</p>
          )}
          <p className="text-sm text-zinc-400 ml-auto">{formData.description.length}/500</p>
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Thumbnail Image</label>

        {formData.thumbnail_base64 ? (
          <div className="space-y-3">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-700">
              <img
                src={
                  formData.thumbnail_base64?.startsWith('data:')
                    ? formData.thumbnail_base64
                    : `data:image/jpeg;base64,${formData.thumbnail_base64}`
                }
                alt="Channel thumbnail preview"
                className="w-full h-full object-cover"
                onLoad={() => console.log('Thumbnail preview loaded successfully')}
                onError={(e) => {
                  console.error('Thumbnail preview failed to load:', e);
                  // 에러 발생 시 이미지 제거
                  handleRemoveImage('thumbnail');
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage('thumbnail')}
                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                disabled={isLoading}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-zinc-400">Click the X button to remove the image</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-32 h-32 border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center hover:border-zinc-600 transition-colors cursor-pointer">
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="flex flex-col items-center space-y-2 text-zinc-400 hover:text-zinc-300 transition-colors"
                disabled={isLoading}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs">Upload Thumbnail</span>
              </button>
            </div>
            <p className="text-sm text-zinc-400">Square (800x600) JPG, PNG up to 10MB</p>
          </div>
        )}

        {validationErrors.thumbnail && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.thumbnail}</p>
        )}

        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'thumbnail')}
          className="hidden"
          disabled={isLoading}
        />
      </div>

      {/* Banner Upload */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Banner Image</label>

        {formData.banner_base64 ? (
          <div className="space-y-3">
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-zinc-700">
              <img
                src={
                  formData.banner_base64?.startsWith('data:')
                    ? formData.banner_base64
                    : `data:image/jpeg;base64,${formData.banner_base64}`
                }
                alt="Channel banner preview"
                className="w-full h-full object-cover"
                onLoad={() => console.log('Banner preview loaded successfully')}
                onError={(e) => {
                  console.error('Banner preview failed to load:', e);
                  // 에러 발생 시 이미지 제거
                  handleRemoveImage('banner');
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage('banner')}
                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                disabled={isLoading}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-zinc-400">Click the X button to remove the banner</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              className="w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center hover:border-zinc-600 transition-colors cursor-pointer"
              onClick={() => {
                console.log('Banner upload clicked, bannerInputRef:', bannerInputRef.current);
                bannerInputRef.current?.click();
              }}
            >
              <div className="flex flex-col items-center space-y-2 text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs">Upload Banner</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400">Wide (1200x400) JPG, PNG up to 10MB</p>
          </div>
        )}

        {validationErrors.banner && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.banner}</p>
        )}

        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'banner')}
          className="hidden"
          disabled={isLoading}
        />
      </div>

      {/* API Error */}
      {(error || storeError) && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error || storeError}</p>
        </div>
      )}
    </form>
  );
}
