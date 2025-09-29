/**
 * Cache Invalidation Hook
 * Provides utilities for invalidating React Query caches
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateRecommendations = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['recommendations', 'channels'],
    });
  }, [queryClient]);

  const invalidateChannelData = useCallback(
    (channelId?: string) => {
      if (channelId) {
        // 특정 채널 데이터 무효화
        queryClient.invalidateQueries({
          queryKey: ['channels', channelId],
        });
      } else {
        // 모든 채널 데이터 무효화
        queryClient.invalidateQueries({
          queryKey: ['channels'],
        });
      }
    },
    [queryClient],
  );

  const invalidateUserData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['user'],
    });
  }, [queryClient]);

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  return {
    invalidateRecommendations,
    invalidateChannelData,
    invalidateUserData,
    invalidateAll,
  };
};
