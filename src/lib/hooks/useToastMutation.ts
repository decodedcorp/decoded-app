import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import {
  toastWithMessages,
  createToastMutation,
  ToastMessages,
  extractApiErrorMessage,
} from '../utils/toastUtils';

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

  // toast를 비활성화한 경우 일반 useMutation 사용
  if (disableToast) {
    return useMutation({
      mutationFn,
      ...mutationOptions,
    });
  }

  // toast가 활성화된 경우 래핑된 함수 사용
  const wrappedMutationFn = createToastMutation(mutationFn, messages, toastId);

  return useMutation({
    mutationFn: wrappedMutationFn,
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

  const defaultMessages: ToastMessages = {
    loading: `${actionName} loading...`,
    success: `${actionName} completed.`,
    error: (err: unknown) => `${actionName} failed: ${extractApiErrorMessage(err)}`,
  };

  return useToastMutation(mutationFn, {
    messages: defaultMessages,
    ...restOptions,
  });
}
