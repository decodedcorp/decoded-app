import { apiClient } from '../client';
import type { BrandDoc, GetDocumentResponse } from '../types';
import type { Response_GetDocumentResponse_ } from '../types/models/Response_GetDocumentResponse_';
import buildQueryString from '../utils/url';

export const brandsService = {
  // 브랜드 상세 정보 조회
  getBrandDetail: (brandId: string) =>
    apiClient.get<Response_GetDocumentResponse_>(`brand/${brandId}`),

  // 브랜드 목록 조회 (페이지네이션)
  getBrands: (options?: { limit?: number; next_id?: string }) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `brands${buildQueryString(options || {})}`
    ),

  // 브랜드 검색
  searchBrands: (query: string, options?: { limit?: number; next_id?: string }) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `brands/search${buildQueryString({ query, ...options })}`
    ),
}; 