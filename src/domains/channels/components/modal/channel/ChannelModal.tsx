'use client';

import React, { useState, useMemo } from 'react';

import {
  useChannelModalStore,
  selectIsModalOpen,
  selectSelectedChannel,
  selectSelectedChannelId,
} from '@/store/channelModalStore';
import type { SidebarFilters } from '@/domains/channels/components/sidebar/ChannelSidebar';
import { ChannelData } from '@/store/channelModalStore';
import { formatDateByContext } from '@/lib/utils/dateUtils';

import { useChannel } from '../../../hooks/useChannels';
import { BaseModal } from '../base/BaseModal';
import { ChannelModalContainer } from '../base/ChannelModalContainer';
import { ContentUploadModal } from '../content-upload/ContentUploadModal';

import { ChannelModalHeader } from './ChannelModalHeader';
import { ChannelModalContent } from './ChannelModalContent';
import { ChannelModalSkeleton } from './ChannelModalSkeleton';



export function ChannelModal() {
  const isOpen = useChannelModalStore(selectIsModalOpen);
  const channel = useChannelModalStore(selectSelectedChannel);
  const channelId = useChannelModalStore(selectSelectedChannelId);
  const closeModal = useChannelModalStore((state) => state.closeModal);

  // 채널 ID로 API 데이터 가져오기
  const { data: apiChannel, isLoading, error } = useChannel(channelId || '');

  // 디버깅을 위한 로그
  React.useEffect(() => {
    if (apiChannel) {
      console.log('API Channel Data:', apiChannel);
    }
    if (error) {
      console.error('Channel API Error:', error);
    }
    console.log('Channel ID:', channelId);
    console.log('Channel from store:', channel);
    console.log('Is modal open:', isOpen);
  }, [apiChannel, error, channelId, channel, isOpen]);

  // 필터 상태 관리
  const [currentFilters, setCurrentFilters] = useState<SidebarFilters>({
    dataTypes: [],
    categories: [],
    tags: [],
    statuses: ['active'], // 기본값: active 콘텐츠만 표시
  });

  const handleFilterChange = (filters: SidebarFilters) => {
    setCurrentFilters(filters);
    console.log('Filters changed:', filters);
    // TODO: Implement filter logic for content
  };

  // 채널 데이터 결정: API 데이터를 직접 사용하거나 기존 데이터를 API 형식으로 변환
  const finalChannel = useMemo((): ChannelData | null => {
    if (apiChannel) {
      // API 데이터를 직접 사용
      return apiChannel;
    }
    if (channel) {
      // 기존 데이터를 API 형식으로 변환
      return {
        id: channel.id || '',
        name: channel.name,
        description: channel.description || null,
        owner_id: channel.owner_id || '',
        thumbnail_url: channel.thumbnail_url || null,
        subscriber_count: channel.subscriber_count || 0,
        content_count: channel.content_count || 0,
        created_at: channel.created_at || undefined,
        updated_at: channel.updated_at || null,
        is_subscribed: channel.is_subscribed || false,
      };
    }
    return null;
  }, [apiChannel, channel, channelId]);

  // finalChannel이 없어도 모달은 열어두고 로딩 상태 표시
  if (!isOpen) return null;

  // finalChannel이 없어도 모달은 열어두고 로딩 상태 표시
  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-fade-in"
    >
      <ChannelModalContainer>
        {/* Header */}
        <div className="flex-shrink-0">
          {finalChannel ? (
            <ChannelModalHeader
              channel={finalChannel}
              onClose={closeModal}
              onSubscribe={(channelId) => {
                console.log('Subscribe to channel:', channelId);
                // TODO: Implement subscribe functionality
              }}
              onUnsubscribe={(channelId) => {
                console.log('Unsubscribe from channel:', channelId);
                // TODO: Implement unsubscribe functionality
              }}
              isSubscribeLoading={false}
            />
          ) : (
            <ChannelModalSkeleton onClose={closeModal} />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {error && (
            <div className="text-red-500 text-center p-4">
              채널 정보를 불러오는데 실패했습니다.
            </div>
          )}
          {!error && finalChannel && (
            <ChannelModalContent 
              currentFilters={currentFilters} 
              channelId={channelId || undefined}
              onFilterChange={handleFilterChange}
            />
          )}
          {!error && !finalChannel && (
            <div className="space-y-6 p-6">
              {/* Stats 스켈레톤 */}
              <div className="space-y-4">
                <div className="flex space-x-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="h-6 w-12 bg-zinc-700 rounded mx-auto mb-1 animate-pulse" />
                      <div className="h-3 w-10 bg-zinc-800 rounded mx-auto animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                  ))}
                </div>
              </div>

              {/* Content 스켈레톤 */}
              <div>
                <div className="h-8 w-32 bg-zinc-700 rounded mb-6 animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-40 bg-zinc-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </ChannelModalContainer>

      {/* Content Upload Modal */}
      <ContentUploadModal />
    </BaseModal>
  );
}
