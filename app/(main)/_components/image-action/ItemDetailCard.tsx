'use client';

import React from 'react';
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
    meta?.thumbUrl ||
    '/images/items/item-placeholder.png';

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-black/80 border-2 border-[#EAFD66] shadow-xl"
      style={{
        minWidth: 180,
        minHeight: 64,
        maxWidth: 220,
        overflow: 'hidden',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <img
        src={imageUrl}
        alt={itemName}
        className="w-12 h-12 rounded-lg bg-white object-cover flex-shrink-0"
        style={{ border: '1px solid #eee', maxWidth: 48, maxHeight: 48 }}
      />
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-gray-300 truncate" title={category}>{category}</span>
        <span className="text-base font-bold text-white truncate" title={itemName}>{itemName}</span>
      </div>
    </div>
  );
}
