import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';
import { loginUser, logoutUser, handleGoogleOAuthCallback } from '../api/authApi';
import { LoginRequest } from '../types/auth';

/**
 * Hook for authentication mutations
 */
export const useAuthMutations = () => {
  const { setUser, setError, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (request: LoginRequest) =>
      loginUser(request.jwt_token, request.sui_address, request.email),
    onSuccess: (data) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Login mutation successful');
      }
      setUser(data.user);
      setError(null);
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth] Login mutation failed:', error);
      }
      setError(error instanceof Error ? error.message : 'Login failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Logout mutation successful');
      }
      setUser(null as any);
      setError(null);
      // Clear all queries
      queryClient.clear();
    },
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth] Logout mutation failed:', error);
      }
      setError(error instanceof Error ? error.message : 'Logout failed');
    },
  });

  const googleOAuthMutation = useMutation({
    mutationFn: handleGoogleOAuthCallback,
    onSuccess: (data) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Google OAuth mutation successful');
      }
      setUser(data.user);
      setError(null);
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth] Google OAuth mutation failed:', error);
      }
      setError(error instanceof Error ? error.message : 'Google OAuth failed');
    },
  });

  return {
    loginMutation,
    logoutMutation,
    googleOAuthMutation,
  };
};
