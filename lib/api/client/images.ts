'use client';

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