import { apiClient } from '../client';

export interface ExploreImage {
  image_doc_id: string;
  image_url: string;
  positions: Array<{
    top: number;
    left: number;
  }>;
}

export interface ExploreKeyword {
  keyword: string;
  images: ExploreImage[];
}

export interface ExploreResponse {
  status_code: number;
  description: string;
  data: ExploreKeyword[];
}

export const getExploreImages = async (of: 'identity' | 'brand') => {
  const response = await apiClient.get<ExploreResponse>(
    `/image/explore?of=${of}`
  );
  console.log(response.data);
  return response.data;
};
