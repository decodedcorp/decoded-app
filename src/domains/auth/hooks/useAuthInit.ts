import { useEffect } from 'react';

import { useAuthStore } from '../../../store/authStore';
import { getAccessToken, getRefreshToken, isTokenExpired } from '../utils/tokenManager';
import { updateApiTokenFromStorage } from '../../../api/config';

/**
 * Hook to initialize and restore authentication state on app startup
 */
export const useAuthInit = () => {
  const { setLoading, setError, logout, setUser, isInitialized, setInitialized, isLoggingOut } =
    useAuthStore();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] useAuthInit useEffect triggered:', {
        isInitialized,
        isLoggingOut,
        windowDefined: typeof window !== 'undefined',
        sessionStorageLoggingOut: sessionStorage.getItem('isLoggingOut'),
      });
    }

    // Client-side only
    if (typeof window === 'undefined') {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Skipping initialization on server-side');
      }
      setLoading(false);
      setInitialized(true);
      return;
    }

    // 이미 초기화되었으면 다시 실행하지 않음
    if (isInitialized) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Already initialized, skipping');
      }
      return;
    }

    // 로그아웃 중이거나 로그아웃 직후에는 초기화하지 않음
    if (isLoggingOut || sessionStorage.getItem('isLoggingOut') === 'true') {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Skipping initialization during logout process');
      }
      return;
    }

    // sessionStorage 변경 모니터링 (디버깅용)
    if (process.env.NODE_ENV === 'development') {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'access_token' || e.key === 'user') {
          console.log('[Auth] SessionStorage changed:', {
            key: e.key,
            oldValue: e.oldValue ? e.oldValue.substring(0, 20) + '...' : null,
            newValue: e.newValue ? e.newValue.substring(0, 20) + '...' : null,
            url: e.url,
            storageArea: e.storageArea === sessionStorage ? 'sessionStorage' : 'localStorage',
          });
        }
      };

      window.addEventListener('storage', handleStorageChange);

      // cleanup
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }

    // 타임아웃 설정 (5초 후 강제로 초기화 완료)
    let timeoutId: NodeJS.Timeout | null = null;

    const initializeAuth = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] initializeAuth started');
        }

        setLoading(true);

        // 타임아웃 설정 (3초)
        timeoutId = setTimeout(() => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Auth] Initialization timeout, forcing completion');
          }
          setLoading(false);
          setInitialized(true);
        }, 3000);

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
          clearTimeout(timeoutId);
          setLoading(false);
          setInitialized(true);
          return;
        }

        // Case 2: Has access token
        if (accessToken) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Auth] Found access token, checking expiration...', {
              tokenLength: accessToken.length,
              tokenPreview: accessToken.substring(0, 20) + '...',
              isExpired: isTokenExpired(accessToken),
            });
          }

          if (isTokenExpired(accessToken)) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Auth] Access token expired, logging out');
            }
            clearTimeout(timeoutId);
            logout();
            setInitialized(true);
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
                console.log('[Auth] User restored from session storage:', {
                  userId: user.doc_id,
                  email: user.email,
                  nickname: user.nickname,
                });
              }
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error('[Auth] Failed to parse user from session:', error);
              }
              clearTimeout(timeoutId);
              logout();
              setInitialized(true);
              return;
            }
          }
        }

        // Case 3: No access token but has user data (inconsistent state - force logout)
        if (!accessToken && sessionStorage.getItem('user')) {
          if (process.env.NODE_ENV === 'development') {
            console.log(
              '[Auth] Inconsistent state detected: user data exists but no access token. Forcing logout.',
            );
          }
          clearTimeout(timeoutId);
          logout();
          setInitialized(true);
          return;
        }

        // Case 4: Has refresh token (future implementation)
        if (refreshToken) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Auth] Refresh token found, using refresh token flow');
          }
          updateApiTokenFromStorage();
        }

        // 타임아웃 취소하고 초기화 완료
        clearTimeout(timeoutId);
        setLoading(false);
        setInitialized(true);

        if (process.env.NODE_ENV !== 'production') {
          console.log('[Auth] Initialization completed successfully', {
            isInitialized: true,
            isLoading: false,
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasUser: !!sessionStorage.getItem('user'),
          });
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Auth] Error during auth initialization:', error);
        }
        setError(error instanceof Error ? error.message : 'Authentication initialization failed');
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        setLoading(false);
        setInitialized(true);
      }
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth] About to call initializeAuth');
    }
    initializeAuth();
  }, [setLoading, setError, logout, setUser, isInitialized, setInitialized, isLoggingOut]);
};
