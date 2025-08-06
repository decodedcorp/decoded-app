import { useAuthInit } from './useAuthInit';
import { useAuthChannelSync } from './useAuthChannelSync';
import { useTokenMonitor } from './useTokenMonitor';

/**
 * 인증 라이프사이클 통합 훅
 * 인증 초기화, 멀티탭 동기화, 토큰 만료 감지를 모두 처리합니다.
 */
export const useAuthLifecycle = () => {
  // 인증 상태 초기화
  useAuthInit();

  // 멀티탭 로그인/로그아웃 동기화 (BroadcastChannel 기반)
  useAuthChannelSync();

  // 토큰 만료 감지 및 자동 로그아웃
  useTokenMonitor();
};
