'use client';

import { mypageService } from '@/lib/api/requests/mypage';
import { createMypageQueryHook, createInfiniteMypageQueryHook } from './create-mypage-hooks';

// API 응답 타입 정의 및 형태 지정
interface ProvidesResponseType {
  data: {
    next_id: string | null;
    [key: string]: any;
  };
}

/**
 * 마이페이지 제공 목록 조회 훅
 */
export const useMyPageProvides = createMypageQueryHook<ProvidesResponseType>(
  (userId, options) => mypageService.provides(userId, options) as Promise<ProvidesResponseType>,
  'provides'
);

/**
 * 마이페이지 제공 목록 무한 스크롤 훅
 */
export const useInfiniteMyPageProvides = createInfiniteMypageQueryHook<ProvidesResponseType>(
  (userId, options) => mypageService.provides(userId, options) as Promise<ProvidesResponseType>,
  'provides'
); 