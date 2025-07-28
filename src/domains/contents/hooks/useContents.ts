import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContentsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

export const useContentsByChannel = (channelId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.contents.byChannel(channelId),
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
    queryKey: queryKeys.contents.byProvider(providerId),
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

export const useUpdateLinkContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, data }: { contentId: string; data: any }) =>
      ContentsService.updateLinkContentContentsLinksContentIdPut(contentId, data),
    onSuccess: (_, { contentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.detail(contentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
    },
  });
};

export const useUpdateImageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, data }: { contentId: string; data: any }) =>
      ContentsService.updateImageContentContentsImagesContentIdPut(contentId, data),
    onSuccess: (_, { contentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.detail(contentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
    },
  });
};

export const useUpdateVideoContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, data }: { contentId: string; data: any }) =>
      ContentsService.updateVideoContentContentsVideosContentIdPut(contentId, data),
    onSuccess: (_, { contentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.detail(contentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
    },
  });
};

export const useDeleteLinkContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) =>
      ContentsService.deleteLinkContentContentsLinksContentIdDelete(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
    },
  });
};

export const useDeleteImageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) =>
      ContentsService.deleteImageContentContentsImagesContentIdDelete(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
    },
  });
};

export const useDeleteVideoContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) =>
      ContentsService.deleteVideoContentContentsVideosContentIdDelete(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
    },
  });
};
