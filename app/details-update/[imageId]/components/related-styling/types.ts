// 기본 응답 구조
interface BaseResponse {
  description: string;
  status_code: number;
}

// 기본 이미지 타입
export interface RelatedImage {
  image_doc_id: string;
  image_url: string;
}

// 트렌딩 이미지 타입
export interface TrendingImage {
  image_doc_id: string;
  image_url: string;
}

// API 응답 타입들
export interface APIResponse<T> {
  status_code: number;
  description: string;
  data: T;
}

export interface ArtistImagesResponse {
  images: RelatedImage[];
}

export interface BrandItem {
  _id: string;
  img_url: string;
  metadata: {
    name: string;
    brand: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface BrandImagesResponse {
  items: BrandItem[];
}

export interface TrendingImagesResponse {
  images: RelatedImage[];
}

// 통합된 관련 이미지 데이터 타입
export interface RelatedImagesData {
  artistImages: RelatedImage[];
  brandImages: RelatedImage[];
  trendingImages: RelatedImage[];
}

// 컴포넌트 Props 타입
export interface RelatedSectionProps {
  title?: string;
  images: RelatedImage[];
  isLoading?: boolean;
  error?: Error | null;
}

export type { ItemDetailResponse } from '@/lib/api/_types/image'; 