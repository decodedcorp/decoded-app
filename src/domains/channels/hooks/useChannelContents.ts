import React from 'react';
import deepEqual from 'fast-deep-equal';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ContentsService } from '@/api/generated/services/ContentsService';
import { PublicService } from '@/api/generated/services/PublicService';
import { queryKeys } from '@/lib/api/queryKeys';
import { convertToContentItem, unifyContent, ContentItem } from '@/lib/types/content';
import { ContentStatus } from '@/api/generated';

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
 * 스마트 폴링을 위한 상태 관리 훅
 */
export const useSmartPolling = (channelId: string, enabled: boolean = true) => {
  // 브라우저 가시성 상태 추적
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 1. PENDING 상태 콘텐츠만 별도로 폴링
  const pendingContentsQuery = useQuery({
    queryKey: [...queryKeys.contents.byChannel(channelId), 'pending'],
    queryFn: async () => {
      const result = await ContentsService.getContentsByStatusContentsStatusStatusGet(
        ContentStatus.PENDING,
        0,
        50, // 충분한 수의 pending 콘텐츠 조회
      );
      return result.contents || [];
    },
    enabled: enabled && !!channelId && isVisible, // 가시성 상태도 고려
    refetchInterval: isVisible ? 5000 : false, // 기본 5초 간격, 비활성화 시 중단
    refetchIntervalInBackground: false,
    staleTime: 3000, // 3초 후 stale (1초 → 3초로 증가)
    gcTime: 2 * 60 * 1000, // 2분 후 가비지 컬렉션
  });

  // 2. 배치 상태 확인 (AI 처리 상태)
  const batchStatusQuery = useQuery({
    queryKey: [...queryKeys.contents.byChannel(channelId), 'batch-status'],
    queryFn: async () => {
      // 배치 ID가 있다면 배치 상태 확인
      // 현재는 demo API 사용, 실제 배치 ID는 콘텐츠에서 추출 필요
      return null;
    },
    enabled: enabled && !!channelId && (pendingContentsQuery.data?.length || 0) > 0 && isVisible,
    refetchInterval: isVisible ? 8000 : false, // 기본 8초 간격, 비활성화 시 중단
    refetchIntervalInBackground: false,
  });

  // 3. 동적 폴링 간격 조절을 위한 useEffect
  React.useEffect(() => {
    if (!enabled || !channelId || !isVisible) return;

    const pendingCount = pendingContentsQuery.data?.length || 0;
    let interval: NodeJS.Timeout;

    // 동적 폴링 간격 설정
    if (pendingCount > 10) {
      interval = setInterval(() => {
        pendingContentsQuery.refetch();
      }, 3000); // 대기열이 많으면 3초마다
    } else if (pendingCount > 5) {
      interval = setInterval(() => {
        pendingContentsQuery.refetch();
      }, 5000); // 중간 대기열이면 5초마다
    } else if (pendingCount > 0) {
      interval = setInterval(() => {
        pendingContentsQuery.refetch();
      }, 8000); // 적은 대기열이면 8초마다
    } else {
      interval = setInterval(() => {
        pendingContentsQuery.refetch();
      }, 15000); // 대기열이 없으면 15초마다
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    enabled,
    channelId,
    isVisible,
    pendingContentsQuery.data?.length,
    pendingContentsQuery.refetch,
  ]);

  return {
    pendingContents: pendingContentsQuery.data || [],
    isPollingPending: pendingContentsQuery.isFetching,
    batchStatus: batchStatusQuery.data,
    isPollingBatch: batchStatusQuery.isFetching,
  };
};

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
        // 개발 모드에서만 로깅 (빈도 제한)
        if (process.env.NODE_ENV === 'development' && Math.random() < 0.1) {
          // 10% 확률로만 로깅
          console.log('[useChannelContents] Making API call for channelId:', channelId);
          console.log('[useChannelContents] Page param:', pageParam);
        }

        try {
          const result = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
            channelId,
            pageParam,
            limit,
          );

          // 개발 모드에서만 로깅 (빈도 제한)
          if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
            // 5% 확률로만 로깅
            console.log('[useChannelContents] API call successful:', result);
            console.log('[useChannelContents] API response structure:', {
              hasContents: !!result.contents,
              contentsLength: result.contents?.length || 0,
              firstContent: result.contents?.[0],
              allContentKeys: result.contents?.[0] ? Object.keys(result.contents[0]) : [],
            });

            // 링크 콘텐츠의 상세 정보 로깅 (더 적은 빈도)
            if (result.contents?.length > 0 && Math.random() < 0.1) {
              // 10% 확률로만 로깅
              result.contents.forEach((content: any, index: number) => {
                if (content.type === 'link') {
                  console.log(`[useChannelContents] Link content ${index}:`, {
                    id: content.id,
                    url: content.url,
                    link_preview_metadata: content.link_preview_metadata,
                    hasImageUrl: !!content.link_preview_metadata?.img_url,
                    imageUrl: content.link_preview_metadata?.img_url,
                  });
                }
              });
            }
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
      // 캐싱 최적화 - 스마트 폴링으로 인해 더 긴 캐시 시간 사용
      staleTime: 5 * 60 * 1000, // 5분 (스마트 폴링으로 인해 연장)
      gcTime: 10 * 60 * 1000, // 10분
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
 * 스마트 폴링이 적용된 단일 페이지 채널 콘텐츠 조회
 */
export const useChannelContentsSinglePage = ({
  channelId,
  limit = 20,
  enabled = true,
  enableSmartPolling = true, // 스마트 폴링 활성화 옵션
}: UseChannelContentsParams & { enableSmartPolling?: boolean }) => {
  // 스마트 폴링 훅 사용
  const { pendingContents, isPollingPending } = useSmartPolling(
    channelId,
    enabled && enableSmartPolling,
  );

  const mainQuery = useQuery({
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
    // 캐싱 최적화 - 스마트 폴링으로 인해 더 긴 캐시 시간 사용
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    // 스마트 폴링으로 대체하므로 기존 폴링 비활성화
    refetchInterval: false,
    refetchIntervalInBackground: false,
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
      if (process.env.NODE_ENV === 'development') {
        console.log('[useChannelContentsSinglePage] Raw API response:', data);
      }

      const contents = data.contents || [];

      if (process.env.NODE_ENV === 'development') {
        console.log('[useChannelContentsSinglePage] Contents array length:', contents.length);
      }

      const convertedContents = contents
        .map((content: any, index: number) => {
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[useChannelContentsSinglePage] Converting content ${index}:`, {
                id: content.id,
                type: content.type,
                title: content.title,
                status: content.status,
              });
            }

            const unifiedContent = unifyContent(content);
            const convertedItem = convertToContentItem(unifiedContent);

            if (process.env.NODE_ENV === 'development') {
              console.log(
                `[useChannelContentsSinglePage] Successfully converted content ${index}:`,
                {
                  originalId: content.id,
                  convertedId: convertedItem?.id,
                  type: convertedItem?.type,
                  title: convertedItem?.title,
                },
              );
            }

            return convertedItem;
          } catch (error) {
            console.error(
              `[useChannelContentsSinglePage] Error converting content ${index}:`,
              error,
              'Original content:',
              content,
            );
            return null;
          }
        })
        .filter(isNotNullContentItem);

      if (process.env.NODE_ENV === 'development') {
        console.log('[useChannelContentsSinglePage] Final converted contents:', {
          originalCount: contents.length,
          convertedCount: convertedContents.length,
          convertedItems: convertedContents.map((item: any) => ({
            id: item.id,
            type: item.type,
            title: item.title,
            status: item.status,
          })),
        });
      }

      return convertedContents;
    }, []),
  });

  // 메인 콘텐츠와 pending 콘텐츠를 병합 (고도화된 중복 제거 + 메모이제이션 최적화)
  const mergedContents = React.useMemo(() => {
    const mainContents = mainQuery.data || [];

    if (!enableSmartPolling || pendingContents.length === 0) {
      return mainContents;
    }

    // 메인 콘텐츠의 ID와 상태를 추출
    const mainContentMap = new Map<string, { item: ContentItem; status: any }>(
      mainContents.map((item: ContentItem) => [String(item.id), { item, status: item.status }]),
    );

    // pending 콘텐츠를 필터링하고 변환
    const validPendingContents = pendingContents
      .map((content: any) => {
        try {
          const unifiedContent = unifyContent(content);
          const contentItem = convertToContentItem(unifiedContent);
          return contentItem;
        } catch (error) {
          console.error('[useChannelContentsSinglePage] Error processing pending content:', error);
          return null;
        }
      })
      .filter((item): item is ContentItem => item !== null)
      .filter((pendingItem) => {
        const existingItem = mainContentMap.get(String(pendingItem.id));

        // 1. 메인에 없는 경우: pending 추가
        if (!existingItem) {
          return true;
        }

        // 2. 메인에 있지만 상태가 다른 경우: pending이 더 최신이면 교체
        if (existingItem.status !== pendingItem.status) {
          // PENDING → ACTIVE로 변경된 경우 pending 제거 (메인에 이미 반영됨)
          if (
            pendingItem.status === ContentStatus.PENDING &&
            existingItem.status === ContentStatus.ACTIVE
          ) {
            return false;
          }
          // 그 외 상태 변경은 pending 우선 (더 최신 정보)
          return true;
        }

        // 3. 동일한 상태인 경우: 메인 우선 (중복 제거)
        return false;
      });

    // 최종 병합: 메인 + 유효한 pending
    const finalContents = [...mainContents];

    // pending 콘텐츠를 메인에 추가하거나 교체
    validPendingContents.forEach((pendingItem) => {
      const existingIndex = finalContents.findIndex((item) => item.id === pendingItem.id);
      if (existingIndex >= 0) {
        // 기존 항목 교체 (더 최신 정보)
        finalContents[existingIndex] = pendingItem;
      } else {
        // 새 항목 추가
        finalContents.push(pendingItem);
      }
    });

    return finalContents;
  }, [mainQuery.data, pendingContents, enableSmartPolling]);

  // 리렌더링 방지를 위한 이전 값 참조
  const prevMergedContentsRef = React.useRef<ContentItem[] | null>(null);

  // 최종 메모이제이션된 결과
  const finalContents = React.useMemo(() => {
    // 이전 값과 깊은 비교
    if (prevMergedContentsRef.current && deepEqual(prevMergedContentsRef.current, mergedContents)) {
      return prevMergedContentsRef.current;
    }

    // 새로운 값 저장
    prevMergedContentsRef.current = mergedContents;
    return mergedContents;
  }, [mergedContents]);

  return {
    data: finalContents,
    isLoading: mainQuery.isLoading,
    error: mainQuery.error as Error | null,
    refetch: mainQuery.refetch,
    isPolling: isPollingPending,
  };
};
