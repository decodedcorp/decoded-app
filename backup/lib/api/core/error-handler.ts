import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';
import { ERROR_CODES, ERROR_MESSAGES, ErrorCode, type ErrorResponse } from './error-codes';
import { isUserFacingError, shouldShowErrorPage, getErrorRedirectPath } from '@/lib/utils/error/error-categories';
import { useRouter } from 'next/navigation';

function normalizeError(error: any): ErrorResponse {
  // 네트워크 에러
  if (error.message === 'Network Error') {
    return {
      code: 'NETWORK_ERROR',
      status: 0,
      message: ERROR_MESSAGES.NETWORK_ERROR,
      url: error.config?.url
    };
  }

  // HTTP 상태 코드에 따른 에러
  const status = error.status || error.response?.status;
  switch (status) {
    case 401:
      return {
        code: 'UNAUTHORIZED',
        status,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        url: error.config?.url
      };
    case 404:
      return {
        code: 'NOT_FOUND',
        status,
        message: ERROR_MESSAGES.NOT_FOUND,
        url: error.config?.url
      };
    case 500:
      return {
        code: 'SERVER_ERROR',
        status,
        message: ERROR_MESSAGES.SERVER_ERROR,
        url: error.config?.url
      };
    case 409:
      return {
        code: 'DUPLICATE_REQUEST',
        status,
        message: ERROR_MESSAGES.DUPLICATE_REQUEST,
        url: error.config?.url
      };
    default:
      return {
        code: 'UNKNOWN_ERROR',
        status: status || 500,
        message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        url: error.config?.url
      };
  }
}

function getStatusType(errorCode: ErrorCode) {
  switch (errorCode) {
    case 'UNAUTHORIZED':
      return 'warning';
    default:
      return 'error';
  }
}

export const handleApiError = (error: any, router?: any) => {
  const normalizedError = normalizeError(error);
  const status = normalizedError.status;

  // 시스템 에러는 에러 페이지로 리다이렉트
  if (shouldShowErrorPage(status) && router) {
    router.push(getErrorRedirectPath(status));
    return;
  }

  // 사용자 대상 에러는 모달로 표시
  if (isUserFacingError(status)) {
    useStatusStore.setState({
      isOpen: true,
      type: getStatusType(normalizedError.code),
      messageKey: 'request',
      message: normalizedError.message
    });
  }

  // 인증 에러 처리
  if (normalizedError.code === 'UNAUTHORIZED') {
    window.sessionStorage.removeItem('ACCESS_TOKEN');
  }

  // 에러 로깅
  console.error('API Error:', normalizedError);

  throw normalizedError;
};
