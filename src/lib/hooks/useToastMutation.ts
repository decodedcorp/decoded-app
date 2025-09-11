import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { createToastMutation, ToastMessages, extractApiErrorMessage } from '../utils/toastUtils';
import { useCommonTranslation } from '../i18n/centralizedHooks';

interface UseToastMutationOptions<TData, TError, TVariables, TContext>
  extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  messages: ToastMessages;
  toastId?: string;
  disableToast?: boolean;
}

/**
 * React Query mutation과 toast를 통합하는 커스텀 훅
 *
 * @param mutationFn - API 호출 함수
 * @param options - React Query 옵션과 toast 메시지
 * @returns useMutation 결과
 *
 * @example
 * ```tsx
 * const mutation = useToastMutation(
 *   (data) => api.createChannel(data),
 *   {
 *     messages: {
 *       loading: '채널을 생성하고 있습니다...',
 *       success: '채널이 성공적으로 생성되었습니다!',
 *       error: (err) => `채널 생성 실패: ${extractApiErrorMessage(err)}`,
 *     },
 *     toastId: 'create-channel',
 *   }
 * );
 * ```
 */
export function useToastMutation<TData, TError, TVariables, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseToastMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { messages, toastId, disableToast = false, ...mutationOptions } = options;

  // toast가 활성화된 경우 래핑된 함수 사용
  const wrappedMutationFn = createToastMutation(mutationFn, messages, toastId);

  // 조건부로 다른 mutation 함수 사용
  const finalMutationFn = disableToast ? mutationFn : wrappedMutationFn;

  return useMutation({
    mutationFn: finalMutationFn,
    ...mutationOptions,
  });
}

/**
 * 간단한 toast mutation 훅 (기본 메시지 사용)
 */
export function useSimpleToastMutation<TData, TError, TVariables, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: Omit<UseToastMutationOptions<TData, TError, TVariables, TContext>, 'messages'> & {
    actionName: string; // "생성", "수정", "삭제" 등
  },
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { actionName, ...restOptions } = options;
  const t = useCommonTranslation();

  // 액션 이름에 따라 적절한 로케일 키를 매핑
  const getActionKey = (actionName: string): string => {
    const actionMap: Record<string, string> = {
      'Create channel': 'createChannel',
      'Update channel': 'updateChannel',
      'Delete channel': 'deleteChannel',
      'Update thumbnail': 'updateThumbnail',
      'Create content': 'createContent',
      'Update content': 'updateContent',
      'Delete content': 'deleteContent',
      'Create link content': 'createLinkContent',
      'Create image content': 'createImageContent',
      'Create video content': 'createVideoContent',
      'Update link content': 'updateLinkContent',
      'Update image content': 'updateImageContent',
      'Update video content': 'updateVideoContent',
      'Delete link content': 'deleteLinkContent',
      'Delete image content': 'deleteImageContent',
      'Delete video content': 'deleteVideoContent',
    };
    return actionMap[actionName] || 'createContent';
  };

  const actionKey = getActionKey(actionName);

  const defaultMessages: ToastMessages = {
    loading: `${t.globalContentUpload.toast.actions[
      actionKey as keyof typeof t.globalContentUpload.toast.actions
    ]()} ${t.globalContentUpload.toast.states.loading()}`,
    success: `${t.globalContentUpload.toast.actions[
      actionKey as keyof typeof t.globalContentUpload.toast.actions
    ]()} ${t.globalContentUpload.toast.states.completed()}`,
    error: (err: unknown) =>
      `${t.globalContentUpload.toast.actions[
        actionKey as keyof typeof t.globalContentUpload.toast.actions
      ]()} ${t.globalContentUpload.toast.states.failed()}: ${extractApiErrorMessage(err)}`,
  };

  return useToastMutation(mutationFn, {
    messages: defaultMessages,
    ...restOptions,
  });
}
