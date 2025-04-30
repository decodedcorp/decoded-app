'use client';

import { useQuery } from '@tanstack/react-query';
import {
  metadataService,
  type OGTags,
  type Response_OGTags,
} from '@/lib/api/requests/metadata';

export function useOGTags(url: string | undefined) {
    return useQuery<OGTags, Error>({
      queryKey: ['og-tags', url],
      queryFn: async () => {
        if (!url) {
          throw new Error('URL이 필요합니다');
        }
        console.log('url:', url);
        try {
          // 직접 메서드만 사용
          const response = await metadataService.getOGTagsDirect(url);
          console.log('Direct API response:', response);
          
          if (!response) {
            throw new Error('OG 태그를 가져오는데 실패했습니다');
          }
          
          // API 응답 형식을 우리 앱에서 사용하는 형식으로 변환
          const formattedData: OGTags = {
            title: response.og_title || null,
            description: response.og_description || null,
            image: response.og_image || null,
            url: response.url || url,
            siteName: response.site_name || null,
            type: response.type || null
          };
          
          return formattedData;
        } catch (error) {
          console.error('Error fetching OG tags:', error);
          throw error;
        }
      },
      enabled: !!url, // URL이 제공된 경우에만 쿼리 실행
      staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
      retry: 2, // 실패 시 2번 재시도
    });
  }