'use client';

import React from 'react';
import { ContentType } from '@/api/generated';
import { useContentUploadStore, selectIsContentUploadModalOpen } from '@/store/contentUploadStore';
import {
  useCreateImageContent,
  useCreateVideoContent,
  useCreateLinkContent,
} from '@/domains/contents/hooks/useContents';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
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

  const queryClient = useQueryClient();

  // API mutations
  const createImageContent = useCreateImageContent();
  const createVideoContent = useCreateVideoContent();
  const createLinkContent = useCreateLinkContent();

  const isLoading =
    createImageContent.isPending || createVideoContent.isPending || createLinkContent.isPending;

  // 폼 유효성 검사
  const canSubmit = React.useMemo(() => {
    if (!formData.title.trim() || !formData.channel_id) return false;

    switch (formData.type) {
      case ContentType.IMAGE:
        return !!formData.img_url;
      case ContentType.VIDEO:
        return !!formData.video_url;
      case ContentType.LINK:
        return !!formData.url?.trim() && !!formData.category?.trim();
      default:
        return false;
    }
  }, [formData]);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      let result;

      switch (data.type) {
        case ContentType.IMAGE:
          result = await createImageContent.mutateAsync({
            channel_id: data.channel_id,
            img_url: data.img_url,
          });
          break;

        case ContentType.VIDEO:
          result = await createVideoContent.mutateAsync({
            channel_id: data.channel_id,
            title: data.title,
            description: data.description,
            video_url: data.video_url,
            thumbnail_url: data.thumbnail_url,
          });
          break;

        case ContentType.LINK:
          result = await createLinkContent.mutateAsync({
            channel_id: data.channel_id,
            url: data.url,
            category: data.category,
          });
          break;

        default:
          throw new Error('지원하지 않는 콘텐츠 타입입니다.');
      }

      console.log('Content created successfully:', result);

      // 채널 콘텐츠 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: queryKeys.contents.byChannel(data.channel_id),
      });

      // 성공 시 모달 닫기
      closeModal();
    } catch (error: any) {
      console.error('Content creation failed:', error);
      setError(
        error?.response?.data?.detail || error.message || '콘텐츠 업로드 중 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
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
      onClose={closeModal}
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      contentClassName="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[800px] max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl flex flex-col">
        <ContentUploadHeader onClose={closeModal} />

        <div className="flex-1 overflow-y-auto">
          <ContentUploadForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={
              createImageContent.error?.message ||
              createVideoContent.error?.message ||
              createLinkContent.error?.message
            }
          />
        </div>

        <ContentUploadFooter
          onCancel={handleCancel}
          onSubmit={() => handleSubmit(formData)}
          isLoading={isLoading}
          canSubmit={canSubmit}
        />
      </div>
    </BaseModal>
  );
}
