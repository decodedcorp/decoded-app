/**
 * Profile 상태 관리
 * 프로필 페이지의 Mock 데이터 및 모달 상태를 관리합니다.
 */

import { create } from "zustand";
import type { UserResponse, UserStatsResponse } from "@/lib/api/types";

// Types
export interface ProfileUser {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
}

export interface ProfileStats {
  totalContributions: number;
  totalAnswers: number;
  totalAccepted: number;
  totalEarnings: number;
}

export type BadgeIconType =
  | "trophy"
  | "heart"
  | "rabbit"
  | "sparkles"
  | "star"
  | "gem"
  | "rocket"
  | "crown"
  | "medal"
  | "award";

export interface Badge {
  id: string;
  name: string;
  icon: BadgeIconType;
  category: string;
  earnedAt: Date;
  description?: string;
}

export interface Ranking {
  scope: "global" | string;
  rank: number;
  change: number;
  period: "week" | "month" | "all";
}

// Mock Data (스펙 와이어프레임 기반)
export const MOCK_USER: ProfileUser = {
  id: "mock-profile-001",
  displayName: "Fashion Explorer",
  username: "@fashion_lover",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fashion",
  bio: "K-Pop Fashion Lover | IVE & NewJeans Fan | Sharing my favorite idol styles",
};

export const MOCK_STATS: ProfileStats = {
  totalContributions: 127,
  totalAnswers: 89,
  totalAccepted: 79,
  totalEarnings: 45000,
};

export const MOCK_BADGES: Badge[] = [
  {
    id: "badge-1",
    name: "IVE Expert",
    icon: "trophy",
    category: "fandom",
    earnedAt: new Date("2025-12-01"),
    description: "IVE 관련 답변 50개 이상 채택",
  },
  {
    id: "badge-2",
    name: "BTS Fan",
    icon: "heart",
    category: "fandom",
    earnedAt: new Date("2025-11-15"),
    description: "BTS 관련 활동 100회 달성",
  },
  {
    id: "badge-3",
    name: "NewJeans Expert",
    icon: "rabbit",
    category: "fandom",
    earnedAt: new Date("2025-10-20"),
    description: "NewJeans 관련 답변 30개 이상 채택",
  },
  {
    id: "badge-4",
    name: "Style Pioneer",
    icon: "sparkles",
    category: "achievement",
    earnedAt: new Date("2025-09-10"),
    description: "최초로 새로운 스타일 트렌드 발견",
  },
  {
    id: "badge-5",
    name: "Top Contributor",
    icon: "star",
    category: "achievement",
    earnedAt: new Date("2025-08-05"),
    description: "월간 기여도 상위 10%",
  },
  {
    id: "badge-6",
    name: "BLACKPINK Fan",
    icon: "gem",
    category: "fandom",
    earnedAt: new Date("2025-07-01"),
    description: "BLACKPINK 관련 활동 50회 달성",
  },
  {
    id: "badge-7",
    name: "Early Adopter",
    icon: "rocket",
    category: "special",
    earnedAt: new Date("2025-06-01"),
    description: "서비스 초기 가입자",
  },
];

export const MOCK_RANKINGS: Ranking[] = [
  { scope: "global", rank: 42, change: 0, period: "all" },
  { scope: "IVE", rank: 3, change: 2, period: "week" },
  { scope: "BLACKPINK", rank: 12, change: -1, period: "month" },
];

// Badge Modal Types
export type BadgeModalMode = "single" | "all" | null;

interface ProfileState {
  // Data
  user: ProfileUser;
  stats: ProfileStats;
  badges: Badge[];
  rankings: Ranking[];

  // Modal State
  badgeModalMode: BadgeModalMode;
  selectedBadge: Badge | null;

  // Actions
  openBadgeModal: (mode: "single" | "all", badge?: Badge) => void;
  closeBadgeModal: () => void;

  // New actions for API sync
  setUserFromApi: (apiUser: UserResponse) => void;
  setStatsFromApi: (apiStats: UserStatsResponse) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  // Mock data
  user: MOCK_USER,
  stats: MOCK_STATS,
  badges: MOCK_BADGES,
  rankings: MOCK_RANKINGS,

  // Modal state
  badgeModalMode: null,
  selectedBadge: null,

  // Actions
  openBadgeModal: (mode, badge) => {
    set({
      badgeModalMode: mode,
      selectedBadge: badge || null,
    });
  },

  closeBadgeModal: () => {
    set({
      badgeModalMode: null,
      selectedBadge: null,
    });
  },

  setUserFromApi: (apiUser) => {
    set({
      user: {
        id: apiUser.id,
        displayName: apiUser.display_name || apiUser.username,
        username: `@${apiUser.username}`,
        avatarUrl: apiUser.avatar_url || undefined,
        bio: apiUser.bio || undefined,
      },
    });
  },

  setStatsFromApi: (apiStats) => {
    set({
      stats: {
        totalContributions: apiStats.total_posts,
        totalAnswers: apiStats.total_comments,
        totalAccepted: apiStats.total_likes_received,
        totalEarnings: apiStats.total_points, // Map points to earnings display
      },
    });
  },
}));

// Selectors
export const selectUser = (state: ProfileState) => state.user;
export const selectStats = (state: ProfileState) => state.stats;
export const selectBadges = (state: ProfileState) => state.badges;
export const selectRankings = (state: ProfileState) => state.rankings;
export const selectBadgeModalMode = (state: ProfileState) =>
  state.badgeModalMode;
export const selectSelectedBadge = (state: ProfileState) => state.selectedBadge;

// Helper functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateAcceptRate(accepted: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((accepted / total) * 100);
}
