'use client';

import { itemsAPI } from '@/lib/api/endpoints/items';
import { useQuery } from '@tanstack/react-query';

export function useImageDetails(itemId: string) {
  return useQuery({
    queryKey: ['imageItem', itemId],
    queryFn: async () => {
      if (!itemId) return null;
      const response = await itemsAPI.getItemDetail(itemId);
      return response.data;
    },
    enabled: !!itemId,
  });
}
