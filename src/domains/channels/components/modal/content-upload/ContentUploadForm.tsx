'use client';

import React, { useRef, useState, useEffect } from 'react';

import { ContentType } from '@/api/generated';
import {
  useContentUploadStore,
  selectContentUploadFormData,
  selectContentUploadError,
  selectIsGenerating,
  selectGeneratedContent,
  selectGenerationProgress,
  selectGenerationError,
} from '@/store/contentUploadStore';
import LoadingAnimation from '@/components/LoadingAnimation';
import TiltedCard from '@/components/TiltedCard';
import { useCreateLinkContent, useCreateImageContent } from '@/domains/channels/hooks/useContents';
import { compressImage, validateImageFile } from '@/lib/utils/imageUtils';

interface ContentUploadFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ContentUploadForm({ onSubmit, isLoading, error }: ContentUploadFormProps) {
  const formData = useContentUploadStore(selectContentUploadFormData);
  const storeError = useContentUploadStore(selectContentUploadError);
  const isGenerating = useContentUploadStore(selectIsGenerating);
  const generatedContent = useContentUploadStore(selectGeneratedContent);
  const generationProgress = useContentUploadStore(selectGenerationProgress);
  const generationError = useContentUploadStore(selectGenerationError);
  const updateFormData = useContentUploadStore((state) => state.updateFormData);
  const startGeneration = useContentUploadStore((state) => state.startGeneration);
  const updateGenerationProgress = useContentUploadStore((state) => state.updateGenerationProgress);
  const setGeneratedContent = useContentUploadStore((state) => state.setGeneratedContent);
  const setGenerationError = useContentUploadStore((state) => state.setGenerationError);
  const resetGeneration = useContentUploadStore((state) => state.resetGeneration);

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
    isGenerating,
    generatedContent: !!generatedContent,
  });

  // AI 생성 시뮬레이션 (실제로는 API 호출)
  useEffect(() => {
    if (isGenerating) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // 5-20%씩 증가
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // AI 생성 완료 시뮬레이션
          setTimeout(() => {
            setGeneratedContent({
              id: `content_${Date.now()}`,
              title: `${formData.url} related content`,
              description: `AI-generated content based on the analysis of ${formData.url}. This content was automatically created based on the link's information.`,
              image_url: `https://picsum.photos/400/300?random=${Date.now()}`, // 랜덤 이미지
              created_at: new Date().toISOString(),
            });
          }, 500);
        }
        updateGenerationProgress(Math.min(progress, 100));
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isGenerating, formData.url, updateGenerationProgress, setGeneratedContent]);

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
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    // if (!formData.title.trim()) {
    //   errors.title = 'Please enter a title.';
    // }

    // if (formData.title.trim().length > 100) {
    //   errors.title = 'Title must be 100 characters or less.';
    // }

    // if (formData.description.trim().length > 500) {
    //   errors.description = 'Description must be 500 characters or less.';
    // }

    if (formData.type === ContentType.IMAGE && !formData.file) {
      errors.file = 'Please select an image.';
    }

    if (formData.type === ContentType.IMAGE && !formData.base64_img_url) {
      errors.file = 'Please select an image.';
    }

    // // if (formData.type === ContentType.VIDEO && !formData.file) {
    // //   errors.file = 'Please select a video.';
    // // }

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
          });

          console.log('Image content created successfully:', result);

          // AI 생성 시작 (실제로는 서버에서 처리)
          console.log('Starting AI generation...');
          startGeneration();
          console.log('AI generation started, isGenerating should be true');

          // 폼 제출 콜백 호출하여 모달 상태 업데이트
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
          });

          console.log('Link content created successfully:', result);

          // AI 생성 시작 (실제로는 서버에서 처리)
          console.log('Starting AI generation...');
          startGeneration();
          console.log('AI generation started, isGenerating should be true');

          // 폼 제출 콜백 호출하여 모달 상태 업데이트
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
        setGenerationError(error instanceof Error ? error.message : 'Failed to create content');
      }
    },
    [
      formData,
      validateForm,
      createImageContent,
      createLinkContent,
      startGeneration,
      onSubmit,
      updateFormData,
      setGenerationError,
    ],
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

  // AI 생성 중이거나 결과가 있을 때 다른 UI 표시
  console.log(
    'ContentUploadForm render - isGenerating:',
    isGenerating,
    'generatedContent:',
    generatedContent,
  );

  if (isGenerating || generatedContent) {
    return (
      <div className="p-6 space-y-6">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12">
            {/* 간단한 로딩 메시지 */}
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-white mb-2">
                AI is generating information...
              </h3>
              <p className="text-sm text-zinc-400">Processing your link content</p>
            </div>
            {generationError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{generationError}</p>
              </div>
            )}
          </div>
        )}

        {generatedContent && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {/* AI 생성 완료 시 항상 TiltedCard 표시 (이미지가 없어도 기본 이미지 사용) */}
            <div className="w-[400px] h-[300px]">
              <TiltedCard
                imageSrc={generatedContent.image_url || 'https://picsum.photos/400/300?random=1'}
                altText={generatedContent.title || 'Generated content'}
                captionText={generatedContent.title || 'AI generation complete!'}
                containerWidth="400px"
                containerHeight="300px"
                imageWidth="400px"
                imageHeight="300px"
                enablePixelTransition={true}
                pixelTransitionTrigger={true}
                gridSize={16}
                animationStepDuration={0.6}
              />
            </div>

            {/* 생성된 콘텐츠 정보 표시 */}
            <div className="text-center space-y-3 max-w-md">
              <h3 className="text-xl font-semibold text-white">
                {generatedContent.title || 'AI Generated Content'}
              </h3>
              {generatedContent.description && (
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {generatedContent.description}
                </p>
              )}
              <div className="text-xs text-zinc-500">
                Generated at {new Date(generatedContent.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Content Type Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Content Type *</label>
        <div className="grid grid-cols-1 gap-3">
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

      {/* File Upload for Image */}
      {formData.type === ContentType.IMAGE && (
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
              disabled={isLoading || createLinkContent.isPending}
            />
            {validationErrors.url && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.url}</p>
            )}
          </div>
        </div>
      )}

      {/* API Error */}
      {(error || storeError || generationError) && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">
            {error || storeError || generationError || 'An error occurred'}
          </p>
        </div>
      )}
    </form>
  );
}
