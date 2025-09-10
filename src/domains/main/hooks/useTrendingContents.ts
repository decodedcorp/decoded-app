import { useQuery } from '@tanstack/react-query';
import { TrendingService } from '@/api/generated/services/TrendingService';
import { TrendingResponse } from '@/api/generated/models/TrendingResponse';
import { queryKeys } from '@/lib/api/queryKeys';

interface UseTrendingContentsParams {
  limit?: number;
  enabled?: boolean;
}

interface TrendingContentsResult {
  popularContents: TrendingResponse | undefined;
  trendingContents: TrendingResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useTrendingContents({
  limit = 20,
  enabled = true,
}: UseTrendingContentsParams = {}): TrendingContentsResult {
  // Popular contents query
  const popularQuery = useQuery({
    queryKey: queryKeys.trending.popular('content', limit),
    queryFn: () => TrendingService.getPopularTrendsTrendingPopularGet('content', limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });

  // Current trending contents query
  const trendingQuery = useQuery({
    queryKey: queryKeys.trending.trending('content', limit, 24),
    queryFn: () => TrendingService.getCurrentTrendsTrendingTrendingGet('content', limit, 24),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return {
    popularContents: popularQuery.data,
    trendingContents: trendingQuery.data,
    isLoading: popularQuery.isLoading || trendingQuery.isLoading,
    isError: popularQuery.isError || trendingQuery.isError,
    error: popularQuery.error || trendingQuery.error,
    refetch: () => {
      popularQuery.refetch();
      trendingQuery.refetch();
    },
  };
}
