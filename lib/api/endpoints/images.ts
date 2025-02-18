import { networkManager } from '@/lib/network/network';
import type { ImageData, DetailPageState, ItemDocument } from '../_types/image';
import type { APIResponse } from '../_types/request';
import type { APIImageResponse } from '@/app/(main)/sections/discover/client/activity-feed/utils/types/image';

interface ImageDetailResponse {
  image: ImageData;
}

export const imagesAPI = {
  // Get single image detail
  getImageDetail: async (
    imageId: string
  ): Promise<APIResponse<ImageDetailResponse>> => {
    try {
      const response = await networkManager.request<
        APIResponse<ImageDetailResponse>
      >(`image/${imageId}`, 'GET');

      console.log('Raw API response:', response); // 디버깅용 로그

      if (!response || !response.data) {
        throw new Error('Invalid API response structure');
      }

      if (!response.data.image) {
        throw new Error('No image data in response');
      }

      return response;
    } catch (error) {
      console.error('Error fetching image detail:', {
        error,
        imageId,
        stack: error instanceof Error ? error.stack : undefined,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },

  // Get image items
  getImageItems: async (
    imageId: string
  ): Promise<APIResponse<ItemDocument[]>> => {
    try {
      const response = await networkManager.request(
        `image/${imageId}/items`,
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update image item
  updateImageItem: async (
    imageId: string,
    itemId: string,
    data: {
      links?: string[];
      provider?: string;
    }
  ): Promise<APIResponse<void>> => {
    try {
      const response = await networkManager.request(
        `image/${imageId}/items/${itemId}`,
        'PUT',
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get featured images
  getFeaturedImages: async (): Promise<APIResponse<ImageData[]>> => {
    try {
      const response = await networkManager.request('image/featured', 'GET');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all images
  getImages: async (): Promise<APIImageResponse> => {
    try {
      const response = await networkManager.request<APIImageResponse>(
        'image',
        'GET'
      );
      if (!response) {
        throw new Error('No response received from the server');
      }
      return response;
    } catch (error) {
      throw error;
    }
  },
};
