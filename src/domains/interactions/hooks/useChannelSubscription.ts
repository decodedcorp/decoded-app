'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InteractionsService } from '@/api/generated/services/InteractionsService';
import { SubscriptionResponse } from '@/api/generated/models/SubscriptionResponse';
import { ChannelSubscriptionStatsResponse } from '@/api/generated/models/ChannelSubscriptionStatsResponse';
import { toast } from 'react-hot-toast';

/**
 * Channel subscription hook for managing subscribe/unsubscribe actions
 */
export const useChannelSubscription = (channelId: string) => {
  const queryClient = useQueryClient();

  // Query keys for caching
  const subscriptionStatsKey = ['channel-subscription-stats', channelId];
  const userSubscriptionsKey = ['user-subscriptions'];

  // Get subscription stats for the channel
  const {
    data: subscriptionStats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useQuery<ChannelSubscriptionStatsResponse>({
    queryKey: subscriptionStatsKey,
    queryFn: () =>
      InteractionsService.getChannelSubscriptionStatsChannelsChannelIdSubscriptionsStatsGet(
        channelId,
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get user's subscriptions to check if already subscribed
  const { data: userSubscriptions, isLoading: isUserSubscriptionsLoading } = useQuery({
    queryKey: userSubscriptionsKey,
    queryFn: () => InteractionsService.getMySubscriptionsMeSubscriptionsGet(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check if user is subscribed to this channel
  const isSubscribed =
    userSubscriptions?.subscriptions?.some(
      (sub: SubscriptionResponse) => sub.channel_id === channelId && sub.is_active,
    ) ?? false;

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: () =>
      InteractionsService.createChannelSubscriptionChannelsChannelIdSubscribePost(channelId),
    onSuccess: (data: SubscriptionResponse) => {
      try {
        // Update user subscriptions cache - add new subscription
        queryClient.setQueryData(userSubscriptionsKey, (oldData: any) => {
          if (!oldData) return { subscriptions: [data] };

          // Check if subscription already exists
          const existingIndex = oldData.subscriptions?.findIndex(
            (sub: SubscriptionResponse) => sub.channel_id === channelId,
          );

          if (existingIndex !== -1) {
            // Update existing subscription
            const updatedSubscriptions = [...oldData.subscriptions];
            updatedSubscriptions[existingIndex] = { ...data, is_active: true };
            return { ...oldData, subscriptions: updatedSubscriptions };
          } else {
            // Add new subscription
            return {
              ...oldData,
              subscriptions: [...(oldData.subscriptions || []), { ...data, is_active: true }],
            };
          }
        });

        // Update subscription stats cache - only for this specific channel
        queryClient.setQueryData(subscriptionStatsKey, (oldData: any) => {
          if (!oldData) {
            // If no existing data, create a minimal structure
            return {
              channel_id: channelId,
              total_subscribers: 1,
              total_subscriptions: 1,
            };
          }

          return {
            ...oldData,
            total_subscribers: (oldData.total_subscribers || 0) + 1,
            total_subscriptions: (oldData.total_subscriptions || 0) + 1,
          };
        });

        // Show success message
        toast.success('Successfully subscribed to channel!');

        // Invalidate only this specific channel's queries
        queryClient.invalidateQueries({
          queryKey: subscriptionStatsKey,
          exact: true,
        });

        // Invalidate user subscriptions to refresh the list
        queryClient.invalidateQueries({
          queryKey: userSubscriptionsKey,
          exact: true,
        });
      } catch (error) {
        console.error('Error updating cache after subscribe:', error);
        // Fallback: invalidate all related queries if cache update fails
        queryClient.invalidateQueries({ queryKey: subscriptionStatsKey });
        queryClient.invalidateQueries({ queryKey: userSubscriptionsKey });
      }
    },
    onError: (error: any) => {
      console.error('Subscribe error:', error);
      toast.error('Failed to subscribe. Please try again.');
    },
  });

  // Unsubscribe mutation
  const unsubscribeMutation = useMutation({
    mutationFn: () =>
      InteractionsService.removeChannelSubscriptionChannelsChannelIdSubscribeDelete(channelId),
    onSuccess: () => {
      try {
        // Update user subscriptions cache - remove or deactivate subscription
        queryClient.setQueryData(userSubscriptionsKey, (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            subscriptions:
              oldData.subscriptions?.map((sub: SubscriptionResponse) =>
                sub.channel_id === channelId ? { ...sub, is_active: false } : sub,
              ) || [],
          };
        });

        // Update subscription stats cache - only for this specific channel
        queryClient.setQueryData(subscriptionStatsKey, (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            total_subscribers: Math.max((oldData.total_subscribers || 1) - 1, 0),
            total_subscriptions: Math.max((oldData.total_subscriptions || 1) - 1, 0),
          };
        });

        // Show success message
        toast.success('Successfully unsubscribed from channel!');

        // Invalidate only this specific channel's queries
        queryClient.invalidateQueries({
          queryKey: subscriptionStatsKey,
          exact: true,
        });

        // Invalidate user subscriptions to refresh the list
        queryClient.invalidateQueries({
          queryKey: userSubscriptionsKey,
          exact: true,
        });
      } catch (error) {
        console.error('Error updating cache after unsubscribe:', error);
        // Fallback: invalidate all related queries if cache update fails
        queryClient.invalidateQueries({ queryKey: subscriptionStatsKey });
        queryClient.invalidateQueries({ queryKey: userSubscriptionsKey });
      }
    },
    onError: (error: any) => {
      console.error('Unsubscribe error:', error);
      toast.error('Failed to unsubscribe. Please try again.');
    },
  });

  // Toggle subscription function
  const toggleSubscription = () => {
    if (isSubscribed) {
      unsubscribeMutation.mutate();
    } else {
      subscribeMutation.mutate();
    }
  };

  // Loading states
  const isLoading = subscribeMutation.isPending || unsubscribeMutation.isPending;
  const isInitialLoading = isStatsLoading || isUserSubscriptionsLoading;

  return {
    // States
    isSubscribed,
    isLoading,
    isInitialLoading,
    subscriptionStats,

    // Actions
    subscribe: () => subscribeMutation.mutate(),
    unsubscribe: () => unsubscribeMutation.mutate(),
    toggleSubscription,

    // Mutations for advanced usage
    subscribeMutation,
    unsubscribeMutation,

    // Errors
    error: statsError || subscribeMutation.error || unsubscribeMutation.error,
  };
};

/**
 * Simplified hook for just checking subscription status
 */
export const useIsChannelSubscribed = (channelId: string) => {
  const { data: userSubscriptions } = useQuery({
    queryKey: ['user-subscriptions'],
    queryFn: () => InteractionsService.getMySubscriptionsMeSubscriptionsGet(),
    staleTime: 5 * 60 * 1000,
  });

  const isSubscribed =
    userSubscriptions?.subscriptions?.some(
      (sub: SubscriptionResponse) => sub.channel_id === channelId && sub.is_active,
    ) ?? false;

  return { isSubscribed };
};
