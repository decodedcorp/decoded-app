import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { InteractionsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

// Likes
export const useMyLikes = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.interactions.myLikes(params),
    queryFn: () => InteractionsService.getMyLikesMeLikesGet(params?.limit || 50, params?.skip),
  });
};

export const useLikeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) =>
      InteractionsService.createLikeLikesPost({ content_id: contentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myLikes() });
    },
  });
};

export const useUnlikeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) =>
      InteractionsService.removeLikeLikesContentIdDelete(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myLikes() });
    },
  });
};

export const useContentLikeStats = (contentId: string) => {
  return useQuery({
    queryKey: queryKeys.contents.likesStats(contentId),
    queryFn: () => InteractionsService.getContentLikeStatsContentsContentIdLikesStatsGet(contentId),
    enabled: !!contentId,
  });
};

// Subscriptions
export const useMySubscriptions = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.interactions.mySubscriptions(params),
    queryFn: () =>
      InteractionsService.getMySubscriptionsMeSubscriptionsGet(params?.limit || 50, params?.skip),
  });
};

export const useSubscribeToChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) =>
      InteractionsService.createSubscriptionSubscriptionsPost({ channel_id: channelId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.mySubscriptions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
    },
  });
};

export const useUnsubscribeFromChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) =>
      InteractionsService.removeSubscriptionSubscriptionsChannelIdDelete(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.mySubscriptions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
    },
  });
};

export const useChannelSubscriptionStats = (channelId: string) => {
  return useQuery({
    queryKey: queryKeys.channels.stats(channelId),
    queryFn: () =>
      InteractionsService.getChannelSubscriptionStatsChannelsChannelIdSubscriptionsStatsGet(
        channelId,
      ),
    enabled: !!channelId,
  });
};

// Notifications
export const useMyNotifications = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.interactions.myNotifications(params),
    queryFn: () =>
      InteractionsService.getMyNotificationsMeNotificationsGet(
        params?.isRead,
        params?.limit || 50,
        params?.skip,
      ),
  });
};

export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      InteractionsService.markMyNotificationsAsReadMeNotificationsMarkReadPatch({
        notification_ids: notificationIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myNotifications() });
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: InteractionsService.createNotificationAdminAdminNotificationsPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myNotifications() });
    },
  });
};

// Stats
export const useMyInteractionStats = () => {
  return useQuery({
    queryKey: queryKeys.interactions.myStats(),
    queryFn: () => InteractionsService.getMyInteractionStatsMeStatsGet(),
  });
};
