/**
 * BroadcastChannel API를 사용한 인증 이벤트 통신 유틸리티
 * 탭 간 빠르고 안정적인 메시지 전달을 제공합니다.
 */

import { User } from '../types/auth';

const CHANNEL_NAME = 'auth-channel';

// BroadcastChannel 인스턴스 생성
export const authChannel = new BroadcastChannel(CHANNEL_NAME);

/**
 * 인증 관련 메시지 타입 정의
 */
export type AuthMessage = {
  type: 'login' | 'logout' | 'token-expired';
  payload?: {
    user?: User;
  };
  timestamp?: number;
};

/**
 * 인증 메시지 전송 유틸리티
 */
export const AuthChannelUtils = {
  /**
   * 로그인 이벤트 전송
   */
  sendLogin: (user?: User) => {
    const message: AuthMessage = {
      type: 'login',
      payload: user ? { user } : undefined,
      timestamp: Date.now(),
    };
    authChannel.postMessage(message);
    console.log('[AuthChannel] Login event sent', user ? 'with user data' : 'without user data');
  },

  /**
   * 로그아웃 이벤트 전송
   */
  sendLogout: () => {
    const message: AuthMessage = {
      type: 'logout',
      timestamp: Date.now(),
    };
    authChannel.postMessage(message);
    console.log('[AuthChannel] Logout event sent');
  },

  /**
   * 토큰 만료 이벤트 전송
   */
  sendTokenExpired: () => {
    const message: AuthMessage = {
      type: 'token-expired',
      timestamp: Date.now(),
    };
    authChannel.postMessage(message);
    console.log('[AuthChannel] Token expired event sent');
  },

  /**
   * 채널 연결 상태 확인
   */
  isSupported: () => {
    return typeof BroadcastChannel !== 'undefined';
  },

  /**
   * 채널 정리
   */
  close: () => {
    authChannel.close();
    console.log('[AuthChannel] Channel closed');
  },
};
