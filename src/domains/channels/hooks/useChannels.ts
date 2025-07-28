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

export const useChannel = (id: string) => {
  return useQuery({
    queryKey: queryKeys.channels.detail(id),
    queryFn: () => ChannelsService.getChannelChannelsChannelIdGet(id),
    enabled: !!id,
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
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      ChannelsService.updateChannelChannelsChannelIdPut(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
    },
  });
};
