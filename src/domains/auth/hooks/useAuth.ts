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
import { GoogleOAuthResponse } from '../types/auth';
import React from 'react';

// Constants
const AUTH_STATUS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const USER_PROFILE_STALE_TIME = 10 * 60 * 1000; // 10 minutes
const TOKEN_CHECK_INTERVAL = 60 * 1000; // 1 minute

// Types
interface LoginResponse {
  access_token?: string;
  refresh_token?: string;
  user?: {
    doc_id?: string;
    id?: string;
    email: string;
    name?: string;
    nickname?: string;
  };
}

/**
 * Hook for token expiration monitoring
 */
const useTokenExpirationMonitor = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

  React.useEffect(() => {
    const checkTokenExpiration = () => {
      const token = getAccessToken();
      if (token && isTokenExpired(token)) {
        console.log('[Auth] Token expired, logging out');
        authStore.logout();
        queryClient.clear();
      }
    };

    const interval = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [authStore, queryClient]);
};

/**
 * Hook for auth state synchronization
 */
const useAuthStateSync = (authStatus: any) => {
  const authStore = useAuthStore();

  const syncAuthState = React.useCallback(() => {
    const isAuth = isAuthenticated();
    const userData = getUserData();

    if (isAuth && userData.doc_id) {
      authStore.updateUser({
        id: userData.doc_id,
        email: userData.email || '',
        name: userData.nickname || '',
        nickname: userData.nickname || '',
      });
    } else {
      authStore.logout();
    }
  }, [authStore]);

  React.useEffect(() => {
    syncAuthState();
  }, [authStatus, syncAuthState]);

  return syncAuthState;
};

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
    enabled: shouldCheckToken(),
    staleTime: AUTH_STATUS_STALE_TIME,
    retry: false,
  });

  // 사용자 프로필 조회
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: getUserProfile,
    enabled: isAuthenticated() && !!getValidAccessToken(),
    staleTime: USER_PROFILE_STALE_TIME,
  });

  // Mutation hooks
  const googleOAuthMutation = useGoogleOAuth();
  const logoutMutation = useLogout();

  // Custom hooks
  const syncAuthState = useAuthStateSync(authStatus);
  useTokenExpirationMonitor();

  // 로그인 성공 시 처리
  const handleLoginSuccess = React.useCallback(
    (response: GoogleOAuthResponse) => {
      updateApiTokenFromStorage();
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      syncAuthState();
    },
    [queryClient, syncAuthState],
  );

  // 로그아웃 처리
  const handleLogout = React.useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      queryClient.clear();
      syncAuthState();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logoutMutation, queryClient, syncAuthState]);

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
    loginWithGoogle: (response: GoogleOAuthResponse) => {
      // 직접 세션 저장 및 상태 업데이트
      if (response.access_token && response.user) {
        const { updateUser } = authStore;
        updateUser({
          id: response.user.doc_id || response.user.id || '',
          email: response.user.email,
          name: response.user.nickname || response.user.name || '',
          nickname: response.user.nickname || response.user.name || '',
        });

        // API 토큰 업데이트
        updateApiTokenFromStorage();

        // 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.status });
      }
    },
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
