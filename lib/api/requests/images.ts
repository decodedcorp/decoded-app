import { apiClient } from '../client';
import type { ImageDoc, ImageBase_Input } from '../types';
import type { Response_GetDocumentResponse_ } from '../types/models/Response_GetDocumentResponse_';
import buildQueryString from '../utils/url';
import { ImageDoc as ImageDocModel } from '../types/models/ImageDoc';

export interface RandomResourcesResponse {
  label: 'image' | 'item';
  resources: ImageDoc[];
}

export interface Response_RandomResources {
  status_code: number;
  description: string;
  data: RandomResourcesResponse;
}

// API 응답 타입
export interface Response_GetDocumentResponse<T> {
  status_code: number;
  description: string;
  data: {
    docs: T[];
    next_id: string | null;
  };
}

// 관련 이미지 API 응답을 위한 타입
export interface PageParams {
  artistNextId: string | null;
  brandNextId: string | null;
  trendingNextId: string | null;
}

// 관련 이미지 결과를 위한 타입
export interface RelatedImagesResponse {
  artistImages: ImageDocModel[];
  brandImages: ImageDocModel[];
  trendingImages: ImageDocModel[];
  nextParams: PageParams;
}

export const imagesService = {
  // 이미지 상세 정보 조회
  getImageDetail: (imageId: string) =>
    apiClient.get<Response_GetDocumentResponse_>(`image/${imageId}`),

  // 이미지 목록 조회 (페이지네이션)
  getImages: (options?: { limit?: number; next_id?: string }) =>
    apiClient.get<Response_GetDocumentResponse<ImageDoc>>(
      `image${buildQueryString(options || {})}`
    ),

  // 랜덤 이미지/아이템 리소스 조회
  getRandomResources: (options: { type: 'image' | 'item'; limit?: number }) =>
    apiClient.get<Response_RandomResources>(
      `random${buildQueryString(options)}`
    ),

  // 유저의 이미지 목록 조회
  getUserImages: (
    userId: string,
    options?: { limit?: number; next_id?: string }
  ) =>
    apiClient.get<Response_GetDocumentResponse_>(
      `users/${userId}/images${buildQueryString(options || {})}`
    ),

  // 아티스트 이미지 조회 - 엔드포인트 수정
  getArtistImages: (
    imageId: string,
    artistId: string,
    options?: { limit?: number; next_id?: string }
  ) =>
    apiClient.get<Response_GetDocumentResponse<ImageDoc>>(
      `image/${imageId}/artist/${artistId}${buildQueryString(options || {})}`
    ),

  // 브랜드 관련 아이템 조회 - 엔드포인트 수정
  getBrandImages: (
    brandId: string,
    options?: { limit?: number; next_id?: string }
  ) =>
    apiClient.get<Response_GetDocumentResponse<ImageDoc>>(
      `item/related/${brandId}${buildQueryString(options || {})}`
    ),
};
