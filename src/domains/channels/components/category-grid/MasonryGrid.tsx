'use client';

import React from 'react';
import { GridItem } from './GridItem';
import { CtaCard } from './CtaCard';
import { pastelColors, cardVariants } from '../../constants/masonryConstants';
import {
  getMockItems,
  distributeNoImageCards,
  insertSpecialCards,
  insertEmptyItems,
} from '../../utils/masonryUtils';
import { MasonryItem, CtaCardType, EmptyItemType } from '../../types/masonry';
import { cn } from '@/lib/utils/styles';
import { useChannelModalStore } from '@/store/channelModalStore';
import { useAddChannelStore } from '@/store/addChannelStore';
import { ChannelData } from '../hero/heroData';

// 타입 가드 함수들
function isMasonryItem(item: MasonryItem | CtaCardType | EmptyItemType): item is MasonryItem {
  return !('type' in item);
}

function isCtaCard(item: MasonryItem | CtaCardType | EmptyItemType): item is CtaCardType {
  return 'type' in item && item.type === 'cta';
}

function isEmptyItem(item: MasonryItem | CtaCardType | EmptyItemType): item is EmptyItemType {
  return 'type' in item && item.type === 'empty';
}

// mock 데이터 준비
const MOCK_ITEMS: Array<MasonryItem | CtaCardType | EmptyItemType> = insertEmptyItems(
  insertSpecialCards(distributeNoImageCards(getMockItems()), 8),
  6,
);

interface MasonryGridProps {
  onExpandChange?: (isExpanded: boolean) => void;
}

export function MasonryGrid({ onExpandChange }: MasonryGridProps) {
  const items = MOCK_ITEMS;
  const openModal = useChannelModalStore((state) => state.openModal);
  const openAddChannelModal = useAddChannelStore((state) => state.openModal);

  const handleAddChannel = () => {
    openAddChannelModal();
  };

  const handleChannelClick = (channel: MasonryItem) => {
    // MasonryItem을 ChannelData 형태로 변환하여 모달 열기
    const channelData: ChannelData = {
      name: channel.title,
      img: channel.imageUrl,
      description: `${channel.category} 채널입니다.`,
      category: channel.category,
      followers: '1.2K', // 임시 데이터
    };
    openModal(channelData);
  };

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 w-full">
      {items.map((item, idx) => {
        if (isCtaCard(item)) {
          return <CtaCard key={item.id} ctaIdx={item.ctaIdx} />;
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
