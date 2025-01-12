'use client';

import { DetailPageState, HoverItem } from '@/types/model.d';
import { MainImage } from '../server/main-image';
import { ListItems } from '../../item-list/client/list-items';
import { ListHeader } from '../../item-list/client/list-header';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { ImagePopup } from '@/app/details/ui/popup/popup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCategories } from '@/lib/hooks/features/ui/useCategories';
import ItemDetail from '../../item-detail/server';

interface ClientImageViewProps {
  detailPageState: DetailPageState;
  imageUrl: string;
}

export function ClientImageView({
  detailPageState,
  imageUrl,
}: ClientImageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<HoverItem | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const itemList = useMemo(() => {
    return detailPageState.itemList ?? [];
  }, [detailPageState.itemList]);

  const {
    activeCategory,
    setActiveCategory,
    availableCategories,
    filteredItems,
    getCategoryCount,
  } = useCategories({ itemList });

  useEffect(() => {
    const itemId = searchParams.get('itemId');
    
    if (itemId) {
      const item = itemList.find((item) => item.info.item.item._id === itemId);
      if (item) {
        setSelectedItem(item);
        setIsDetailVisible(true);
      }
    }

    // 브라우저 네비게이션 처리
    const handlePopState = () => {
      const itemId = new URL(window.location.href).searchParams.get('itemId');
      if (!itemId) {
        setSelectedItem(null);
        setIsDetailVisible(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [itemList, searchParams]);

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
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('itemId', item.info.item.item._id);
    router.push(`?${newSearchParams.toString()}`);
    setSelectedItem(item);
    setIsDetailVisible(true);
  }, [router, searchParams]);

  const handleBack = useCallback(() => {
    const pathname = window.location.pathname;
    const matches = pathname.match(/\/details\/([^/]+)/);
    
    if (matches) {
      const [, imageId] = matches;
      window.history.pushState({}, '', `/details/${imageId}`);
    }
    setIsDetailVisible(false);
  }, []);

  return (
    <section className="flex flex-row justify-center gap-[30px] bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] ring-1 ring-gray-800/30 max-h-[calc(100vh-2rem)]">
      <div className="shrink-0 flex items-center">
        <div className="relative w-full" onClick={handleTouch}>
          <MainImage imageUrl={imageUrl} detailPageState={detailPageState} />
          <div className="absolute inset-0 z-10">
            <ImagePopup
              detailPageState={detailPageState}
              currentIndex={currentIndex}
              isTouch={isTouch}
              hoveredItem={hoveredItem}
              setHoveredItem={handleSetHoveredItem}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </div>
      <div className="w-[388px] shrink-0">
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
            className={`absolute inset-0 flex flex-col transition-transform duration-500 ease-in-out ${
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
