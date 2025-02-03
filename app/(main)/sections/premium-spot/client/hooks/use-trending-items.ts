import { useState, useEffect } from 'react';
import { ApiResponse, TrendingItem } from '../../types';
import { networkManager } from '@/lib/network/network';

function mapResponseToTrendingItems(response: ApiResponse): TrendingItem[] {
  if (!response.data) return [];

  return response.data.map((item) => ({
    id: item.item_doc_id,
    image: item.img_url,
    title: item.name || 'Unnamed Item',
    brand: item.brand,
    views: item.views,
    requestCount: item.like,
    exposureRate: item.exposure_rate,
    trendingScore: item.trending_score,
    featured: item.trending_score > 30,
    imageDocId: item.image_doc_id,
    itemDocId: item.item_doc_id,
  }));
}

export function useTrendingItems() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrendingItems() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await networkManager.request<ApiResponse>(
          'metrics/trending/items?limit=9',
          'GET'
        );

        if (!isMounted) return;

        const transformedItems = mapResponseToTrendingItems(response);
        setItems(transformedItems);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching items:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to fetch items')
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTrendingItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return { items, isLoading, error };
}
