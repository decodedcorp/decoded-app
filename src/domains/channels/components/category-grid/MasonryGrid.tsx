'use client';

import React, { useMemo } from 'react';
import { GridItem } from './GridItem';
import { CtaCard } from './CtaCard';
import { MasonryGridSkeleton } from './MasonryGridSkeleton';
import { InfiniteScrollLoader } from './InfiniteScrollLoader';
import { pastelColors, cardVariants } from '../../constants/masonryConstants';
import { getMockItems, distributeNoImageCards, insertSpecialCards } from '../../utils/masonryUtils';
import { MasonryItem, CtaCardType } from '../../types/masonry';
import { cn } from '@/lib/utils/styles';
import { useChannelModalStore, ChannelData } from '@/store/channelModalStore';
import { useAddChannelStore } from '@/store/addChannelStore';
import { useInfiniteChannels } from '../../hooks/useChannels';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { ChannelResponse } from '@/api/generated';
import { mapChannelsToMasonryItems } from '../../utils/apiMappers';

// 타입 가드 함수들
function isMasonryItem(item: MasonryItem | CtaCardType): item is MasonryItem {
  return !('type' in item);
}

function isCtaCard(item: MasonryItem | CtaCardType): item is CtaCardType {
  return 'type' in item && item.type === 'cta';
}

interface MasonryGridProps {
  onExpandChange?: (isExpanded: boolean) => void;
}

export function MasonryGrid({ onExpandChange }: MasonryGridProps) {
  // 무한 스크롤로 채널 데이터 가져오기
  const {
    data: infiniteData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChannels({
    limit: 20, // 한 번에 20개씩 로드
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // 무한 스크롤 훅 사용
  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // 무한 스크롤 데이터에서 모든 채널 추출
  const allChannels = useMemo(() => {
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap((page) => page.channels || []);
  }, [infiniteData]);

  // API 데이터와 기존 레이아웃 요소들을 조합
  const items = useMemo(() => {
    if (isLoading || error || allChannels.length === 0) {
      // 로딩 중이거나 에러일 때는 기존 mock 데이터 사용
      const mockItems = insertSpecialCards(distributeNoImageCards(getMockItems()), 8);
      return mockItems;
    }

    // API 데이터를 MasonryItem으로 변환
    const apiItems = mapChannelsToMasonryItems(allChannels);

    // API 데이터가 충분하지 않으면 mock 데이터와 혼합
    let finalItems = apiItems;
    if (apiItems.length < 20) {
      const mockItems = getMockItems().slice(0, 20 - apiItems.length);
      finalItems = [...apiItems, ...mockItems];
    }

    // CTA 카드들을 조화롭게 배치 (8개마다 CTA, Add Channel CTA는 반드시 포함)
    const itemsWithSpecialCards = insertSpecialCards(distributeNoImageCards(finalItems), 8);

    return itemsWithSpecialCards;
  }, [allChannels, isLoading, error]);

  const openModal = useChannelModalStore((state) => state.openModal);
  const openModalById = useChannelModalStore((state) => state.openModalById);
  const openAddChannelModal = useAddChannelStore((state) => state.openModal);

  const handleCtaClick = (ctaIdx: number) => {
    switch (ctaIdx) {
      case 3: // Add Channel
        openAddChannelModal();
        break;
      case 0: // Recommended Artists
        console.log('Navigate to recommendations');
        break;
      case 1: // Trending Now
        console.log('Navigate to trending');
        break;
      case 2: // New Collection
        console.log('Navigate to collections');
        break;
      default:
        console.log('Unknown CTA action');
    }
  };

  const handleChannelClick = (channel: MasonryItem) => {
    // API 데이터가 있고, 해당 채널이 API 데이터에 있으면 ID로 모달 열기
    if (allChannels.length > 0) {
      const originalChannel = allChannels.find(
        (apiChannel: any) => apiChannel.name === channel.title,
      );

      if (originalChannel) {
        // API 데이터가 있으면 ID로 모달 열기
        openModalById(originalChannel.id);
        return;
      }
    }

    // API 데이터가 없거나 해당 채널이 없으면 mock 데이터로 모달 열기 (인증 불필요)
    const channelData: ChannelData = {
      id: `temp-${Date.now()}`,
      name: channel.title,
      description: `${channel.category} 채널입니다.`,
      owner_id: 'temp-owner',
      thumbnail_url: channel.imageUrl || null,
      subscriber_count: 0,
      content_count: 0,
      created_at: new Date().toISOString(),
      is_subscribed: false,
    };
    openModal(channelData);
  };

  // 로딩 상태 표시
  if (isLoading) {
    return <MasonryGridSkeleton />;
  }

  // 에러 상태 로깅 (기존 mock 데이터로 fallback)
  if (error) {
    console.warn('Failed to load channels, using mock data:', error);
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 w-full pt-4">
      {items.map((item, idx) => {
        if (isCtaCard(item)) {
          return (
            <CtaCard
              key={item.id}
              ctaIdx={item.ctaIdx}
              onClick={() => handleCtaClick(item.ctaIdx)}
            />
          );
        }

        if (isMasonryItem(item)) {
          const cardClass = cardVariants[idx % cardVariants.length];
          const avatarBorder = pastelColors[idx % pastelColors.length];
          return (
            <div
              key={idx}
              className={cn(
                'mb-4 break-inside-avoid transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer group',
                cardClass,
              )}
            >
              <GridItem
                imageUrl={item.imageUrl}
                title={item.title}
                category={item.category}
                editors={item.editors}
                date={item.date}
                isNew={item.isNew}
                isHot={item.isHot}
                avatarBorder={avatarBorder}
                onChannelClick={() => handleChannelClick(item)}
              />
            </div>
          );
        }

        return null;
      })}

      {/* 무한 스크롤 로딩 인디케이터 */}
      <InfiniteScrollLoader
        observerRef={observerRef}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
