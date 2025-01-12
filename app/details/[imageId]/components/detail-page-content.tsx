'use client';

import Header from '@/app/details/[imageId]/components/server/header';
import ImageSection from '@/app/details/[imageId]/image-section/server';
import type { DetailPageState } from '@/types/model.d';
import { useEffect } from 'react';
import { itemsAPI } from '@/lib/api/endpoints/items';
import { useBoolean } from '@/lib/hooks/common/useBoolean';

interface DetailPageContentProps {
  initialData: DetailPageState;
  imageId: string;
  itemId?: string;
  showList: boolean;
}

export default function DetailPageContent({
  initialData,
  imageId,
  itemId,
  showList,
}: DetailPageContentProps) {
  const { value: isListVisible, setValue: setIsListVisible } =
    useBoolean(false);

  useEffect(() => {
    async function fetchItemData() {
      if (!itemId) return;
      try {
        await itemsAPI.getItemDetail(itemId);
      } catch (err) {
        console.error('Failed to fetch item details:', err);
      }
    }

    fetchItemData();
  }, [itemId]);

  useEffect(() => {
    if (showList) {
      setIsListVisible(true);
    }
  }, [showList, setIsListVisible]);

  if (!initialData.img) {
    return <div>Invalid data format</div>;
  }

  return (
    <div className="flex flex-col items-center my-5 w-full">
      <Header
        title={initialData.img.title || undefined}
        description={initialData.img.description || undefined}
      />
      <div className="flex justify-center w-full">
        <div className="flex justify-center">
          <ImageSection
            detailPageState={initialData}
            imageUrl={initialData.img.imageUrl}
          />
        </div>
      </div>
    </div>
  );
} 