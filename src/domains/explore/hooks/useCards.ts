/**
 * Infinity Quilt Grid - useCards Hook
 *
 * React Query useInfiniteQuery 기반 무한 스크롤 훅
 * queryFn에서 API 호출 대신 getCards() 호출
 * getNextPageParam으로 nextCursor 전달
 */

'use client';

import { useInfiniteQuery, useQuery, type UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import type { Card, CardsRequest, CardsResponse } from '../types/card';
import type { InfiniteData } from '@tanstack/react-query';
import { CardsProvider } from '../data/cardsProvider';
import { CARD_CONSTANTS } from '../types/card';

// Query Key Factory
export const cardsQueryKeys = {
  all: ['cards'] as const,
  lists: () => [...cardsQueryKeys.all, 'list'] as const,
  list: (filters: Partial<CardsRequest>) => [...cardsQueryKeys.lists(), filters] as const,
  details: () => [...cardsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...cardsQueryKeys.details(), id] as const,
  stats: () => [...cardsQueryKeys.all, 'stats'] as const,
} as const;

// Hook Options Interface
interface UseCardsOptions {
  limit?: number;
  category?: string;
  tags?: string[];
  author?: string;
  type?: 'image' | 'video' | 'card';
  priority?: 'high' | 'medium' | 'low';
  sortBy?: 'latest' | 'popular' | 'trending' | 'random';
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

// Infinite Query Result Type
interface UseCardsResult {
  // 데이터
  cards: Card[];
  pages: CardsResponse[];

  // 상태
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // 페이지네이션
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;

  // 액션
  fetchNextPage: () => Promise<void>;
  fetchPreviousPage: () => Promise<void>;
  refresh: () => Promise<void>;

  // 메타데이터
  totalCount: number;
  loadedCount: number;

  // 캐시 관리
  invalidate: () => Promise<void>;
}

/**
 * 무한 스크롤 카드 목록 훅
 */
export function useCards(options: UseCardsOptions = {}): UseCardsResult {
  const {
    limit = CARD_CONSTANTS.DEFAULT_LIMIT,
    category,
    tags,
    author,
    type,
    priority,
    sortBy = 'latest',
    enabled = true,
    staleTime = CARD_CONSTANTS.CACHE_TTL_MS,
    gcTime = CARD_CONSTANTS.CACHE_TTL_MS * 2,
  } = options;

  // Request 객체 생성
  const request: CardsRequest = useMemo(
    () => ({
      limit,
      category,
      tags,
      author,
      type,
      priority,
      sortBy,
    }),
    [limit, category, tags, author, type, priority, sortBy],
  );

  // Query Key 생성
  const queryKey = cardsQueryKeys.list(request);

  // Infinite Query 설정
  const queryOptions: UseInfiniteQueryOptions<CardsResponse, Error, InfiniteData<CardsResponse>> = {
    queryKey,
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as string | undefined;
      return CardsProvider.getCards({ ...request, cursor });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.prevCursor || undefined;
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // 네트워크 에러는 최대 3번 재시도
      if (error.message.includes('fetch')) {
        return failureCount < 3;
      }
      // 기타 에러는 1번만 재시도
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  };

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage: _fetchNextPage,
    fetchPreviousPage: _fetchPreviousPage,
    refetch,
  } = useInfiniteQuery<CardsResponse, Error>(queryOptions);

  // 모든 페이지의 카드를 평면화
  const cards = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page: CardsResponse) => page.items);
  }, [data?.pages]);

  // 총 개수 계산 (첫 페이지에서 제공)
  const totalCount = useMemo(() => {
    return data?.pages[0]?.totalCount ?? 0;
  }, [data?.pages]);

  // 액션 함수들
  const fetchNextPage = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      try {
        await _fetchNextPage();
      } catch (error) {
        console.error('Failed to fetch next page:', error);
      }
    }
  }, [hasNextPage, isFetchingNextPage, _fetchNextPage]);

  const fetchPreviousPage = useCallback(async () => {
    if (hasPreviousPage && !isFetchingPreviousPage) {
      try {
        await _fetchPreviousPage();
      } catch (error) {
        console.error('Failed to fetch previous page:', error);
      }
    }
  }, [hasPreviousPage, isFetchingPreviousPage, _fetchPreviousPage]);

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh cards:', error);
    }
  }, [refetch]);

  const invalidate = useCallback(async () => {
    // 캐시 무효화 (refetch로 대체)
    await refetch();
  }, [refetch]);

  return {
    // 데이터
    cards,
    pages: data?.pages ?? [],

    // 상태
    isLoading,
    isError,
    error,

    // 페이지네이션
    hasNextPage: !!hasNextPage,
    hasPreviousPage: !!hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,

    // 액션
    fetchNextPage,
    fetchPreviousPage,
    refresh,

    // 메타데이터
    totalCount,
    loadedCount: cards.length,

    // 캐시 관리
    invalidate,
  };
}

/**
 * 단일 카드 조회 훅
 */
interface UseCardOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useCard(id: string, options: UseCardOptions = {}) {
  const {
    enabled = true,
    staleTime = CARD_CONSTANTS.CACHE_TTL_MS,
    gcTime = CARD_CONSTANTS.CACHE_TTL_MS * 2,
  } = options;

  return useQuery({
    queryKey: cardsQueryKeys.detail(id),
    queryFn: () => CardsProvider.getCard(id),
    enabled: enabled && !!id,
    staleTime,
    gcTime,
    retry: 2,
  });
}

/**
 * 카드 통계 조회 훅
 */
export function useCardsStats() {
  return useQuery({
    queryKey: cardsQueryKeys.stats(),
    queryFn: CardsProvider.getStats,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

/**
 * 무한 스크롤 센티넬 훅
 * IntersectionObserver 기반으로 자동 다음 페이지 로딩
 */
interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
  const {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin = `${CARD_CONSTANTS.OVERSCAN_PIXELS}px`,
    threshold = CARD_CONSTANTS.INTERSECTION_THRESHOLD,
    enabled = true,
  } = options;

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node || !enabled) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          rootMargin,
          threshold,
        },
      );

      observer.observe(node);

      // Cleanup
      return () => {
        observer.disconnect();
      };
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin, threshold, enabled],
  );

  return { sentinelRef };
}

/**
 * 카드 프리로딩 훅
 * 뷰포트 근처의 카드들을 미리 로딩
 */
export function useCardPreloading(cards: Card[], viewportCards: Card[]) {
  const preloadNextBatch = useCallback(() => {
    const currentIndex = cards.findIndex((card) => viewportCards.some((vc) => vc.id === card.id));

    if (currentIndex === -1) return;

    // 현재 뷰포트 이후 10-20개 카드의 이미지를 프리로드
    const nextCards = cards.slice(
      currentIndex + viewportCards.length,
      currentIndex + viewportCards.length + 20,
    );

    nextCards.forEach((card) => {
      if (card.loadPriority === 'high' || card.preloadHint) {
        const img = new Image();
        img.src = card.thumbnailUrl;
      }
    });
  }, [cards, viewportCards]);

  return { preloadNextBatch };
}

// 개발/디버깅용 유틸리티
export const CardsHookUtils = {
  queryKeys: cardsQueryKeys,
  constants: CARD_CONSTANTS,
} as const;
