'use client';

import React from 'react';
import Image from 'next/image';
import type { DecodedItem } from '../../_types/image-grid';

interface ItemDetailCardProps {
  decodedItem: DecodedItem;
}

export function ItemDetailCard({ decodedItem }: ItemDetailCardProps) {
  const itemName = decodedItem?.item?.item?.metadata?.name ?? 'No item name';
  const meta = decodedItem?.item?.item?.metadata as any;
  const category = meta?.category || (decodedItem?.item as any)?.category || 'No category';
  const imageUrl =
    meta?.image_url ||
    meta?.imageUrl ||
    meta?.thumbnail_url ||
    meta?.thumbnailUrl ||
    meta?.thumb_url ||
    meta?.thumbUrl;

  const hasValidImage = imageUrl && imageUrl !== '/images/items/item-placeholder.png';

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      data-detail-card="true"
      className="flex items-center gap-2 px-2 py-1 rounded-xl bg-black/95 border-2 border-[#EAFD66] shadow-2xl"
      style={{
        minWidth: 140,
        minHeight: 40,
        maxWidth: 180,
        overflow: 'hidden',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(234, 253, 102, 0.2)',
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={itemName}
            width={32}
            height={32}
            className="rounded-md object-cover"
            style={{ maxWidth: 32, maxHeight: 32 }}
            onError={(e) => {
              // 이미지 로드 실패 시 플레이스홀더로 변경
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                    <span class="text-gray-500 font-bold text-base leading-none">?</span>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
            <span className="text-gray-500 font-bold text-base leading-none">?</span>
          </div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-gray-200 truncate font-medium" title={category} style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>{category}</span>
        <span className="text-xs font-bold text-white truncate" title={itemName} style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)' }}>{itemName}</span>
      </div>
    </div>
  );
}
