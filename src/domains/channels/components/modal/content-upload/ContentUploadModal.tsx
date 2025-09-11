'use client';

import React from 'react';

import { ContentType } from '@/lib/types/ContentType';
import { useContentUploadStore, selectIsContentUploadModalOpen } from '@/store/contentUploadStore';
import { useCreateImageContent, useCreateLinkContent } from '@/domains/channels/hooks/useContents';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
// getValidAccessToken import 제거 (사용하지 않음)

import { BaseModal } from '../base/BaseModal';

import { ContentUploadHeader } from './ContentUploadHeader';
import { ContentUploadForm } from './ContentUploadForm';
import { ContentUploadFooter } from './ContentUploadFooter';

export function ContentUploadModal() {
  const isOpen = useContentUploadStore(selectIsContentUploadModalOpen);
  const closeModal = useContentUploadStore((state) => state.closeModal);
  const formData = useContentUploadStore((state) => state.formData);
  const setLoading = useContentUploadStore((state) => state.setLoading);
  const setError = useContentUploadStore((state) => state.setError);
  // AI 생성 관련 상태 제거 - 링크 포스트는 기본 포스트 동작으로 처리

  const queryClient = useQueryClient();

  // AI 생성 관련 로직 제거 - 링크 포스트는 기본 포스트 동작으로 처리

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

      // 콘텐츠 업로드 완료 후 모달 닫기
      closeModal();
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      closeModal();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      closeOnOverlayClick={true}
      closeOnEscape={true}
      titleId="content-upload-modal-title"
      descId="content-upload-modal-description"
    >
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[600px] lg:max-w-[600px] max-h-[90vh] sm:max-h-[85vh] md:max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl flex flex-col">
        <ContentUploadHeader onClose={handleCancel} />

        <div className="flex-1 overflow-y-auto">
          <ContentUploadForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={useContentUploadStore((state) => state.error)}
          />
        </div>

        {/* 푸터는 항상 표시 (AI 생성 로직 제거) */}
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
      </div>
    </BaseModal>
  );
}
