import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { ChannelsService } from '../../../api/generated';
import type { ChannelCreate } from '../../../api/generated/models/ChannelCreate';
import { queryKeys } from '../../../lib/api/queryKeys';
import { createApiHeaders, getTokenStatus } from '../../../api/utils/apiHeaders';
import { refreshOpenAPIToken } from '../../../api/hooks/useApi';
import { getValidAccessToken } from '../../auth/utils/tokenManager';
import { OpenAPI } from '../../../api/generated/core/OpenAPI';
import { useToastMutation, useSimpleToastMutation } from '../../../lib/hooks/useToastMutation';
import { extractApiErrorMessage } from '../../../lib/utils/toastUtils';
import { useCommonTranslation } from '../../../lib/i18n/centralizedHooks';

export const useChannels = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  ownerId?: string;
  isManager?: boolean;
  sortBy?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: params ? queryKeys.channels.list(params) : queryKeys.channels.lists(),
    queryFn: async () => {
      // OpenAPI 토큰 업데이트
      refreshOpenAPIToken();

      return ChannelsService.listChannelsChannelsGet(
        params?.page,
        params?.limit,
        params?.search,
        params?.ownerId,
        params?.isManager,
        params?.sortBy,
        params?.sortOrder,
      );
    },
    staleTime: 2 * 60 * 1000, // 2분으로 단축
    gcTime: 10 * 60 * 1000, // 10분 (기존 cacheTime)
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    refetchOnMount: false, // 마운트 시 재요청 비활성화
    retry: 1, // 재시도 횟수 제한
    retryDelay: 1000, // 재시도 간격 1초
  });
};

