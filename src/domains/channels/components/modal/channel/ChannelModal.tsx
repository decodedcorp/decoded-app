'use client';

import React from 'react';

import {
  useChannelModalStore,
  selectIsModalOpen,
  selectSelectedChannel,
  selectSelectedChannelId,
  selectChannelOwnerId,
  selectChannelCreatedAt,
} from '@/store/channelModalStore';
import { useContentModalStore, selectIsContentModalOpen } from '@/store/contentModalStore';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { useChannelSubscription } from '@/domains/interactions/hooks/useChannelSubscription';

import { useChannelData } from '../../../hooks/useChannelData';
import { useChannelContentFilters } from '../../../hooks/useUnifiedFilters';
import { BaseModal } from '../base/BaseModal';
import { ChannelModalContainer } from '../base/ChannelModalContainer';
import { ContentUploadModal } from '../content-upload/ContentUploadModal';
import { ChannelContentContainer } from '../../common/ChannelContentContainer';

import { ChannelModalHeader } from './ChannelModalHeader';
import { ChannelModalContent } from './ChannelModalContent';
import { ChannelModalSkeleton } from './ChannelModalSkeleton';

export function ChannelModal() {
  const isOpen = useChannelModalStore(selectIsModalOpen);
  const channel = useChannelModalStore(selectSelectedChannel);
  const channelId = useChannelModalStore(selectSelectedChannelId);
  const channelOwnerId = useChannelModalStore(selectChannelOwnerId);
  const channelCreatedAt = useChannelModalStore(selectChannelCreatedAt);
  const closeModal = useChannelModalStore((state) => state.closeModal);

  // 콘텐츠 모달 상태 확인
  const isContentModalOpen = useContentModalStore(selectIsContentModalOpen);

  // 현재 사용자 정보 가져오기
  const { user } = useUser();

  // 통일된 채널 데이터 관리
  const { channel: finalChannel, isLoading, error, hasData } = useChannelData(channelId);

  // 구독 기능
  const subscriptionHook = useChannelSubscription(channelId || '');

  // 통일된 필터 관리
  const { filters: currentFilters, updateFilters: handleFilterChange } = useChannelContentFilters();

  // 디버깅을 위한 로그
  React.useEffect(() => {
    console.log('🎯 [ChannelModal] Modal state changed:', {
      isOpen,
      channelId,
      hasChannel: !!finalChannel,
      channelData: finalChannel,
      channelOwnerId,
      channelCreatedAt,
      isContentModalOpen,
      isLoading,
      error: !!error,
    });
  }, [
    isOpen,
    channelId,
    finalChannel,
    channelOwnerId,
    channelCreatedAt,
    isContentModalOpen,
    isLoading,
    error,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      closeOnEscape={!isContentModalOpen}
      titleId="channel-modal-title"
      descId="channel-modal-description"
      enableFlexLayout={true}
    >
      <ChannelModalContainer>
        {/* Header */}
        <div className="flex-shrink-0">
          {finalChannel ? (
            <ChannelModalHeader
              channel={finalChannel}
              onClose={closeModal}
              onSubscribe={subscriptionHook?.toggleSubscription}
              onUnsubscribe={subscriptionHook?.toggleSubscription}
              isSubscribeLoading={subscriptionHook?.isLoading || false}
              currentUserId={user?.doc_id}
              subscriptionHook={subscriptionHook}
              // 작성자 정보 전달
              ownerId={channelOwnerId}
              createdAt={channelCreatedAt}
            />
          ) : (
            <ChannelModalSkeleton onClose={closeModal} />
          )}
        </div>

        {/* Main Content - 통일된 컨테이너 사용 */}
        <ChannelContentContainer
          isLoading={isLoading}
          error={error}
          hasData={hasData}
          loadingTitle="Loading channel content..."
          errorTitle="Failed to load channel content"
          errorSubtitle="Please try again later"
          emptyTitle="No content available"
          emptySubtitle="This channel doesn't have any content yet"
        >
          {finalChannel && (
            <ChannelModalContent
              currentFilters={{
                dataTypes: currentFilters.dataTypes || [],
                categories: currentFilters.categories || [],
                tags: currentFilters.tags || [],
                statuses: currentFilters.statuses || ['active'],
              }}
              channelId={channelId || undefined}
              onFilterChange={handleFilterChange}
            />
          )}
        </ChannelContentContainer>
      </ChannelModalContainer>

      {/* Content Upload Modal */}
      <ContentUploadModal />
    </BaseModal>
  );
}
