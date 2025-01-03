import { networkManager } from '@/lib/network/network';
import { ImageRequest, RequestImage } from '@/types/model';

interface APIResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const requestAPI = {
  // Get request information
  getImageRequest: async (imageId: string): Promise<APIResponse<ImageRequest>> => {
    try {
      const response = await networkManager.request(
        `image/${imageId}/request`,
        'GET'
      ) as ImageRequest;
      
      return {
        data: response,
        status: 200
      };
    } catch (error) {
      throw error;
    }
  },

  // Create new request
  createImageRequest: async (data: RequestImage): Promise<APIResponse<{ id: string }>> => {
    try {
      const response = await networkManager.request(
        'image/request',
        'POST',
        data
      ) as { id: string };

      return {
        data: response,
        status: 201,
        message: '이미지 요청이 생성되었습니다.'
      };
    } catch (error) {
      throw error;
    }
  },

  // Update request status
  updateImageRequest: async (
    imageId: string,
    data: Partial<RequestImage>
  ): Promise<APIResponse<void>> => {
    try {
      await networkManager.request(
        `image/${imageId}/request`,
        'PUT',
        data
      );

      return {
        data: undefined,
        status: 200,
        message: '이미지 요청이 업데이트되었습니다.'
      };
    } catch (error) {
      throw error;
    }
  },

  // Get request list
  getImageRequestList: async (): Promise<APIResponse<ImageRequest[]>> => {
    try {
      const response = await networkManager.request(
        'image/requests',
        'GET'
      ) as ImageRequest[];

      return {
        data: response,
        status: 200
      };
    } catch (error) {
      throw error;
    }
  },

  // Delete request
  deleteImageRequest: async (imageId: string): Promise<APIResponse<void>> => {
    try {
      await networkManager.request(
        `image/${imageId}/request`,
        'DELETE'
      );

      return {
        data: undefined,
        status: 200,
        message: '이미지 요청이 삭제되었습니다.'
      };
    } catch (error) {
      throw error;
    }
  }
};
