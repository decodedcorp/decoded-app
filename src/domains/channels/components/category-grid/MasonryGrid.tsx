'use client';

import React, { useMemo } from 'react';

import { cn } from '@/lib/utils/styles';
import { useChannelModalStore, ChannelData } from '@/store/channelModalStore';
import { useAddChannelStore } from '@/domains/create/store/addChannelStore';
import { ChannelResponse } from '@/api/generated';
import Masonry from '@/components/ReactBitsMasonry';

import { pastelColors, cardVariants } from '../../constants/masonryConstants';
import { getMockItems, distributeNoImageCards, insertSpecialCards } from '../../utils/masonryUtils';
import { MasonryItem, CtaCardType } from '../../types/masonry';
import { useInfiniteChannels } from '../../hooks/useChannels';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { mapChannelsToMasonryItems } from '../../utils/apiMappers';


import { InfiniteScrollLoader } from './InfiniteScrollLoader';
import { MasonryGridSkeleton } from './MasonryGridSkeleton';
import { CtaCard } from './CtaCard';
import { GridItem } from './GridItem';

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

  // 로딩 상태를 더 정확하게 판단
  const isDataReady = useMemo(() => {
    // 초기 로딩 중이거나 에러가 있으면 false
    if (isLoading) return false;

    // 에러가 있어도 mock 데이터를 사용할 수 있으므로 true
    if (error) return true;

    // 데이터가 있으면 true
    if (allChannels.length > 0) return true;

    // 로딩이 완료되었으면 true (mock 데이터 사용)
    return true;
  }, [isLoading, error, allChannels.length]);

  // 스켈레톤 표시 여부 결정
  const shouldShowSkeleton = useMemo(() => {
    // 초기 로딩 중일 때만 스켈레톤 표시
    return isLoading;
  }, [isLoading]);

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

  // 새로운 메이슨리 컴포넌트용 아이템 변환
  const masonryItems = useMemo(() => {
    return items
      .map((item, idx) => {
        if (isCtaCard(item)) {
          return {
            id: item.id,
            img: '', // CTA 카드는 이미지가 없음
            height: 280 + (idx % 3) * 40, // CTA 카드 높이 다양화
            type: 'cta' as const,
            ctaIdx: item.ctaIdx,
          };
        }

        if (isMasonryItem(item)) {
          // 편집자 수와 제목 길이에 따라 높이 조정
          const editorsCount = Array.isArray(item.editors) ? item.editors.length : 0;
          const titleLength = item.title?.length || 0;
          const baseHeight = 380;
          const editorsBonus = Math.min(editorsCount * 20, 60); // 편집자당 20px, 최대 60px
          const titleBonus = Math.min(titleLength * 2, 40); // 제목 길이당 2px, 최대 40px
          const categoryBonus = item.category ? 30 : 0;
          const badgesBonus = item.isNew || item.isHot ? 25 : 0;

          const dynamicHeight =
            baseHeight + editorsBonus + titleBonus + categoryBonus + badgesBonus;

          return {
            id: `channel-${idx}`,
            img: item.imageUrl || '',
            height: dynamicHeight, // 동적 높이 계산
            title: item.title,
            category: item.category,
            editors: item.editors,
            date: item.date,
            isNew: item.isNew,
            isHot: item.isHot,
            type: 'channel' as const,
          };
        }

        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [items]);

  // 커스텀 렌더링 함수
  const renderMasonryItem = (gridItem: any) => {
    const originalItem = items.find((item, idx) => {
      if (isCtaCard(item)) {
        return item.id === gridItem.id;
      }
      if (isMasonryItem(item)) {
        return `channel-${idx}` === gridItem.id;
      }
      return false;
    });

    if (!originalItem) return null;

    if (isCtaCard(originalItem)) {
      return (
        <div className="w-full h-full">
          <CtaCard
            ctaIdx={originalItem.ctaIdx}
            onClick={() => handleCtaClick(originalItem.ctaIdx)}
          />
        </div>
      );
    }

    if (isMasonryItem(originalItem)) {
      const idx = items.indexOf(originalItem);
      const cardClass = cardVariants[idx % cardVariants.length];
      const avatarBorder = pastelColors[idx % pastelColors.length];

      return (
        <div className={cn('w-full h-full', cardClass)}>
          <GridItem
            imageUrl={originalItem.imageUrl}
            title={originalItem.title}
            category={originalItem.category}
            editors={originalItem.editors}
            date={originalItem.date}
            isNew={originalItem.isNew}
            isHot={originalItem.isHot}
            avatarBorder={avatarBorder}
            onChannelClick={() => handleChannelClick(originalItem)}
          />
        </div>
      );
    }

    return null;
  };

  // 명확한 조건부 렌더링: 초기 로딩 중일 때만 스켈레톤 표시
  if (shouldShowSkeleton) {
    return <MasonryGridSkeleton />;
  }

  // 에러 상태 로깅 (기존 mock 데이터로 fallback)
  if (error) {
    console.warn('Failed to load channels, using mock data:', error);
  }

  return (
    <div className="w-full pt-4 animate-in fade-in duration-500">
      <Masonry
        items={masonryItems}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={0.98}
        blurToFocus={true}
        colorShiftOnHover={false}
        className="w-full min-h-[1200px]"
        onItemClick={(item) => {
          if (item.type === 'cta') {
            handleCtaClick(item.ctaIdx!);
          } else if (item.type === 'channel') {
            const originalItem = items.find(
              (originalItem, idx) => isMasonryItem(originalItem) && `channel-${idx}` === item.id,
            ) as MasonryItem;
            if (originalItem) {
              handleChannelClick(originalItem);
            }
          }
        }}
        renderItem={renderMasonryItem}
      />

      {/* 무한 스크롤 로딩 인디케이터 */}
      <InfiniteScrollLoader
        observerRef={observerRef}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
