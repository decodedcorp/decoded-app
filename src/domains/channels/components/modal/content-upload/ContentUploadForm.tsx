'use client';

import React, { useRef, useState, useEffect } from 'react';

import { X, Image, Link, Upload } from 'lucide-react';
import { Button } from '@decoded/ui';
import { ContentType } from '@/lib/types/ContentType';
import {
  useContentUploadStore,
  selectContentUploadFormData,
  selectContentUploadError,
} from '@/store/contentUploadStore';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
// AI 생성 관련 컴포넌트 import 제거
import { useCreateLinkContent, useCreateImageContent } from '@/domains/channels/hooks/useContents';
import { compressImage, validateImageFile } from '@/lib/utils/imageUtils';

interface ContentUploadFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ContentUploadForm({ onSubmit, isLoading, error }: ContentUploadFormProps) {
  const t = useCommonTranslation();
  const formData = useContentUploadStore(selectContentUploadFormData);
  const storeError = useContentUploadStore(selectContentUploadError);
  const updateFormData = useContentUploadStore((state) => state.updateFormData);

  const createLinkContent = useCreateLinkContent();
  const createImageContent = useCreateImageContent();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    file?: string;
    url?: string;
  }>({});

  // 폼 상태 로깅
  console.log('ContentUploadForm render - formData:', {
    type: formData.type,
    url: formData.url,
    channel_id: formData.channel_id,
  });

  // AI 생성 시뮬레이션 로직 제거 - 링크 포스트는 기본 포스트 동작으로 처리

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
          file: t.globalContentUpload.contentUpload.validation.imageProcessingError(),
        }));
      }
    }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    // if (!formData.title.trim()) {
    //   errors.title = 'Please enter a title.';
    // }

    // if (formData.title.trim().length > 100) {
    //   errors.title = 'Title must be 100 characters or less.';
    // }

    if (formData.description && formData.description.trim().length > 500) {
      errors.description = t.globalContentUpload.contentUpload.validation.descriptionTooLong();
    }

    if (formData.type === ContentType.IMAGE && !formData.file) {
      errors.file = t.globalContentUpload.contentUpload.validation.imageRequired();
    }

    if (formData.type === ContentType.IMAGE && !formData.base64_img_url) {
      errors.file = t.globalContentUpload.contentUpload.validation.imageRequired();
    }

    // // if (formData.type === ContentType.VIDEO && !formData.file) {
    // //   errors.file = 'Please select a video.';
    // // }

    if (formData.type === ContentType.LINK && !formData.url?.trim()) {
      errors.url = t.globalContentUpload.contentUpload.validation.urlRequired();
    }

    if (formData.type === ContentType.LINK && formData.url?.trim()) {
      try {
        new URL(formData.url.trim());
      } catch {
        errors.url = t.globalContentUpload.contentUpload.validation.invalidUrl();
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log('=== handleSubmit called ===');
      console.log('Event type:', e.type);
      console.log('Form data at submit:', formData);

      if (!validateForm()) {
        console.log('Form validation failed');
        return;
      }

      const submitData = {
        type: formData.type,
        title: formData.title.trim() || 'Untitled', // 기본값 설정
        description: formData.description.trim() || null,
        channel_id: formData.channel_id || 'test-channel-id', // 테스트용 임시 채널 ID
        ...(formData.type === ContentType.IMAGE && { base64_img_url: formData.base64_img_url }),
        // ...(formData.type === ContentType.VIDEO && {
        //   video_url: formData.video_url,
        //   thumbnail_url: formData.thumbnail_url,
        // }),
        ...(formData.type === ContentType.LINK && {
          url: formData.url?.trim(),
        }),
      };

      // formData에 channel_id 설정
      if (!formData.channel_id) {
        updateFormData({ channel_id: 'test-channel-id' });
      }

      console.log('Submitting content data:', submitData);
      console.log('Form data type:', formData.type);
      console.log('Form data URL:', formData.url);
      console.log('Submit data channel_id:', submitData.channel_id);

      try {
        // 실제 API 호출
        if (
          formData.type === ContentType.IMAGE &&
          submitData.channel_id &&
          formData.base64_img_url
        ) {
          console.log('About to call createImageContent.mutateAsync...');
          const result = await createImageContent.mutateAsync({
            channel_id: submitData.channel_id,
            base64_img: formData.base64_img_url,
            description: formData.description?.trim() || null,
          });

          console.log('Image content created successfully:', result);

          // 이미지 포스트 생성 완료 후 바로 모달 닫기
          console.log('Image content created, closing modal...');
          onSubmit(submitData);
        } else if (formData.type === ContentType.LINK && submitData.channel_id && formData.url) {
          console.log('About to call createLinkContent.mutateAsync...');
          console.log('Link content data:', {
            channel_id: submitData.channel_id,
            url: formData.url.trim(),
          });
          console.log('createLinkContent mutation state:', {
            isPending: createLinkContent.isPending,
            isError: createLinkContent.isError,
            error: createLinkContent.error,
          });

          const result = await createLinkContent.mutateAsync({
            channel_id: submitData.channel_id,
            url: formData.url.trim(),
            description: formData.description?.trim() || null,
          });

          console.log('Link content created successfully:', result);

          // 링크 포스트 생성 완료 후 바로 모달 닫기 (기본 포스트 동작)
          console.log('Link content created, closing modal...');
          onSubmit(submitData);
        } else {
          console.log('Condition not met for API call');
          console.log('formData.type:', formData.type);
          console.log('submitData.channel_id:', submitData.channel_id);
          console.log('formData.base64_img_url exists:', !!formData.base64_img_url);
          console.log('formData.url:', formData.url);
          console.log('ContentType.LINK:', ContentType.LINK);
          console.log('formData.type === ContentType.LINK:', formData.type === ContentType.LINK);
          console.log('submitData.channel_id truthy:', !!submitData.channel_id);
          console.log('formData.url truthy:', !!formData.url);
        }
      } catch (error) {
        console.error('Failed to create content:', error);
        // 에러는 상위 컴포넌트에서 처리
      }
    },
    [formData, validateForm, createImageContent, createLinkContent, onSubmit, updateFormData],
  );

  // 외부에서 폼 제출을 트리거할 수 있도록 전역 함수 노출
  React.useEffect(() => {
    (window as any).triggerContentFormSubmit = () => {
      console.log('=== Global submit triggered ===');
      handleSubmit(new Event('submit') as any);
    };

    return () => {
      delete (window as any).triggerContentFormSubmit;
    };
  }, [handleSubmit]);

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

  // AI 생성 로직 제거 - 링크 포스트는 기본 포스트 동작으로 처리

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
      {/* Content Type Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          {t.globalContentUpload.contentUpload.contentType()} *
        </label>
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              type: ContentType.IMAGE,
              label: t.globalContentUpload.contentUpload.image(),
              icon: Image,
            },
            // { type: ContentType.VIDEO, label: 'Video', icon: '🎥' }, // Temporarily disabled
            {
              type: ContentType.LINK,
              label: t.globalContentUpload.contentUpload.link(),
              icon: Link,
            },
          ].map(({ type, label, icon: IconComponent }) => (
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
              <div className="flex items-center justify-center mb-2">
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload for Image */}
      {formData.type === ContentType.IMAGE && (
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            {t.globalContentUpload.contentUpload.imageUpload()} *
          </label>

          {formData.filePreview ? (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-zinc-800/50 border border-zinc-700/50">
                <img
                  src={formData.filePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <Button
                  type="button"
                  onClick={removeFile}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 w-8 h-8 rounded-full p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
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
                  <Upload className="w-8 h-8" />
                  <span className="text-sm">
                    {t.globalContentUpload.contentUpload.selectImage()}
                  </span>
                </button>
              </div>
              <p className="text-sm text-zinc-400">
                {t.globalContentUpload.contentUpload.fileFormats()}
              </p>
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
              {t.globalContentUpload.contentUpload.linkUrl()} *
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
              disabled={isLoading || createLinkContent.isPending}
            />
            {validationErrors.url && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.url}</p>
            )}
          </div>
        </div>
      )}

      {/* Description Input - shown for all content types */}
      <div>
        <label htmlFor="content-description" className="block text-sm font-medium text-white mb-2">
          {t.globalContentUpload.contentUpload.description()}
          <span className="text-zinc-400 font-normal ml-1">
            {t.globalContentUpload.contentUpload.optional()}
          </span>
        </label>
        <textarea
          id="content-description"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors resize-none ${
            validationErrors.description ? 'border-red-500' : 'border-zinc-700'
          }`}
          placeholder={t.globalContentUpload.contentUpload.addDescription()}
          rows={3}
          maxLength={500}
          disabled={isLoading || createLinkContent.isPending || createImageContent.isPending}
        />
        <div className="flex justify-between items-center mt-1">
          {validationErrors.description && (
            <p className="text-sm text-red-400">{validationErrors.description}</p>
          )}
          <p className="text-xs text-zinc-500 ml-auto">{(formData.description || '').length}/500</p>
        </div>
      </div>

      {/* API Error */}
      {(error || storeError) && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error || storeError || 'An error occurred'}</p>
        </div>
      )}
    </form>
  );
}
