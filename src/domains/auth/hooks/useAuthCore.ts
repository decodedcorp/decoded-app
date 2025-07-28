import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';
import { queryKeys } from '../../../lib/api/queryKeys';
import { getUserProfile, checkAuthStatus } from '../api/authApi';
import { isAuthenticated, getValidAccessToken, shouldCheckToken } from '../utils/tokenManager';
import { TIMING } from '../constants';

/**
 * 핵심 인증 훅 - 기본적인 인증 상태와 사용자 정보만 관리
 */
export const useAuthCore = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

  // 인증 상태 확인
  const { data: authStatus, isLoading: isAuthLoading } = useQuery({
    queryKey: queryKeys.auth.status,
    queryFn: checkAuthStatus,
    enabled: shouldCheckToken(),
    staleTime: TIMING.AUTH_STATUS_STALE_TIME,
    retry: false,
  });

  // 사용자 프로필 조회
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: getUserProfile,
    enabled: isAuthenticated() && !!getValidAccessToken(),
    staleTime: TIMING.USER_PROFILE_STALE_TIME,
    retry: 1,
  });

  return {
    // Store state
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,

    // Query state
    authStatus,
    userProfile,
    isAuthLoading,
    isProfileLoading,
    profileError,

    // Actions
    login: authStore.login,
    logout: authStore.logout,
    setLoading: authStore.setLoading,
    setError: authStore.setError,
    clearError: authStore.clearError,
    updateUser: authStore.updateUser,
  };
};
