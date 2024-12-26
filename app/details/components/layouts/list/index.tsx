import { DetailPageState, HoverItem } from '@/types/model.d';
import { ListHeader } from './list-header';
import { ListProgress } from './list-progress';
import { ListItems } from './list-items';
import { ItemDetail } from './item-detail';
import { createNoImageItem } from './no-image';
import { useState } from 'react';

interface ImageListProps {
  detailPageState: DetailPageState;
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
}

export function ImageList({
  detailPageState,
  currentIndex,
  setCurrentIndex,
}: ImageListProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<HoverItem | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const baseItems = detailPageState.itemList ?? [];
  const noImageItem = createNoImageItem();
  const items: HoverItem[] = baseItems.length > 0 ? [...baseItems, noImageItem] : [];
  
  const totalItems = items.length;
  const decodedItems = items.filter(item => 
    Boolean(item.info?.brands?.length)
  ).length;
  const progressValue = (decodedItems / totalItems) * 100;

  const handleItemClick = (item: HoverItem) => {
    setIsTransitioning(true);
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setIsTransitioning(true);
    setSelectedItem(null);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <div className="relative h-full overflow-hidden">
      <div 
        className={`absolute inset-0 flex flex-col transition-transform duration-500 ease-in-out ${
          selectedItem ? 'translate-x-[-100%]' : 'translate-x-0'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="shrink-0">
          <ListHeader />
        </div>
        <div className="flex-1 min-h-0">
          <ListItems
            items={items}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            onItemClick={handleItemClick}
          />
        </div>
        <div className="shrink-0">
          <ListProgress value={progressValue} />
        </div>
      </div>

      <div 
        className={`absolute inset-0 flex flex-col transition-transform duration-500 ease-in-out ${
          selectedItem ? 'translate-x-0' : 'translate-x-[100%]'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {selectedItem && (
          <ItemDetail 
            item={selectedItem} 
            onClose={handleCloseDetail}
            isTransitioning={isTransitioning}
          />
        )}
      </div>
    </div>
  );
}
