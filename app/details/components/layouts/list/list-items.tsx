import { HoverItem } from '@/types/model.d';
import { ListItemImage } from './list-item-image';
import { ListItemInfo } from './list-item-info';
import { NoImageListItem } from './no-image';
import { useCallback } from 'react';

interface ListItemsProps {
  items: HoverItem[];
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  hoveredItem: number | null;
  setHoveredItem: (index: number | null) => void;
}

export function ListItems({
  items,
  currentIndex,
  setCurrentIndex,
  hoveredItem,
  setHoveredItem,
}: ListItemsProps) {
  const handleMouseEnter = useCallback((index: number) => {
    setCurrentIndex(index);
    setHoveredItem(index);
  }, [setCurrentIndex, setHoveredItem]);

  const handleMouseLeave = useCallback(() => {
    setCurrentIndex(null);
    setHoveredItem(null);
  }, [setCurrentIndex, setHoveredItem]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      <div className="flex flex-col gap-8">
        {items.map((item, index) => {
          if (!item || !item.info) return null;

          const isActive = currentIndex === index || hoveredItem === index;
          const hasImage = Boolean(item.info.imageUrl);

          return (
            <div
              key={`${item.info.name}-${index}`}
              className={hasImage ? "hover:bg-white/5 transition-colors cursor-pointer relative group" : ""}
              onMouseEnter={hasImage ? () => handleMouseEnter(index) : undefined}
              onMouseLeave={hasImage ? handleMouseLeave : undefined}
            >
              <div className="flex items-center gap-3">
                {hasImage ? (
                  <>
                    <ListItemImage item={item} isActive={isActive} />
                    <ListItemInfo item={item} isActive={isActive} />
                  </>
                ) : (
                  <NoImageListItem item={item} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
