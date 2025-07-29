import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChannelsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';
import { createApiHeaders, getTokenStatus } from '../../../api/utils/apiHeaders';
import { refreshOpenAPIToken } from '../../../api/hooks/useApi';
import { getValidAccessToken } from '../../auth/utils/tokenManager';

export const useChannels = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.channels.lists(params),
    queryFn: async () => {
      // OpenAPI 토큰 업데이트
      refreshOpenAPIToken();

      return ChannelsService.getChannelsChannelsGet(params);
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export const useChannel = (channelId: string) => {
  return useQuery({
    queryKey: queryKeys.channels.detail(channelId),
    queryFn: () => ChannelsService.getChannelChannelsChannelIdGet(channelId),
    enabled: !!channelId,
  });
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.channels.create(),
    mutationFn: async (data: any) => {
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

      return ChannelsService.createChannelChannelsPost(data);
    },
    onMutate: async (newChannel) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.channels.lists() });

      // Snapshot the previous value
      const previousChannels = queryClient.getQueryData(queryKeys.channels.lists());

      return { previousChannels };
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
    },
    onError: (error, variables, context) => {
      console.error('Failed to create channel:', error);
      // Revert to the previous value if available
      if (context?.previousChannels) {
        queryClient.setQueryData(queryKeys.channels.lists(), context.previousChannels);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
    },
  });
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string; data: any }) => {
      return ChannelsService.updateChannelChannelsChannelIdPut(channelId, data);
    },
    onSuccess: (response, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(channelId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
    },
    onError: (error, { channelId }) => {
      console.error('Failed to update channel:', channelId, error);
    },
  });
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) =>
      ChannelsService.deleteChannelChannelsChannelIdDelete(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
    },
  });
};

export const useUpdateChannelThumbnail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string; data: any }) =>
      ChannelsService.updateThumbnailChannelsChannelIdThumbnailPatch(channelId, data),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(channelId) });
    },
  });
};

export const useAddChannelManagers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string; data: any }) =>
      ChannelsService.addManagersChannelsChannelIdManagersPost(channelId, data),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(channelId) });
    },
  });
};

export const useRemoveChannelManagers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string; data: any }) =>
      ChannelsService.removeManagersChannelsChannelIdManagersDelete(channelId, data),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(channelId) });
    },
  });
};
