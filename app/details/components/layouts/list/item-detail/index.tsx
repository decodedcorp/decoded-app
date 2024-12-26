'use client';

import { HoverItem } from '@/types/model.d';
import { TopSection } from './top-section';
import { BottomSection } from './bottom-section';

interface ItemDetailProps {
  item: HoverItem;
  onClose: () => void;
  isTransitioning: boolean;
}

export function ItemDetail({
  item,
  onClose,
  isTransitioning,
}: ItemDetailProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-1">
        <TopSection
          item={item}
          onClose={onClose}
          isTransitioning={isTransitioning}
        />
      </div>
      <div className="flex-1 min-h-0">
        <BottomSection item={item} />
      </div>
    </div>
  );
}
