import { networkManager } from '@/lib/network/network';
import { ItemDocument, ProvideData, DetailPageState } from '@/types/model';

interface APIResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const provideAPI = {
  // Get detail page state
  getDetailPageState: async (imageId: string): Promise<APIResponse<DetailPageState>> => {
    try {
      const response = await networkManager.request(
        `image/${imageId}/detail`,
        'GET'
      ) as DetailPageState;

      return {
        data: response,
        status: 200
      };
    } catch (error) {
      throw error;
    }
  },

  // Get item detail information
  getItemDetail: async (imageId: string, itemId: string): Promise<APIResponse<ItemDocument>> => {
    try {
      const response = await networkManager.request(
        `image/${imageId}/provide/item/${itemId}`,
        'GET'
      ) as ItemDocument;

      return {
        data: response,
        status: 200
      };
    } catch (error) {
      throw error;
    }
  },

  // Provide item information
  provideItemInfo: async (
    imageId: string,
    itemId: string,
    data: ProvideData
  ): Promise<APIResponse<void>> => {
    try {
      await networkManager.request(
        `image/${imageId}/provide/item/${itemId}`,
        'POST',
        data
      );

      return {
        data: undefined,
        status: 201,
        message: '아이템 정보가 제공되었습니다.'
      };
    } catch (error) {
      throw error;
    }
  },

  // Get item list for image
  getImageItems: async (imageId: string): Promise<APIResponse<ItemDocument[]>> => {
    try {
      const response = await networkManager.request(
        `image/${imageId}/items`,
        'GET'
      ) as ItemDocument[];

      return {
        data: response,
        status: 200
      };
    } catch (error) {
      throw error;
    }
  }
}; 