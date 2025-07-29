import { useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';

/**
 * 멀티탭에서 로그인 동기화를 위한 훅
 * 다른 탭에서 로그인이 발생하면 현재 탭도 자동으로 로그인 상태로 동기화됩니다.
 */
export const useLoginSync = () => {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // login-event가 발생했을 때만 처리
      if (e.key === 'login-event') {
        console.log('[Auth] Login event detected from another tab, syncing login state...');

        // sessionStorage에서 user 정보 가져오기
        if (typeof window !== 'undefined') {
          const userFromSession = sessionStorage.getItem('user');
          if (userFromSession) {
            try {
              const user = JSON.parse(userFromSession);
              setUser(user);
              console.log('[Auth] Login state synced from sessionStorage:', user);
            } catch (error) {
              console.error('[Auth] Failed to parse user from sessionStorage:', error);
            }
          } else {
            console.warn('[Auth] No user data found in sessionStorage for login sync');
          }
        }
      }
    };

    // storage 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUser]);
};
