import { useQuery } from '@tanstack/react-query';
import { TrendingService } from '@/api/generated/services/TrendingService';
import { TrendingResponse } from '@/api/generated/models/TrendingResponse';

export type TrendingType = 'popular' | 'trending';
export type TrendingCategory = 'content' | 'channels';

export function useTrending(
  type: TrendingType,
  category: TrendingCategory,
  limit: number = 12
) {
  return useQuery<TrendingResponse>({
    queryKey: ['trending', type, category, limit],
    queryFn: () => {
      if (type === 'popular') {
        return TrendingService.getPopularTrendsTrendingPopularGet(category, limit);
      } else {
        return TrendingService.getCurrentTrendsTrendingTrendingGet(category, limit, 24);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Separate hooks for convenience
export function useTrendingContents(type: TrendingType, limit: number = 12) {
  return useTrending(type, 'content', limit);
}

export function useTrendingChannels(type: TrendingType, limit: number = 12) {
  return useTrending(type, 'channels', limit);
}