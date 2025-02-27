import { useCallback } from 'react';
import { useStatusStore } from './store';
import type { StatusMessageKey, StatusType, StatusConfig } from './types';
import { isUserFacingError } from '@/lib/utils/error/error-categories';

interface UseStatusMessageConfig {
  defaultSuccessKey?: StatusMessageKey;
  defaultErrorKey?: StatusMessageKey;
  defaultWarningKey?: StatusMessageKey;
}

export function useStatusMessage(config: UseStatusMessageConfig = {}) {
  const { defaultSuccessKey = 'default', defaultErrorKey = 'request' } = config;
  const { setStatus, closeStatus } = useStatusStore();

  const showStatus = useCallback(async (
    type: StatusType,
    messageKey?: StatusMessageKey,
    isLoading?: boolean
  ) => {
    if (isLoading) {
      setStatus({ type, messageKey, isLoading: true });
      // 실제 작업 수행 후
      setStatus({ type, messageKey, isLoading: false });
    } else {
      setStatus({ type, messageKey });
    }
  }, [setStatus]);

  const showSuccess = useCallback((messageKey?: StatusMessageKey, customMessage?: string) => {
    setStatus({
      type: 'success',
      messageKey: messageKey || defaultSuccessKey,
      message: customMessage,
    });
  }, [setStatus, defaultSuccessKey]);

  const showError = useCallback((messageKey?: StatusMessageKey, customMessage?: string) => {
    setStatus({
      type: 'error',
      messageKey: messageKey || defaultErrorKey,
      message: customMessage,
    });
  }, [setStatus, defaultErrorKey]);

  const showWarning = useCallback((messageKey?: StatusMessageKey, customMessage?: string) => {
    setStatus({
      type: 'warning',
      messageKey: messageKey || 'default',
      message: customMessage,
    });
  }, [setStatus]);

  const showLoadingStatus = useCallback(async <T>(
    promise: Promise<T>,
    successConfig: StatusConfig
  ): Promise<T> => {
    setStatus({ type: 'loading', messageKey: 'default', isLoading: true });
    
    try {
      const result = await promise;
      setStatus({ ...successConfig, type: 'success', isLoading: false });
      return result;
    } catch (error: any) {
      // 사용자 대상 에러만 모달로 표시
      if (isUserFacingError(error.status)) {
        if (error.status === 409) {
          setStatus({ 
            type: 'warning',
            messageKey: 'duplicate',
            isLoading: false
          });
        } else {
          setStatus({ 
            type: 'error',
            messageKey: 'request',
            message: error.message,
            isLoading: false
          });
        }
      }
      
      throw error;
    }
  }, [setStatus]);

  return {
    showStatus,
    showSuccess,
    showError,
    showWarning,
    showLoadingStatus,
  };
} 