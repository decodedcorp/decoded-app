'use client';

import React from 'react';
import { ContentType } from '@/api/generated';
import { useContentUploadStore, selectIsContentUploadModalOpen } from '@/store/contentUploadStore';
import {
  useCreateImageContent,
  useCreateVideoContent,
  useCreateLinkContent,
} from '@/domains/contents/hooks/useContents';
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
    if (aiGeneratedContent?.ai_gen_metadata && aiGeneratedContent.link_preview_metadata?.img_url) {
      console.log('AI generation completed with metadata and image:', aiGeneratedContent);
      setGeneratedContent({
        id: aiGeneratedContent.id,
        title: aiGeneratedContent.ai_gen_metadata.summary,
        description: aiGeneratedContent.ai_gen_metadata.summary,
        image_url: aiGeneratedContent.link_preview_metadata.img_url,
        created_at: aiGeneratedContent.created_at || new Date().toISOString(),
      });
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
  // const createVideoContent = useCreateVideoContent(); // Temporarily disabled
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
    try {
      // 인증 상태 확인
      const token = getValidAccessToken();
      if (!token) {
        setError('로그인이 필요합니다. 먼저 로그인해주세요.');
        return;
      }

      setLoading(true);
      setError(null);

      // channel_id가 없으면 기본값 설정
      const channelId = data.channel_id || 'test-channel-id';

      let result;

      switch (data.type) {
        case ContentType.IMAGE:
          result = await createImageContent.mutateAsync({
            channel_id: channelId,
            base64_img: data.base64_img_url,
          });
          break;

        // case ContentType.VIDEO:
        //   result = await createVideoContent.mutateAsync({
        //     channel_id: channelId,
        //     title: data.title,
        //     description: data.description,
        //     video_url: data.video_url,
        //     thumbnail_url: data.thumbnail_url,
        //   });
        //   break;

        case ContentType.LINK:
          result = await createLinkContent.mutateAsync({
            channel_id: channelId,
            url: data.url,
          });
          break;

        default:
          throw new Error('지원하지 않는 콘텐츠 타입입니다.');
      }

      console.log('Content created successfully:', result);

      // 채널 콘텐츠 캐시 무효화하여 새로고침 (single 페이지 포함)
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

      // 성공 시 모달을 닫지 않고 AI 생성 상태로 전환
      // closeModal(); // 이 줄을 주석처리

      // AI 생성 시작 - 실제 API 응답을 기다림
      console.log('Starting AI generation from modal...');
      startGeneration();
      console.log('AI generation started from modal, isGenerating should be true');

      // 생성된 콘텐츠 ID를 설정하여 polling 시작
      setCreatedContentId(result.id);
      console.log('Started polling for AI generated content with ID:', result.id);
    } catch (error: any) {
      console.error('Content creation failed:', error);

      // 인증 관련 에러 처리
      if (error.message?.includes('Authentication required')) {
        setError('로그인이 필요합니다. 먼저 로그인해주세요.');
      } else {
        setError(
          error?.response?.data?.detail || error.message || '콘텐츠 업로드 중 오류가 발생했습니다.',
        );
      }
    } finally {
      setLoading(false);
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
            onSubmit={() => handleSubmit(formData)}
          />
        )}
      </div>
    </BaseModal>
  );
}
