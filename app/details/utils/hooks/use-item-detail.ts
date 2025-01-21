'use client';

import { useQuery } from '@tanstack/react-query';
import { networkManager } from '@/lib/network/network';
import type { ItemDetailResponse } from '@/lib/api/types/image';

async function fetchItemDetail(itemId: string): Promise<ItemDetailResponse> {
  try {
    const response = await networkManager.request<ItemDetailResponse>(
      `item/${itemId}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error fetching item detail:', error);
    throw error;
  }
}

export function useItemDetail(itemId: string | null) {
  return useQuery<ItemDetailResponse>({
    queryKey: ['itemDetail', itemId],
    queryFn: () => fetchItemDetail(itemId!),
    enabled: !!itemId,
  });
}
