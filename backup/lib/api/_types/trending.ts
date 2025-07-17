import type { ImageData } from './image';

export interface TrendingImage {
  image: {
    _id: string;
    title: string | null;
    img_url: string;
    upload_by: string;
    like: number;
    requested_items?: Record<string, Array<{
      item_doc_id: string;
      position: {
        top: string;
        left: string;
      };
    }>>;
  };
  trending_score: number;
  views: number;
  exposure_rate: number;
  relative_exposure: number;
}

export interface TrendingImagesResponse {
  status_code: number;
  description: string;
  data: TrendingImage[];
}

export interface GetTrendingImagesParams {
  min?: number;
  limit?: number;
} 