import { networkManager } from '@/lib/network/network';
import type { APIResponse } from '../_types/request';
import type { GetTrendingImagesParams, TrendingImagesResponse } from '../_types/trending';

export const trendingAPI = {
  getTrendingImages: async (params: GetTrendingImagesParams): Promise<APIResponse<TrendingImagesResponse>> => {
    try {
      const queryParams = new URLSearchParams({
        min: (params.min ?? 1).toString(),
        limit: (params.limit ?? 10).toString(),
        period: params.period ?? 'daily'
      });

      const response = await networkManager.request(
        `metrics/trending/images?${queryParams.toString()}`,
        'GET'
      );

      return response;
    } catch (error) {
      console.error('Error fetching trending images:', error);
      throw error;
    }
  }
}; 