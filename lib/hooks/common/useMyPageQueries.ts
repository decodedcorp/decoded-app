import { useQuery, useQueryClient } from '@tanstack/react-query';
import { networkManager } from '@/lib/network/network';
import type { AccountData, RequestData, ProvideData, LikeData, TabType } from '@/components/Header/nav/modal/types/mypage';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/features/auth/useAuth';

// 조건부 로깅 헬퍼 함수
const isDev = process.env.NODE_ENV === 'development';
const logDebug = (message: string, data?: any) => {
  if (isDev) {
    console.log(message, data);
  }
};

interface ApiResponse<T> {
  status_code: number;
  data: T;
}

// 기본 데이터 구조 정의
const defaultAccountData: AccountData = {
  points: 0,
  active_ticket_num: 0,
  request_num: 0,
  provide_num: 0,
  pending_num: 0
};

const defaultRequestData: RequestData = {
  request_num: 0,
  requests: [],
  next_id: null
};

const defaultProvideData: ProvideData = {
  provide_num: 0,
  provides: [],
  next_id: null
};

const defaultLikeData: LikeData = {
  images: {
    likes: [],
    next_id: null
  },
  items: {
    likes: [],
    next_id: null
  }
};

export function useMyPageQuery(tab: TabType, isOpen: boolean) {
  const { isLogin, isInitialized } = useAuth();
  const queryClient = useQueryClient();
  const [userDocId, setUserDocId] = useState<string | null>(() => {
    // 초기 상태 설정 시 즉시 세션 스토리지에서 값을 가져옴
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('USER_DOC_ID');
    }
    return null;
  });
  
  // 로그인 상태 변경 감지
  useEffect(() => {
    if (isInitialized) {
      const docId = sessionStorage.getItem('USER_DOC_ID');
      logDebug('[useMyPageQuery] 로그인 상태 변경 감지:', { 
        isLogin, 
        docId,
        currentUserDocId: userDocId
      });
      
      if (isLogin && docId && docId !== userDocId) {
        logDebug('[useMyPageQuery] 새로운 사용자 ID 감지, 쿼리 무효화');
        setUserDocId(docId);
        queryClient.invalidateQueries({ queryKey: ['mypage'] });
      } else if (!isLogin && userDocId) {
        logDebug('[useMyPageQuery] 로그아웃 감지, 사용자 ID 초기화');
        setUserDocId(null);
      }
    }
  }, [isLogin, isInitialized, queryClient, userDocId]);

  // 모달이 열릴 때마다 userDocId를 다시 확인
  useEffect(() => {
    if (isOpen) {
      const docId = sessionStorage.getItem('USER_DOC_ID');
      logDebug('[useMyPageQuery] 모달 열림, 사용자 ID 확인:', { 
        docId, 
        currentUserDocId: userDocId,
        sessionData: {
          USER_DOC_ID: sessionStorage.getItem('USER_DOC_ID'),
          USER_EMAIL: sessionStorage.getItem('USER_EMAIL'),
          USER_NICKNAME: sessionStorage.getItem('USER_NICKNAME'),
          SUI_ACCOUNT: !!sessionStorage.getItem('SUI_ACCOUNT'),
          ACCESS_TOKEN: !!sessionStorage.getItem('ACCESS_TOKEN')
        }
      });
      
      if (docId !== userDocId) {
        logDebug('[useMyPageQuery] 사용자 ID 변경됨, 쿼리 무효화');
        setUserDocId(docId);
        queryClient.invalidateQueries({ queryKey: ['mypage'] });
      }
    }
  }, [isOpen, isLogin, queryClient, userDocId]);

  return useQuery({
    queryKey: ['mypage', tab, userDocId],
    queryFn: async () => {
      logDebug('[useMyPageQuery] 데이터 fetching 시작:', { tab, userDocId });
      
      if (!userDocId) {
        logDebug('[useMyPageQuery] 사용자 ID 없음, 기본 데이터 반환');
        // 로그인 정보가 없는 경우 기본 데이터 반환
        if (tab === 'home') {
          return defaultAccountData;
        } else if (tab === 'like') {
          return defaultLikeData;
        } else if (tab === 'request') {
          return defaultRequestData;
        } else if (tab === 'provide') {
          return defaultProvideData;
        }
        
        throw new Error('User ID not found');
      }

      // 엔드포인트 경로 구성 시 앞에 슬래시(/)가 아닌 user 부터 시작해야 함
      const endpoints = {
        home: `user/${userDocId}/mypage/home`,
        request: `user/${userDocId}/mypage/requests`,
        provide: `user/${userDocId}/mypage/provides`,
        like: `user/${userDocId}/mypage/likes`
      };

      logDebug(`[useMyPageQuery] API 엔드포인트 호출: ${endpoints[tab]}`);
      
      // 현재 액세스 토큰 확인
      const accessToken = typeof window !== 'undefined' ? window.sessionStorage.getItem('ACCESS_TOKEN') : null;
      logDebug(`[useMyPageQuery] 액세스 토큰 존재 여부: ${!!accessToken}`);

      if (tab === 'like') {
        try {
          const [imagesResponse, itemsResponse] = await Promise.all([
            networkManager.request<ApiResponse<LikeData['images']>>(`user/${userDocId}/mypage/likes/image`, 'GET', null, 3, accessToken || undefined),
            networkManager.request<ApiResponse<LikeData['items']>>(`user/${userDocId}/mypage/likes/item`, 'GET', null, 3, accessToken || undefined),
          ]);
          
          logDebug('[useMyPageQuery] Like 데이터 응답:', { 
            imagesResponse: !!imagesResponse, 
            itemsResponse: !!itemsResponse 
          });
          
          if (imagesResponse?.status_code === 200 && itemsResponse?.status_code === 200) {
            return {
              images: imagesResponse.data,
              items: itemsResponse.data,
            };
          }
          
          throw new Error('Failed to fetch like data');
        } catch (error) {
          logDebug('[useMyPageQuery] Like 데이터 오류:', error);
          return defaultLikeData;
        }
      }
      
      try {
        const response = await networkManager.request<ApiResponse<any>>(
          endpoints[tab],
          'GET',
          null,
          3,
          accessToken || undefined
        );

        logDebug(`[useMyPageQuery] ${tab} 데이터 응답:`, response);
        
        if (response && response.status_code === 200) {
          logDebug(`[useMyPageQuery] ${tab} 데이터 성공:`, response.data);
          return response.data;
        }
        
        throw new Error(`Failed to fetch ${tab} data`);
      } catch (error) {
        logDebug(`[useMyPageQuery] ${tab} 데이터 오류:`, error);
        
        // 타입에 따른 기본 데이터 반환
        if (tab === 'home') {
          return defaultAccountData;
        } else if (tab === 'request') {
          return defaultRequestData;
        } else if (tab === 'provide') {
          return defaultProvideData;
        }
        
        throw error;
      }
    },
    enabled: isOpen && isInitialized,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10,   // 10분
  });
}
