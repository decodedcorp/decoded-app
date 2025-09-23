'use client';

import React, { useCallback } from 'react';

import { AddChannelModal } from '@/domains/create/components/modal/add-channel/AddChannelModal';

import { ExploreGrid } from '../explore/ExploreGrid';
import { DiscoverSection } from '../explore/DiscoverSection';
import { TrendingContentsSection } from '../trending/TrendingContentsSection';
import { TrendingChannelsSection } from '../trending/TrendingChannelsSection';
import { ChannelModal, ContentModal } from '../modal';
import { LoadingState, ErrorState, EmptyState } from '../common/LoadingStates';
import { ChannelPageSkeleton } from '@/shared/components/loading/ChannelPageSkeleton';
import { useChannelsData } from '../../hooks/useChannelData';
import { useChannelExploreFilters } from '../../hooks/useUnifiedFilters';
import { useChannelModalStore } from '../../../../store/channelModalStore';
import { ChannelResponse } from '../../../../api/generated/models/ChannelResponse';
import { useChannelTranslation } from '../../../../lib/i18n/hooks';

interface ChannelMainContentProps {
  className?: string;
}

export function ChannelMainContent({ className = '' }: ChannelMainContentProps) {
  // Translation hooks
  const { states } = useChannelTranslation();

  // 채널 모달 스토어
  const openChannelModal = useChannelModalStore((state) => state.openModal);

  // 통일된 채널 데이터 관리
  const { channels, isLoading, error, hasData } = useChannelsData({
    limit: 100,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // 통일된 필터 관리
  const { filters, updateFilters: handleFilterChange } = useChannelExploreFilters();

  // Channel click handler
  const handleChannelClick = useCallback(
    (channel: ChannelResponse) => {
      console.log('🎯 [ChannelMainContent] Channel clicked:', {
        id: channel.id,
        name: channel.name,
        owner_id: channel.owner_id,
        created_at: channel.created_at,
        fullChannel: channel,
      });

      // 작성자 ID와 작성시간을 명시적으로 전달
      const channelData = {
        ...channel,
        owner_id: channel.owner_id || 'test-owner-id', // 임시 테스트용
        created_at: channel.created_at || new Date().toISOString(), // 임시 테스트용
      };

      console.log('🎯 [ChannelMainContent] Channel data to pass:', {
        id: channelData.id,
        name: channelData.name,
        owner_id: channelData.owner_id,
        created_at: channelData.created_at,
        fullChannelData: channelData,
      });

      openChannelModal(channelData);
    },
    [openChannelModal],
  );

  // 로딩 상태 렌더링 - 채널 페이지 전용 스켈레톤 사용
  if (isLoading) {
    return (
      <div className={`relative h-full overflow-y-auto pt-[var(--header-h)] ${className}`}>
        <ChannelPageSkeleton />
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className={`relative h-full overflow-y-auto pt-[var(--header-h)] ${className}`}>
        <ErrorState title={states.loadError()} subtitle={states.loadErrorSubtitle()} />
      </div>
    );
  }

  // 채널이 없는 경우
  if (!hasData) {
    return (
      <div className={`relative h-full overflow-y-auto pt-[var(--header-h)] ${className}`}>
        <EmptyState title={states.empty()} subtitle={states.emptySubtitle()} />
      </div>
    );
  }

  // Check if we should show organized sections or filtered grid
  const showOrganizedSections =
    !filters.search?.trim() && filters.category === 'all' && filters.subcategory === 'all';

  return (
    <div className={`relative h-full overflow-hidden bg-black ${className}`}>
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <div className="pb-12">
          {showOrganizedSections ? (
            // Organized sections view (default explore experience)
            <>
              {/* Trending Contents Section */}
              <TrendingContentsSection className="mt-8 mb-16" />

              {/* Trending Channels Section */}
              <TrendingChannelsSection className="mb-16" />

              {/* All Channels Section */}
              <DiscoverSection
                onChannelClick={handleChannelClick}
                className=""
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
    </div>
  );
}
