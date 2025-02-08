import { useCallback } from 'react';
import { useStatusStore } from './store';
import type { StatusMessageKey } from './types';

interface UseStatusMessageConfig {
  defaultSuccessKey?: StatusMessageKey;
  defaultErrorKey?: StatusMessageKey;
}

export function useStatusMessage(config: UseStatusMessageConfig = {}) {
  const { defaultSuccessKey = 'default', defaultErrorKey = 'request' } = config;
  const setStatus = useStatusStore((state) => state.setStatus);

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

  return {
    showSuccess,
    showError,
    showWarning,
  };
} 