// MasonryGrid에서 사용하는 아이템 타입
export interface MasonryItem {
  id: string;
  key: string;
  groupKey: number;
  data: {
    imageUrl?: string;
    imageDocId?: string;
    title?: string;
    aspectRatio?: number; // 이미지의 원본 비율 (width/height)
  };
}

// 마이페이지 컨텐츠 필터 타입
export type ContentFilter = 'all' | 'likes' | 'provides' | 'requests';

// API 응답 관련 타입 정의
export interface BaseResponse {
  status_code: number;
  description: string;
}

// 좋아요 관련 타입
export interface LikedImage {
  image_doc_id: string;
  image_url: string;
}

export interface LikesImageData {
  likes: LikedImage[];
  next_id: string | null;
}

export interface Response_LikesImageResponse extends BaseResponse {
  data: LikesImageData;
}

// 제공 관련 타입
export interface ProvideItem {
  item_doc_id: string; 
  image_doc_id: string;
  image_url: string;
  category: string;
  link: string;
}

export interface ProvidesData {
  provide_num: number;
  provides: ProvideItem[];
  next_id: string | null;
}

export interface Response_ProvidesResponse extends BaseResponse {
  data: ProvidesData;
}

// 요청 관련 타입
export interface RequestItem {
  category: string | null;
  is_provided: boolean;
}

export interface RequestData {
  image_doc_id: string;
  image_url: string;
  items: RequestItem[];
  provided_num: number;
}

export interface RequestsData {
  request_num: number;
  requests: RequestData[];
  next_id: string | null;
}

export interface Response_RequestsResponse extends BaseResponse {
  data: RequestsData;
}

// 공통 마이페이지 아이템 타입 (매핑 함수에서 사용)
export interface MyPageItemBase {
  image_doc_id: string;
  image_url: string;
}

// 로드 데이터 타입 (다양한 소스의 데이터를 하나로 통합)
export interface LoadDataResult {
  items: MasonryItem[];
  hasMore: boolean;
} 