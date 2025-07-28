import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthState, LoginResponse, GoogleOAuthResponse } from '../domains/auth/types/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (response: LoginResponse) => void;
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
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Login actions
        login: (response: LoginResponse) => {
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Store tokens in localStorage
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
        },

        loginWithGoogle: (response: GoogleOAuthResponse) => {
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Store tokens in localStorage
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
        },

        logout: () => {
          set(initialState);

          // Clear tokens from localStorage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error, isLoading: false });
        },

        clearError: () => {
          set({ error: null });
        },

        // Token management
        getAccessToken: () => {
          return localStorage.getItem('access_token');
        },

        getRefreshToken: () => {
          return localStorage.getItem('refresh_token');
        },

        setTokens: (accessToken: string, refreshToken: string) => {
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
        },

        clearTokens: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
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
      }),
      {
        name: 'auth-storage',
        // Only persist user data, not tokens (tokens are stored separately)
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: 'auth-store',
    },
  ),
);

// Selectors for better performance
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectError = (state: AuthStore) => state.error;
export const selectUserRole = (state: AuthStore) => state.user?.role;
export const selectUserName = (state: AuthStore) => state.user?.name;
export const selectUserEmail = (state: AuthStore) => state.user?.email;
