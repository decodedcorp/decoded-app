'use client';

import { HoverItem } from '@/types/model.d';
import { ListItemImage } from '@/app/details/[imageId]/item-list/server/list-item-image';
import { ListItemInfo } from '@/app/details/[imageId]/item-list/server/list-item-info';
import { useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

interface ListItemsProps {
  items: HoverItem[];
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  hoveredItem: number | null;
  setHoveredItem: (index: number | null) => void;
  onItemClick: (item: HoverItem) => void;
}

export function ListItems({
  items,
  currentIndex,
  setCurrentIndex,
  hoveredItem,
  setHoveredItem,
  onItemClick,
}: ListItemsProps) {
  const handleMouseEnter = useCallback(
    (index: number) => {
      setHoveredItem(index);
    },
    [setHoveredItem]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, [setHoveredItem]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          if (!item || !item.info) return null;

          const isActive = hoveredItem === index;
          const uniqueKey = `${item.imageDocId}-${item.info.item.item._id}-${index}`;

          return (
            <div
              key={uniqueKey}
              className={`
                relative w-full group h-[80px] rounded-xl bg-[#1A1A1A] hover:bg-[#242424] transition-colors cursor-pointer
              `}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => onItemClick(item)}
            >
              <div className="flex items-center gap-4 px-4 h-full">
                <div className="w-[80px] h-[80px] shrink-0 p-2">
                  <ListItemImage item={item} isActive={isActive} />
                </div>
                <div className="flex-1 min-w-0">
                  <ListItemInfo item={item} isActive={isActive} />
                </div>
                <div className="shrink-0">
                  <ChevronRight className="w-5 h-5 text-white opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
