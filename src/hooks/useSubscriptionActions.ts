/**
 * Subscription Actions Hook
 * Provides subscription/unsubscription actions with cache invalidation
 */

import { useCallback } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useCacheInvalidation } from './useCacheInvalidation';

export const useSubscriptionActions = () => {
  const { subscribe, unsubscribe, setLoading, setError } = useSubscriptionStore();
  const { invalidateRecommendations, invalidateChannelData } = useCacheInvalidation();

  const handleSubscribe = useCallback(
    async (channelId: string) => {
      try {
        setLoading(true);
        setError(null);

        // TODO: 실제 API 호출로 구독 처리
        // await subscribeToChannelAPI(channelId);

        // 로컬 상태 업데이트
        subscribe(channelId);

        // 캐시 무효화
        invalidateRecommendations();
        invalidateChannelData(channelId);

        console.log(`[Subscription] Successfully subscribed to channel ${channelId}`);
      } catch (error) {
        console.error(`[Subscription] Failed to subscribe to channel ${channelId}:`, error);
        setError(error instanceof Error ? error.message : '구독에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [subscribe, setLoading, setError, invalidateRecommendations, invalidateChannelData],
  );

  const handleUnsubscribe = useCallback(
    async (channelId: string) => {
      try {
        setLoading(true);
        setError(null);

        // TODO: 실제 API 호출로 구독 취소 처리
        // await unsubscribeFromChannelAPI(channelId);

        // 로컬 상태 업데이트
        unsubscribe(channelId);

        // 캐시 무효화
        invalidateRecommendations();
        invalidateChannelData(channelId);

        console.log(`[Subscription] Successfully unsubscribed from channel ${channelId}`);
      } catch (error) {
        console.error(`[Subscription] Failed to unsubscribe from channel ${channelId}:`, error);
        setError(error instanceof Error ? error.message : '구독 취소에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [unsubscribe, setLoading, setError, invalidateRecommendations, invalidateChannelData],
  );

  return {
    handleSubscribe,
    handleUnsubscribe,
  };
};
