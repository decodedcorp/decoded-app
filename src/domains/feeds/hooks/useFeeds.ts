import { useQuery } from '@tanstack/react-query';

import { FeedsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

export const useRecentFeed = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.recent(params),
    queryFn: () =>
      FeedsService.getRecentFeedFeedsRecentGet(params?.limit, params?.skip, params?.daysBack),
  });
};

export const usePopularFeed = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.popular(params),
    queryFn: () =>
      FeedsService.getPopularFeedFeedsPopularGet(params?.limit, params?.skip, params?.minLikes),
  });
};

export const useTrendingFeed = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.trending(params),
    queryFn: () =>
      FeedsService.getTrendingFeedFeedsTrendingGet(params?.limit, params?.skip, params?.hoursBack),
  });
};

export const useMixedFeed = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.mixed(params),
    queryFn: () =>
      FeedsService.getMixedFeedFeedsMixedGet(params?.limit, params?.skip, params?.recentRatio),
  });
};

export const useChannelFeed = (channelId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.channel(channelId, params),
    queryFn: () =>
      FeedsService.getChannelFeedFeedsChannelChannelIdGet(channelId, params?.limit, params?.skip),
    enabled: !!channelId,
  });
};

export const useProviderFeed = (providerId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.provider(providerId, params),
    queryFn: () =>
      FeedsService.getProviderFeedFeedsProviderProviderIdGet(
        providerId,
        params?.limit,
        params?.skip,
      ),
    enabled: !!providerId,
  });
};

export const useSearchFeed = (query: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.search(query, params),
    queryFn: () => FeedsService.searchFeedFeedsSearchGet(query, params?.limit, params?.skip),
    enabled: !!query,
  });
};

export const useMultipleFeeds = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.multiple(params),
    queryFn: () => FeedsService.getMultipleFeedsFeedsMultipleGet(params?.limit),
  });
};

export const useFeedStats = () => {
  return useQuery({
    queryKey: queryKeys.feeds.stats(),
    queryFn: () => FeedsService.getFeedStatsFeedsStatsGet(),
  });
};

export const useFeedHealth = () => {
  return useQuery({
    queryKey: queryKeys.feeds.health(),
    queryFn: () => FeedsService.getFeedHealthFeedsHealthGet(),
  });
};

export const useDefaultFeed = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.feeds.list({ type: 'default', ...params }),
    queryFn: () =>
      FeedsService.getDefaultFeedFeedsGet(params?.feedType, params?.limit, params?.skip),
  });
};
