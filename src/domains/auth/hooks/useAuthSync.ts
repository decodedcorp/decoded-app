import { useLoginSync } from './useLoginSync';
import { useLogoutSync } from './useLogoutSync';

/**
 * 멀티탭 인증 동기화 통합 훅
 * 로그인과 로그아웃 상태를 다른 탭과 자동으로 동기화합니다.
 */
export const useAuthSync = () => {
  useLoginSync();
  useLogoutSync();
};
