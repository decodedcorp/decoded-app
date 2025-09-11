'use client';

import { useMemo, useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { SearchService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

// 적응형 지연 시간 계산
function getAdaptiveDelay(query: string, baseDelay: number): number {
  const length = query.trim().length;
  
  // 짧은 쿼리는 더 오래 기다림 (너무 많은 결과 방지)
  if (length <= 1) return baseDelay + 200;
  if (length === 2) return baseDelay + 100;
  
  // 긴 쿼리는 빠르게 반응 (구체적인 검색)
  if (length >= 8) return Math.max(baseDelay - 100, 150);
  if (length >= 5) return Math.max(baseDelay - 50, 200);
  
  return baseDelay;
}

// Adaptive debounce hook for search input
function useDebounce<T>(value: T, baseDelay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 문자열인 경우 적응형 지연 적용
    const adaptiveDelay = typeof value === 'string' 
      ? getAdaptiveDelay(value, baseDelay)
      : baseDelay;

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, adaptiveDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, baseDelay]);

  return debouncedValue;
}

interface UseSearchContentsParams {
  query: string;
  limit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

interface UseSearchChannelsParams {
  query: string;
  limit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

interface UseSearchChannelContentsParams {
  channelId: string;
  query: string;
  limit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Hook for searching contents across all channels
 */
export const useSearchContents = ({
  query,
  limit = 10,
  enabled = true,
  debounceMs = 300,
}: UseSearchContentsParams) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // Only enable search if query has meaningful content (최소 2글자)
  const shouldQuery = enabled && debouncedQuery.trim().length >= 2;

  return useQuery({
    queryKey: queryKeys.search.contents(debouncedQuery, limit),
    queryFn: () => SearchService.searchContentsSearchContentsGet(debouncedQuery, limit),
    enabled: shouldQuery,
    staleTime: 2 * 60 * 1000, // 2 minutes - 자동완성용 짧게
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // 포커스 시 재요청 비활성화
    retry: 1, // 실패 시 1회만 재시도 (빠른 응답 중시)
    retryDelay: 500, // 재시도 지연 최소화
  });
};

/**
 * Hook for searching channels
 */
export const useSearchChannels = ({
  query,
  limit = 10,
  enabled = true,
  debounceMs = 300,
}: UseSearchChannelsParams) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // Only enable search if query has meaningful content (최소 2글자)
  const shouldQuery = enabled && debouncedQuery.trim().length >= 2;

  return useQuery({
    queryKey: queryKeys.search.channels(debouncedQuery, limit),
    queryFn: () => SearchService.searchChannelsSearchChannelsGet(debouncedQuery, limit),
    enabled: shouldQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes - 채널은 덜 자주 변함
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 500,
  });
};

/**
 * Hook for searching contents within a specific channel
 */
export const useSearchChannelContents = ({
  channelId,
  query,
  limit = 10,
  enabled = true,
  debounceMs = 300,
}: UseSearchChannelContentsParams) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // Only enable search if query has meaningful content and channelId exists (최소 2글자)
  const shouldQuery = enabled && debouncedQuery.trim().length >= 2 && channelId.trim().length > 0;

  return useQuery({
    queryKey: queryKeys.search.channelContents(channelId, debouncedQuery, limit),
    queryFn: () => SearchService.searchChannelContentsSearchChannelsChannelIdContentsGet(
      channelId,
      debouncedQuery,
      limit
    ),
    enabled: shouldQuery,
    staleTime: 3 * 60 * 1000, // 3 minutes - 채널별 콘텐츠
    gcTime: 8 * 60 * 1000, // 8 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 500,
  });
};

interface UseSearchUsersParams {
  query: string;
  limit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Hook for searching users
 */
export const useSearchUsers = ({
  query,
  limit = 10,
  enabled = true,
  debounceMs = 300,
}: UseSearchUsersParams) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // Only enable search if query has meaningful content (최소 2글자)
  const shouldQuery = enabled && debouncedQuery.trim().length >= 2;

  return useQuery({
    queryKey: queryKeys.search.users(debouncedQuery, limit),
    queryFn: () => SearchService.searchUsersSearchUsersGet(debouncedQuery, limit),
    enabled: shouldQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes - 사용자 정보는 덜 자주 변함
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 500,
  });
};

/**
 * Combined search hook that provides both channel and content results
 */
interface UseCombinedSearchParams {
  query: string;
  channelLimit?: number;
  contentLimit?: number;
  enabled?: boolean;
  debounceMs?: number;
}

export const useCombinedSearch = ({
  query,
  channelLimit = 5,
  contentLimit = 8,
  enabled = true,
  debounceMs = 300,
}: UseCombinedSearchParams) => {
  const channelsQuery = useSearchChannels({
    query,
    limit: channelLimit,
    enabled,
    debounceMs,
  });

  const contentsQuery = useSearchContents({
    query,
    limit: contentLimit,
    enabled,
    debounceMs,
  });

  const combinedData = useMemo(() => {
    return {
      channels: channelsQuery.data?.channels || [],
      contents: {
        image: contentsQuery.data?.image || [],
        video: contentsQuery.data?.video || [],
        link: contentsQuery.data?.link || [],
      },
    };
  }, [channelsQuery.data, contentsQuery.data]);

  const isLoading = channelsQuery.isLoading || contentsQuery.isLoading;
  const error = channelsQuery.error || contentsQuery.error;
  const isFetching = channelsQuery.isFetching || contentsQuery.isFetching;

  return {
    data: combinedData,
    isLoading,
    error,
    isFetching,
    refetch: () => {
      channelsQuery.refetch();
      contentsQuery.refetch();
    },
  };
};