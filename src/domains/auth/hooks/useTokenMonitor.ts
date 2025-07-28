import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';
import { getAccessToken, isTokenExpired } from '../utils/tokenManager';
import { TIMING } from '../constants';

/**
 * 토큰 만료 모니터링 훅
 * 별도 컴포넌트에서 사용하여 토큰 만료 시 자동 로그아웃 처리
 */
export const useTokenMonitor = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkTokenExpiration = () => {
      const token = getAccessToken();
      if (token && isTokenExpired(token)) {
        console.log('[Auth] Token expired, logging out');
        logout();
        queryClient.clear();
      }
    };

    if (typeof window !== 'undefined') {
      // 초기 체크
      checkTokenExpiration();

      // 주기적 체크
      intervalId = setInterval(checkTokenExpiration, TIMING.TOKEN_CHECK_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [logout, queryClient]);

  return null; // 이 훅은 부작용만 있음
};
