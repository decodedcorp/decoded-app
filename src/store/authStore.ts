import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import i18n from '../lib/i18n/config';

import { AuthState, User, LoginResponse } from '../domains/auth/types/auth';
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getUserData,
  getValidAccessToken,
  storeLoginResponse,
} from '../domains/auth/utils/tokenManager';
import { AuthChannelUtils } from '../domains/auth/utils/authChannel';

// AuthState를 확장하여 초기화 상태와 로그아웃 상태 추가
interface ExtendedAuthState extends AuthState {
  isInitialized: boolean; // 초기화 완료 여부
  isLoggingOut: boolean; // 로그아웃 진행 중 여부
}

interface AuthStore extends ExtendedAuthState {
  // Actions
  login: (response: LoginResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setUser: (user: User) => void; // user 상태 직접 설정
  setInitialized: (initialized: boolean) => void; // 초기화 상태 설정

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
        isInitialized: false, // 초기화 완료 여부
        isLoggingOut: false, // 로그아웃 진행 중 여부

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

              // 토큰과 사용자 정보를 sessionStorage에 저장
              storeLoginResponse(response);

              // sessionStorage에 user 정보 저장 (기존 호환성 유지)
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('user', JSON.stringify(user));
              }

              // 멀티탭 동기화를 위한 login 이벤트 발행 (user 정보 포함)
              if (typeof window !== 'undefined') {
                AuthChannelUtils.sendLogin(user);
              }

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
              error: i18n.t('auth:login.failed'),
              isLoading: false,
            });
          }
        },

        logout: () => {
          // 로그아웃 상태 설정
          set({ isLoggingOut: true });

          // 로그아웃 플래그 설정
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('isLoggingOut', 'true');
          }

          // 강화된 토큰 및 세션 완전 정리
          clearSession();

          // 추가적인 sessionStorage 정리 (확실한 제거 보장)
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('user');
            // 현재 키들
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('user_doc_id');
            sessionStorage.removeItem('user_email');
            sessionStorage.removeItem('user_nickname');
            // Legacy 대문자 키들도 정리
            sessionStorage.removeItem('ACCESS_TOKEN');
            sessionStorage.removeItem('USER_DOC_ID');
            sessionStorage.removeItem('USER_EMAIL');
            sessionStorage.removeItem('USER_NICKNAME');
            
            if (process.env.NODE_ENV === 'development') {
              console.log('[AuthStore] 로그아웃 시 모든 인증 데이터 강제 제거 완료 (legacy 키 포함)');
            }
          }

          // 멀티탭 동기화를 위한 logout 이벤트 발행
          if (typeof window !== 'undefined') {
            AuthChannelUtils.sendLogout();
          }

          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
            isInitialized: false, // 로그아웃 시 초기화 상태도 리셋
            isLoggingOut: false, // 로그아웃 완료
          });

          // 로그아웃 플래그 제거 (약간의 지연 후)
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('isLoggingOut');
            }
          }, 1000);
        },

        setUser: (user: User) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Auth] Setting user:', user);
          }
          // sessionStorage에 user 정보 저장
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('user', JSON.stringify(user));
          }

          set({ user, isAuthenticated: true });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Auth] Setting error:', error);
          }
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        setInitialized: (initialized: boolean) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Auth] Setting initialized:', initialized);
          }
          set({ isInitialized: initialized });
        },

        // Token management
        getAccessToken: () => getAccessToken(),
        getRefreshToken: () => getRefreshToken(),
        getValidAccessToken: () => getValidAccessToken(),

        // User management
        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };

            // sessionStorage 업데이트
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('user', JSON.stringify(updatedUser));
            }

            set({ user: updatedUser, isAuthenticated: true });
          }
        },

        getUserData: () => getUserData(),
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => localStorage), // localStorage 사용
        partialize: (state) => ({
          // localStorage에는 isAuthenticated만 저장
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // 새로고침 시 sessionStorage에서 user 복원
          if (typeof window !== 'undefined' && state) {
            const userFromSession = sessionStorage.getItem('user');
            if (userFromSession) {
              try {
                const user = JSON.parse(userFromSession);
                // 사용자 정보와 인증 상태를 함께 설정
                state.setUser(user);
                state.isAuthenticated = true;
                console.log('[Auth] User restored from sessionStorage:', user);
              } catch (error) {
                console.error('[Auth] Failed to parse user from sessionStorage:', error);
                // 파싱 실패 시 로그아웃
                state.logout();
              }
            } else {
              // localStorage에서 isAuthenticated가 true로 복원되었지만 sessionStorage에 user가 없는 경우
              // 실제로는 로그아웃 상태로 처리
              if (state.isAuthenticated) {
                console.log('[Auth] isAuthenticated true but no sessionStorage data, resetting to logout state');
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                state.isLoading = false;
              }
            }
          }
        },
      },
    ),
    {
      name: 'auth-store',
    },
  ),
);

// 안전한 개별 selector들만 유지
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectError = (state: AuthStore) => state.error;
export const selectUserRole = (state: AuthStore) => state.user?.role;
export const selectUserName = (state: AuthStore) => state.user?.nickname;
export const selectUserEmail = (state: AuthStore) => state.user?.email;
