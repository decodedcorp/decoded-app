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
  onSubmit: (data: { name: string; description: string | null; thumbnail_base64?: string }) => void;
  isLoading: boolean;
  error?: string | null;
}

export function AddChannelForm({ onSubmit, isLoading, error }: AddChannelFormProps) {
  const formData = useAddChannelStore(selectAddChannelFormData);
  const storeError = useAddChannelStore(selectAddChannelError);
  const updateFormData = useAddChannelStore((state) => state.updateFormData);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    updateFormData({ [field]: value });

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file using utility function
    const validation = validateImageFile(file, {
      maxSizeBytes: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });

    if (!validation.isValid) {
      console.log('File validation failed:', validation.error);
      updateFormData({ thumbnail_base64: undefined });
      setValidationErrors((prev) => ({ ...prev, description: validation.error }));
      return;
    }

    try {
      console.log('Starting image processing...');
      // Use new image utility for compression
      const optimizedBase64 = await compressImage(file, {
        maxSizeBytes: 500 * 1024, // 500KB로 줄임 (기존 3MB)
        maxWidth: 800, // 1200에서 800으로 줄임
        maxHeight: 600, // 800에서 600으로 줄임
        quality: 0.8, // 0.9에서 0.8로 줄임
        format: 'jpeg',
        includeDataPrefix: true, // 백엔드에서 data: 접두어를 기대하는 것 같음
      });

      console.log('Image processed successfully, base64 length:', optimizedBase64?.length);
      console.log('Base64 starts with data:', optimizedBase64?.startsWith('data:'));

      // 새로운 유틸 함수로 Base64 분석
      if (optimizedBase64) {
        logBase64Analysis(optimizedBase64, 'thumbnail');

        // 압축 권장사항 확인
        const compressionRecs = getCompressionRecommendations(optimizedBase64);
        if (compressionRecs.needsCompression) {
          console.warn('🔧 압축 권장사항:', compressionRecs.reasons);
          console.log('💡 제안 설정:', {
            quality: compressionRecs.suggestedQuality,
            maxWidth: compressionRecs.suggestedMaxWidth,
            maxHeight: compressionRecs.suggestedMaxHeight,
            format: compressionRecs.suggestedFormat,
          });
        }
      }

      updateFormData({ thumbnail_base64: optimizedBase64 });
      console.log('Form data updated with thumbnail_base64');
      setValidationErrors((prev) => ({ ...prev, description: undefined }));
    } catch (error) {
      console.error('Image processing error:', error);
      updateFormData({ thumbnail_base64: undefined });
      setValidationErrors((prev) => ({ ...prev, description: 'Failed to process image' }));
    }
  };

  const handleRemoveThumbnail = () => {
    updateFormData({ thumbnail_base64: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    };

    console.log('Submitting form data:', {
      name: submitData.name,
      description: submitData.description,
      thumbnail_base64: submitData.thumbnail_base64
        ? `${submitData.thumbnail_base64.substring(0, 50)}...`
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
                src={`data:image/jpeg;base64,${formData.thumbnail_base64}`}
                alt="Channel thumbnail preview"
                className="w-full h-full object-cover"
                onLoad={() => console.log('Image preview loaded successfully')}
                onError={(e) => console.error('Image preview failed to load:', e)}
              />
              <button
                type="button"
                onClick={handleRemoveThumbnail}
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
                onClick={() => fileInputRef.current?.click()}
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
                <span className="text-xs">Upload Image</span>
              </button>
            </div>
            <p className="text-sm text-zinc-400">JPG, PNG up to 10MB (원본 품질 유지)</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
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
