import { useEffect } from 'react';

import { useAuthStore } from '../../../store/authStore';

/**
 * 멀티탭에서 로그아웃 동기화를 위한 훅
 * 다른 탭에서 로그아웃이 발생하면 현재 탭도 자동으로 로그아웃됩니다.
 */
export const useLogoutSync = () => {
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // logout-event가 발생했을 때만 처리
      if (e.key === 'logout-event') {
        console.log('[Auth] Logout event detected from another tab, logging out...');
        logout();
      }
    };

    // storage 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logout]);
};
