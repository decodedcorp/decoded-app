'use client';

import { DetailPageState, HoverItem } from '@/types/model.d';
import { MainImage } from './main-image';
import { ImageList } from '../list';
import { useState, useCallback } from 'react';
import { ImagePopup } from '../popup/popup';

export interface ImageViewProps {
  detailPageState: DetailPageState;
  imageUrl: string;
}

export function ImageView({
  detailPageState,
  imageUrl,
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

  if (!detailPageState.img) {
    return null;
  }

  const itemList = detailPageState.itemList ?? [];
  const brandUrlList = detailPageState.brandUrlList ?? new Map();
  const brandImgList = detailPageState.brandImgList ?? new Map();
  const artistImgList = detailPageState.artistImgList ?? [];
  const artistList = detailPageState.artistList ?? [];
  const artistArticleList = detailPageState.artistArticleList ?? [];

  return (
    <section className="flex flex-row w-full justify-center mx-auto gap-[30px]">
      <div className="w-[569px] shrink-0">
        <div className="relative" onClick={handleTouch}>
          <MainImage
            imageUrl={imageUrl}
            detailPageState={{
              img: detailPageState.img,
              itemList,
              brandUrlList,
              brandImgList,
              artistImgList,
              artistList,
              artistArticleList
            }}
          />
          <div className="absolute inset-0 z-10">
            <ImagePopup
              detailPageState={{
                img: detailPageState.img,
                itemList,
                brandUrlList,
                brandImgList,
                artistImgList,
                artistList,
                artistArticleList
              }}
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
          detailPageState={{
            img: detailPageState.img,
            itemList,
            brandUrlList,
            brandImgList,
            artistImgList,
            artistList,
            artistArticleList
          }}
          currentIndex={currentIndex}
          setCurrentIndex={handleSetCurrentIndex}
        />
      </div>
    </section>
  );
}
