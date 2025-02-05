import { apiClient } from '../client';
import type { ItemDoc, GetDocumentResponse } from '../types';
import type { Response_GetDocumentResponse_ } from '../types/models/Response_GetDocumentResponse_';
import buildQueryString from '../utils/url';

export const itemsService = {
  // 아이템 상세 정보 조회
  getItemDetail: (itemId: string) =>
    apiClient.get<Response_GetDocumentResponse_>(`item/${itemId}`),

  // 아이템 목록 조회 (페이지네이션)
  getItems: (options?: { limit?: number; next_id?: string }) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `items${buildQueryString(options || {})}`
    ),

  // 아이템 검색
  searchItems: (
    query: string,
    options?: { limit?: number; next_id?: string }
  ) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `items/search${buildQueryString({ query, ...options })}`
    ),

  // 관련 아이템 조회
  getRelatedItems: (itemId: string, limit: number = 10) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `item/${itemId}/related?limit=${limit}`
    ),
};
