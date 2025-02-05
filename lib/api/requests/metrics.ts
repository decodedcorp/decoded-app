import { apiClient } from '../client';
import type { GetDocumentResponse } from '../types';
import type { APIResponse } from '../_types/request';

export const metricsService = {
  // 트렌딩 아이템 조회
  getTrendingItems: (limit: number = 10) =>
    apiClient.get<APIResponse<GetDocumentResponse>>(`metrics/trending?limit=${limit}`),

  // 인기 브랜드 조회
  getPopularBrands: (limit: number = 10) =>
    apiClient.get<APIResponse<GetDocumentResponse>>(`metrics/brands/popular?limit=${limit}`),
}; 