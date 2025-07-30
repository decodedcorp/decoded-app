import React from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ContentsService, ContentListResponse } from '@/api/generated';
import { queryKeys } from '@/lib/api/queryKeys';
import { unifyContent, convertToContentItem, ContentItem } from '@/lib/types/content';

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
 * 채널별 콘텐츠를 조회하는 Hook
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
        console.log('[useChannelContents] Making API call for channelId:', channelId);
        console.log('[useChannelContents] Page param:', pageParam);

        try {
          const result = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
            channelId,
            pageParam,
            limit,
          );

          console.log('[useChannelContents] API call successful:', result);

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
      staleTime: 3 * 60 * 1000, // 3분
      gcTime: 10 * 60 * 1000, // 10분
    });

  // 모든 페이지의 콘텐츠를 하나의 배열로 합치고 ContentItem으로 변환
  const contents: ContentItem[] = React.useMemo(() => {
    if (!data?.pages) return [];

    const allContents = data.pages.flatMap((page: any) => page.contents || []);

    return allContents
      .map((content) => {
        try {
          const unifiedContent = unifyContent(content);
          return convertToContentItem(unifiedContent);
        } catch (error) {
          console.error('[useChannelContents] Error converting content:', error, content);
          return null;
        }
      })
      .filter((item): item is ContentItem => item !== null);
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
 * 단일 페이지 채널 콘텐츠 조회 (무한 스크롤이 필요 없는 경우)
 */
export const useChannelContentsSinglePage = ({
  channelId,
  limit = 20,
  enabled = true,
}: UseChannelContentsParams) => {
  return useQuery({
    queryKey: [...queryKeys.contents.byChannel(channelId), 'single'],
    queryFn: async () => {
      console.log('[useChannelContentsSinglePage] Making API call for channelId:', channelId);

      try {
        const result = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
          channelId,
          0,
          limit,
        );

        console.log('[useChannelContentsSinglePage] API call successful:', result);

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
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 10 * 60 * 1000, // 10분
    select: (data) => {
      const contents = data.contents || [];
      return contents
        .map((content) => {
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
        .filter((item): item is ContentItem => item !== null);
    },
  });
};
