import { networkManager } from '@/lib/network/network';
import type { RequestImage, APIResponse } from '../types/request';

export const requestAPI = {
  // Create image request
  createImageRequest: async (requestData: RequestImage): Promise<APIResponse<void>> => {
    try {
      const response = await networkManager.request(
        'image/request',
        'POST',
        requestData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get image request list
  getImageRequests: async (): Promise<APIResponse<RequestImage[]>> => {
    try { 
      const response = await networkManager.request(
        'image/requests',
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single image request
  getImageRequest: async (requestId: string): Promise<APIResponse<RequestImage>> => {
    try {
      const response = await networkManager.request(
        `image/request/${requestId}`,
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 