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
      className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-black/80 border-2 border-[#EAFD66] shadow-xl"
      style={{
        minWidth: 180,
        minHeight: 64,
        maxWidth: 220,
        overflow: 'hidden',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={itemName}
            width={48}
            height={48}
            className="rounded-lg object-cover"
            style={{ maxWidth: 48, maxHeight: 48 }}
            onError={(e) => {
              // 이미지 로드 실패 시 플레이스홀더로 변경
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                    <span class="text-gray-500 font-bold text-xl leading-none">?</span>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
            <span className="text-gray-500 font-bold text-xl leading-none">?</span>
          </div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-gray-300 truncate" title={category}>{category}</span>
        <span className="text-base font-bold text-white truncate" title={itemName}>{itemName}</span>
      </div>
    </div>
  );
}
