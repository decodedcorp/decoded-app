'use client';

import React, { useState, useCallback, useMemo } from 'react';

import { ExploreHeader, ExploreFilters } from '../explore/ExploreHeader';
import { ExploreGrid } from '../explore/ExploreGrid';
import { DiscoverSection } from '../explore/DiscoverSection';
import { ChannelModal, ContentModal } from '../modal';
import { AddChannelModal } from '@/domains/create/components/modal/add-channel/AddChannelModal';
import { LoadingState, ErrorState, EmptyState } from '../common/LoadingStates';
import { useChannels } from '../../hooks/useChannels';
import { useChannelModalStore } from '../../../../store/channelModalStore';
import { ChannelResponse } from '../../../../api/generated/models/ChannelResponse';

interface ChannelMainContentProps {
  className?: string;
}

export function ChannelMainContent({ className = '' }: ChannelMainContentProps) {
  // Explore filters state
  const [filters, setFilters] = useState<ExploreFilters>({
    search: '',
    category: 'all',
    sortBy: 'recent',
    sortOrder: 'desc',
  });

  // 채널 모달 스토어
  const openChannelModal = useChannelModalStore((state) => state.openModal);

  // 채널 데이터 가져오기
  const {
    data: channelsData,
    isLoading,
    error,
  } = useChannels({
    limit: 100, // Load more channels for better explore experience
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // 원본 채널 데이터
  const channels = useMemo(() => {
    return channelsData?.channels || [];
  }, [channelsData]);


  // Filter change handler
  const handleFilterChange = useCallback((newFilters: ExploreFilters) => {
    setFilters(newFilters);
  }, []);

  // Channel click handler
  const handleChannelClick = useCallback(
    (channel: ChannelResponse) => {
      console.log('Channel clicked:', channel);
      openChannelModal(channel);
    },
    [openChannelModal],
  );

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className={`relative h-full overflow-y-auto ${className}`}>
        <LoadingState title="큐레이터들을 찾는 중..." />
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className={`relative h-full overflow-y-auto ${className}`}>
        <ErrorState 
          title="큐레이터 정보를 불러올 수 없습니다"
          subtitle="잠시 후 다시 시도해 주세요"
        />
      </div>
    );
  }

  // 채널이 없는 경우
  if (!channels.length) {
    return (
      <div className={`relative h-full overflow-y-auto ${className}`}>
        <EmptyState 
          title="등록된 큐레이터가 없습니다"
          subtitle="새로운 채널을 추가해보세요"
        />
      </div>
    );
  }

  // Check if we should show organized sections or filtered grid
  const showOrganizedSections = !filters.search.trim() && filters.category === 'all';

  return (
    <div className={`relative h-full overflow-y-auto bg-black ${className}`}>
      {/* Top padding for Header - minimal */}
      <div className="h-[8px] md:h-[12px]" />
      
      {/* Explore Header */}
      <ExploreHeader 
        onFilterChange={handleFilterChange}
        totalChannels={channels.length}
      />

      <div className="px-4 md:px-8 pb-12">
        {showOrganizedSections ? (
          // Organized sections view (default explore experience)
          <>
            {/* Discover Section - Channel listings */}
            <DiscoverSection 
              channels={channels}
              onChannelClick={handleChannelClick}
              className="mt-16"
            />
          </>
        ) : (
          // Filtered grid view
          <div className="mt-8">
            <ExploreGrid 
              channels={channels}
              filters={filters}
              onChannelClick={handleChannelClick}
            />
          </div>
        )}
      </div>

      {/* Global Modals */}
      <ChannelModal />
      <ContentModal />
      <AddChannelModal />
    </div>
  );
}
