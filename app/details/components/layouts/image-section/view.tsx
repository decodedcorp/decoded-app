'use client';

import { DetailPageState, HoverItem } from '@/types/model.d';
import { MainImage } from './main-image';
import { ListItems } from '../../layouts/list/item-list/list-items';
import { ListHeader } from '../../layouts/list/item-list/list-header';
import { useState, useCallback, useEffect } from 'react';
import { ImagePopup } from '../popup/popup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCategories } from '@/lib/hooks/useCategories';
import ItemDetail from '../../layouts/list/item-detail';

export interface ImageViewProps {
  detailPageState: DetailPageState;
  imageUrl: string;
}

export function ImageView({ detailPageState, imageUrl }: ImageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<HoverItem | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const itemList = detailPageState.itemList ?? [];
  const {
    activeCategory,
    setActiveCategory,
    availableCategories,
    filteredItems,
    getCategoryCount,
  } = useCategories({ itemList });

  useEffect(() => {
    const itemId = searchParams.get('itemId');
    const showList = searchParams.get('showList') === 'true';

    if (itemId && showList) {
      const item = itemList.find(item => item.info.item.item._id === itemId);
      if (item) {
        setSelectedItem(item);
        setIsDetailVisible(true);
      }
    }
  }, [searchParams, itemList]);

  const handleTouch = useCallback(() => {
    setIsTouch((prev) => !prev);
  }, []);

  const handleSetCurrentIndex = useCallback((index: number | null) => {
    setCurrentIndex(index);
  }, []);

  const handleSetHoveredItem = useCallback((index: number | null) => {
    setHoveredItem(index);
  }, []);

  const handleItemClick = useCallback((item: HoverItem) => {
    router.push(`/details?imageId=${item.imageDocId}&itemId=${item.info.item.item._id}&showList=true`);
    setSelectedItem(item);
    setIsDetailVisible(true);
  }, [router]);

  const handleBack = useCallback(() => {
    const currentImageId = searchParams.get('imageId');
    if (currentImageId) {
      router.push(`/details?imageId=${currentImageId}`);
    }
    setIsDetailVisible(false);
  }, [router, searchParams]);

  if (!detailPageState.img) {
    return null;
  }

  const brandUrlList = detailPageState.brandUrlList ?? new Map();
  const brandImgList = detailPageState.brandImgList ?? new Map();
  const artistImgList = detailPageState.artistImgList ?? [];
  const artistList = detailPageState.artistList ?? [];
  const artistArticleList = detailPageState.artistArticleList ?? [];

  return (
    <section className="flex flex-row w-full h-full justify-center mx-auto gap-[30px]">
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
              artistArticleList,
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
                artistArticleList,
              }}
              currentIndex={currentIndex}
              isTouch={isTouch}
              hoveredItem={hoveredItem}
              setHoveredItem={handleSetHoveredItem}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </div>
      <div className="w-[388px] h-full shrink-0">
        <div className="relative h-full overflow-hidden">
          <div
            className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${
              isDetailVisible ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="flex flex-col h-full">
              <ListHeader
                onCategoryChange={setActiveCategory}
                availableCategories={availableCategories}
                itemList={itemList}
              />
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ListItems
                  items={filteredItems}
                  currentIndex={currentIndex}
                  setCurrentIndex={handleSetCurrentIndex}
                  hoveredItem={hoveredItem}
                  setHoveredItem={handleSetHoveredItem}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          </div>

          <div
            className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${
              isDetailVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {selectedItem && (
              <ItemDetail
                item={selectedItem}
                onClose={() => {
                  handleBack();
                  setTimeout(() => setSelectedItem(null), 300);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
