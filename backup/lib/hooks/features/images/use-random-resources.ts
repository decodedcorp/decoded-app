'use client';

import { useQuery } from '@tanstack/react-query';
import { imagesService } from '@/lib/api/requests/images';
import type { ImageDoc } from '@/lib/api/types';
import type { Response_RandomResources } from '@/lib/api/requests/images';

export function useRandomResources(limit: number = 10) {
  return useQuery<Response_RandomResources, Error, ImageDoc[]>({
    queryKey: ['random-resources', limit],
    queryFn: async () => {
      const response = await imagesService.getRandomResources({ type: 'image', limit });
      if (!response) {
        throw new Error('Failed to fetch random resources');
      }
      return response;
    },
    select: (response) => {
      if (!response) {
        throw new Error('No response from server');
      }
      return response.data?.resources ?? [];
    },
    staleTime: 30 * 1000,
    retry: 3,
  });
}
