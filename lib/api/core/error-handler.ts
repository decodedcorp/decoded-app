import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';
import { ERROR_CODES, ERROR_MESSAGES, ErrorCode, type ErrorResponse } from './error-codes';

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

export const handleApiError = (error: any) => {
  const normalizedError = normalizeError(error);

  // 인증 에러 처리
  if (normalizedError.code === 'UNAUTHORIZED') {
    window.sessionStorage.removeItem('ACCESS_TOKEN');
  }

  // 즉시 상태 업데이트
  useStatusStore.setState({
    isOpen: true,
    type: getStatusType(normalizedError.code),
    messageKey: 'request',
    message: normalizedError.message
  });

  // 에러 로깅
  console.error('API Error:', normalizedError);

  // 에러 전파
  throw normalizedError;
};
