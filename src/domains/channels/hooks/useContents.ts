import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ContentsService } from '../../../api/generated';
import type { LinkContentCreate } from '../../../api/generated/models/LinkContentCreate';
import type { ImageContentCreate } from '../../../api/generated/models/ImageContentCreate';
import { queryKeys } from '../../../lib/api/queryKeys';
import { refreshOpenAPIToken } from '../../../api/hooks/useApi';
import { getValidAccessToken } from '../../auth/utils/tokenManager';
import { useToastMutation } from '../../../lib/hooks/useToastMutation';

export const useCreateLinkContent = () => {
  const queryClient = useQueryClient();

  return useToastMutation(
    async (data: LinkContentCreate) => {
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
        channel_id: data.channel_id,
        url: data.url?.trim(),
        description: data.description?.trim() || null,
      };

      // 필수 필드 검증
      if (!requestData.channel_id) {
        throw new Error('Channel ID is required');
      }
      if (!requestData.url) {
        throw new Error('URL is required');
      }

      console.log('[useCreateLinkContent] Making API call with data:', requestData);
      console.log('[useCreateLinkContent] Token available:', !!updatedToken);

      try {
        const result = await ContentsService.createLinkContentContentsLinksPost(requestData);
        console.log('[useCreateLinkContent] API call successful:', result);
        return result;
      } catch (error) {
        console.error('[useCreateLinkContent] API call failed:', error);

        // 더 자세한 에러 정보 로깅
        if (error instanceof Error) {
          console.error('[useCreateLinkContent] Error message:', error.message);
          console.error('[useCreateLinkContent] Error stack:', error.stack);
        }

        // API 응답 에러인 경우 더 자세한 정보 제공
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as any;
          console.error('[useCreateLinkContent] API Error status:', apiError.response?.status);
          console.error('[useCreateLinkContent] API Error data:', apiError.response?.data);
        }

        throw error;
      }
    },
    {
      messages: {
        loading: 'Creating link content...',
        success: 'Link content created successfully',
        error: 'Failed to create link content',
      },
      onSuccess: (data, variables) => {
        console.log('[useCreateLinkContent] Success:', data);

        // 채널의 콘텐츠 목록 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.contents.list({ channelId: variables.channel_id }),
        });

        // 채널 상세 정보 무효화 (콘텐츠 수 등이 변경될 수 있음)
        queryClient.invalidateQueries({
          queryKey: queryKeys.channels.detail(variables.channel_id),
        });
      },
      onError: (error) => {
        console.error('[useCreateLinkContent] Error:', error);
      },
    },
  );
};

export const useCreateImageContent = () => {
  const queryClient = useQueryClient();

  return useToastMutation(
    async (data: ImageContentCreate) => {
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
        channel_id: data.channel_id,
        base64_img: data.base64_img,
        description: data.description?.trim() || null,
      };

      // 필수 필드 검증
      if (!requestData.channel_id) {
        throw new Error('Channel ID is required');
      }
      if (!requestData.base64_img) {
        throw new Error('Base64 image is required');
      }

      console.log('[useCreateImageContent] Making API call with data:', {
        channel_id: requestData.channel_id,
        base64_img_length: requestData.base64_img?.length || 0,
      });

      try {
        const result = await ContentsService.createImageContentContentsImagesPost(requestData);
        console.log('[useCreateImageContent] API call successful:', result);
        return result;
      } catch (error) {
        console.error('[useCreateImageContent] API call failed:', error);
        throw error;
      }
    },
    {
      messages: {
        loading: 'Creating image content...',
        success: 'Image content created successfully',
        error: 'Failed to create image content',
      },
      onSuccess: (data, variables) => {
        console.log('[useCreateImageContent] Success:', data);

        // 채널의 콘텐츠 목록 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.contents.list({ channelId: variables.channel_id }),
        });

        // 채널 상세 정보 무효화 (콘텐츠 수 등이 변경될 수 있음)
        queryClient.invalidateQueries({
          queryKey: queryKeys.channels.detail(variables.channel_id),
        });
      },
      onError: (error) => {
        console.error('[useCreateImageContent] Error:', error);
      },
    },
  );
};

export const useGetLinkContent = (contentId: string | null) => {
  return useQuery({
    queryKey: queryKeys.contents.detail(contentId || ''),
    queryFn: async () => {
      if (!contentId) {
        throw new Error('Content ID is required');
      }

      // 유효한 토큰이 있는지 확인
      const validToken = getValidAccessToken();
      if (!validToken) {
        throw new Error('No valid access token available');
      }

      // Update OpenAPI token before making the request
      refreshOpenAPIToken();

      console.log('[useGetLinkContent] Fetching content:', contentId);

      try {
        const result = await ContentsService.getLinkContentContentsLinksContentIdGet(contentId);
        console.log('[useGetLinkContent] API call successful:', result);
        return result;
      } catch (error) {
        console.error('[useGetLinkContent] API call failed:', error);
        throw error;
      }
    },
    enabled: !!contentId,
    refetchInterval: (data: any) => {
      // AI 생성이 완료되면 polling 중단
      if (data?.ai_gen_metadata) {
        console.log('[useGetLinkContent] AI generation completed, stopping polling');
        return false;
      }

      // 링크 프리뷰 메타데이터가 있으면 polling 중단 (AI 생성 없이도 완료 가능)
      if (data?.link_preview_metadata) {
        console.log('[useGetLinkContent] Link preview metadata available, stopping polling');
        return false;
      }

      // AI 생성 중이면 3초마다 polling (2초에서 3초로 증가)
      console.log('[useGetLinkContent] AI generation in progress, continuing polling');
      return 3000;
    },
    refetchIntervalInBackground: false,
    // 최대 폴링 시간 제한 (5분)
    retry: (failureCount, error) => {
      if (failureCount >= 100) {
        // 5분 / 3초 = 약 100회
        console.log('[useGetLinkContent] Max polling time reached, stopping');
        return false;
      }
      return true;
    },
  });
};
