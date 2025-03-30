import { apiClient } from '../client';
import buildQueryString from '../utils/url';
import type { ImageDoc } from '../types';

// 마이페이지 요청 API 응답 타입
export interface MypageRequestResponse {
  request_num: number;
  requests: ImageDoc[];
  next_id: string | null;
}

// 마이페이지 제공 API 응답 타입
export interface MypageProvideResponse {
  provide_num: number;
  provides: ImageDoc[];
  next_id: string | null;
}

// 마이페이지 좋아요 이미지 API 응답 타입
export interface MypageLikeImageResponse {
  likes: ImageDoc[];
  next_id: string | null;
}

// 마이페이지 좋아요 아이템 API 응답 타입
export interface MypageLikeItemResponse {
  likes: {
    item_doc_id: string;
    image_url: string | null;
    name: string | null;
    item_category: string;
  }[];
  next_id: string | null;
}

// API 응답 래퍼 타입
export interface Response<T> {
  status_code: number;
  description: string;
  data: T;
}

export const mypageService = {
  // 사용자의 요청 목록 조회
  getUserRequests: (
    userId: string,
    options?: { limit?: number; next_id?: string }
  ) =>
    apiClient.get<Response<MypageRequestResponse>>(
      `user/${userId}/mypage/requests${buildQueryString(options || {})}`
    ),

  // 사용자의 제공 목록 조회
  getUserProvides: (
    userId: string,
    options?: { limit?: number; next_id?: string }
  ) =>
    apiClient.get<Response<MypageProvideResponse>>(
      `user/${userId}/mypage/provides${buildQueryString(options || {})}`
    ),

  // 사용자가 좋아요한 이미지 목록 조회
  getUserLikedImages: (
    userId: string,
    options?: { limit?: number; next_id?: string }
  ) =>
    apiClient.get<Response<MypageLikeImageResponse>>(
      `user/${userId}/mypage/likes/image${buildQueryString(options || {})}`
    ),

  // 사용자가 좋아요한 아이템 목록 조회
  getUserLikedItems: (
    userId: string,
    options?: { limit?: number; next_id?: string }
  ) =>
    apiClient.get<Response<MypageLikeItemResponse>>(
      `user/${userId}/mypage/likes/item${buildQueryString(options || {})}`
    ),
}; 