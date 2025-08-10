'use client';

import React from 'react';
import { ContentType } from '@/api/generated';
import { useContentUploadStore, selectIsContentUploadModalOpen } from '@/store/contentUploadStore';
import { useCreateImageContent, useCreateLinkContent } from '@/domains/channels/hooks/useContents';
import { useGetLinkContent } from '@/domains/channels/hooks/useContents';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { BaseModal } from '../base/BaseModal';
import { ContentUploadHeader } from './ContentUploadHeader';
import { ContentUploadForm } from './ContentUploadForm';
import { ContentUploadFooter } from './ContentUploadFooter';
import { getValidAccessToken } from '@/domains/auth/utils/tokenManager';

export function ContentUploadModal() {
  const isOpen = useContentUploadStore(selectIsContentUploadModalOpen);
  const closeModal = useContentUploadStore((state) => state.closeModal);
  const formData = useContentUploadStore((state) => state.formData);
  const setLoading = useContentUploadStore((state) => state.setLoading);
  const setError = useContentUploadStore((state) => state.setError);
  const isGenerating = useContentUploadStore((state) => state.isGenerating);
  const generatedContent = useContentUploadStore((state) => state.generatedContent);
  const startGeneration = useContentUploadStore((state) => state.startGeneration);
  const setGeneratedContent = useContentUploadStore((state) => state.setGeneratedContent);
  const setGenerationError = useContentUploadStore((state) => state.setGenerationError);

  const queryClient = useQueryClient();

  // AI 생성된 콘텐츠를 가져오기 위한 상태
  const [createdContentId, setCreatedContentId] = React.useState<string | null>(null);
  const { data: aiGeneratedContent, error: aiError } = useGetLinkContent(createdContentId);

  // AI 생성 완료 감지
  React.useEffect(() => {
    if (aiGeneratedContent) {
      console.log('AI generated content received:', aiGeneratedContent);

      // AI 생성 메타데이터가 있거나 링크 프리뷰 메타데이터가 있으면 완료로 처리
      const hasAiMetadata = aiGeneratedContent.ai_gen_metadata;
      const hasLinkPreview = aiGeneratedContent.link_preview_metadata;

      console.log('Content analysis:', {
        hasAiMetadata,
        hasLinkPreview,
        aiMetadata: aiGeneratedContent.ai_gen_metadata,
        linkPreview: aiGeneratedContent.link_preview_metadata,
        contentId: aiGeneratedContent.id,
        url: aiGeneratedContent.url,
      });

      if (hasAiMetadata || hasLinkPreview) {
        console.log('AI generation completed with metadata:', {
          hasAiMetadata,
          hasLinkPreview,
          aiMetadata: aiGeneratedContent.ai_gen_metadata,
          linkPreview: aiGeneratedContent.link_preview_metadata,
        });

        const generatedContentData = {
          id: aiGeneratedContent.id,
          title:
            aiGeneratedContent.ai_gen_metadata?.summary ||
            aiGeneratedContent.link_preview_metadata?.title ||
            'Untitled',
          description:
            aiGeneratedContent.ai_gen_metadata?.summary ||
            aiGeneratedContent.link_preview_metadata?.description ||
            '',
          image_url: aiGeneratedContent.link_preview_metadata?.img_url || '',
          created_at: aiGeneratedContent.created_at || new Date().toISOString(),
        };

        console.log('Setting generated content:', generatedContentData);
        setGeneratedContent(generatedContentData);
      } else {
        console.log('Content received but no metadata found yet, continuing to wait...');
      }
    }
  }, [aiGeneratedContent, setGeneratedContent]);

  // AI 에러 처리
  React.useEffect(() => {
    if (aiError) {
      console.error('AI generation error:', aiError);
      setGenerationError('Failed to generate AI content');
    }
  }, [aiError, setGenerationError]);

  // API mutations
  const createImageContent = useCreateImageContent();
  // // const createVideoContent = useCreateVideoContent(); // Temporarily disabled // Temporarily disabled
  const createLinkContent = useCreateLinkContent();

  const isLoading =
    createImageContent.isPending ||
    /* createVideoContent.isPending || */ createLinkContent.isPending;

  // 폼 유효성 검사
  const canSubmit = React.useMemo(() => {
    // 테스트용으로 임시 channel_id 설정
    const channelId = formData.channel_id || 'test-channel-id';

    switch (formData.type) {
      case ContentType.IMAGE:
        return !!formData.base64_img_url;
      // case ContentType.VIDEO:
      //   return !!formData.video_url;
      case ContentType.LINK:
        return !!formData.url?.trim();
      default:
        return false;
    }
  }, [formData]);

  const handleSubmit = async (data: any) => {
    console.log('ContentUploadModal handleSubmit called with data:', data);

    // ContentUploadForm에서 이미 API 호출이 완료되었으므로
    // 여기서는 추가적인 상태 관리만 수행
    try {
      // 채널 콘텐츠 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.contents.byChannel(data.channel_id),
      });

      // single 페이지 쿼리도 명시적으로 무효화
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.contents.byChannel(data.channel_id), 'single'],
      });

      // 모든 콘텐츠 관련 쿼리 무효화 (더 포괄적)
      queryClient.invalidateQueries({
        queryKey: queryKeys.contents.all,
      });

      console.log('Cache invalidated successfully');
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
    }
  };

  const handleCancel = () => {
    if (!isLoading && !isGenerating) {
      closeModal();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      contentClassName="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[600px] max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl flex flex-col">
        <ContentUploadHeader onClose={handleCancel} />

        <div className="flex-1 overflow-y-auto">
          <ContentUploadForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={useContentUploadStore((state) => state.error)}
          />
        </div>

        {/* AI 생성 중이거나 결과가 있을 때는 푸터 숨김 */}
        {!isGenerating && !generatedContent && (
          <ContentUploadFooter
            canSubmit={canSubmit}
            isLoading={isLoading}
            onCancel={handleCancel}
            onSubmit={() => {
              console.log('=== Footer submit button clicked ===');
              // 전역 함수를 통해 ContentUploadForm의 handleSubmit 호출
              if ((window as any).triggerContentFormSubmit) {
                console.log('Calling global submit function...');
                (window as any).triggerContentFormSubmit();
              } else {
                console.error('Global submit function not found!');
              }
            }}
          />
        )}
      </div>
    </BaseModal>
  );
}
