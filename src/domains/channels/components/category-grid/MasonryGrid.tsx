'use client';

import React, { useState, useMemo } from 'react';
import { GridItem } from './GridItem';
import { CtaCard } from './CtaCard';
import { TestChannelItem } from '../TestChannelItem';
import { pastelColors, cardVariants } from '../../constants/masonryConstants';
import {
  getMockItems,
  distributeNoImageCards,
  insertSpecialCards,
  insertEmptyItems,
  insertTestChannelItem,
} from '../../utils/masonryUtils';
import { MasonryItem, CtaCardType, EmptyItemType, TestChannelItemType } from '../../types/masonry';
import { cn } from '@/lib/utils/styles';
import { useChannelModalStore } from '@/store/channelModalStore';
import { useAddChannelStore } from '@/store/addChannelStore';
import { ChannelData } from '../hero/heroData';
import { useChannels } from '../../hooks/useChannels';
import { ChannelResponse } from '@/api/generated';
import { mapChannelsToMasonryItems } from '../../utils/apiMappers';

// 타입 가드 함수들
function isMasonryItem(
  item: MasonryItem | CtaCardType | EmptyItemType | TestChannelItemType,
): item is MasonryItem {
  return !('type' in item);
}

function isCtaCard(
  item: MasonryItem | CtaCardType | EmptyItemType | TestChannelItemType,
): item is CtaCardType {
  return 'type' in item && item.type === 'cta';
}

function isEmptyItem(
  item: MasonryItem | CtaCardType | EmptyItemType | TestChannelItemType,
): item is EmptyItemType {
  return 'type' in item && item.type === 'empty';
}

function isTestChannelItem(
  item: MasonryItem | CtaCardType | EmptyItemType | TestChannelItemType,
): item is TestChannelItemType {
  return 'type' in item && item.type === 'test-channel';
}

interface MasonryGridProps {
  onExpandChange?: (isExpanded: boolean) => void;
}

export function MasonryGrid({ onExpandChange }: MasonryGridProps) {
  // API에서 채널 데이터 가져오기
  const {
    data: channelsData,
    isLoading,
    error,
  } = useChannels({
    page: 1,
    limit: 50, // 충분한 데이터를 가져와서 기존 레이아웃 유지
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // API 데이터와 기존 레이아웃 요소들을 조합
  const items = useMemo(() => {
    if (isLoading || error || !channelsData?.channels) {
      // 로딩 중이거나 에러일 때는 기존 mock 데이터 사용
      const mockItems = insertEmptyItems(
        insertSpecialCards(distributeNoImageCards(getMockItems()), 8),
        6,
      );
      return insertTestChannelItem(mockItems, 0); // 첫 번째 위치에 TestChannelItem 삽입
    }

    // API 데이터를 MasonryItem으로 변환
    const apiItems = mapChannelsToMasonryItems(channelsData.channels);

    // 기존 레이아웃을 유지하기 위해 특수 카드들과 빈 아이템들 추가
    const itemsWithSpecialCards = insertSpecialCards(distributeNoImageCards(apiItems), 8);
    const itemsWithEmptyItems = insertEmptyItems(itemsWithSpecialCards, 6);

    return insertTestChannelItem(itemsWithEmptyItems, 0); // 첫 번째 위치에 TestChannelItem 삽입
  }, [channelsData, isLoading, error]);
  const openModal = useChannelModalStore((state) => state.openModal);
  const openModalById = useChannelModalStore((state) => state.openModalById);
  const openAddChannelModal = useAddChannelStore((state) => state.openModal);

  const handleAddChannel = () => {
    openAddChannelModal();
  };

  const handleChannelClick = (channel: MasonryItem) => {
    // 채널 ID가 있으면 API로 조회, 없으면 기존 방식 사용
    if (channel.channelId) {
      openModalById(channel.channelId);
    } else {
      // API 데이터에서 원본 ChannelResponse 찾기
      const originalChannel = channelsData?.channels?.find(
        (apiChannel) => apiChannel.name === channel.title,
      );

      // MasonryItem을 ChannelData 형태로 변환하여 모달 열기
      const channelData: ChannelData = {
        name: channel.title,
        img: channel.imageUrl,
        description: originalChannel?.description || `${channel.category} 채널입니다.`,
        category: channel.category,
        followers: originalChannel?.subscriber_count
          ? `${originalChannel.subscriber_count.toLocaleString()}`
          : '0',
      };
      openModal(channelData);
    }
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 w-full">
        {Array.from({ length: 20 }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              'mb-4 break-inside-avoid animate-pulse',
              cardVariants[idx % cardVariants.length],
            )}
          >
            {/* 카테고리 + 배지 스켈레톤 */}
            <div className="flex items-start justify-between px-3 pt-3 pb-1 min-h-[28px]">
              <div className="w-16 h-3 bg-zinc-700 rounded animate-pulse"></div>
              <div className="flex gap-1">
                <div className="w-8 h-4 bg-zinc-700 rounded-full animate-pulse"></div>
                <div className="w-8 h-4 bg-zinc-700 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* 이미지 스켈레톤 */}
            <div className="relative w-full aspect-[4/5] bg-zinc-800 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-zinc-700 animate-pulse"></div>
            </div>

            {/* 텍스트 정보 스켈레톤 */}
            <div className="flex flex-col gap-2 px-3 py-2 flex-1">
              <div className="h-8 bg-zinc-700 rounded animate-pulse"></div>

              {/* Editors 아바타 스택 스켈레톤 */}
              <div className="flex items-center mt-1 gap-1">
                <div className="w-7 h-7 rounded-full bg-zinc-700 animate-pulse"></div>
                <div className="w-7 h-7 rounded-full bg-zinc-700 -ml-2 animate-pulse"></div>
                <div className="w-7 h-7 rounded-full bg-zinc-700 -ml-2 animate-pulse"></div>
              </div>

              <div className="w-20 h-3 bg-zinc-700 rounded animate-pulse mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 에러 상태 표시 (기존 mock 데이터로 fallback)
  if (error) {
    console.warn('Failed to load channels, using mock data:', error);
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 w-full">
      {items.map((item, idx) => {
        if (isCtaCard(item)) {
          return <CtaCard key={item.id} ctaIdx={item.ctaIdx} onClick={handleAddChannel} />;
        }

        if (isTestChannelItem(item)) {
          return <TestChannelItem key={item.id} />;
        }

        if (isEmptyItem(item)) {
          const cardClass = cardVariants[idx % cardVariants.length];
          return (
            <div
              key={item.id}
              className={cn(
                'mb-4 break-inside-avoid transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer group',
                cardClass,
              )}
            >
              <GridItem
                title={item.title}
                category={item.category}
                isEmpty={true}
                onAddChannel={handleAddChannel}
              />
            </div>
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
    </div>
  );
}
