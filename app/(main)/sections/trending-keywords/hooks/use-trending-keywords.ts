import { useQuery } from '@tanstack/react-query';
import { metricsService, Response_TrendingKeywords } from "@/lib/api/requests/metrics";

export function useTrendingKeywords() {
  return useQuery<Response_TrendingKeywords>({
    queryKey: ['trending-keywords'],
    queryFn: async () => {
      const response = await metricsService.getTrendingKeywords(10);
      return response;
    }
  });
} 