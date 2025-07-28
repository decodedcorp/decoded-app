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
import { getUserProfile } from '../api/authApi';
import { getAccessToken, isTokenExpired } from '../utils/tokenManager';
import { useLogin, useGoogleOAuth, useLogout } from './useAuthMutations';
import { updateApiTokenFromStorage } from '../../../api/config';

/**
 * Main hook providing authentication state and related actions
 * Integrates React Query with Zustand for comprehensive state management
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

  // Safely check for tokens (client-side only)
  const hasValidToken =
    typeof window !== 'undefined' && getAccessToken() && !isTokenExpired(getAccessToken()!);

  // Fetch user profile (only when token exists)
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: getUserProfile,
    enabled: !!hasValidToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // React Query mutations
  const loginMutation = useLogin();
  const googleOAuthMutation = useGoogleOAuth();
  const logoutMutation = useLogout();

  // Zustand state selectors
  const user = selectUser(authStore);
  const isAuthenticated = selectIsAuthenticated(authStore);
  const isLoading = selectIsLoading(authStore);
  const error = selectError(authStore);
  const userRole = selectUserRole(authStore);
  const userName = selectUserName(authStore);
  const userEmail = selectUserEmail(authStore);

  // Actions
  const login = authStore.login;
  const loginWithGoogle = authStore.loginWithGoogle;
  const logout = authStore.logout;
  const setLoading = authStore.setLoading;
  const setError = authStore.setError;
  const clearError = authStore.clearError;
  const updateUser = authStore.updateUser;

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    userName,
    userEmail,
    userProfile,
    isProfileLoading,

    // Actions
    login,
    loginWithGoogle,
    logout,
    setLoading,
    setError,
    clearError,
    updateUser,

    // Mutations
    loginMutation,
    googleOAuthMutation,
    logoutMutation,
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
