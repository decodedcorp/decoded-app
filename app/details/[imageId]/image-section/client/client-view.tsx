'use client';

import { DetailPageState, HoverItem } from '@/types/model.d';
import { useState, useCallback, useMemo } from 'react';
import { ImageSection } from './components/image-section';
import { ListDetailSection } from './components/list-detail-section';
import { useItemUrlState } from './hooks/useItemUrlState';

interface ClientImageViewProps {
  detailPageState: DetailPageState;
  imageUrl: string;
}

export function ClientImageView({
  detailPageState,
  imageUrl,
}: ClientImageViewProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const itemList = useMemo(() => {
    return detailPageState.itemList ?? [];
  }, [detailPageState.itemList]);

  const {
    selectedItem,
    setSelectedItem,
    isDetailVisible,
    handleItemClick,
    handleBack,
  } = useItemUrlState(itemList);

  const handleTouch = useCallback(() => {
    setIsTouch((prev) => !prev);
  }, []);

  return (
    <section className="mt-5 grid grid-cols-[4fr_3fr] px-2 bg-gray-900 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] ring-1 ring-gray-800/30 max-h-[calc(100vh-2rem)]">
      <div className="w-full h-full overflow-hidden">
        <ImageSection
          imageUrl={imageUrl}
          detailPageState={detailPageState}
          currentIndex={currentIndex}
          isTouch={isTouch}
          hoveredItem={hoveredItem}
          onTouch={handleTouch}
          setHoveredItem={setHoveredItem}
          onItemClick={handleItemClick}
        />
      </div>

      <ListDetailSection
        itemList={itemList}
        isDetailVisible={isDetailVisible}
        selectedItem={selectedItem}
        currentIndex={currentIndex}
        hoveredItem={hoveredItem}
        setCurrentIndex={setCurrentIndex}
        setHoveredItem={setHoveredItem}
        setSelectedItem={setSelectedItem}
        onItemClick={handleItemClick}
        onBack={handleBack}
        detailPageState={detailPageState}
      />
    </section>
  );
}
