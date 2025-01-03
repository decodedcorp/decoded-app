// lib/api/images.ts
import { networkManager } from '@/lib/network/network';
import { ImageDetail, ImageRequest } from '@/types/model';

interface APIResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const imagesAPI = {
  // Get image detail information
  getImageDetail: async (imageId: string): Promise<APIResponse<ImageDetail>> => {
    try {
      const response = await networkManager.request(
        `/images/${imageId}`,
        'GET'
      ) as ImageDetail;
      
      return {
        data: response,
        status: 200
      };
    } catch (error) {
      throw error;
    }
  },

  // Get image list with pagination
  getImageList: async (page: number = 1, limit: number = 20): Promise<APIResponse<ImageDetail[]>> => {
    try {
      const response = await networkManager.request('/images', 'GET', {
        page,
        limit,
      }) as ImageDetail[];

      return {
        data: response,
        status: 200
      };
    } catch (error) {
      throw error;
    }
  },

  // Get featured images
  getFeaturedImages: async (): Promise<APIResponse<ImageDetail[]>> => {
    try {
      const response = await networkManager.request(
        '/images/featured',
        'GET'
      ) as ImageDetail[];

      return {
        data: response,
        status: 200
      };
    } catch (error) {
      throw error;
    }
  },

  // Search images
  searchImages: async (query: string, page: number = 1): Promise<APIResponse<ImageDetail[]>> => {
    try {
      const response = await networkManager.request('/images/search', 'GET', {
        query,
        page,
      }) as ImageDetail[];

      return {
        data: response,
        status: 200,
        message: '이미지 검색이 완료되었습니다.'
      };
    } catch (error) {
      throw error;
    }
  }
};
