import { networkManager } from '@/lib/network/network';
import { useEffect, useState } from 'react';

interface ItemMetadata {
  name: string | null;
  description: string | null;
  brand: string | null;
  designed_by: string | null;
  material: string | null;
  color: string | null;
  item_class: string;
  item_sub_class: string;
  category: string;
  sub_category: string;
  product_type: string;
}

interface LinkInfo {
  url: string;
  label: string | null;
  date: string;
  provider: string;
  og_metadata: any | null;
  link_metadata: any | null;
}

interface ItemData {
  _id: string;
  requester: string;
  requested_at: string;
  link_info: LinkInfo[] | null;
  metadata: ItemMetadata;
  img_url: string | null;
  like: number;
}

interface TrendingItemResponse {
  item_doc_id: string;
  name: string | null;
  brand: string | null;
  img_url: string | null;
  like: number;
  num_links: number;
  trending_score: number;
  views: number;
  exposure_rate: number;
  relative_exposure: number;
  image_doc_id: string;
}

interface ApiResponse {
  status_code: number;
  description: string;
  data: TrendingItemResponse[];
}

export interface TrendingItem {
  id: string;
  image: string | null;
  title: string;
  brand: string | null;
  views: number;
  requestCount: number;
  exposureRate: number;
  trendingScore: number;
  featured: boolean;
  imageDocId: string;
  itemDocId: string;
}

function mapResponseToTrendingItems(response: ApiResponse): TrendingItem[] {
  console.log('Raw API Response:', response);

  if (!response.data) {
    console.warn('No data in response');
    return [];
  }

  const mappedItems = response.data.map((item) => {
    return {
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
    };
  });

  console.log('Mapped Items:', mappedItems);
  return mappedItems;
}

export function useTrendingItems(
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
) {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTrendingItems() {
      try {
        console.log(`Fetching trending items for period: ${period}...`);
        const response = await networkManager.request<ApiResponse>(
          `metrics/trending/items?limit=9&period=${period}`,
          'GET'
        );
        const transformedItems = mapResponseToTrendingItems(response);
        console.log('Final Items:', transformedItems);
        setItems(transformedItems);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to fetch items')
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingItems();
  }, [period]);

  return {
    items,
    isLoading,
    error,
  };
}
