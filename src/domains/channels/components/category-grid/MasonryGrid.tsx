'use client';

import React from 'react';
import { GridItem } from './GridItem';
import { CtaCard } from './CtaCard';
import { pastelColors, cardVariants } from '../../constants/masonryConstants';
import { getMockItems, distributeNoImageCards, insertSpecialCards } from '../../utils/masonryUtils';
import { MasonryItem, CtaCardType } from '../../types/masonry';
import { cn } from '@/lib/utils/styles';

// 타입 가드 함수
function isMasonryItem(item: MasonryItem | CtaCardType): item is MasonryItem {
  return !('type' in item && item.type === 'cta');
}

// mock 데이터 준비
const MOCK_ITEMS: Array<MasonryItem | CtaCardType> = insertSpecialCards(
  distributeNoImageCards(getMockItems()),
  8,
);

export function MasonryGrid() {
  const items = MOCK_ITEMS;

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 w-full">
      {items.map((item, idx) => {
        if ('type' in item && item.type === 'cta') {
          return <CtaCard key={item.id} ctaIdx={item.ctaIdx} />;
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
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
