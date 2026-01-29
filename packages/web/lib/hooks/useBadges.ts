/**
 * Badges Hooks
 * React Query hooks for badge system data
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchBadges,
  fetchMyBadges,
  fetchBadgeById,
} from "@/lib/api/badges";
import {
  BadgeListResponse,
  MyBadgesResponse,
  BadgeResponse,
  BadgeRarity,
  BadgeType,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const badgesKeys = {
  all: ["badges"] as const,
  list: () => [...badgesKeys.all, "list"] as const,
  my: () => [...badgesKeys.all, "my"] as const,
  detail: (badgeId: string) => [...badgesKeys.all, "detail", badgeId] as const,
};

// ============================================================
// useBadges - All available badges
// ============================================================

export function useBadges(
  options?: Omit<UseQueryOptions<BadgeListResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: badgesKeys.list(),
    queryFn: fetchBadges,
    staleTime: 1000 * 60 * 10, // 10 minutes (badges change infrequently)
    ...options,
  });
}

// ============================================================
// useMyBadges - Current user's earned and available badges
// ============================================================

export function useMyBadges(
  options?: Omit<UseQueryOptions<MyBadgesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: badgesKeys.my(),
    queryFn: fetchMyBadges,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}

// ============================================================
// useBadge - Single badge details
// ============================================================

export function useBadge(
  badgeId: string,
  options?: Omit<UseQueryOptions<BadgeResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: badgesKeys.detail(badgeId),
    queryFn: () => fetchBadgeById(badgeId),
    enabled: !!badgeId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}

// ============================================================
// Helper: Transform badges to unified format for UI
// ============================================================

export interface UnifiedBadge {
  id: string;
  type: BadgeType;
  name: string;
  description?: string;
  rarity: BadgeRarity;
  icon_url?: string;
  earned_at?: string; // Present if earned
  progress?: {
    current: number;
    target: number;
    percentage: number;
  }; // Present if in-progress
  is_earned: boolean;
  is_available: boolean;
}

/**
 * Transform MyBadgesResponse to a unified list for easier rendering
 * Combines earned badges and available badges into a single array
 */
export function transformToUnifiedBadges(
  myBadgesResponse?: MyBadgesResponse
): UnifiedBadge[] {
  if (!myBadgesResponse) return [];

  const earnedBadges: UnifiedBadge[] = myBadgesResponse.data.map((item) => ({
    id: item.badge.id,
    type: item.badge.type,
    name: item.badge.name,
    description: item.badge.description,
    rarity: item.badge.rarity,
    icon_url: item.badge.icon_url,
    earned_at: item.earned_at,
    is_earned: true,
    is_available: false,
  }));

  const availableBadges: UnifiedBadge[] = myBadgesResponse.available_badges.map(
    (item) => ({
      id: item.badge.id,
      type: item.badge.type,
      name: item.badge.name,
      description: item.badge.description,
      rarity: item.badge.rarity,
      icon_url: item.badge.icon_url,
      progress: item.progress,
      is_earned: false,
      is_available: true,
    })
  );

  return [...earnedBadges, ...availableBadges];
}
