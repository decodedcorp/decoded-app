'use client';

import { imagesService } from '@/lib/api/requests/images';
import { useQuery } from '@tanstack/react-query';
import type { ImageDetailResponse } from '@/components/ui/modal/add-item-modal/types';
import type { APIResponse } from '@/backup/app/details/[imageId]/components/related-styling/types';

export function useImageDetails(itemId: string) {
  return useQuery<APIResponse<ImageDetailResponse>>({
    queryKey: ['imageItem', itemId],
    queryFn: async () => {
      if (!itemId) throw new Error('Item ID is required');
      const response = await imagesService.getImageDetail(itemId);
      return response as APIResponse<ImageDetailResponse>;
    },
    enabled: Boolean(itemId),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
