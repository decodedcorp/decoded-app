import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useMemo, useCallback } from 'react';

import { TrendingService } from '@/api/generated/services/TrendingService';
import { ContentsService } from '@/api/generated/services/ContentsService';
import { ContentStatus } from '@/api/generated/models/ContentStatus';
import { queryKeys } from '@/lib/api/queryKeys';

import type {
  FeedQueryParams,
  FeedContentsResult,
  FeedPage,
  FeedItem,
  SortOption,
} from '../types/feedTypes';
import {
  normalizeTrendingItem,
  normalizeContentItem,
  mergeAndDeduplicateItems,
  deduplicateItems,
  sortItemsByDate,
} from '../utils/feedNormalizers';

/**
 * Enhanced infinite scroll hook for MainFeed with hybrid API strategy
 *
 * Strategy:
 * - Page 0: TrendingService (hot content, curated)
 * - Page 1+: ContentsService (general content, pagination)
 *
 * Features:
 * - Session-level deduplication
 * - Sort mode consistency
 * - Performance optimizations
 * - Error handling & retry
 */
export function useFeedContents({
  sort = 'hot',
  channelId,
  providerId,
  status = 'published',
  hours = 24,
  limit = 20,
}: FeedQueryParams = {}): FeedContentsResult {
  // Session-level deduplication (survives page changes)
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Query key with all parameters for proper cache separation
  const queryKey = useMemo(
    () =>
      queryKeys.feed.infinite({
        sort,
        channelId,
        providerId,
        status,
        hours,
        limit,
      }),
    [sort, channelId, providerId, status, hours, limit],
  );

  // Reset deduplication when query parameters change
  const resetDeduplication = useCallback(() => {
    seenIdsRef.current = new Set();
  }, []);

  // Hybrid page fetcher
  const fetchPage = useCallback(
    async ({ pageParam = 0 }): Promise<FeedPage> => {
      try {
        // PAGE 0: TrendingService (curated content)
        if (pageParam === 0) {
          const promises: Promise<any>[] = [];

          // Fetch based on sort mode
          if (sort === 'hot') {
            promises.push(TrendingService.getPopularTrendsTrendingPopularGet('content', limit));
          } else if (sort === 'new') {
            promises.push(
              TrendingService.getCurrentTrendsTrendingTrendingGet('content', limit, hours),
            );
          } else if (sort === 'top') {
            // Fetch both popular and trending for 'top' mode
            promises.push(
              TrendingService.getPopularTrendsTrendingPopularGet('content', Math.floor(limit / 2)),
              TrendingService.getCurrentTrendsTrendingTrendingGet(
                'content',
                Math.floor(limit / 2),
                hours,
              ),
            );
          }

          const results = await Promise.all(promises);
          let items: FeedItem[] = [];

          if (sort === 'top' && results.length === 2) {
            // Merge popular and trending with deduplication
            const [popularResponse, trendingResponse] = results;
            const popularItems = popularResponse?.content || [];
            const trendingItems = trendingResponse?.content || [];

            items = mergeAndDeduplicateItems(popularItems, trendingItems, seenIdsRef.current);
          } else {
            // Single API response
            const response = results[0];
            const rawItems = response?.content || [];
            const normalizedItems = rawItems.map((item: any, index: number) =>
              normalizeTrendingItem(item, index, sort),
            );

            items = deduplicateItems(normalizedItems, seenIdsRef.current);
          }

          return {
            items,
            pageIndex: 0,
            hasMore: true, // Always allow continuation to ContentsService
            pageType: 'trending',
            sortMode: sort,
          };
        }

        // PAGE 1+: ContentsService (general content with pagination)
        const skip = (pageParam - 1) * limit; // Adjust for 0-based trending page

        let contentsResponse;

        if (channelId) {
          contentsResponse = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
            channelId,
            skip,
            limit,
          );
        } else if (providerId) {
          contentsResponse =
            await ContentsService.getContentsByProviderContentsProviderProviderIdGet(
              providerId,
              skip,
              limit,
            );
        } else {
          // Map 'published' to 'active' status for API compatibility
          const apiStatus = status === 'published' ? ContentStatus.ACTIVE : status;
          contentsResponse = await ContentsService.getContentsByStatusContentsStatusStatusGet(
            apiStatus as ContentStatus,
            skip,
            limit,
          );
        }

        // Normalize and deduplicate content items
        const rawItems = contentsResponse?.contents || [];
        const normalizedItems = rawItems.map(normalizeContentItem);

        // Sort by creation date for consistency
        const sortedItems = sortItemsByDate(normalizedItems, false);
        const items = deduplicateItems(sortedItems, seenIdsRef.current);

        return {
          items,
          pageIndex: pageParam,
          hasMore: items.length === limit, // Has more if we got full page
          pageType: 'content',
          sortMode: sort,
        };
      } catch (error) {
        console.error('Feed fetch error:', error);
        throw error;
      }
    },
    [sort, channelId, providerId, status, hours, limit],
  );

  // Infinite query with optimized settings
  const query = useInfiniteQuery<FeedPage>({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage({ pageParam: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.pageIndex + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors, but not for 4xx errors
      if (failureCount >= 3) return false;
      const status = (error as any)?.status;
      return !status || status >= 500;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Reset deduplication when query key changes (new search/filter)
  useMemo(() => {
    resetDeduplication();
  }, [resetDeduplication, queryKey]);

  // Compute derived data
  const allItems = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flatMap((page) => page.items);
  }, [query.data?.pages]);

  const totalItems = allItems.length;

  return {
    data: query.data,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: () => {
      resetDeduplication();
      return query.refetch();
    },
    allItems,
    totalItems,
  };
}
