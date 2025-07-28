import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChannelsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

export const useChannels = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.channels.list(params || {}),
    queryFn: () =>
      ChannelsService.listChannelsChannelsGet(
        params?.page || 1,
        params?.limit || 20,
        params?.search,
        params?.ownerId,
        params?.sortBy || 'created_at',
        params?.sortOrder || 'desc',
      ),
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
    mutationFn: ChannelsService.createChannelChannelsPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
    },
  });
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string; data: any }) =>
      ChannelsService.updateChannelChannelsChannelIdPut(channelId, data),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(channelId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
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
