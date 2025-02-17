'use client';

import { useQuery } from '@tanstack/react-query';
import { imagesService } from '@/lib/api/requests/images';
import type { ImageDoc } from '@/lib/api/types';
import type { Response_RandomResources } from '@/lib/api/requests/images';

export function useRandomResources(limit: number = 10) {
  return useQuery<Response_RandomResources, Error, ImageDoc[]>({
    queryKey: ['random-resources', limit],
    queryFn: () => imagesService.getRandomResources({ type: 'image', limit }),
    select: (response) => {
      return response.data?.resources ?? [];
    },
    staleTime: 30 * 1000,
    retry: 3,
  });
}
