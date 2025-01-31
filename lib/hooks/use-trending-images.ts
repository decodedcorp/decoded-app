import { useQuery } from '@tanstack/react-query';
import { trendingAPI } from '@/lib/api/endpoints/trending';
import type { GetTrendingImagesParams } from '@/lib/api/types/trending';

export function useTrendingImages(params: GetTrendingImagesParams = {}) {
  return useQuery({
    queryKey: ['trending-images', params],
    queryFn: () => trendingAPI.getTrendingImages(params),
  });
} 