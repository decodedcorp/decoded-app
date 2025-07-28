import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useAuthStore,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectUserRole,
  selectUserName,
  selectUserEmail,
} from '../../../store/authStore';
import { queryKeys } from '../../../lib/api/queryKeys';
import { getUserProfile, checkAuthStatus } from '../api/authApi';
import {
  getAccessToken,
  isTokenExpired,
  getValidAccessToken,
  isAuthenticated,
  getUserData,
  shouldCheckToken,
  setLastTokenCheck,
} from '../utils/tokenManager';
import { useGoogleOAuth, useLogout } from './useAuthMutations';
import { updateApiTokenFromStorage } from '../../../api/config';
import React from 'react';

/**
 * Main hook providing authentication state and related actions
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

  // 인증 상태 확인 (backup 방식)
  const { data: authStatus } = useQuery({
    queryKey: queryKeys.auth.status,
    queryFn: checkAuthStatus,
    enabled: shouldCheckToken(), // 5분마다 한 번만 검증
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });

  // 사용자 프로필 조회
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: getUserProfile,
    enabled: isAuthenticated() && !!getValidAccessToken(),
    staleTime: 10 * 60 * 1000, // 10분
  });

  // Mutation hooks
  const googleOAuthMutation = useGoogleOAuth();
  const logoutMutation = useLogout();

  // 인증 상태 동기화
  const syncAuthState = () => {
    const isAuth = isAuthenticated();
    const userData = getUserData();

    if (isAuth && userData.doc_id) {
      // 사용자 데이터가 있으면 Zustand 상태 업데이트
      authStore.updateUser({
        id: userData.doc_id,
        email: userData.email || '',
        name: userData.nickname || '',
        nickname: userData.nickname || '',
      });
    } else {
      // 인증되지 않았으면 상태 초기화
      authStore.logout();
    }
  };

  // 컴포넌트 마운트 시 인증 상태 동기화
  React.useEffect(() => {
    syncAuthState();
  }, [authStatus]);

  // 토큰 만료 감지
  React.useEffect(() => {
    const checkTokenExpiration = () => {
      const token = getAccessToken();
      if (token && isTokenExpired(token)) {
        console.log('[Auth] Token expired, logging out');
        authStore.logout();
        queryClient.clear();
      }
    };

    // 주기적으로 토큰 만료 확인 (1분마다)
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    return () => clearInterval(interval);
  }, [authStore, queryClient]);

  // 로그인 성공 시 처리
  const handleLoginSuccess = React.useCallback(
    (response: any) => {
      // API 토큰 업데이트
      updateApiTokenFromStorage();

      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });

      // 인증 상태 동기화
      syncAuthState();
    },
    [queryClient],
  );

  // 로그아웃 처리
  const handleLogout = React.useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();

      // 캐시 클리어
      queryClient.clear();

      // 인증 상태 동기화
      syncAuthState();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logoutMutation, queryClient]);

  return {
    // State
    user: selectUser(authStore),
    isAuthenticated: selectIsAuthenticated(authStore),
    isLoading: selectIsLoading(authStore) || isProfileLoading,
    error: selectError(authStore),
    userRole: selectUserRole(authStore),
    userName: selectUserName(authStore),
    userEmail: selectUserEmail(authStore),

    // User data from sessionStorage
    userData: getUserData(),

    // Actions
    loginWithGoogle: (response: any) => googleOAuthMutation.mutate(response),
    logout: handleLogout,
    setLoading: authStore.setLoading,
    setError: authStore.setError,
    clearError: authStore.clearError,

    // Token management
    getAccessToken: authStore.getAccessToken,
    getRefreshToken: authStore.getRefreshToken,
    getValidAccessToken: authStore.getValidAccessToken,

    // User management
    updateUser: authStore.updateUser,
    getUserData: authStore.getUserData,

    // Mutation states
    isLoginLoading: googleOAuthMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,

    // Auth status
    authStatus,
  };
};

/**
 * Hook for cases where only user information is needed
 */
export const useUser = () => {
  return {
    user: useAuthStore(selectUser),
    isAuthenticated: useAuthStore(selectIsAuthenticated),
    role: useAuthStore(selectUserRole),
    name: useAuthStore(selectUserName),
    email: useAuthStore(selectUserEmail),
  };
};

/**
 * Hook for cases where only authentication status is needed
 */
export const useAuthStatus = () => {
  return {
    isAuthenticated: useAuthStore(selectIsAuthenticated),
    isLoading: useAuthStore(selectIsLoading),
    error: useAuthStore(selectError),
  };
};

/**
 * Hook for cases where only loading state is needed
 */
export const useAuthLoading = () => {
  return useAuthStore(selectIsLoading);
};

/**
 * Hook for cases where only error state is needed
 */
export const useAuthError = () => {
  return useAuthStore(selectError);
};

/**
 * Hook to check user role
 */
export const useUserRole = () => {
  return useAuthStore(selectUserRole);
};

/**
 * Hook to check if user has a specific role
 */
export const useHasRole = (requiredRole: string) => {
  const userRole = useAuthStore(selectUserRole);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return isAuthenticated && userRole === requiredRole;
};

/**
 * Hook to check if user is admin
 */
export const useIsAdmin = () => {
  return useHasRole('admin');
};

/**
 * Hook to check if user has user role
 */
export const useIsUser = () => {
  return useHasRole('user');
};
