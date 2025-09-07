import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/authStore';
import { loginUser, logoutUser, handleGoogleOAuthCallback } from '../api/authApi';
import { LoginRequest } from '../types/auth';
import { UsersService } from '../../../api/generated/services/UsersService';
import { queryKeys } from '../../../lib/api/queryKeys';

/**
 * Hook for authentication mutations
 */
export const useAuthMutations = () => {
  const { setUser, setError, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (request: LoginRequest) =>
      loginUser(request.jwt_token, request.sui_address || undefined, request.email),
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
      // Clear specific auth-related queries instead of all queries
      queryClient.removeQueries({ queryKey: queryKeys.auth.profile });
      queryClient.removeQueries({ queryKey: queryKeys.auth.user });
      queryClient.removeQueries({ queryKey: ['user'] });
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

      // Check if sui_address needs to be updated
      if (data.access_token && !data.access_token.has_sui_address) {
        // Get sui_address from the original request
        // We need to extract it from the Google OAuth flow
        // For now, we'll trigger a manual update
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] User needs sui_address update, triggering manual update');
        }
        // TODO: Extract sui_address from the OAuth flow and update
      }
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

/**
 * Hook for Sui address updates
 */
export const useSuiAddressUpdate = () => {
  const queryClient = useQueryClient();

  const updateSuiAddressMutation = useMutation({
    mutationFn: (suiAddress: string) =>
      UsersService.updateMyProfileUsersMeProfilePatch({ 
        aka: null, // Keep existing aka unchanged
        sui_address: suiAddress 
      }),
    onSuccess: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Sui address update mutation successful');
      }
      // Invalidate user-related queries to refetch with updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
    },
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth] Sui address update mutation failed:', error);
      }
      // Don't set global error for sui address update failure
      // This is a non-critical operation
    },
  });

  return {
    updateSuiAddressMutation,
  };
};
