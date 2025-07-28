import { useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { getAccessToken, getRefreshToken, isTokenExpired } from '../utils/tokenManager';

/**
 * Hook to initialize and restore authentication state on app startup
 */
export const useAuthInit = () => {
  const { setLoading, setError, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Check stored tokens
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (!accessToken || !refreshToken) {
          // Set to logout state if no tokens
          logout();
          return;
        }

        // Check if access token is expired
        if (isTokenExpired(accessToken)) {
          // Logout if token is expired
          logout();
          return;
        }

        // Set authentication state to true if tokens are valid
        // Actual user data will be fetched by useAuth hook using React Query
        useAuthStore.setState({
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setError('Failed to initialize authentication state.');
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setLoading, setError, logout]);

  return null;
};
