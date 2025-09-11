import { useInfiniteQuery } from '@tanstack/react-query';

import { ContentsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

interface InfiniteContentParams {
  limit?: number;
  sortBy?: 'hot' | 'new' | 'top';
}

export const useInfiniteContentsByChannel = (
  channelId: string, 
  params: InfiniteContentParams = {}
) => {
  const { limit = 20, sortBy = 'hot' } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.contents.infiniteByChannel(channelId, sortBy),
    initialPageParam: 0, // React Query v5 필수 속성
    queryFn: async ({ pageParam = 0 }) => {
      const response = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
        channelId,
        pageParam, // skip
        limit
      );
      
      return {
        contents: response.contents || [],
        nextCursor: response.contents && response.contents.length === limit 
          ? pageParam + limit 
          : undefined,
        totalCount: response.total_count || 0
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!channelId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 방지
    retry: (failureCount, error) => {
      // 네트워크 에러는 3번 재시도, 서버 에러는 1번만 재시도
      if (error && (error as any).status >= 500) return failureCount < 1;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    // 성능 최적화: 초기 로드 시 첫 페이지만, 이후 background에서 업데이트
    refetchOnMount: 'always',
    // 메모리 관리: 최대 10페이지까지만 유지
    maxPages: 10,
    // 에러 발생 시에도 기존 데이터 유지 (React Query v5)
    placeholderData: (previousData) => previousData,
  });
};