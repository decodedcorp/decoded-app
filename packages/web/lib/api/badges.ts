/**
 * Badges API Functions
 * - Badge system endpoints
 * - Earned badges and progress tracking
 */

import { apiClient } from "./client";
import {
  BadgeListResponse,
  MyBadgesResponse,
  BadgeResponse,
} from "./types";

// ============================================================
// GET /api/v1/badges
// Get all available badges
// ============================================================

export async function fetchBadges(): Promise<BadgeListResponse> {
  return apiClient<BadgeListResponse>({
    path: "/api/v1/badges",
    method: "GET",
    requiresAuth: false,
  });
}

// ============================================================
// GET /api/v1/badges/me
// Get current user's earned badges and progress (auth required)
// ============================================================

export async function fetchMyBadges(): Promise<MyBadgesResponse> {
  return apiClient<MyBadgesResponse>({
    path: "/api/v1/badges/me",
    method: "GET",
    requiresAuth: true,
  });
}

// ============================================================
// GET /api/v1/badges/{badge_id}
// Get badge details by ID
// ============================================================

export async function fetchBadgeById(badgeId: string): Promise<BadgeResponse> {
  return apiClient<BadgeResponse>({
    path: `/api/v1/badges/${badgeId}`,
    method: "GET",
    requiresAuth: false,
  });
}
