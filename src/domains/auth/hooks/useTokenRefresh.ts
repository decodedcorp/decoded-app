import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refreshUserToken } from '../api/authApi';
import { getAccessToken, getRefreshToken, setTokens, isTokenExpired } from '../utils/tokenManager';
import { useAuthStore } from '../../../store/authStore';
import { queryKeys } from '../../../lib/api/queryKeys';

export const useTokenRefresh = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const refreshMutation = useMutation({
    mutationFn: refreshUserToken,
    onSuccess: (data) => {
      // Store new tokens (fallback to old refreshToken if undefined)
      setTokens(data.access_token, data.refresh_token || getRefreshToken()!);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
    onError: () => {
      // Logout on refresh failure
      logout();
    },
  });

  useEffect(() => {
    const scheduleRefresh = () => {
      const accessToken = getAccessToken();
      if (!accessToken || isTokenExpired(accessToken)) {
        return;
      }

      // Clear existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Calculate time until token expires (minus 5 minutes buffer)
      const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresAt = tokenData.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now - 5 * 60 * 1000; // 5 minutes buffer

      if (timeUntilExpiry > 0) {
        refreshTimeoutRef.current = setTimeout(() => {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            refreshMutation.mutate(refreshToken);
          }
        }, timeUntilExpiry);
      }
    };

    // Schedule initial refresh
    scheduleRefresh();

    // Set up interval to check and schedule refresh
    const interval = setInterval(scheduleRefresh, 60 * 1000); // Check every minute

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      clearInterval(interval);
    };
  }, [refreshMutation]);

  return refreshMutation;
};
