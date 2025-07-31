import React from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ContentsService } from '@/api/generated/services/ContentsService';
import { queryKeys } from '@/lib/api/queryKeys';
import { convertToContentItem, unifyContent, ContentItem } from '@/lib/types/content';

const isNotNullContentItem = (item: any): item is ContentItem => item !== null;

export interface UseChannelContentsParams {
  channelId: string;
  limit?: number;
  enabled?: boolean;
}

export interface UseChannelContentsResult {
  contents: ContentItem[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

/**
 * 채널별 콘텐츠를 조회하는 Hook (최적화됨)
 */
export const useChannelContents = ({
  channelId,
  limit = 20,
  enabled = true,
}: UseChannelContentsParams): UseChannelContentsResult => {
  const { data, isLoading, error, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: queryKeys.contents.byChannel(channelId),
      initialPageParam: 0,
      queryFn: async ({ pageParam }) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useChannelContents] Making API call for channelId:', channelId);
          console.log('[useChannelContents] Page param:', pageParam);
        }

        try {
          const result = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
            channelId,
            pageParam,
            limit,
          );

          if (process.env.NODE_ENV === 'development') {
            console.log('[useChannelContents] API call successful:', result);
          }

          // API 응답이 undefined인 경우 에러 던지기
          if (result === undefined) {
            throw new Error('API response is undefined - server returned empty response');
          }

          return result;
        } catch (error) {
          console.error('[useChannelContents] API call failed:', error);
          throw error;
        }
      },
      getNextPageParam: (lastPage, allPages) => {
        // next_id가 있으면 다음 페이지가 있음
        if (lastPage.next_id) {
          return allPages.length * limit;
        }
        return undefined;
      },
      enabled: enabled && !!channelId,
      // 캐싱 최적화
      staleTime: 2 * 60 * 1000, // 2분 (기존 3분에서 단축)
      gcTime: 5 * 60 * 1000, // 5분 (기존 10분에서 단축)
      // 불필요한 리페치 방지
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      // 재시도 정책 최적화
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('401')) {
          return false;
        }
        return failureCount < 1; // 1회만 재시도
      },
      retryDelay: 1000,
    });

  // 모든 페이지의 콘텐츠를 하나의 배열로 합치고 ContentItem으로 변환 (메모이제이션 최적화)
  const contents: ContentItem[] = React.useMemo(() => {
    if (!data?.pages) return [];

    const allContents = data.pages.flatMap((page: any) => page.contents || []);

    return (
      allContents
        .map((content) => {
          try {
            const unifiedContent = unifyContent(content);
            return convertToContentItem(unifiedContent);
          } catch (error) {
            console.error('[useChannelContents] Error converting content:', error, content);
            return null;
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any): item is ContentItem => item !== null)
    );
  }, [data?.pages]);

  return {
    contents,
    isLoading,
    error: error as Error | null,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
};

/**
 * 단일 페이지 채널 콘텐츠 조회 (무한 스크롤이 필요 없는 경우) - 최적화됨
 */
export const useChannelContentsSinglePage = ({
  channelId,
  limit = 20,
  enabled = true,
}: UseChannelContentsParams) => {
  return useQuery({
    queryKey: [...queryKeys.contents.byChannel(channelId), 'single'],
    queryFn: async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[useChannelContentsSinglePage] Making API call for channelId:', channelId);
      }

      try {
        const result = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
          channelId,
          0,
          limit,
        );

        if (process.env.NODE_ENV === 'development') {
          console.log('[useChannelContentsSinglePage] API call successful:', result);
        }

        if (result === undefined) {
          throw new Error('API response is undefined - server returned empty response');
        }

        return result;
      } catch (error) {
        console.error('[useChannelContentsSinglePage] API call failed:', error);
        throw error;
      }
    },
    enabled: enabled && !!channelId,
    // 캐싱 최적화
    staleTime: 2 * 60 * 1000, // 2분 (기존 3분에서 단축)
    gcTime: 5 * 60 * 1000, // 5분 (기존 10분에서 단축)
    // 불필요한 리페치 방지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    // 재시도 정책 최적화
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 1; // 1회만 재시도
    },
    retryDelay: 1000,
    // 데이터 변환 최적화 (메모이제이션)
    select: React.useCallback((data: any) => {
      const contents = data.contents || [];
      return contents
        .map((content: any) => {
          try {
            const unifiedContent = unifyContent(content);
            return convertToContentItem(unifiedContent);
          } catch (error) {
            console.error(
              '[useChannelContentsSinglePage] Error converting content:',
              error,
              content,
            );
            return null;
          }
        })
        .filter(isNotNullContentItem);
    }, []),
  });
};
