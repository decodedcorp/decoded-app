import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, handleGoogleOAuthCallback, logoutUser } from '../api/authApi';
import { queryKeys } from '../../../lib/api/queryKeys';
import { LoginFormData, LoginResponse, GoogleOAuthResponse } from '../types/auth';
import { setTokens, clearTokens } from '../utils/tokenManager';
import { updateApiTokenFromStorage } from '../../../api/config';

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

      // Update API token configuration
      updateApiTokenFromStorage();

      // Update cache
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      queryClient.setQueryData(queryKeys.auth.profile, data.user);
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

      // Update API token configuration
      updateApiTokenFromStorage();

      // Update cache
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      queryClient.setQueryData(queryKeys.auth.profile, data.user);
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

      // Update API token configuration
      updateApiTokenFromStorage();

      // Clear cache
      queryClient.clear();
    },
  });
};