export const useChannel = (channelId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.channels.detail(channelId),
    queryFn: async () => {
      // OpenAPI 토큰 업데이트
      refreshOpenAPIToken();

      console.log('[useChannel] Making API call for channelId:', channelId);

      try {
        const result = await ChannelsService.getChannelChannelsChannelIdGet(channelId);
        console.log('[useChannel] API call successful:', result);

        // API 응답이 undefined인 경우 에러 던지기
        if (result === undefined) {
          throw new Error('API response is undefined - server returned empty response');
        }

        return result;
      } catch (error) {
        console.error('[useChannel] API call failed:', error);
        throw error;
      }
    },
    enabled: !!channelId && options?.enabled !== false,
    // 캐시 전략 최적화 - 채널 전환 성능 향상
    staleTime: 15 * 60 * 1000, // 15분으로 증가 - 채널 정보는 자주 변경되지 않음
    gcTime: 2 * 60 * 60 * 1000, // 2시간으로 증가 - 더 오래 캐시하여 빠른 전환 지원
    // 불필요한 리페치 방지
    refetchOnWindowFocus: false,
    refetchOnMount: false, // 캐시된 데이터가 있으면 즉시 사용
    refetchOnReconnect: false,
    // 재시도 정책 최적화
    retry: (failureCount, error) => {
      // 401 에러는 재시도하지 않음
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 1; // 재시도 횟수 줄임
    },
    retryDelay: 500, // 재시도 지연 시간 단축
    // 네트워크 상태에 따른 스마트 리페치
    networkMode: 'online',
    // 즉시 캐시된 데이터 반환
    notifyOnChangeProps: ['data', 'error'],
  });
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useToastMutation(
    async (data: ChannelCreate) => {
      // 유효한 토큰이 있는지 확인
      const validToken = getValidAccessToken();
      if (!validToken) {
        throw new Error('No valid access token available');
      }

      // Update OpenAPI token before making the request
      refreshOpenAPIToken();

      // 토큰이 제대로 설정되었는지 다시 확인
      const updatedToken = getValidAccessToken();
      if (!updatedToken) {
        throw new Error('Failed to update OpenAPI token');
      }

      // API 요청 데이터 준비 및 검증
      const requestData = {
        name: data.name?.trim(),
        description: data.description?.trim() || null,
        thumbnail_base64: data.thumbnail_base64 || null,
        banner_base64: data.banner_base64 || null,
        category: data.category || null,
        subcategory: data.subcategory || null,
      };

      // 필수 필드 검증
      if (!requestData.name || requestData.name.length === 0) {
        throw new Error('Channel name is required');
      }

      if (requestData.name.length < 3) {
        throw new Error('Channel name must be at least 3 characters');
      }

      if (requestData.name.length > 50) {
        throw new Error('Channel name must be less than 50 characters');
      }

      // Base64 데이터 검증 (있는 경우)
      if (requestData.thumbnail_base64) {
        if (requestData.thumbnail_base64.length > 10 * 1024 * 1024) {
          // 10MB 제한
          throw new Error('Image size too large (max 10MB)');
        }
      }

      return ChannelsService.createChannelChannelsPost(requestData);
    },
    {
      messages: {
        loading: t.globalContentUpload.toast.messages.creatingChannel(),
        success: t.globalContentUpload.toast.messages.channelCreated(),
        error: (err: unknown) =>
          `${t.globalContentUpload.toast.messages.channelCreateFailed()}: ${extractApiErrorMessage(
            err,
          )}`,
      },
      toastId: 'create-channel',
      mutationKey: queryKeys.channels.create(),
      onMutate: async (newChannel: ChannelCreate) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: queryKeys.channels.lists() });

        // Snapshot the previous value
        const previousChannels = queryClient.getQueryData(queryKeys.channels.lists());

        return { previousChannels };
      },
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
      },
      onError: (error: any, variables: ChannelCreate, context: any) => {
        // Revert to the previous value if available
        if (context?.previousChannels) {
          queryClient.setQueryData(queryKeys.channels.lists(), context.previousChannels);
        }
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
      },
    },
  );
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation<any, any, { channelId: string; data: any }, any>(
    ({ channelId, data }) => {
      return ChannelsService.updateChannelChannelsChannelIdPut(channelId, data);
    },
    {
      actionName: t.globalContentUpload.toast.actions.updateChannel(),
      toastId: 'update-channel',
      onSuccess: (response: any, { channelId }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(channelId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
      },
      onError: (error: any, { channelId }) => {
        console.error('Failed to update channel:', channelId, error);
      },
    },
  );
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    (channelId: string) => ChannelsService.deleteChannelChannelsChannelIdDelete(channelId),
    {
      actionName: t.globalContentUpload.toast.actions.deleteChannel(),
      toastId: 'delete-channel',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
      },
    },
  );
};

export const useUpdateChannelThumbnail = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation<any, any, { channelId: string; data: any }, any>(
    ({ channelId, data }) =>
      ChannelsService.updateThumbnailChannelsChannelIdThumbnailPatch(channelId, data),
    {
      actionName: t.globalContentUpload.toast.actions.updateThumbnail(),
      toastId: 'update-thumbnail',
      onSuccess: (_: any, { channelId }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(channelId) });
      },
    },
  );
};

// Manager methods removed - not available in ChannelsService

export const useInfiniteChannels = (params?: {
  limit?: number;
  search?: string;
  ownerId?: string;
  isManager?: boolean;
  sortBy?: string;
  sortOrder?: string;
}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.channels.list(params || {}),
    queryFn: async ({ pageParam = 1 }) => {
      // OpenAPI 토큰 업데이트
      refreshOpenAPIToken();

      return ChannelsService.listChannelsChannelsGet(
        pageParam as number,
        params?.limit || 20,
        params?.search,
        params?.ownerId,
        params?.isManager,
        params?.sortBy,
        params?.sortOrder,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      // 마지막 페이지에 더 많은 데이터가 있으면 다음 페이지 반환
      if (lastPage?.channels && lastPage.channels.length === (params?.limit || 20)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000, // 2분으로 단축
    gcTime: 10 * 60 * 1000, // 10분 (기존 cacheTime)
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    refetchOnMount: false, // 마운트 시 재요청 비활성화
    retry: 1, // 재시도 횟수 제한
    retryDelay: 1000, // 재시도 간격 1초
  });
};
