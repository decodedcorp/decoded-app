import { useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { getAccessToken, getRefreshToken, isTokenExpired } from '../utils/tokenManager';
import { updateApiTokenFromStorage } from '../../../api/config';

/**
 * Hook to initialize and restore authentication state on app startup
 */
export const useAuthInit = () => {
  const { setLoading, setError, logout, setUser } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Only run on client-side
        if (typeof window === 'undefined') {
          return;
        }

        // Check stored tokens
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] Initializing auth with tokens:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            accessTokenExpired: accessToken ? isTokenExpired(accessToken) : 'N/A',
          });
        }

        // Case 1: No tokens at all - user is not logged in
        if (!accessToken && !refreshToken) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Auth] No tokens found, user not logged in');
          }
          setLoading(false);
          return;
        }

        // Case 2: Has access token but no refresh token (current backend behavior)
        if (accessToken && !refreshToken) {
          if (isTokenExpired(accessToken)) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Auth] Access token expired, logging out');
            }
            logout();
            return;
          }

          // Access token is valid, try to restore user session
          if (process.env.NODE_ENV === 'development') {
            console.log('[Auth] Access token valid, restoring session');
          }

          updateApiTokenFromStorage();

          // Try to get user from session storage
          const userFromSession = sessionStorage.getItem('user');
          if (userFromSession) {
            try {
              const user = JSON.parse(userFromSession);
              setUser(user);
              if (process.env.NODE_ENV === 'development') {
                console.log('[Auth] User restored from session storage');
              }
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error('[Auth] Failed to parse user from session:', error);
              }
              logout();
            }
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Auth] No user in session storage, will fetch from API');
            }
            // User will be fetched by useAuthCore hook
          }
        }

        // Case 3: Has both tokens (future implementation)
        if (accessToken && refreshToken) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Auth] Both tokens found, using refresh token flow');
          }
          // TODO: Implement refresh token flow when backend supports it
          updateApiTokenFromStorage();
        }

        setLoading(false);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Auth] Error during auth initialization:', error);
        }
        setError(error instanceof Error ? error.message : 'Authentication initialization failed');
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setLoading, setError, logout, setUser]);
};
