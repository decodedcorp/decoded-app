import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthState, User, LoginResponse } from '../domains/auth/types/auth';
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getUserData,
  isAuthenticated,
  getValidAccessToken,
} from '../domains/auth/utils/tokenManager';

interface AuthStore extends AuthState {
  // Actions
  login: (response: LoginResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Token management
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getValidAccessToken: () => string | null;

  // User management
  updateUser: (userData: Partial<User>) => void;
  getUserData: () => { doc_id: string | null; email: string | null; nickname: string | null };
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
        login: (response: LoginResponse) => {
          try {
            if (response.access_token?.access_token && response.user) {
              const user: User = {
                doc_id: response.user.doc_id,
                email: response.user.email,
                nickname: response.user.nickname,
                role: response.user.role,
                status: response.user.status,
              };

              set({
                user,
                isAuthenticated: true,
                error: null,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error('[Auth] Failed to login:', error);
            set({
              error: '로그인에 실패했습니다.',
              isLoading: false,
            });
          }
        },

        logout: () => {
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
        getValidAccessToken: () => getValidAccessToken(),

        // User management
        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, ...userData },
            });
          }
        },

        getUserData: () => getUserData(),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          // 필요한 경우에만 일부 상태를 localStorage에 저장
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
export const selectUserName = (state: AuthStore) => state.user?.nickname;
export const selectUserEmail = (state: AuthStore) => state.user?.email;
