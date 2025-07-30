'use client';

import React, { useRef, useState } from 'react';
import { ContentType } from '@/api/generated';
import {
  useContentUploadStore,
  selectContentUploadFormData,
  selectContentUploadError,
} from '@/store/contentUploadStore';
import { compressImage, validateImageFile } from '@/lib/utils/imageUtils';

interface ContentUploadFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ContentUploadForm({ onSubmit, isLoading, error }: ContentUploadFormProps) {
  const formData = useContentUploadStore(selectContentUploadFormData);
  const storeError = useContentUploadStore(selectContentUploadError);
  const updateFormData = useContentUploadStore((state) => state.updateFormData);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    file?: string;
    url?: string;
  }>({});

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    updateFormData({ [field]: value });

    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTypeChange = (type: ContentType) => {
    updateFormData({
      type,
      file: undefined,
      filePreview: undefined,
      img_url: undefined,
      video_url: undefined,
      url: undefined,
    });
    setValidationErrors({});
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file based on content type
    if (formData.type === ContentType.IMAGE) {
      const validation = validateImageFile(file, {
        maxSizeBytes: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      });

      if (!validation.isValid) {
        console.log('File validation failed:', validation.error);
        updateFormData({ file: undefined, filePreview: undefined });
        setValidationErrors((prev) => ({ ...prev, file: validation.error }));
        return;
      }

      try {
        console.log('Starting image processing...');
        const optimizedBase64 = await compressImage(file, {
          maxSizeBytes: 500 * 1024, // 500KB
          maxWidth: 800,
          maxHeight: 600,
          quality: 0.8,
          format: 'jpeg',
          includeDataPrefix: true,
        });

        console.log('Image processed successfully, base64 length:', optimizedBase64?.length);

        updateFormData({
          file,
          filePreview: URL.createObjectURL(file),
          base64_img_url: optimizedBase64,
        });
        setValidationErrors((prev) => ({ ...prev, file: undefined }));
      } catch (error) {
        console.error('Image processing failed:', error);
        updateFormData({ file: undefined, filePreview: undefined });
        setValidationErrors((prev) => ({
          ...prev,
          file: 'Error occurred while processing image.',
        }));
      }
    }
    // } else if (formData.type === ContentType.VIDEO) {
    //   // Video file validation - Temporarily disabled
    //   const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    //   if (!allowedVideoTypes.includes(file.type)) {
    //     setValidationErrors((prev) => ({
    //       ...prev,
    //       file: 'Unsupported video format. (MP4, WebM, OGG)',
    //     }));
    //     return;
    //   }

    //   if (file.size > 100 * 1024 * 1024) {
    //     // 100MB
    //     setValidationErrors((prev) => ({
    //       ...prev,
    //       file: 'Video file is too large. (Max 100MB)',
    //     }));
    //     return;
    //   }

    //   updateFormData({
    //     file,
    //     filePreview: URL.createObjectURL(file),
    //     video_url: URL.createObjectURL(file), // 임시 URL
    //   });
    //   setValidationErrors((prev) => ({ ...prev, file: undefined }));
    // }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'Please enter a title.';
    }

    if (formData.title.trim().length > 100) {
      errors.title = 'Title must be 100 characters or less.';
    }

    if (formData.description.trim().length > 500) {
      errors.description = 'Description must be 500 characters or less.';
    }

    if (formData.type === ContentType.IMAGE && !formData.file) {
      errors.file = 'Please select an image.';
    }

    if (formData.type === ContentType.IMAGE && !formData.base64_img_url) {
      errors.file = 'Please select an image.';
    }

    // if (formData.type === ContentType.VIDEO && !formData.file) {
    //   errors.file = 'Please select a video.';
    // }

    if (formData.type === ContentType.LINK && !formData.url?.trim()) {
      errors.url = 'Please enter a link URL.';
    }

    if (formData.type === ContentType.LINK && formData.url?.trim()) {
      try {
        new URL(formData.url.trim());
      } catch {
        errors.url = 'Please enter a valid URL format.';
      }
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
      type: formData.type,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      channel_id: formData.channel_id,
      ...(formData.type === ContentType.IMAGE && { img_url: formData.img_url }),
      ...(formData.type === ContentType.VIDEO && {
        video_url: formData.video_url,
        thumbnail_url: formData.thumbnail_url,
      }),
      ...(formData.type === ContentType.LINK && {
        url: formData.url?.trim(),
      }),
    };

    console.log('Submitting content data:', submitData);
    onSubmit(submitData);
  };

  const removeFile = () => {
    if (formData.filePreview) {
      URL.revokeObjectURL(formData.filePreview);
    }
    updateFormData({
      file: undefined,
      filePreview: undefined,
      img_url: undefined,
      video_url: undefined,
    });
    setValidationErrors((prev) => ({ ...prev, file: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Content Type Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Content Type *</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: ContentType.IMAGE, label: 'Image', icon: '🖼️' },
            // { type: ContentType.VIDEO, label: 'Video', icon: '🎥' }, // Temporarily disabled
            { type: ContentType.LINK, label: 'Link', icon: '🔗' },
          ].map(({ type, label, icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                formData.type === type
                  ? 'border-zinc-500 bg-zinc-700/50 text-white'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-sm font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Title */}
      <div>
        <label htmlFor="content-title" className="block text-sm font-medium text-white mb-2">
          Title *
        </label>
        <input
          id="content-title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors ${
            validationErrors.title ? 'border-red-500' : 'border-zinc-700'
          }`}
          placeholder="Enter content title"
          disabled={isLoading}
          maxLength={100}
        />
        {validationErrors.title && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.title}</p>
        )}
      </div>

      {/* Content Description */}
      <div>
        <label htmlFor="content-description" className="block text-sm font-medium text-white mb-2">
          Description
        </label>
        <textarea
          id="content-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors resize-none ${
            validationErrors.description ? 'border-red-500' : 'border-zinc-700'
          }`}
          placeholder="Enter content description (optional)"
          disabled={isLoading}
          maxLength={500}
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.description}</p>
        )}
        <p className="mt-1 text-xs text-zinc-500">{formData.description.length}/500</p>
      </div>

      {/* File Upload for Image */}
      {formData.type === ContentType.IMAGE && (
        // formData.type === ContentType.VIDEO && (
        <div>
          <label className="block text-sm font-medium text-white mb-3">Image Upload *</label>

          {formData.filePreview ? (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-zinc-800/50 border border-zinc-700/50">
                <img
                  src={formData.filePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-zinc-400">
                {formData.file?.name} ({(formData.file?.size || 0 / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center hover:border-zinc-600 transition-colors cursor-pointer">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center space-y-2 text-zinc-400 hover:text-zinc-300 transition-colors"
                  disabled={isLoading}
                >
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm">Select Image</span>
                </button>
              </div>
              <p className="text-sm text-zinc-400">JPG, PNG, WebP, GIF up to 10MB</p>
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

          {validationErrors.file && (
            <p className="mt-1 text-sm text-red-400">{validationErrors.file}</p>
          )}
        </div>
      )}

      {/* URL Input for Link */}
      {formData.type === ContentType.LINK && (
        <div className="space-y-4">
          <div>
            <label htmlFor="content-url" className="block text-sm font-medium text-white mb-2">
              Link URL *
            </label>
            <input
              id="content-url"
              type="url"
              value={formData.url || ''}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors ${
                validationErrors.url ? 'border-red-500' : 'border-zinc-700'
              }`}
              placeholder="https://example.com"
              disabled={isLoading}
            />
            {validationErrors.url && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.url}</p>
            )}
          </div>
        </div>
      )}

      {/* API Error */}
      {(error || storeError) && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error || storeError}</p>
        </div>
      )}
    </form>
  );
}
