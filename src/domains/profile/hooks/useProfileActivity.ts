import { useQuery } from '@tanstack/react-query';
import { ChannelsService } from '@/api/generated/services/ChannelsService';
import { InteractionsService } from '@/api/generated/services/InteractionsService';
import { UsersService } from '@/api/generated/services/UsersService';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook to get user's managed channels
 */
export const useMyChannels = (enabled = true) => {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: queryKeys.channels.myChannels(),
    queryFn: () => ChannelsService.listChannelsChannelsGet(1, 50, undefined, undefined, true),
    enabled: !!user && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get user's subscribed channels
 */
export const useMySubscriptions = (limit = 50, skip = 0, enabled = true) => {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: queryKeys.subscriptions.list({ limit, skip }),
    queryFn: () => InteractionsService.getMySubscriptionsMeSubscriptionsGet(limit, skip),
    enabled: !!user && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get user's interaction stats (legacy)
 */
export const useMyStats = (enabled = true) => {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: queryKeys.users.stats(),
    queryFn: () => InteractionsService.getMyInteractionStatsMeStatsGet(),
    enabled: !!user && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get user's activity stats - new comprehensive stats API
 */
export const useUserActivityStats = (enabled = true) => {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: queryKeys.users.activityStats(),
    queryFn: () => UsersService.getMyActivityStatsUsersMeStatsGet(),
    enabled: !!user && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get user's comments (placeholder - need to check API)
 */
export const useMyComments = (limit = 20, skip = 0) => {
  const user = useAuthStore((state) => state.user);
  
  // TODO: Replace with actual API call when endpoint is available
  return useQuery({
    queryKey: ['comments', 'my', { limit, skip }],
    queryFn: async () => {
      // Placeholder - need to implement when API is available
      return {
        comments: [],
        total_count: 0,
        has_more: false,
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};