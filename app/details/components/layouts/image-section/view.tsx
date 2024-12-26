'use client';

import { DetailPageState } from '@/types/model.d';
import { MainImage } from './main-image';
import { ImageList } from '../list';
import { useState, useCallback } from 'react';
import { ImagePopup } from '../popup/popup';

export interface ImageViewProps {
  detailPageState: DetailPageState;
  imageUrl: string;
  isItemDetail?: boolean;
}

export function ImageView({ 
  detailPageState, 
  imageUrl,
  isItemDetail = false 
}: ImageViewProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const handleTouch = useCallback(() => {
    setIsTouch((prev) => !prev);
  }, []);

  const handleSetCurrentIndex = useCallback((index: number | null) => {
    setCurrentIndex(index);
  }, []);

  const handleSetHoveredItem = useCallback((index: number | null) => {
    setHoveredItem(index);
  }, []);

  if (isItemDetail) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-800">
        <div className="relative w-full h-full">
          <MainImage
            imageUrl={imageUrl}
            detailPageState={detailPageState}
            isItemDetail={true}
          />
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-row w-full justify-center mx-auto gap-[30px]">
      <div className="w-[569px] shrink-0">
        <div className="relative" onClick={handleTouch}>
          <MainImage
            imageUrl={imageUrl}
            detailPageState={detailPageState}
            isItemDetail={false}
          />
          <div className="absolute inset-0 z-10">
            <ImagePopup
              detailPageState={detailPageState}
              currentIndex={currentIndex}
              isTouch={isTouch}
              hoveredItem={hoveredItem}
              setHoveredItem={handleSetHoveredItem}
            />
          </div>
        </div>
      </div>
      <div className="w-[388px] shrink-0">
        <ImageList
          detailPageState={detailPageState}
          currentIndex={currentIndex}
          setCurrentIndex={handleSetCurrentIndex}
        />
      </div>
    </section>
  );
}
