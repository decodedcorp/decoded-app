'use client';

import React, { useState, useCallback, useMemo } from 'react';

import { ExploreHeader, ExploreFilters } from '../explore/ExploreHeader';
import { ExploreGrid } from '../explore/ExploreGrid';
import { TrendingSection, CategorySection } from '../explore/CategorySection';
import { RecommendedSection } from '../explore/RecommendedSection';
import { ChannelModal, ContentModal } from '../modal';
import { AddChannelModal } from '../modal/add-channel/AddChannelModal';
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

  // Group channels by category for organized sections (exclude uncategorized)
  // Note: For now we'll use a simple categorization until API provides category field
  const categorizedChannels = useMemo(() => {
    const categoryGroups: Record<string, ChannelResponse[]> = {
      'technology': [],
      'design': [],
      'lifestyle': []
    };
    
    // Simple distribution of channels for now
    channels.forEach((channel, index) => {
      const categories = Object.keys(categoryGroups);
      const categoryIndex = index % categories.length;
      const category = categories[categoryIndex];
      categoryGroups[category].push(channel);
    });

    return categoryGroups;
  }, [channels]);

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
      {/* Top padding for Header */}
      <div className="h-[60px] md:h-[72px]" />
      
      {/* Explore Header */}
      <ExploreHeader 
        onFilterChange={handleFilterChange}
        totalChannels={channels.length}
      />

      <div className="px-4 md:px-8 pb-12">
        {showOrganizedSections ? (
          // Organized sections view (default explore experience)
          <>
            {/* Personalized Recommendations */}
            <RecommendedSection 
              channels={channels}
              onChannelClick={handleChannelClick}
              className="mt-8"
            />

            {/* Trending Section */}
            <TrendingSection 
              channels={channels}
              onChannelClick={handleChannelClick}
            />

            {/* Category Sections */}
            {Object.entries(categorizedChannels).map(([category, categoryChannels]) => {
              const displayTitle = category.charAt(0).toUpperCase() + category.slice(1);
              
              return (
                <CategorySection
                  key={category}
                  title={displayTitle}
                  channels={categoryChannels}
                  onChannelClick={handleChannelClick}
                  onViewAll={() => {
                    setFilters(prev => ({ ...prev, category }));
                  }}
                />
              );
            })}
            
            {/* Become an Editor CTA */}
            <section className="mt-20 mb-8">
              <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-700/30">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="w-12 h-12 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-400 mb-3">
                    당신만의 편집 철학을 공유해보세요
                  </h3>
                  <p className="text-gray-500 mb-6 text-lg leading-relaxed">
                    Decoded는 누구나 에디터가 될 수 있는 플랫폼입니다. <br />
                    당신의 독창적인 관점과 큐레이션으로 새로운 가치를 만들어보세요.
                  </p>
                  <div className="flex items-center justify-center space-x-6 mb-6 text-sm text-gray-500">
                    <span>무료로 시작</span>
                    <span>•</span>
                    <span>전문 도구 제공</span>
                    <span>•</span>
                    <span>커뮤니티 지원</span>
                  </div>
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-gray-300 font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
                    에디터 되기
                  </button>
                </div>
              </div>
            </section>
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
