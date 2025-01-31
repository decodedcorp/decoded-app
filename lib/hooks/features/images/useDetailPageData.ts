import { useState, useEffect, useCallback } from 'react';
import { imagesAPI } from '@/lib/api/endpoints/images';
import type { DetailPageState, ItemDocument } from '@/lib/api/types/image';

interface UseDetailPageDataReturn {
  detailPageState: DetailPageState | null;
  items: ItemDocument[];
  isLoading: boolean;
  error: Error | null;
  refreshItems: () => Promise<void>;
}

function transformToDetailPageState(data: any): DetailPageState {
  const itemList = Object.entries(data.img?.items || {}).flatMap(([key, items]: [string, any]) => {
    if (!Array.isArray(items)) return [];
    
    return items.map((item: any) => ({
      imageDocId: data.doc_id,
      info: {
        item: {
          item: {
            _id: item.item.item._id,
            name: item.item.item.metadata?.name || '',
            description: item.item.item.metadata?.description,
            img_url: item.item.item.img_url,
            price: item.item.item.price,
            metadata: item.item.item.metadata,
          },
          brand_name: item.item.brand_name,
          brand_logo_image_url: item.item.brand_logo_image_url,
        },
      },
      pos: {
        top: parseFloat(item.position?.top || '0'),
        left: parseFloat(item.position?.left || '0'),
      },
    }));
  });

  return {
    title: data.title,
    description: data.description,
    like: data.like || 0,
    style: data.style,
    img_url: data.img_url,
    source: data.source,
    upload_by: data.upload_by || '',
    doc_id: data.doc_id || '',
    decoded_percent: data.decoded_percent || 0,
    items: data.img?.items || {},
  };
}

export function useDetailPageData(imageId: string): UseDetailPageDataReturn {
  const [detailPageState, setDetailPageState] = useState<DetailPageState | null>(null);
  const [items, setItems] = useState<ItemDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetailPageState = useCallback(async () => {
    try {
      const response = await imagesAPI.getImageDetail(imageId);
      if (response.data) {
        const transformedData = transformToDetailPageState(response.data.images[0]);
        setDetailPageState(transformedData);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch detail page state'));
      return false;
    }
  }, [imageId]);

  const fetchItems = useCallback(async () => {
    try {
      const response = await imagesAPI.getImageItems(imageId);
      setItems(response.data.images[0] || []);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch items'));
      return false;
    }
  }, [imageId]);

  const refreshItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchItems();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const [detailSuccess, itemsSuccess] = await Promise.all([
          fetchDetailPageState(),
          fetchItems()
        ]);

        if (!detailSuccess || !itemsSuccess) {
          throw new Error('Failed to fetch data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [imageId, fetchDetailPageState, fetchItems]);

  return {
    detailPageState,
    items,
    isLoading,
    error,
    refreshItems
  };
} 