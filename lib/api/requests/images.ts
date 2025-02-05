import { apiClient } from '../client';
import type { ImageDoc, ImageBase_Input } from '../types';
import type { Response_GetDocumentResponse_ } from '../types/models/Response_GetDocumentResponse_';
import buildQueryString from '../utils/url';

export interface RandomResourcesResponse {
  label: 'image' | 'item';
  resources: ImageDoc[];
}

export interface Response_RandomResources {
  status_code: number;
  description: string;
  data: RandomResourcesResponse;
}

export const imagesService = {
  // 이미지 상세 정보 조회
  getImageDetail: (imageId: string) =>
    apiClient.get<Response_GetDocumentResponse_>(`/image/${imageId}`),

  // 이미지 목록 조회 (페이지네이션)
  getImages: (options?: { limit?: number; next_id?: string }) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `/images${buildQueryString(options || {})}`
    ),

  // 랜덤 이미지/아이템 리소스 조회
  getRandomResources: (options: { type: 'image' | 'item'; limit?: number }) =>
    apiClient.get<Response_RandomResources>(
      `random${buildQueryString(options)}`
    ),

  // 이미지 업로드
  uploadImage: (data: ImageBase_Input) =>
    apiClient.post<Response_GetDocumentResponse_>('/image/upload', data),
};
