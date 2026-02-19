/**
 * Badges API
 * GET /api/v1/badges - 전체 뱃지 목록 (공개)
 * GET /api/v1/badges/me - 내 뱃지 (인증 필요)
 */

import { apiClient } from "./client";
import type { MyBadgesResponse } from "./types";

// ============================================================
// GET /api/v1/badges/me - 내 뱃지 조회 (인증 필요)
// ============================================================

export async function fetchMyBadges(): Promise<MyBadgesResponse> {
  return apiClient<MyBadgesResponse>({
    path: "/api/v1/badges/me",
    method: "GET",
    requiresAuth: true,
  });
}
