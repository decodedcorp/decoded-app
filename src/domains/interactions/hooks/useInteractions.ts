import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { InteractionsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';
import { ContentLikeStatsResponse } from '../../../api/generated/models/ContentLikeStatsResponse';

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
    mutationFn: (contentId: string) => {
      // MongoDB ObjectID 형식 검증 (24자리 hex)
      if (!/^[a-f\d]{24}$/i.test(contentId)) {
        throw new Error(`Invalid content ID format: ${contentId}`);
      }

      // API 호출 디버깅
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 [useLikeContent] API 호출:', {
          contentId,
          endpoint: `/contents/${contentId}/like`,
          method: 'POST',
        });
      }

      return InteractionsService.createContentLikeContentsContentIdLikePost(contentId);
    },
    onSuccess: (_, contentId) => {
      // 콘텐츠 좋아요 통계 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.contents.likesStats(contentId),
      });
      // 콘텐츠 목록 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.lists() });
      // 내 좋아요 목록 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myLikes() });
    },
  });
};

export const useUnlikeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) => {
      // MongoDB ObjectID 형식 검증 (24자리 hex)
      if (!/^[a-f\d]{24}$/i.test(contentId)) {
        throw new Error(`Invalid content ID format: ${contentId}`);
      }

      // API 호출 디버깅
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 [useUnlikeContent] API 호출:', {
          contentId,
          endpoint: `/contents/${contentId}/like`,
          method: 'DELETE',
        });
      }

      return InteractionsService.removeContentLikeContentsContentIdLikeDelete(contentId);
    },
    onSuccess: (_, contentId) => {
      // 콘텐츠 좋아요 통계 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.contents.likesStats(contentId),
      });
      // 콘텐츠 목록 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.lists() });
      // 내 좋아요 목록 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myLikes() });
    },
  });
};

export const useContentLikeStats = (contentId: string) => {
  return useQuery<ContentLikeStatsResponse>({
    queryKey: queryKeys.contents.likesStats(contentId),
    queryFn: () => {
      // API 호출 디버깅
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 [useContentLikeStats] API 호출:', {
          contentId,
          endpoint: `/contents/${contentId}/likes/stats`,
          method: 'GET',
        });
      }

      return InteractionsService.getContentLikeStatsContentsContentIdLikesStatsGet(contentId);
    },
    enabled: !!contentId,
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음
      if (error && 'status' in error && error.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
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
      InteractionsService.createChannelSubscriptionChannelsChannelIdSubscribePost(channelId),
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
      InteractionsService.removeChannelSubscriptionChannelsChannelIdSubscribeDelete(channelId),
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

// Admin notification creation hook removed - API endpoint no longer available
// export const useCreateNotification = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: InteractionsService.createNotificationAdminAdminNotificationsPost,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myNotifications() });
//     },
//   });
// };

// Channel Likes - Temporarily disabled due to missing API methods
/*
export const useChannelLikeStats = (channelId: string) => {
  return useQuery({
    queryKey: queryKeys.channels.likeStats(channelId),
    queryFn: () =>
      InteractionsService.getChannelLikeStatsEndpointChannelsChannelIdLikesStatsGet(channelId),
    enabled: !!channelId,
  });
};

export const useLikeChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) =>
      InteractionsService.createChannelLikeChannelsChannelIdLikePost(channelId),
    onSuccess: (_, channelId) => {
      // 채널 좋아요 통계 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.channels.likeStats(channelId),
      });
      // 채널 목록 무효화 (좋아요 상태 반영)
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
      // 내 좋아요 목록 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myLikes() });
    },
  });
};

export const useUnlikeChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) =>
      InteractionsService.removeChannelLikeChannelsChannelIdLikeDelete(channelId),
    onSuccess: (_, channelId) => {
      // 채널 좋아요 통계 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.channels.likeStats(channelId),
      });
      // 채널 목록 무효화 (좋아요 상태 반영)
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
      // 내 좋아요 목록 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myLikes() });
    },
  });
};
*/

// Stats
export const useMyInteractionStats = () => {
  return useQuery({
    queryKey: queryKeys.interactions.myStats(),
    queryFn: () => InteractionsService.getMyInteractionStatsMeStatsGet(),
  });
};
