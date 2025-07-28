import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContentsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

export const useContentsByChannel = (channelId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.contents.list({ channelId, ...params }),
    queryFn: () =>
      ContentsService.getContentsByChannelContentsChannelChannelIdGet(
        channelId,
        params?.skip,
        params?.limit || 20,
      ),
    enabled: !!channelId,
  });
};

export const useContentsByProvider = (providerId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.contents.list({ providerId, ...params }),
    queryFn: () =>
      ContentsService.getContentsByProviderContentsProviderProviderIdGet(
        providerId,
        params?.skip,
        params?.limit || 20,
      ),
    enabled: !!providerId,
  });
};

export const useLinkContent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.contents.detail(id),
    queryFn: () => ContentsService.getLinkContentContentsLinksContentIdGet(id),
    enabled: !!id,
  });
};

export const useImageContent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.contents.detail(id),
    queryFn: () => ContentsService.getImageContentContentsImagesContentIdGet(id),
    enabled: !!id,
  });
};

export const useVideoContent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.contents.detail(id),
    queryFn: () => ContentsService.getVideoContentContentsVideosContentIdGet(id),
    enabled: !!id,
  });
};

export const useCreateLinkContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ContentsService.createLinkContentContentsLinksPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
    },
  });
};

export const useCreateImageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ContentsService.createImageContentContentsImagesPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
    },
  });
};

export const useCreateVideoContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ContentsService.createVideoContentContentsVideosPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
    },
  });
};
