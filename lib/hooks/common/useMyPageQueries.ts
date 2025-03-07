import { useQuery, useQueryClient } from '@tanstack/react-query';
import { networkManager } from '@/lib/network/network';
import type { AccountData, RequestData, ProvideData, LikeData, TabType } from '@/components/Header/nav/modal/types/mypage';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/features/auth/useAuth';

interface ApiResponse<T> {
  status_code: number;
  data: T;
}

export function useMyPageQuery(tab: TabType, isOpen: boolean) {
  const { isLogin } = useAuth();
  const queryClient = useQueryClient();
  const [userDocId, setUserDocId] = useState<string | null>(() => {
    // 초기 상태 설정 시 즉시 세션 스토리지에서 값을 가져옴
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('USER_DOC_ID');
    }
    return null;
  });

  // 모달이 열릴 때마다 userDocId를 다시 확인
  useEffect(() => {
    if (isOpen) {
      const docId = sessionStorage.getItem('USER_DOC_ID');
      if (docId !== userDocId) {
        setUserDocId(docId);
        queryClient.invalidateQueries({ queryKey: ['mypage'] });
      }
    }
  }, [isOpen, isLogin, queryClient, userDocId]);

  return useQuery({
    queryKey: ['mypage', tab, userDocId],
    queryFn: async () => {
      if (!userDocId) throw new Error('User ID not found');

      const endpoints = {
        home: `user/${userDocId}/mypage/home`,
        request: `user/${userDocId}/mypage/requests`,
        provide: `user/${userDocId}/mypage/provides`,
        like: `user/${userDocId}/mypage/likes`
      };

      // 초기 로딩 시 캐시된 데이터가 있다면 먼저 반환
      const cachedData = queryClient.getQueryData(['mypage', tab, userDocId]);
      if (cachedData) {
        return cachedData;
      }

      if (tab === 'like') {
        const [imagesResponse, itemsResponse] = await Promise.all([
          networkManager.request<ApiResponse<LikeData['images']>>(`user/${userDocId}/mypage/likes/image`, 'GET'),
          networkManager.request<ApiResponse<LikeData['items']>>(`user/${userDocId}/mypage/likes/item`, 'GET'),
        ]);
        
        if (imagesResponse?.status_code === 200 && itemsResponse?.status_code === 200) {
          return {
            images: imagesResponse.data,
            items: itemsResponse.data,
          } as LikeData;
        }
      } else {
        const response = await networkManager.request(
          endpoints[tab],
          'GET'
        );
        if (response.status_code === 200) {
          return response.data;
        }
      }
      throw new Error(`Failed to fetch ${tab} data`);
    },
    enabled: !!userDocId && isOpen,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
