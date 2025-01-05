import { useState, useEffect } from 'react';
import { imagesAPI } from '@/lib/api/endpoints/images';
import { DetailPageState, ItemDocument } from '@/lib/api/types/image';

interface UseDetailPageDataReturn {
  detailPageState: DetailPageState | null;
  items: ItemDocument[];
  isLoading: boolean;
  error: Error | null;
  refreshItems: () => Promise<void>;
}

export function useDetailPageData(imageId: string): UseDetailPageDataReturn {
  const [detailPageState, setDetailPageState] = useState<DetailPageState | null>(null);
  const [items, setItems] = useState<ItemDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetailPageState = async () => {
    try {
      setIsLoading(true);
      const response = await imagesAPI.getImageDetail(imageId);
      setDetailPageState(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch detail page state'));
    }
  };

  const fetchItems = async () => {
    try {
      const response = await imagesAPI.getImageItems(imageId);
      setItems(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch items'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshItems = async () => {
    setIsLoading(true);
    await fetchItems();
  };

  useEffect(() => {
    if (!imageId) return;

    const fetchData = async () => {
      await fetchDetailPageState();
      await fetchItems();
    };

    fetchData();
  }, [imageId]);

  return {
    detailPageState,
    items,
    isLoading,
    error,
    refreshItems
  };
} 