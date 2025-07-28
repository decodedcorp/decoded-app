import { useQuery } from '@tanstack/react-query';
import { FeedsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

export const useRecentFeed = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.list({ type: 'recent', ...params }),
    queryFn: () =>
      FeedsService.getRecentFeedFeedsRecentGet(params?.limit, params?.skip, params?.daysBack),
  });
};

export const usePopularFeed = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.list({ type: 'popular', ...params }),
    queryFn: () =>
      FeedsService.getPopularFeedFeedsPopularGet(params?.limit, params?.skip, params?.minLikes),
  });
};

export const useTrendingFeed = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.list({ type: 'trending', ...params }),
    queryFn: () =>
      FeedsService.getTrendingFeedFeedsTrendingGet(params?.limit, params?.skip, params?.hoursBack),
  });
};

export const useMixedFeed = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.list({ type: 'mixed', ...params }),
    queryFn: () =>
      FeedsService.getMixedFeedFeedsMixedGet(params?.limit, params?.skip, params?.recentRatio),
  });
};

export const useChannelFeed = (channelId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.list({ channelId, ...params }),
    queryFn: () =>
      FeedsService.getChannelFeedFeedsChannelChannelIdGet(channelId, params?.limit, params?.skip),
    enabled: !!channelId,
  });
};

export const useMultipleFeeds = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.list({ type: 'multiple', ...params }),
    queryFn: () => FeedsService.getMultipleFeedsFeedsMultipleGet(params?.limit),
  });
};
