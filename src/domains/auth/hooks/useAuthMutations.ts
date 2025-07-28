import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleGoogleOAuthCallback, logoutUser } from '../api/authApi';
import { queryKeys } from '../../../lib/api/queryKeys';
import { GoogleOAuthResponse } from '../types/auth';
import { storeUserSession, clearSession, setLastTokenCheck } from '../utils/tokenManager';
import { updateApiTokenFromStorage } from '../../../api/config';

/**
 * Google OAuth mutation hook
 * Backup 방식: sessionStorage 기반 토큰 관리
 */
export const useGoogleOAuth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleGoogleOAuthCallback,
    onSuccess: (data: GoogleOAuthResponse) => {
      // Backup 방식: 세션 데이터 저장
      if (data.access_token && data.user) {
        storeUserSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          doc_id: data.user.doc_id || data.user.id || '',
          email: data.user.email,
          nickname: data.user.nickname || data.user.name || '',
        });

        // Update API token configuration
        updateApiTokenFromStorage();

        // Invalidate and refetch user profile
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.status });

        // Set last token check
        setLastTokenCheck();
      }
    },
    onError: (error) => {
      console.error('Google OAuth failed:', error);
      // Clear any partial session data on error
      clearSession();
    },
  });
};

/**
 * Logout mutation hook
 * Backup 방식: 세션만 정리
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();

      // Clear session storage
      clearSession();

      // Update API token configuration
      updateApiTokenFromStorage();
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local session
      clearSession();
      queryClient.clear();
    },
  });
};
