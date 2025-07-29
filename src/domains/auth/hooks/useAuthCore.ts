import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';
import { queryKeys } from '../../../lib/api/queryKeys';
import { isAuthenticated, getValidAccessToken } from '../utils/tokenManager';
import { TIMING } from '../constants';
import { AuthError } from '../types/auth';
import { UsersService } from '../../../api/generated';
import { useDocId } from './useDocId';

/**
 * 핵심 인증 훅 - 기본적인 인증 상태와 사용자 정보만 관리
 */
export const useAuthCore = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();
  const docId = useDocId();

  // 사용자 프로필 조회 (typgen UsersService 사용)
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: async () => {
      // doc_id가 없으면 에러
      if (!docId) {
        throw new Error('No user ID available');
      }

      // typgen으로 생성된 UsersService 사용
      const profile = await UsersService.getProfileUsersUserIdProfileGet(docId);
      return profile;
    },
    enabled: isAuthenticated() && !!getValidAccessToken() && !!docId,
    staleTime: TIMING.USER_PROFILE_STALE_TIME,
    gcTime: TIMING.USER_PROFILE_GC_TIME,
    retry: (failureCount, error) => {
      // 프로필 조회 실패 시 재시도 정책
      if (error instanceof AuthError && error.status === 401) {
        return false; // 인증 실패는 재시도하지 않음
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    // 캐시 무효화 방지를 위한 추가 설정
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    // Store state
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,

    // Query state
    authStatus: null, // checkAuthStatus 제거됨
    userProfile,
    isAuthLoading: false, // checkAuthStatus 제거됨
    isProfileLoading,
    authError: null, // checkAuthStatus 제거됨
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
