'use client';

import { useState, useCallback, memo } from 'react';
import { DetailPageState } from '@/types/model.d';
import { ImagePopup } from '../popup/popup';
import { ImageList } from '../list';
import { MainImage } from './main-image';

interface ImageViewProps {
  detailPageState: DetailPageState;
  imageUrl: string;
}

function ImageViewComponent({ detailPageState, imageUrl }: ImageViewProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const handleTouch = useCallback(() => {
    setIsTouch(prev => !prev);
  }, []);

  const handleSetCurrentIndex = useCallback((index: number | null) => {
    setCurrentIndex(index);
  }, []);

  const handleSetHoveredItem = useCallback((index: number | null) => {
    setHoveredItem(index);
  }, []);

  return (
    <section className="flex flex-row w-[1000px] mx-auto">
      <div className="w-[650px]">
        <MainImage
          imageUrl={imageUrl}
          onTouch={handleTouch}
        >
          <ImagePopup
            detailPageState={detailPageState}
            currentIndex={currentIndex}
            isTouch={isTouch}
            hoveredItem={hoveredItem}
            setHoveredItem={handleSetHoveredItem}
          />
        </MainImage>
      </div>
      <div className="w-[320px] ml-[30px]">
        <ImageList
          detailPageState={detailPageState}
          currentIndex={currentIndex}
          setCurrentIndex={handleSetCurrentIndex}
        />
      </div>
    </section>
  );
}

export const ImageView = memo(ImageViewComponent);
