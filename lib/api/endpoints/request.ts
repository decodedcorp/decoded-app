import { networkManager } from '@/lib/network/network';
import type { RequestImage, APIResponse } from '../_types/request';

export const requestAPI = {
  // Create image request
  createImageRequest: async (
    userId: string,
    data: RequestImage
  ): Promise<APIResponse<void>> => {
    try {
      const response = await networkManager.request(
        `user/${userId}/image/request`,
        'POST',
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add request to existing image
  addImageRequest: async (
    userId: string,
    imageId: string,
    requestData: RequestImage
  ): Promise<APIResponse<void>> => {
    try {
      const response = await networkManager.request(
        `user/${userId}/image/${imageId}/request/add`,
        'POST',
        requestData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get image request list for user
  getImageRequests: async (userId: string): Promise<APIResponse<RequestImage[]>> => {
    try {
      const response = await networkManager.request(
        `user/${userId}/requests`,
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 