'use client';

import { mypageService } from '@/lib/api/requests/mypage';
import { createMypageQueryHook, createInfiniteMypageQueryHook } from './create-mypage-hooks';

// API 응답 타입 정의 및 형태 지정
interface LikesResponseType {
  data: {
    next_id: string | null;
    [key: string]: any;
  };
}

/**
 * 마이페이지 이미지 좋아요 목록 조회 훅
 */
export const useMyPageLikesImage = createMypageQueryHook<LikesResponseType>(
  (userId, options) => mypageService.likesImage(userId, options) as Promise<LikesResponseType>,
  'likes-image'
);

/**
 * 마이페이지 이미지 좋아요 목록 무한 스크롤 훅
 */
export const useInfiniteMyPageLikesImage = createInfiniteMypageQueryHook<LikesResponseType>(
  (userId, options) => mypageService.likesImage(userId, options) as Promise<LikesResponseType>,
  'likes-image'
);

/**
 * 마이페이지 아이템 좋아요 목록 조회 훅
 */
export const useMyPageLikesItem = createMypageQueryHook<LikesResponseType>(
  (userId, options) => mypageService.likesItem(userId, options) as Promise<LikesResponseType>,
  'likes-item'
);

/**
 * 마이페이지 아이템 좋아요 목록 무한 스크롤 훅
 */
export const useInfiniteMyPageLikesItem = createInfiniteMypageQueryHook<LikesResponseType>(
  (userId, options) => mypageService.likesItem(userId, options) as Promise<LikesResponseType>,
  'likes-item'
); 