import { networkManager } from '@/lib/network/network';
import type { APIResponse } from '../_types/request';
import type { ItemDetailResponse } from '@/types/item';

export const itemsAPI = {
  getItemDetail: async (
    itemId: string
  ): Promise<APIResponse<ItemDetailResponse>> => {
    try {
      const response = await networkManager.request(
        `item/${itemId}`,
        'GET',
        null
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
