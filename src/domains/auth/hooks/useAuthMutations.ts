import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, handleGoogleOAuthCallback, logoutUser } from '../api/authApi';
import { queryKeys } from '../../../lib/api/queryKeys';
import { LoginFormData, LoginResponse, GoogleOAuthResponse } from '../types/auth';
import { setTokens, clearTokens } from '../utils/tokenManager';
import { setApiToken } from '../../../api/config';

/**
 * Login mutation hook
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      // Store tokens
      setTokens(data.access_token, data.refresh_token);

      // Set API token for future requests
      setApiToken(data.access_token);

      // Update cache
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
    onError: (error: Error) => {
      console.error('Login failed:', error);
    },
  });
};

/**
 * Google OAuth mutation hook
 */
export const useGoogleOAuth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleGoogleOAuthCallback,
    onSuccess: (data: GoogleOAuthResponse) => {
      // Store tokens
      setTokens(data.access_token, data.refresh_token);

      // Set API token for future requests
      setApiToken(data.access_token);

      // Update cache
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
    onError: (error: Error) => {
      console.error('Google OAuth failed:', error);
    },
  });
};

/**
 * Logout mutation hook
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear tokens
      clearTokens();

      // Clear API token
      setApiToken(null);

      // Clear cache
      queryClient.clear();
    },
    onError: (error: Error) => {
      console.error('Logout failed:', error);
      // Proceed with local logout even if API call fails
      clearTokens();
      setApiToken(null);
      queryClient.clear();
    },
  });
};
