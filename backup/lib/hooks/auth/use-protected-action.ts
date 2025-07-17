import { useCallback } from 'react';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';

// 로그인 후 실행할 콜백 저장을 위한 전역 상태
let pendingAuthCallback: (() => void) | null = null;

// 콜백이 설정된 시간 추적
let callbackSetTime: number = 0;

// 로그인 후 콜백 설정 함수
export function setAuthCallback(callback: () => void) {
  console.log('[Auth] Setting auth callback');
  pendingAuthCallback = callback;
  callbackSetTime = Date.now();
}

// 로그인 후 콜백 실행 함수
export function executeAuthCallback() {
  console.log('[Auth] Executing auth callback');
  
  if (pendingAuthCallback) {
    // 콜백이 설정된 후 최소 100ms 기다리도록 함 (타이밍 이슈 방지)
    const timeSinceSet = Date.now() - callbackSetTime;
    const delay = Math.max(0, 100 - timeSinceSet);
    
    const callback = pendingAuthCallback;
    pendingAuthCallback = null;
    
    // 약간의 지연을 줘서 다른 상태 업데이트가 완료되도록 함
    setTimeout(() => {
      console.log('[Auth] Running callback with delay:', delay);
      callback();
    }, delay);
  } else {
    console.log('[Auth] No pending callback found');
  }
}

export function useProtectedAction() {
  const checkAuth = useCallback((callback?: () => void) => {
    const userId = sessionStorage.getItem('USER_DOC_ID');
    if (!userId) {
      // 콜백이 제공된 경우 저장
      if (callback) {
        console.log('[Auth] User not logged in, setting callback for later');
        pendingAuthCallback = callback;
        callbackSetTime = Date.now();
      }
      
      useStatusStore.setState({
        isOpen: true,
        type: 'warning',
        messageKey: 'login'
      });
      return false;
    }
    return userId;
  }, []);

  const withAuth = useCallback(<T>(action: (userId: string) => Promise<T>) => {
    return async () => {
      const userId = checkAuth();
      if (!userId) return;
      return action(userId);
    };
  }, [checkAuth]);

  return { checkAuth, withAuth };
}