import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InvitationsService, OpenAPI } from '@/api/generated';
import type { InvitationCreateRequest } from '@/api/generated/models/InvitationCreateRequest';
import { queryKeys } from '@/lib/api/queryKeys';
import { refreshOpenAPIToken } from '@/api/hooks/useApi';
import { useToastMutation, useSimpleToastMutation } from '@/lib/hooks/useToastMutation';
import { extractApiErrorMessage } from '@/lib/utils/toastUtils';

// 초대 목록 조회
export const useInvitations = (params?: {
  page?: number;
  limit?: number;
  includeExpired?: boolean;
}) => {
  return useQuery({
    queryKey: queryKeys.invitations.list(params || {}),
    queryFn: async () => {
      refreshOpenAPIToken();
      
      try {
        const result = await InvitationsService.listInvitationsInvitationsGet(
          params?.page || 1,
          params?.limit || 20,
          params?.includeExpired || false
        );
        return result;
      } catch (error) {
        console.error('[useInvitations] API call failed:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  });
};

// 초대 생성
export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useToastMutation(
    async (data: InvitationCreateRequest) => {
      refreshOpenAPIToken();
      
      // 필수 필드 검증
      if (!data.channel_id?.trim()) {
        throw new Error('Channel ID is required');
      }
      
      if (!data.invitee_user_id?.trim()) {
        throw new Error('Invitee user ID is required');
      }

      return InvitationsService.createInvitationInvitationsPost(data);
    },
    {
      messages: {
        loading: 'Sending invitation...',
        success: 'Invitation sent successfully!',
        error: (err: unknown) => `Failed to send invitation: ${extractApiErrorMessage(err)}`,
      },
      toastId: 'create-invitation',
      mutationKey: queryKeys.invitations.create(),
      onSuccess: () => {
        // 초대 목록 다시 불러오기
        queryClient.invalidateQueries({ queryKey: queryKeys.invitations.lists() });
        // 채널 정보도 갱신 (관리자 목록 업데이트를 위해)
        queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
      },
    }
  );
};

// 초대 수락
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useSimpleToastMutation(
    (invitationId: string) => {
      refreshOpenAPIToken();
      return InvitationsService.acceptInvitationInvitationsInvitationIdAcceptPost(invitationId);
    },
    {
      actionName: 'Accept invitation',
      toastId: 'accept-invitation',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.invitations.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.channels.lists() });
      },
    }
  );
};

// 초대 거절
export const useRejectInvitation = () => {
  const queryClient = useQueryClient();

  return useSimpleToastMutation(
    (invitationId: string) => {
      refreshOpenAPIToken();
      return InvitationsService.rejectInvitationInvitationsInvitationIdRejectPost(invitationId);
    },
    {
      actionName: 'Reject invitation',
      toastId: 'reject-invitation',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.invitations.lists() });
      },
    }
  );
};

// 초대 취소
export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useSimpleToastMutation(
    (invitationId: string) => {
      refreshOpenAPIToken();
      return InvitationsService.cancelInvitationInvitationsInvitationIdDelete(invitationId);
    },
    {
      actionName: 'Cancel invitation',
      toastId: 'cancel-invitation',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.invitations.lists() });
      },
    }
  );
};