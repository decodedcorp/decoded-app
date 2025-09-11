import { toast } from 'react-hot-toast';

import i18n from '../i18n/config';

export interface ToastMessages {
  loading: string;
  success: string;
  error: string | ((err: unknown) => string);
}

/**
 * Promise를 toast로 래핑하여 로딩/성공/실패 상태를 자동으로 표시
 */
export const toastWithMessages = async <T>(
  promise: Promise<T>,
  messages: ToastMessages,
  id?: string
): Promise<T> => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: (err) =>
      typeof messages.error === 'function' ? messages.error(err) : messages.error,
  }, { id });
};

/**
 * React Query mutation을 위한 toast 래퍼
 */
export const createToastMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  messages: ToastMessages,
  id?: string
) => {
  return async (variables: TVariables): Promise<TData> => {
    return toastWithMessages(mutationFn(variables), messages, id);
  };
};

/**
 * 에러 메시지 추출 유틸리티
 */
export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return i18n.t('errors:general.unknown');
};

/**
 * API 에러 메시지 추출 (API 응답 구조에 맞춤)
 */
export const extractApiErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'detail' in error) {
    return String(error.detail);
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return extractErrorMessage(error);
};

/**
 * 성공 토스트 표시
 */
export const showSuccessToast = (message: string, id?: string) => {
  return toast.success(message, { id });
};

/**
 * 에러 토스트 표시
 */
export const showErrorToast = (message: string, id?: string) => {
  return toast.error(message, { id });
};

/**
 * 로딩 토스트 표시
 */
export const showLoadingToast = (message: string, id?: string) => {
  return toast.loading(message, { id });
};

/**
 * 토스트 제거
 */
export const dismissToast = (id: string) => {
  toast.dismiss(id);
}; 