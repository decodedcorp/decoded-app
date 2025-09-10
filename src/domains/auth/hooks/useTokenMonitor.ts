import { useEffect, useRef, useCallback } from 'react';

import { useAuthStore } from '../../../store/authStore';
import { TokenDecoder } from '../utils/tokenDecoder';
import { getAccessToken, getValidAccessToken } from '../utils/tokenManager';
import { AuthChannelUtils } from '../utils/authChannel';

/**
 * 토큰 만료를 감지하고 자동으로 로그아웃을 처리하는 훅
 * JWT의 exp 필드를 기반으로 타이머를 설정하고, 만료 시점에 모든 탭에서 로그아웃됩니다.
 */
export const useTokenMonitor = () => {
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoggingOut = useAuthStore((s) => s.isLoggingOut);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTokenRef = useRef<string | null>(null);

  // 토큰 만료 타이머 설정 함수
  const setupTokenTimer = useCallback(() => {
    // 기존 타이머 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // 인증되지 않은 상태거나 로그아웃 중이면 타이머 설정하지 않음
    if (!isAuthenticated || isLoggingOut) {
      return;
    }

    // 유효한 토큰 가져오기 (만료 검증 포함)
    const token = getValidAccessToken();
    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[TokenMonitor] No valid access token found, skipping timer setup');
      }
      return;
    }

    // 토큰이 변경되지 않았다면 타이머 재설정하지 않음
    if (lastTokenRef.current === token) {
      return;
    }

    lastTokenRef.current = token;

    try {
      // JWT 형식이 아닌 토큰 (임시 토큰 등)은 만료 시간을 모니터링하지 않음
      const isJwtFormat = (token.match(/\./g) || []).length === 2;
      
      if (!isJwtFormat) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[TokenMonitor] Non-JWT token detected, skipping expiration monitoring:', {
            tokenPreview: token.substring(0, 20) + '...',
            isTempToken: token.startsWith('temp_token_'),
          });
        }
        return; // JWT가 아닌 토큰은 만료 모니터링하지 않음
      }

      // 토큰 만료 시간 계산
      const timeUntilExpire = TokenDecoder.getTimeUntilExpiry(token) * 1000; // 밀리초로 변환

      if (timeUntilExpire <= 0) {
        // 이미 만료된 경우 즉시 로그아웃
        if (process.env.NODE_ENV === 'development') {
          console.log('[TokenMonitor] Token already expired, logging out...');
        }
        AuthChannelUtils.sendTokenExpired();
        logout();
        return;
      }

      // 새로운 타이머 설정
      timeoutRef.current = setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[TokenMonitor] Token expired, logging out...');
        }
        // 멀티탭 동기화를 위한 토큰 만료 이벤트 발행
        AuthChannelUtils.sendTokenExpired();
        logout();
      }, timeUntilExpire);

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[TokenMonitor] Token will expire in ${Math.floor(timeUntilExpire / 1000)} seconds`,
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[TokenMonitor] Failed to monitor token:', error);
      }
      // 토큰 디코딩 실패 시 안전하게 로그아웃
      AuthChannelUtils.sendTokenExpired();
      logout();
    }
  }, [isAuthenticated, logout]);

  // 인증 상태 변경 시 타이머 설정
  useEffect(() => {
    setupTokenTimer();

    // cleanup: 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastTokenRef.current = null;
    };
  }, [setupTokenTimer]);

  // 주기적으로 토큰 상태 확인 (토큰 갱신 감지)
  useEffect(() => {
    if (!isAuthenticated || isLoggingOut) {
      return;
    }

    const checkTokenInterval = setInterval(() => {
      const currentToken = getValidAccessToken();

      // 토큰이 변경되었거나 없어진 경우 타이머 재설정
      if (currentToken !== lastTokenRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[TokenMonitor] Token changed, updating timer...');
        }
        setupTokenTimer();
      }
    }, 30000); // 30초마다 확인

    return () => {
      clearInterval(checkTokenInterval);
    };
  }, [isAuthenticated, setupTokenTimer]);
};
