import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContentsService } from '../../../api/generated';
import type { LinkContentCreate } from '../../../api/generated/models/LinkContentCreate';
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
      };

      // 필수 필드 검증
      if (!requestData.channel_id) {
        throw new Error('Channel ID is required');
      }
      if (!requestData.url) {
        throw new Error('URL is required');
      }

      console.log('[useCreateLinkContent] Making API call with data:', requestData);

      try {
        const result = await ContentsService.createLinkContentContentsLinksPost(requestData);
        console.log('[useCreateLinkContent] API call successful:', result);
        return result;
      } catch (error) {
        console.error('[useCreateLinkContent] API call failed:', error);
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
        return false;
      }
      // AI 생성 중이면 2초마다 polling
      return 2000;
    },
    refetchIntervalInBackground: false,
  });
};
