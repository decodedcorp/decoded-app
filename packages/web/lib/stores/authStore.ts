import { create } from "zustand";

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
  isGuest: boolean;
  isLoading: boolean;
  loadingProvider: OAuthProvider | null;
  error: string | null;

  // Actions
  mockLogin: (provider: OAuthProvider) => Promise<void>;
  guestLogin: () => void;
  logout: () => void;
  clearError: () => void;
}

const mockUser: User = {
  id: "mock-user-001",
  email: "user@example.com",
  name: "Mock User",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mock",
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isGuest: false,
  isLoading: false,
  loadingProvider: null,
  error: null,

  mockLogin: async (provider: OAuthProvider) => {
    set({ isLoading: true, loadingProvider: provider, error: null });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    set({
      user: mockUser,
      isGuest: false,
      isLoading: false,
      loadingProvider: null,
    });
  },

  guestLogin: () => {
    set({ isGuest: true, user: null, error: null });
  },

  logout: () => {
    set({ user: null, isGuest: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
