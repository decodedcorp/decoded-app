'use client';

import { useQuery } from '@tanstack/react-query';
import { InteractionsService } from '@/api/generated/services/InteractionsService';
import { ChannelsService } from '@/api/generated/services/ChannelsService';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { SubscriptionResponse } from '@/api/generated/models/SubscriptionResponse';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuthStore } from '@/store/authStore';

/**
 * 구독한 채널의 상세 정보를 가져오는 훅
 */
export const useSubscribedChannels = (limit: number = 5) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['subscribed-channels', limit],
    queryFn: async (): Promise<ChannelResponse[]> => {
      // 1. 구독 목록 가져오기
      const subscriptionsResponse = await InteractionsService.getMySubscriptionsMeSubscriptionsGet(
        limit,
        0,
      );

      if (!subscriptionsResponse?.subscriptions?.length) {
        return [];
      }

      // 2. 각 채널의 상세 정보 가져오기
      const channelPromises = subscriptionsResponse.subscriptions
        .filter((sub: SubscriptionResponse) => sub.is_active)
        .map(async (sub: SubscriptionResponse) => {
          try {
            const channel = await ChannelsService.getChannelChannelsChannelIdGet(sub.channel_id);
            return channel;
          } catch (error) {
            console.warn(`Failed to fetch channel ${sub.channel_id}:`, error);
            return null;
          }
        });

      const channels = await Promise.all(channelPromises);

      // 3. null 값 제거하고 반환
      return channels.filter((channel): channel is ChannelResponse => channel !== null);
    },
    enabled: isAuthenticated, // 인증된 사용자만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
