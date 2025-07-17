import { apiClient } from '../client';
import type { CategoryDoc, GetDocumentResponse } from '../types';
import type { Response_GetDocumentResponse_ } from '../types/models/Response_GetDocumentResponse_';
import buildQueryString from '../utils/url';

export const categoriesService = {
  // 카테고리 상세 정보 조회
  getCategoryDetail: (categoryId: string) =>
    apiClient.get<Response_GetDocumentResponse_>(`category/${categoryId}`),

  // 카테고리 목록 조회
  getCategories: (options?: { limit?: number; next_id?: string }) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `categories${buildQueryString(options || {})}`
    ),
}; 