import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthState, GoogleOAuthResponse } from '../domains/auth/types/auth';
import {
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  storeUserSession,
  clearSession,
  getUserData,
  isAuthenticated,
  getValidAccessToken,
} from '../domains/auth/utils/tokenManager';

interface AuthStore extends AuthState {
  // Actions
  loginWithGoogle: (response: GoogleOAuthResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Token management
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;

  // User management
  updateUser: (userData: Partial<AuthState['user']>) => void;
  getUserData: () => { doc_id: string | null; email: string | null; nickname: string | null };
  getValidAccessToken: () => string | null;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        // Actions
        loginWithGoogle: (response: GoogleOAuthResponse) => {
          try {
            // Backup 방식: 세션 데이터 저장
            if (response.access_token && response.user) {
              storeUserSession({
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                doc_id: response.user.doc_id || response.user.id || '',
                email: response.user.email,
                nickname: response.user.nickname || response.user.name || '',
              });

              set({
                user: response.user,
                isAuthenticated: true,
                error: null,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error('Failed to login with Google:', error);
            set({
              error: 'Google 로그인에 실패했습니다.',
              isLoading: false,
            });
          }
        },

        logout: () => {
          // Backup 방식: 세션만 정리
          clearSession();

          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        // Token management
        getAccessToken: () => getAccessToken(),
        getRefreshToken: () => getRefreshToken(),
        setTokens: (accessToken: string, refreshToken: string) => {
          setTokens(accessToken, refreshToken);
        },
        clearTokens: () => {
          clearTokens();
        },

        // User management
        updateUser: (userData: Partial<AuthState['user']>) => {
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, ...userData },
            });
          }
        },

        getUserData: () => getUserData(),
        getValidAccessToken: () => getValidAccessToken(),
      }),
      {
        name: 'auth-store',
        // Backup 방식: sessionStorage 기반이므로 persist는 최소한으로
        partialize: (state) => ({
          // 필요한 경우에만 일부 상태를 localStorage에 저장
          // 대부분은 sessionStorage에서 관리
        }),
      },
    ),
    {
      name: 'auth-store',
    },
  ),
);

// Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectError = (state: AuthStore) => state.error;
export const selectUserRole = (state: AuthStore) => state.user?.role;
export const selectUserName = (state: AuthStore) => state.user?.name || state.user?.nickname;
export const selectUserEmail = (state: AuthStore) => state.user?.email;
