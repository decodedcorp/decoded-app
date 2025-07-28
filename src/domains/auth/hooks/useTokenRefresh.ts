import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refreshToken } from '../api/authApi';
import { getAccessToken, getRefreshToken, setTokens, isTokenExpired } from '../utils/tokenManager';
import { useAuthStore } from '../../../store/authStore';

/**
 * Hook for automatic token refresh
 * Automatically refreshes tokens before they expire.
 */
export const useTokenRefresh = () => {
  const queryClient = useQueryClient();
  const refreshTimeoutRef = useRef<number | undefined>(undefined);
  const { logout } = useAuthStore();

  const refreshMutation = useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      // Store new tokens
      setTokens(data.access_token, data.refresh_token || getRefreshToken()!);

      // Schedule next refresh
      scheduleNextRefresh(data.access_token);
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
      // Logout on refresh failure
      logout();
    },
  });

  const scheduleNextRefresh = (accessToken: string) => {
    try {
      // Calculate token expiration time (for JWT tokens)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();

      // Refresh 5 minutes before expiration
      const refreshTime = expiresAt - now - 5 * 60 * 1000;

      if (refreshTime > 0) {
        // Clear existing timer
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }

        // Set new timer
        refreshTimeoutRef.current = window.setTimeout(() => {
          const currentRefreshToken = getRefreshToken();
          if (currentRefreshToken) {
            refreshMutation.mutate(currentRefreshToken);
          }
        }, refreshTime);
      }
    } catch (error) {
      console.error('Failed to schedule token refresh:', error);
    }
  };

  const startTokenRefresh = () => {
    const accessToken = getAccessToken();
    const currentRefreshToken = getRefreshToken();

    if (!accessToken || !currentRefreshToken) {
      return;
    }

    // Check if token is already expired
    if (isTokenExpired(accessToken)) {
      // Try immediate refresh
      refreshMutation.mutate(currentRefreshToken);
    } else {
      // Schedule next refresh
      scheduleNextRefresh(accessToken);
    }
  };

  const stopTokenRefresh = () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = undefined;
    }
  };

  useEffect(() => {
    // Start token refresh on component mount
    startTokenRefresh();

    // Clean up timer on component unmount
    return () => {
      stopTokenRefresh();
    };
  }, []);

  return {
    isRefreshing: refreshMutation.isPending,
    refreshToken: refreshMutation.mutate,
    startTokenRefresh,
    stopTokenRefresh,
  };
};
