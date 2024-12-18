'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DetailPageState } from '@/types/model.d';
import { ImagePopup } from './popup';
import { ImageList } from './list';

interface ImageViewProps {
  detailPageState: DetailPageState;
  imageUrl: string;
}

export function ImageView({ detailPageState, imageUrl }: ImageViewProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <div className="flex flex-row w-full md:w-[1000px] md:flex-row justify-center mt-10 border border-white/10 rounded-xl">
      <div className="flex flex-col w-full justify-center min-w-[500px]">
        <div
          className="relative aspect-w-3 aspect-h-4"
          onClick={() => setIsTouch(!isTouch)}
        >
          <Image
            src={imageUrl}
            alt="Featured fashion"
            fill={true}
            style={{ objectFit: 'cover' }}
            className="rounded-xl"
          />
          <ImagePopup
            detailPageState={detailPageState}
            currentIndex={currentIndex}
            isTouch={isTouch}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />
        </div>
      </div>
      <ImageList
        detailPageState={detailPageState}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
