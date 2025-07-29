'use client';

import React, { useState, useMemo } from 'react';
import {
  useChannelModalStore,
  selectIsModalOpen,
  selectSelectedChannel,
  selectSelectedChannelId,
} from '@/store/channelModalStore';
import { useChannel } from '../../../hooks/useChannels';
import { BaseModal } from '../base/BaseModal';
import { ChannelModalContainer } from '../base/ChannelModalContainer';
import { ChannelModalHeader } from './ChannelModalHeader';
import { ChannelModalStats } from './ChannelModalStats';
import { ChannelModalEditors } from './ChannelModalEditors';
import { ChannelModalContent } from './ChannelModalContent';
import { ChannelModalRelated } from './ChannelModalRelated';
import { ChannelModalFooter } from './ChannelModalFooter';
import { ChannelModalSidebar } from './ChannelModalSidebar';
import type { SidebarFilters } from '@/domains/channels/components/sidebar/ChannelSidebar';
import { ChannelData } from '@/store/channelModalStore';

export function ChannelModal() {
  const isOpen = useChannelModalStore(selectIsModalOpen);
  const channel = useChannelModalStore(selectSelectedChannel);
  const channelId = useChannelModalStore(selectSelectedChannelId);
  const closeModal = useChannelModalStore((state) => state.closeModal);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 채널 ID로 API 데이터 가져오기
  const { data: apiChannel, isLoading, error } = useChannel(channelId || '');

  // 사이드바 상태 관리
  const [currentFilters, setCurrentFilters] = useState<SidebarFilters>({
    dataTypes: [],
    categories: [],
    tags: [],
  });

  const handleFilterChange = (filters: SidebarFilters) => {
    setCurrentFilters(filters);
    console.log('Filters changed:', filters);
    // TODO: Implement filter logic for content
  };

  // 채널 데이터 결정: API 데이터가 있으면 사용, 없으면 기존 데이터 사용
  const finalChannel = useMemo((): ChannelData | null => {
    if (apiChannel) {
      // API 데이터를 ChannelData 형태로 변환
      return {
        name: apiChannel.name,
        img: apiChannel.thumbnail_url || undefined,
        description: apiChannel.description || '채널 설명이 없습니다.',
        category: 'default', // TODO: API에서 카테고리 정보 추가 필요
        followers: apiChannel.subscriber_count ? apiChannel.subscriber_count.toLocaleString() : '0',
      };
    }
    return channel;
  }, [apiChannel, channel]);

  if (!finalChannel) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
    >
      <ChannelModalContainer
        sidebar={
          <ChannelModalSidebar
            currentFilters={currentFilters}
            onFilterChange={handleFilterChange}
          />
        }
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <ChannelModalHeader channel={finalChannel} onClose={closeModal} />

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {isLoading && (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center p-4">채널 정보를 불러오는데 실패했습니다.</div>
          )}
          {!isLoading && !error && (
            <>
              <ChannelModalStats channel={finalChannel} />
              <ChannelModalEditors />
              <ChannelModalContent />
              <ChannelModalRelated />
            </>
          )}
        </div>

        <ChannelModalFooter />
      </ChannelModalContainer>
    </BaseModal>
  );
}
