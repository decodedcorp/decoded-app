import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, logoutUser } from '../api/authApi';
import { queryKeys } from '../../../lib/api/queryKeys';
import { LoginRequest, LoginResponse } from '../types/auth';
import { clearSession } from '../utils/tokenManager';
import { updateApiTokenFromStorage } from '../../../api/config';
import { ERROR_MESSAGES } from '../constants';

/**
 * 사용자 로그인 mutation 훅
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      console.log('[Auth] Login mutation successful');

      // 캐시 무효화 및 재조회
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.status });
    },
    onError: (error) => {
      console.error('[Auth] Login mutation failed:', error);
      // 로그인 실패 시 세션 정리
      clearSession();
    },
  });
};

/**
 * 사용자 로그아웃 mutation 훅
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      console.log('[Auth] Logout mutation successful');

      // 모든 쿼리 캐시 정리
      queryClient.clear();

      // 로컬 세션 정리
      clearSession();
      updateApiTokenFromStorage();
    },
    onError: (error) => {
      console.error('[Auth] Logout mutation failed:', error);
      // 로그아웃 API 실패해도 로컬 정리는 계속 진행
      queryClient.clear();
      clearSession();
      updateApiTokenFromStorage();
    },
  });
};

// Legacy function for backward compatibility
export const useGoogleOAuth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) =>
      loginUser({
        jwt_token: code,
        sui_address: '', // 임시 값
      }),
    onSuccess: (data: LoginResponse) => {
      console.log('[Auth] Google OAuth mutation successful');

      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.status });
    },
    onError: (error) => {
      console.error('[Auth] Google OAuth mutation failed:', error);
      clearSession();
    },
  });
};
