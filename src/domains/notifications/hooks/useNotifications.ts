import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InteractionsService } from '@/api/generated';
import { queryKeys } from '@/lib/api/queryKeys';
import { refreshOpenAPIToken } from '@/api/hooks/useApi';
import { useToastMutation } from '@/lib/hooks/useToastMutation';
import { extractApiErrorMessage } from '@/lib/utils/toastUtils';

// 알림 목록 조회
export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) => {
  return useQuery({
    queryKey: queryKeys.interactions.myNotifications(params || {}),
    queryFn: async () => {
      refreshOpenAPIToken();
      
      try {
        const result = await InteractionsService.getMyNotificationsMeNotificationsGet(
          params?.page || 1,
          params?.limit || 20,
          params?.unreadOnly || false
        );
        return result;
      } catch (error) {
        console.error('[useNotifications] API call failed:', error);
        // 알림 API 실패 시 빈 배열 반환하여 앱이 계속 작동하도록 함
        return { notifications: [] };
      }
    },
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
    // API 실패해도 쿼리를 성공으로 처리 (fallback 데이터 사용)
    throwOnError: false,
  });
};

// 알림 읽음 처리
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useToastMutation(
    async (notificationId: string) => {
      refreshOpenAPIToken();
      return InteractionsService.markNotificationReadMeNotificationsMarkReadPost({
        notification_ids: [notificationId]
      });
    },
    {
      messages: {
        loading: 'Marking notification as read...',
        success: 'Notification marked as read',
        error: (err: unknown) => `Failed to mark notification as read: ${extractApiErrorMessage(err)}`,
      },
      toastId: 'mark-notification-read',
      onSuccess: () => {
        // 알림 목록 다시 불러오기
        queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myNotifications() });
      },
    }
  );
};

// 모든 알림 읽음 처리
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useToastMutation(
    async () => {
      refreshOpenAPIToken();
      return InteractionsService.markNotificationReadMeNotificationsMarkReadPost({});
    },
    {
      messages: {
        loading: 'Marking all notifications as read...',
        success: 'All notifications marked as read',
        error: (err: unknown) => `Failed to mark notifications as read: ${extractApiErrorMessage(err)}`,
      },
      toastId: 'mark-all-notifications-read',
      onSuccess: () => {
        // 알림 목록 다시 불러오기
        queryClient.invalidateQueries({ queryKey: queryKeys.interactions.myNotifications() });
      },
    }
  );
};

// 알림 통계 조회 (읽지 않은 알림 개수 등)
export const useNotificationStats = () => {
  return useQuery({
    queryKey: queryKeys.interactions.myStats(),
    queryFn: async () => {
      refreshOpenAPIToken();
      
      try {
        const result = await InteractionsService.getMyStatsInteractionsMeStatsGet();
        return result;
      } catch (error) {
        console.error('[useNotificationStats] API call failed:', error);
        throw error;
      }
    },
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: true,
    retry: 1,
    retryDelay: 1000,
  });
};