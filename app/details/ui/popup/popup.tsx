'use client';

import { DetailPageState, HoverItem } from '@/types/model.d';
import { ItemButton } from '../buttons';

interface ImagePopupProps {
  detailPageState: DetailPageState;
  currentIndex: number | null;
  isTouch: boolean;
  hoveredItem: number | null;
  setHoveredItem: (index: number | null) => void;
  onItemClick?: (item: HoverItem) => void;
}

export function ImagePopup({
  detailPageState,
  currentIndex,
  isTouch,
  hoveredItem,
  setHoveredItem,
  onItemClick,
}: ImagePopupProps) {
  return (
    <div className="w-full">
      {/* 기존 아이템 버튼 */}
      {detailPageState.img &&
        detailPageState.itemList?.map((item, index) => {
          const uniqueKey = `${item.imageDocId}-${item.info.item.item._id}-${index}`;
          return (
            <div
              key={uniqueKey}
              style={{
                position: 'absolute',
                top: `${item.pos.top}%`,
                left: `${item.pos.left}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`point cursor-pointer ${
                currentIndex === index ? 'z-50' : 'z-10'
              }`}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => onItemClick?.(item)}
            >
              <ItemButton
                item={item}
                isActive={currentIndex === index || hoveredItem === index}
              />
            </div>
          );
        })}
    </div>
  );
}
