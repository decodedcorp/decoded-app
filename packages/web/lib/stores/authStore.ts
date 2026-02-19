/**
 * Auth Store - Supabase OAuth 인증 상태 관리
 */

import { create } from "zustand";
import { type User as SupabaseUser } from "@supabase/supabase-js";
import { supabaseBrowserClient } from "@/lib/supabase/client";

export type OAuthProvider = "kakao" | "google" | "apple";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isGuest: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  loadingProvider: OAuthProvider | null;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  guestLogin: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (supabaseUser: SupabaseUser | null) => Promise<void>;
}

/**
 * Supabase User를 앱 User 형식으로 변환
 */
function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const metadata = supabaseUser.user_metadata || {};

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name:
      metadata.full_name ||
      metadata.name ||
      metadata.nickname ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    avatarUrl: metadata.avatar_url || metadata.picture,
    createdAt: supabaseUser.created_at,
  };
}

/**
 * Fetches is_admin flag for the given user ID from the users table.
 * Returns false on any error or missing record.
 */
async function fetchIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseBrowserClient
      .from("users")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) return false;
    return data?.is_admin === true;
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAdmin: false,
  isGuest: false,
  isLoading: false,
  isInitialized: false,
  loadingProvider: null,
  error: null,

  /**
   * 앱 시작 시 세션 확인
   */
  initialize: async () => {
    if (get().isInitialized) return;

    try {
      const {
        data: { session },
        error,
      } = await supabaseBrowserClient.auth.getSession();

      if (error) {
        console.error("Failed to get session:", error);
        set({ isInitialized: true, user: null, isAdmin: false });
        return;
      }

      if (session?.user) {
        const isAdmin = await fetchIsAdmin(session.user.id);
        set({
          user: mapSupabaseUser(session.user),
          isAdmin,
          isInitialized: true,
          isGuest: false,
        });
      } else {
        set({ isInitialized: true, user: null, isAdmin: false });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({ isInitialized: true, user: null, isAdmin: false });
    }
  },

  /**
   * OAuth 로그인
   */
  signInWithOAuth: async (provider: OAuthProvider) => {
    set({ isLoading: true, loadingProvider: provider, error: null });

    try {
      const { error } = await supabaseBrowserClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }

      // OAuth는 리다이렉트되므로 여기서 loading 상태는 유지됨
      // 실제 로그인 완료는 onAuthStateChange에서 처리
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "로그인에 실패했습니다.";
      set({
        error: message,
        isLoading: false,
        loadingProvider: null,
      });
    }
  },

  /**
   * 게스트 로그인
   */
  guestLogin: () => {
    set({ isGuest: true, user: null, isAdmin: false, error: null });
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabaseBrowserClient.auth.signOut();

      if (error) {
        throw error;
      }

      set({
        user: null,
        isAdmin: false,
        isGuest: false,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "로그아웃에 실패했습니다.";
      set({
        error: message,
        isLoading: false,
      });
    }
  },

  /**
   * 에러 초기화
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Supabase auth state change에서 호출
   * Now async to fetch is_admin status from users table.
   */
  setUser: async (supabaseUser: SupabaseUser | null) => {
    if (supabaseUser) {
      const isAdmin = await fetchIsAdmin(supabaseUser.id);
      set({
        user: mapSupabaseUser(supabaseUser),
        isAdmin,
        isGuest: false,
        isLoading: false,
        loadingProvider: null,
      });
    } else {
      set({
        user: null,
        isAdmin: false,
        isLoading: false,
        loadingProvider: null,
      });
    }
  },
}));

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectIsAdmin = (state: AuthState) => state.isAdmin;
export const selectIsAuthenticated = (state: AuthState) =>
  !!state.user || state.isGuest;
export const selectIsLoggedIn = (state: AuthState) => !!state.user;
export const selectIsGuest = (state: AuthState) => state.isGuest;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectIsInitialized = (state: AuthState) => state.isInitialized;
