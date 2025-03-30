import { apiClient } from '../client';
import type { Response_GetDocumentResponse_ } from '../types/models/Response_GetDocumentResponse_';
import buildQueryString from '../utils/url';

// Request API 응답 타입 정의
interface RequestItem {
  category: string | null;
  is_provided: boolean;
}

interface RequestData {
  image_doc_id: string;
  image_url: string;
  items: RequestItem[];
  provided_num: number;
}

interface RequestsData {
  request_num: number;
  requests: RequestData[];
  next_id: string | null;
}

// LikeImage API 응답 타입 정의
interface LikedImage {
  image_doc_id: string;
  image_url: string;
}

interface LikesImageData {
  likes: LikedImage[];
  next_id: string | null;
}

interface Response_LikesImageResponse {
  status_code: number;
  description: string;
  data: LikesImageData;
}

// LikeItem API 응답 타입 정의
interface LikedItem {
  item_doc_id: string;
  image_url: string | null;
  name: string | null;
  item_category: string;
}

interface LikesItemData {
  likes: LikedItem[];
  next_id: string | null;
}

interface Response_LikesItemResponse {
  status_code: number;
  description: string;
  data: LikesItemData;
}

// Provides API 응답 타입 정의 (추정)
interface ProvideItem {
  item_doc_id: string; 
  image_doc_id: string;
  image_url: string;
  category: string;
  link: string;
}

interface ProvidesData {
  provide_num: number;
  provides: ProvideItem[];
  next_id: string | null;
}

interface Response_ProvidesResponse {
  status_code: number;
  description: string;
  data: ProvidesData;
}

interface Response_RequestsResponse {
  status_code: number;
  description: string;
  data: RequestsData;
}

// 페이지네이션 파라미터 타입
interface PaginationParams {
  limit?: number;
  nextId?: string;
  [key: string]: string | number | undefined;
}

export const mypageService = {
  request: (userId: string, params?: PaginationParams) => {
    const queryString = buildQueryString(params || {});
    const url = `/user/${userId}/mypage/requests${queryString}`;
    
    return apiClient.get<Response_RequestsResponse>(url);
  },
  
  provides: (userId: string, params?: PaginationParams) => {
    const queryString = buildQueryString(params || {});
    const url = `/user/${userId}/mypage/provides${queryString}`;
    
    return apiClient.get<Response_ProvidesResponse>(url);
  },
  
  // 이미지 좋아요 목록 함수
  likesImage: (userId: string, params?: PaginationParams) => {
    const queryString = buildQueryString(params || {});
    const url = `/user/${userId}/mypage/likes/image${queryString}`;
    
    return apiClient.get<Response_LikesImageResponse>(url);
  },
  
  // 아이템 좋아요 목록 함수
  likesItem: (userId: string, params?: PaginationParams) => {
    const queryString = buildQueryString(params || {});
    const url = `/user/${userId}/mypage/likes/item${queryString}`;
    
    return apiClient.get<Response_LikesItemResponse>(url);
  },
};
