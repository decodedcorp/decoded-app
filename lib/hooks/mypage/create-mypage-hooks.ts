'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useUserId } from './use-user-id';
import React from 'react';

// 기본 옵션 타입
interface QueryOptions {
  limit?: number;
}

// 서비스 함수 타입 (기본 쿼리용)
type ServiceFn<T> = (userId: string, options: { limit?: number }) => Promise<T>;

// 서비스 함수 타입 (무한 쿼리용)
type InfiniteServiceFn<T> = (
  userId: string, 
  options: { limit?: number; nextId?: string }
) => Promise<T>;

// 페이징 응답 인터페이스 
interface PagingResponse {
  data: {
    next_id: string | null;
    [key: string]: any;
  };
}

/**
 * 기본 마이페이지 쿼리 훅 생성 함수
 */
export function createMypageQueryHook<T>(
  serviceFn: ServiceFn<T>,
  resourceType: string,
) {
  return function useMyPageQuery(options?: QueryOptions) {
    const userId = useUserId();

    return useQuery({
      queryKey: ['mypage', resourceType, userId, options?.limit],
      queryFn: async () => {
        if (!userId) throw new Error('User ID not found');
        return serviceFn(userId, { limit: options?.limit });
      },
      enabled: !!userId,
      staleTime: 1000 * 60 * 5, // 5분
    });
  };
}

/**
 * 무한 스크롤 마이페이지 쿼리 훅 생성 함수
 */
export function createInfiniteMypageQueryHook<T extends PagingResponse>(
  serviceFn: InfiniteServiceFn<T>,
  resourceType: string,
) {
  return function useInfiniteMyPageQuery(options?: QueryOptions) {
    const userId = useUserId();
    const usedNextIdsRef = React.useRef(new Set<string>());
    const nextIdCountMapRef = React.useRef<Map<string, number>>(new Map());

    return useInfiniteQuery({
      queryKey: ['mypage', resourceType, 'infinite', userId, options?.limit],
      queryFn: async ({ pageParam, queryKey }) => {
        if (!userId) throw new Error('User ID not found');
        
        // pageParam이 null 또는 undefined 경우를 명시적으로 처리
        const nextId = pageParam === null || pageParam === undefined 
          ? undefined 
          : String(pageParam);
        
        console.log(`[API 요청] ${resourceType} - userId: ${userId.substring(0, 8)}..., nextId: ${nextId || 'undefined'}, limit: ${options?.limit || 'default'}, queryKey: ${JSON.stringify(queryKey.slice(0, 3))}`);
        
        try {
          const result = await serviceFn(userId, { 
            limit: options?.limit, 
            nextId: nextId
          });
          
          // 응답 데이터 구조 세부 로깅 추가
          console.log(`[API 응답 상세] ${resourceType} - 응답:`, {
            nextId: result.data.next_id,
            keys: Object.keys(result.data),
            hasData: !!result.data,
            // 각 필터별 데이터 존재 여부 확인
            likesLength: Array.isArray(result.data.likes) ? result.data.likes.length : 'N/A',
            providesLength: Array.isArray(result.data.provides) ? result.data.provides.length : 'N/A',
            requestsLength: Array.isArray(result.data.requests) ? result.data.requests.length : 'N/A'
          });
          
          // 데이터 유무를 더 정확하게 확인
          const hasContent = 
            (Array.isArray(result.data.likes) && result.data.likes.length > 0) ||
            (Array.isArray(result.data.provides) && result.data.provides.length > 0) ||
            (Array.isArray(result.data.requests) && result.data.requests.length > 0);
          
          console.log(`[API 응답] ${resourceType} - 성공, next_id: ${result.data.next_id || 'null'}, 데이터 유무: ${!!result.data}, 실제 콘텐츠 있음: ${hasContent}`);
          
          // 실제 새로운 데이터가 있는지 확인하는 로직 추가
          const currentItems = result.data.likes || result.data.provides || result.data.requests || [];
          if (currentItems.length === 0 && result.data.next_id) {
            console.log(`[API 응답] ${resourceType} - 새로운 데이터가 없지만 next_id가 있습니다. 페이지네이션 중단 권장.`);
            // 이 경우 처리를 위한 커스텀 필드 추가
            result.data._shouldStopPagination = true;
          }
          
          return result;
        } catch (error) {
          console.error(`[API 에러] ${resourceType} - 실패:`, error);
          throw error;
        }
      },
      initialPageParam: null as string | null,
      getPreviousPageParam: () => null, // 이전 페이지는 사용하지 않음
      getNextPageParam: (lastPage) => {
        // 커스텀 필드 확인하여 페이지네이션 중단 여부 결정
        if (lastPage?.data?._shouldStopPagination) {
          return null;
        }
        
        if (!lastPage || lastPage.data.next_id === null) {
          console.log(`[페이징] ${resourceType} - 더 이상 페이지가 없음 (next_id: null)`);
          return null;
        }
        
        const nextId = lastPage.data.next_id;
        
        // 수정: 함수 컴포넌트 레벨의 nextIdCountMapRef 사용
        const useCount = (nextIdCountMapRef.current.get(nextId) || 0) + 1;
        nextIdCountMapRef.current.set(nextId, useCount);
        
        // next_id가 2회 초과로 반복되면 중단 (최소 한 번은 실행)
        if (useCount > 2) {
          console.log(`[페이징] ${resourceType} - next_id(${nextId})가 ${useCount}회 반복되어 페이지네이션 종료.`);
          return null;
        }
        
        // next_id를 추적
        usedNextIdsRef.current.add(nextId);
        console.log(`[페이징] ${resourceType} - 다음 페이지 요청, next_id: ${nextId} (사용 횟수: ${useCount}회)`);
        return nextId;
      },
      enabled: !!userId,
      staleTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false, // 창 포커스 시 다시 가져오지 않음
      refetchOnReconnect: false, // 네트워크 재연결 시 다시 가져오지 않음
      refetchOnMount: false, // 컴포넌트 마운트 시 다시 가져오지 않음
      refetchInterval: false,
      refetchIntervalInBackground: false,
      structuralSharing: true,
    });
  };
} 