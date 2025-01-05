import { networkManager } from '@/lib/network/network';
import type { 
  ImageData, 
  DetailPageState, 
  ItemDocument 
} from '../types/image';
import type { APIResponse } from '../types/request';

export const imagesAPI = {
  // Get images list
  getImages: async (): Promise<APIResponse<{ images: ImageData[]; maybe_next_id: string | null }>> => {
    try {
      const response = await networkManager.request(
        'images',
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single image detail
  getImageDetail: async (imageId: string): Promise<APIResponse<DetailPageState>> => {
    try {
      // 전체 이미지 목록을 가져와서 해당 이미지를 찾습니다
      const response = await networkManager.request(
        'images',
        'GET'
      );
      
      if (!response.data?.images) {
        throw new Error('Invalid API response structure');
      }

      const image = response.data.images.find((img: ImageData) => img.doc_id === imageId);
      if (!image) {
        throw new Error('Image not found');
      }

      return {
        status_code: response.status_code,
        description: response.description,
        data: image
      };
    } catch (error) {
      throw error;
    }
  },

  // Get image items
  getImageItems: async (imageId: string): Promise<APIResponse<ItemDocument[]>> => {
    try {
      const response = await networkManager.request(
        `images/${imageId}/items`,
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
        `images/${imageId}/items/${itemId}`,
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
      const response = await networkManager.request(
        'images/featured',
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 