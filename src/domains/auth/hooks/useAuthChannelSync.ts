import { useEffect } from 'react';
import { authChannel, AuthMessage } from '../utils/authChannel';
import { useAuthStore } from '../../../store/authStore';

/**
 * BroadcastChannel API를 사용한 인증 동기화 훅
 * 로그인, 로그아웃, 토큰 만료 이벤트를 감지하고 처리합니다.
 */
export const useAuthChannelSync = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<AuthMessage>) => {
      const { type, timestamp } = event.data;

      console.log(
        `[AuthChannel] Received ${type} event at ${new Date(timestamp || 0).toISOString()}`,
      );

      switch (type) {
        case 'login':
          // sessionStorage에서 user 정보 가져오기
          if (typeof window !== 'undefined') {
            const userFromSession = sessionStorage.getItem('user');
            if (userFromSession) {
              try {
                const user = JSON.parse(userFromSession);
                setUser(user);
                console.log('[AuthChannel] Login state synced from sessionStorage:', user);
              } catch (error) {
                console.error('[AuthChannel] Failed to parse user from sessionStorage:', error);
              }
            } else {
              console.warn('[AuthChannel] No user data found in sessionStorage for login sync');
            }
          }
          break;

        case 'logout':
        case 'token-expired':
          console.log(`[AuthChannel] Processing ${type} event, logging out...`);
          logout();
          break;

        default:
          console.warn(`[AuthChannel] Unknown event type: ${type}`);
      }
    };

    // BroadcastChannel 메시지 리스너 등록
    authChannel.addEventListener('message', handleMessage);

    return () => {
      authChannel.removeEventListener('message', handleMessage);
    };
  }, [setUser, logout]);
};
