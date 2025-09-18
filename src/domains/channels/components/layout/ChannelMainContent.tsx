'use client';

import React, { useState, useCallback, useMemo } from 'react';

import { AddChannelModal } from '@/domains/create/components/modal/add-channel/AddChannelModal';

import { ExploreFilters } from '../../types/filters';
import { ExploreGrid } from '../explore/ExploreGrid';
import { DiscoverSection } from '../explore/DiscoverSection';
import { TrendingContentsSection } from '../trending/TrendingContentsSection';
import { TrendingChannelsSection } from '../trending/TrendingChannelsSection';
import { ChannelModal, ContentModal } from '../modal';
import { LoadingState, ErrorState, EmptyState } from '../common/LoadingStates';
import { useChannels } from '../../hooks/useChannels';
import { useChannelModalStore } from '../../../../store/channelModalStore';
import { ChannelResponse } from '../../../../api/generated/models/ChannelResponse';
import { useChannelTranslation } from '../../../../lib/i18n/hooks';

interface ChannelMainContentProps {
  className?: string;
}

export function ChannelMainContent({ className = '' }: ChannelMainContentProps) {
  // Explore filters state
  const [filters, setFilters] = useState<ExploreFilters>({
    search: '',
    category: 'all',
    subcategory: 'all',
    sortBy: 'recent',
    sortOrder: 'desc',
  });

  // Translation hooks
  const { states } = useChannelTranslation();

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
      <div className={`relative h-full overflow-y-auto pt-[var(--header-h)] ${className}`}>
        <LoadingState title={states.searching()} />
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
  if (!channels.length) {
    return (
      <div className={`relative h-full overflow-y-auto pt-[var(--header-h)] ${className}`}>
        <EmptyState title={states.empty()} subtitle={states.emptySubtitle()} />
      </div>
    );
  }

  // Check if we should show organized sections or filtered grid
  const showOrganizedSections =
    !filters.search.trim() && filters.category === 'all' && filters.subcategory === 'all';

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
                channels={channels}
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
