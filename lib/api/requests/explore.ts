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
  if (!response) {
    throw new Error('No response from server');
  }

  if (response.status_code !== 200) {
    throw new Error('Failed to fetch explore images');
  }

  return response.data;
};
