/**
 * Channel Contents Hook
 *
 * 채널별 콘텐츠 데이터를 가져오는 React Query 기반 훅
 * 기존 useCards와 호환되면서 실제 API 데이터 사용
 */

'use client';

import { useCallback, useMemo } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { ContentsService } from '@/api/generated';
import type { ContentListResponse } from '@/api/generated';

import type { Card, CardsRequest, CardsResponse } from '../types/card';

// Channel Contents Hook Options
interface UseChannelContentsOptions {
  channelId: string;
  limit?: number;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

// API Response Transform Types
interface APIContent {
  id: string;
  channel_id: string;
  url: string;
  status: 'active' | 'pending';
  category: string | null;
  link_preview_metadata: {
    title: string;
    description: string;
    img_url: string;
    site_name: string;
  } | null;
  ai_gen_metadata: {
    summary: string;
    qa_list: Array<{
      question: string;
      answer: string;
    }>;
  } | null;
  created_at: string;
  updated_at: string | null;
  provider?: {
    id: string;
    name: string;
  };
  thumbnail_url?: string;
  metadata?: {
    title: string;
    description: string;
  };
  likes?: number;
}

// Content Type Detection
const determineCardType = (category: string | null, url: string): 'image' | 'video' | 'card' => {
  if (category === 'photo') return 'image';
  if (category === 'video' || url.includes('youtube.com') || url.includes('youtu.be'))
    return 'video';
  return 'card';
};

// Priority Detection
const determineLoadPriority = (content: APIContent): 'high' | 'medium' | 'low' => {
  if (content.status !== 'active') return 'low';
  if (content.category === 'photo' || content.category === 'video') return 'high';
  return 'medium';
};

// Extract dominant color from image URL (placeholder logic)
const extractDominantColor = (imageUrl: string | null): string => {
  if (!imageUrl) return '#18181b';

  // Simple hash-based color generation for consistency
  let hash = 0;
  for (let i = 0; i < imageUrl.length; i++) {
    hash = imageUrl.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 20%, 15%)`; // Dark, low saturation colors
};

// Transform API Content to Card Interface
const transformContentToCard = (content: APIContent): Card => {
  const authorName = content.provider?.name || 'Unknown Author';

  return {
    id: content.id,
    type: 'card' as const,
    createdAt: content.created_at,
    updatedAt: content.updated_at || undefined,
    thumbnailUrl: content.link_preview_metadata?.img_url || content.thumbnail_url || '',
    originalUrl: content.link_preview_metadata?.img_url || content.thumbnail_url || undefined,
    avgColor: extractDominantColor(content.link_preview_metadata?.img_url || ''),
    blurhash: undefined,
    aspectRatio: undefined,
    metadata: {
      title:
        content.link_preview_metadata?.title || content.metadata?.title || `Content ${content.id}`,
      description:
        content.link_preview_metadata?.description || content.metadata?.description || '',
      category: content.category || undefined,
      author: {
        id: content.provider?.id || content.id, // provider ID 또는 content ID를 fallback으로 사용
        name: authorName,
      },
      likeCount: content.likes || 0,
      commentCount: 0,
      viewCount: 0,
      shareCount: 0,
      aiSummary: content.ai_gen_metadata?.summary,
      qaList: content.ai_gen_metadata?.qa_list?.map((qa) => ({
        question: qa.question,
        answer: qa.answer,
      })),
      sourceUrl: content.url,
      siteName: content.link_preview_metadata?.site_name,
    },
    status: content.status as 'published' | 'draft' | 'archived' | 'active' | 'pending',
    priority: 'medium' as const,
  };
};

// Transform API Response to Cards Response
const transformAPIResponse = (apiResponse: ContentListResponse): CardsResponse => {
  const cards = apiResponse.contents?.map((content: any) => transformContentToCard(content)) || [];

  return {
    items: cards,
    hasMore: !!apiResponse.next_id,
    nextCursor: apiResponse.next_id || undefined,
    totalCount: apiResponse.total_count || cards.length,
    prevCursor: undefined, // API doesn't provide previous cursor
  };
};

// Query Key Factory
export const channelContentsQueryKeys = {
  all: ['channel-contents'] as const,
  lists: () => [...channelContentsQueryKeys.all, 'list'] as const,
  list: (channelId: string, filters: Partial<CardsRequest>) =>
    [...channelContentsQueryKeys.lists(), channelId, filters] as const,
} as const;

/**
 * 채널 콘텐츠 무한 스크롤 훅
 */
export function useChannelContents(options: UseChannelContentsOptions) {
  const {
    channelId,
    limit = 20,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
  } = options;

  // Query Key 생성
  const queryKey = channelContentsQueryKeys.list(channelId, { limit });

  // Infinite Query 설정
  const queryOptions = {
    queryKey,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const skip = pageParam || 0;
      console.log('[useChannelContents] Making API request:', {
        channelId,
        skip,
        limit,
        pageParam,
      });
      try {
        console.log('[useChannelContents] About to call API with:', { channelId, skip, limit });
        const result = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
          channelId,
          skip,
          limit,
        );
        console.log('[useChannelContents] Raw API response:', result);
        console.log('[useChannelContents] API response type:', typeof result);
        console.log('[useChannelContents] API response JSON:', JSON.stringify(result, null, 2));

        // 응답이 없거나 비어있는 경우 기본값 반환
        if (!result) {
          console.warn(
            '[useChannelContents] API returned null/undefined, returning empty response',
          );
          return {
            contents: [],
            next_id: null,
            total_count: 0,
          };
        }

        // 응답 검증 및 로깅
        console.log('[useChannelContents] Validated API response:', {
          hasResult: !!result,
          resultType: typeof result,
          resultKeys: result ? Object.keys(result) : [],
          contentsExists: 'contents' in result,
          contentsType: typeof result.contents,
          contentsLength: Array.isArray(result.contents) ? result.contents.length : 'not array',
          nextId: result?.next_id,
          totalCount: result?.total_count,
        });

        return result;
      } catch (error: any) {
        console.error('[useChannelContents] API error details:', {
          error,
          errorMessage: error?.message,
          errorStack: error?.stack,
          channelId,
          skip,
          limit,
        });
        throw error;
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      if (!lastPage.next_id) return undefined;
      // Calculate next skip based on total loaded items
      return allPages.reduce((total: number, page: any) => total + (page.contents?.length || 0), 0);
    },
    enabled: true, // 강제 활성화하여 테스트
    staleTime,
    gcTime,
    refetchOnWindowFocus: false,
    retry: (failureCount: number, error: any) => {
      // Network errors: retry up to 3 times
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return failureCount < 3;
      }
      // Other errors: retry once
      return failureCount < 1;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  };

  const queryResult = useInfiniteQuery(queryOptions);

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: _fetchNextPage,
    refetch,
    isSuccess,
    isFetching,
    status,
    fetchStatus,
  } = queryResult;

  // Debug React Query state
  console.log('[useChannelContents] React Query state:', {
    channelId,
    isLoading,
    isSuccess,
    isFetching,
    isError,
    status,
    fetchStatus,
    error: error?.message,
    hasData: !!data,
    hasPages: !!data?.pages,
    pagesCount: data?.pages?.length || 0,
    hasNextPage,
    isFetchingNextPage,
    queryKey,
    dataStructure: data,
    queryResult,
  });

  // Transform pages to cards
  const cards = useMemo(() => {
    console.log('[useChannelContents] Transform pages to cards:', {
      hasData: !!data,
      hasPages: !!data?.pages,
      pagesLength: data?.pages?.length || 0,
      pages: data?.pages,
    });

    if (!data?.pages) {
      console.log('[useChannelContents] No data.pages, returning empty array');
      return [];
    }

    const transformedCards = data.pages.flatMap((page: ContentListResponse, pageIndex: number) => {
      console.log(`[useChannelContents] Processing page ${pageIndex}:`, {
        page,
        hasContents: !!page.contents,
        contentsLength: page.contents?.length || 0,
        contents: page.contents,
      });

      if (!page.contents) {
        console.log(`[useChannelContents] Page ${pageIndex} has no contents`);
        return [];
      }

      const pageCards = page.contents
        .map((content, contentIndex) => {
          console.log(
            `[useChannelContents] Processing content ${contentIndex} on page ${pageIndex}:`,
            content,
          );
          try {
            const transformedCard = transformContentToCard(content as APIContent);
            console.log(
              `[useChannelContents] Transformed content ${contentIndex}:`,
              transformedCard,
            );
            return transformedCard;
          } catch (error) {
            console.error(
              `[useChannelContents] Error transforming content ${contentIndex}:`,
              error,
              content,
            );
            return null;
          }
        })
        .filter(Boolean);

      console.log(`[useChannelContents] Page ${pageIndex} produced ${pageCards.length} cards`);
      return pageCards;
    });

    console.log('[useChannelContents] Final transformed cards:', {
      totalCards: transformedCards.length,
      cards: transformedCards,
    });

    return transformedCards;
  }, [data?.pages]);

  // Calculate total count
  const totalCount = useMemo(() => {
    return data?.pages?.[0]?.total_count ?? 0;
  }, [data?.pages]);

  // Action functions
  const fetchNextPage = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      try {
        await _fetchNextPage();
      } catch (error) {
        console.error('Failed to fetch next page:', error);
      }
    }
  }, [hasNextPage, isFetchingNextPage, _fetchNextPage]);

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh channel contents:', error);
    }
  }, [refetch]);

  return {
    // Data
    cards,
    pages: data?.pages || [],

    // State
    isLoading,
    isError,
    error,

    // Pagination
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,

    // Actions
    fetchNextPage,
    refresh,

    // Metadata
    totalCount,
    loadedCount: cards.length,
    channelId,

    // Transform utilities (for debugging)
    transformContentToCard,
    transformAPIResponse,
  };
}

// Compatibility hook - wraps useChannelContents to match useCards interface
export function useChannelCardsCompat(channelId: string, options: Partial<CardsRequest> = {}) {
  const result = useChannelContents({
    channelId,
    limit: options.limit || 20,
    enabled: true,
  });

  return {
    ...result,
    // Add missing properties for backward compatibility
    hasPreviousPage: false,
    isFetchingPreviousPage: false,
    fetchPreviousPage: async () => {}, // No-op
    invalidate: result.refresh,
  };
}
