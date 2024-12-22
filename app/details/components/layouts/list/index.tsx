import { DetailPageState } from '@/types/model.d';
import { ListHeader } from './list-header';
import { ListProgress } from './list-progress';
import { ListItems } from './list-items';
import { createNoImageItem } from './no-image';
import { useState, useCallback } from 'react';

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
  const items = [...(detailPageState.itemList ?? []), createNoImageItem()];
  const currentProgress = currentIndex !== null ? currentIndex + 1 : 0;

  const handleHover = useCallback((index: number | null) => {
    setHoveredItem(index);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ListHeader />
      <ListItems
        items={items}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        hoveredItem={hoveredItem}
        setHoveredItem={handleHover}
      />
      <ListProgress total={items.length} current={currentProgress} />
    </div>
  );
}
