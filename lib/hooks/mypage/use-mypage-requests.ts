'use client';

import { mypageService } from '@/lib/api/requests/mypage';
import { createMypageQueryHook, createInfiniteMypageQueryHook } from './create-mypage-hooks';

// API 응답 타입 정의 및 형태 지정
interface RequestResponseType {
  data: {
    next_id: string | null;
    [key: string]: any;
  };
}

/**
 * 마이페이지 요청 목록 조회 훅
 */
export const useMyPageRequests = createMypageQueryHook<RequestResponseType>(
  (userId, options) => mypageService.request(userId, options) as Promise<RequestResponseType>,
  'requests'
);

/**
 * 마이페이지 요청 목록 무한 스크롤 훅
 */
export const useInfiniteMyPageRequests = createInfiniteMypageQueryHook<RequestResponseType>(
  (userId, options) => mypageService.request(userId, options) as Promise<RequestResponseType>,
  'requests'
); 