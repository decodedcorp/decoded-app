'use client';

import { cn } from '@/lib/utils/style';
import { ImageDetails } from '@/lib/api/types/image';

interface ImagePopupProps {
  imageData: ImageDetails;
  currentIndex: number | null;
  hoveredItem: number | null;
  setHoveredItem: (index: number | null) => void;
  onItemClick?: (index: number) => void;
}

interface ItemButtonProps {
  isActive: boolean;
}

function ItemButton({ isActive }: ItemButtonProps) {
  return (
    <div
      className={cn(
        'w-3 h-3 rounded-full transition-all duration-200',
        isActive
          ? 'bg-white scale-125 shadow-lg'
          : 'bg-white/70 hover:bg-white hover:scale-110'
      )}
    />
  );
}

export function ImagePopup({
  imageData,
  currentIndex,
  hoveredItem,
  setHoveredItem,
  onItemClick,
}: ImagePopupProps) {
  const allItems = Object.values(imageData.items).flat();

  return (
    <div className="w-full">
      {allItems.map((item, index) => {
        const uniqueKey = `${imageData.doc_id}-${item.item.item._id}-${index}`;
        return (
          <div
            key={uniqueKey}
            style={{
              position: 'absolute',
              top: `${item.position.top}%`,
              left: `${item.position.left}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={cn(
              'point cursor-pointer',
              currentIndex === index ? 'z-50' : 'z-10'
            )}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => onItemClick?.(index)}
          >
            <ItemButton
              isActive={currentIndex === index || hoveredItem === index}
            />
          </div>
        );
      })}
    </div>
  );
}
