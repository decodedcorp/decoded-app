'use client';

import { useSearchParams, notFound } from 'next/navigation';
import Header from './components/layouts/header';
import ImageSection from './components/sections/image-section';
import LoadingView from '@/components/ui/loading';
import type { ApiDetailPageState } from '@/types/model';
import { useEffect, useState } from 'react';
import { imagesAPI } from '@/lib/api/endpoints/images';
import { itemsAPI } from '@/lib/api/endpoints/items';
import { transformToDetailPageState } from '@/lib/utils/transform';
import { useBoolean } from '@/lib/hooks/useBoolean';

export default function DetailPage() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');
  const itemId = searchParams.get('itemId');
  const showList = searchParams.get('showList') === 'true';
  const { value: isListVisible, setValue: setIsListVisible } =
    useBoolean(false);

  const [detailPageState, setDetailPageState] =
    useState<ApiDetailPageState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!imageId) return;

      try {
        setIsLoading(true);
        const response = await imagesAPI.getImageDetail(imageId);

        if (!response || !response.data) {
          throw new Error('Invalid API response structure');
        }

        setDetailPageState(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch image details')
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [imageId]);

  useEffect(() => {
    async function fetchItemData() {
      if (!itemId) return;
      try {
        await itemsAPI.getItemDetail(itemId);
      } catch (err) {
        console.error('Failed to fetch item details');
      }
    }

    fetchItemData();
  }, [itemId]);

  useEffect(() => {
    if (showList) {
      setIsListVisible(true);
    }
  }, [showList, setIsListVisible]);

  if (!imageId) {
    notFound();
  }

  if (isLoading || !detailPageState) {
    return <LoadingView />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  const transformed = transformToDetailPageState(detailPageState);

  if (!transformed.img) {
    return <div>Invalid data format</div>;
  }

  return (
    <div className="flex flex-col items-center my-32 w-full">
      <Header
        title={transformed.img.title || undefined}
        description={transformed.img.description || undefined}
      />
      <div className="flex justify-center w-full">
        <div className="flex w-full max-w-[1280px] justify-center">
          <ImageSection
            detailPageState={transformed}
            imageUrl={detailPageState.img_url}
          />
        </div>
      </div>
    </div>
  );
}
