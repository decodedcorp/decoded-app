import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getValidAccessToken } from '@/domains/auth/utils/tokenManager';
import { refreshOpenAPIToken } from '@/api/hooks/useApi';

import { ContentsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';
import { useToastMutation, useSimpleToastMutation } from '../../../lib/hooks/useToastMutation';
import { extractApiErrorMessage } from '../../../lib/utils/toastUtils';
import { useCommonTranslation } from '../../../lib/i18n/centralizedHooks';

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
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    async (data: { channel_id: string; url: string }) => {
      // API 요청 전 토큰 상태 확인
      const token = getValidAccessToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // 토큰이 있으면 OpenAPI 토큰 업데이트
      refreshOpenAPIToken();

      return ContentsService.createLinkContentContentsLinksPost(data);
    },
    {
      actionName: t.globalContentUpload.toast.actions.createLinkContent(),
      toastId: 'create-link-content',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      },
    },
  );
};

export const useCreateImageContent = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    async (data: { channel_id: string; base64_img: string }) => {
      // API 요청 전 토큰 상태 확인
      const token = getValidAccessToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // 토큰이 있으면 OpenAPI 토큰 업데이트
      refreshOpenAPIToken();

      return ContentsService.createImageContentContentsImagesPost(data);
    },
    {
      actionName: t.globalContentUpload.toast.actions.createImageContent(),
      toastId: 'create-image-content',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      },
    },
  );
};

export const useCreateVideoContent = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    async (data: {
      channel_id: string;
      title: string;
      description?: string;
      video_url: string;
      thumbnail_url?: string;
    }) => {
      // API 요청 전 토큰 상태 확인
      const token = getValidAccessToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // 토큰이 있으면 OpenAPI 토큰 업데이트
      refreshOpenAPIToken();

      return ContentsService.createVideoContentContentsVideosPost(data);
    },
    {
      actionName: t.globalContentUpload.toast.actions.createVideoContent(),
      toastId: 'create-video-content',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      },
    },
  );
};

export const useUpdateLinkContent = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    ({ contentId, data }: { contentId: string; data: any }) =>
      ContentsService.updateLinkContentContentsLinksContentIdPut(contentId, data),
    {
      actionName: t.globalContentUpload.toast.actions.updateLinkContent(),
      toastId: 'update-link-content',
      onSuccess: (_, { contentId }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.detail(contentId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      },
    },
  );
};

export const useUpdateImageContent = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    ({ contentId, data }: { contentId: string; data: any }) =>
      ContentsService.updateImageContentContentsImagesContentIdPut(contentId, data),
    {
      actionName: t.globalContentUpload.toast.actions.updateImageContent(),
      toastId: 'update-image-content',
      onSuccess: (_, { contentId }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.detail(contentId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      },
    },
  );
};

export const useUpdateVideoContent = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    ({ contentId, data }: { contentId: string; data: any }) =>
      ContentsService.updateVideoContentContentsVideosContentIdPut(contentId, data),
    {
      actionName: t.globalContentUpload.toast.actions.updateVideoContent(),
      toastId: 'update-video-content',
      onSuccess: (_, { contentId }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.detail(contentId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      },
    },
  );
};

export const useDeleteLinkContent = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    (contentId: string) => ContentsService.deleteLinkContentContentsLinksContentIdDelete(contentId),
    {
      actionName: t.globalContentUpload.toast.actions.deleteLinkContent(),
      toastId: 'delete-link-content',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      },
    },
  );
};

export const useDeleteImageContent = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    (contentId: string) =>
      ContentsService.deleteImageContentContentsImagesContentIdDelete(contentId),
    {
      actionName: t.globalContentUpload.toast.actions.deleteImageContent(),
      toastId: 'delete-image-content',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      },
    },
  );
};

export const useDeleteVideoContent = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useSimpleToastMutation(
    (contentId: string) =>
      ContentsService.deleteVideoContentContentsVideosContentIdDelete(contentId),
    {
      actionName: t.globalContentUpload.toast.actions.deleteVideoContent(),
      toastId: 'delete-video-content',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      },
    },
  );
};
