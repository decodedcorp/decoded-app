'use client';

import React, { useState, useEffect } from 'react';
import { GridItem } from './GridItem';
import { CtaCard } from './CtaCard';
import { ExpandedChannel } from '../hero/ExpandedChannel';
import { pastelColors, cardVariants } from '../../constants/masonryConstants';
import {
  getMockItems,
  distributeNoImageCards,
  insertSpecialCards,
  insertEmptyItems,
} from '../../utils/masonryUtils';
import { MasonryItem, CtaCardType, EmptyItemType } from '../../types/masonry';
import { cn } from '@/lib/utils/styles';

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
  const [expandedChannel, setExpandedChannel] = useState<MasonryItem | null>(null);

  // expanded 상태 변경 시 부모에게 알림
  useEffect(() => {
    onExpandChange?.(!!expandedChannel);
  }, [expandedChannel, onExpandChange]);

  const handleAddChannel = () => {
    // TODO: 채널 추가 모달 또는 페이지로 이동하는 로직 구현
    console.log('Add channel clicked');
    alert('채널 추가 기능이 구현될 예정입니다!');
  };

  const handleChannelClick = (channel: MasonryItem) => {
    setExpandedChannel(channel);
  };

  const handleCloseExpanded = () => {
    setExpandedChannel(null);
  };

  // ExpandedChannel이 열려있으면 그것만 렌더링
  if (expandedChannel) {
    // MasonryItem을 ChannelData 형태로 변환
    const channelData = {
      name: expandedChannel.title,
      img: expandedChannel.imageUrl,
      description: `${expandedChannel.category} 채널입니다.`,
      category: expandedChannel.category,
      followers: '1.2K', // 임시 데이터
    };

    return <ExpandedChannel channel={channelData} onClose={handleCloseExpanded} />;
  }

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
