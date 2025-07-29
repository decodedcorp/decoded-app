import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { TokenDecoder } from '../utils/tokenDecoder';
import { getAccessToken } from '../utils/tokenManager';
import { AuthChannelUtils } from '../utils/authChannel';

/**
 * 토큰 만료를 감지하고 자동으로 로그아웃을 처리하는 훅
 * JWT의 exp 필드를 기반으로 타이머를 설정하고, 만료 시점에 모든 탭에서 로그아웃됩니다.
 */
export const useTokenMonitor = () => {
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 인증되지 않은 상태면 타이머 정리
    if (!isAuthenticated) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // 토큰 가져오기
    const token = getAccessToken();
    if (!token) {
      console.warn('[TokenMonitor] No access token found');
      return;
    }

    try {
      // 토큰 만료 시간 계산
      const timeUntilExpire = TokenDecoder.getTimeUntilExpiry(token) * 1000; // 밀리초로 변환

      if (timeUntilExpire <= 0) {
        // 이미 만료된 경우 즉시 로그아웃
        console.log('[TokenMonitor] Token already expired, logging out...');
        logout();
        return;
      }

      // 기존 타이머 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 새로운 타이머 설정
      timeoutRef.current = setTimeout(() => {
        console.log('[TokenMonitor] Token expired, logging out...');
        // 멀티탭 동기화를 위한 토큰 만료 이벤트 발행
        AuthChannelUtils.sendTokenExpired();
        logout();
      }, timeUntilExpire);

      console.log(
        `[TokenMonitor] Token will expire in ${Math.floor(timeUntilExpire / 1000)} seconds`,
      );
    } catch (error) {
      console.error('[TokenMonitor] Failed to monitor token:', error);
      // 토큰 디코딩 실패 시 안전하게 로그아웃
      logout();
    }

    // cleanup: 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isAuthenticated, logout]);

  // 토큰 갱신 시 타이머 재설정을 위한 추가 effect
  useEffect(() => {
    if (isAuthenticated) {
      const token = getAccessToken();
      if (token) {
        const timeUntilExpire = TokenDecoder.getTimeUntilExpiry(token) * 1000;

        if (timeUntilExpire > 0) {
          // 기존 타이머 정리 후 새로 설정
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            console.log('[TokenMonitor] Token expired, logging out...');
            // 멀티탭 동기화를 위한 토큰 만료 이벤트 발행
            AuthChannelUtils.sendTokenExpired();
            logout();
          }, timeUntilExpire);
        }
      }
    }
  }, [isAuthenticated, logout]);
};
