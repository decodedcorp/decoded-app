import { apiClient } from '../client';
import type { Response_GetDocumentResponse_ } from '../types/models/Response_GetDocumentResponse_';


export interface Response_TrendingKeywords {
  status_code: number;
  description: string;
  data: string[];
} 

export const metricsService = {
  // 트렌딩 아이템 조회
  getTrendingItems: (limit: number = 10) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `metrics/trending/items?limit=${limit}`
    ),

  // 인기 브랜드 조회
  getPopularBrands: (limit: number = 10) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `metrics/brands/popular?limit=${limit}`
    ),

  getTrendingKeywords: (limit: number = 10) =>
    apiClient.get<Response_TrendingKeywords>(
      `metrics/trending/keywords?limit=${limit}`
    ),
};
