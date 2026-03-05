/**
 * Rankings API
 * GET /api/v1/rankings - 전체 랭킹 (선택적 인증)
 * GET /api/v1/rankings/me - 내 랭킹 상세 (인증 필요)
 */

import { apiClient } from "./client";
import type { RankingListResponse, ApiMyRankingDetail } from "./types";

// ============================================================
// GET /api/v1/rankings - 전체 랭킹
// ============================================================

export interface RankingsParams {
  period?: "weekly" | "monthly" | "all_time";
  page?: number;
  per_page?: number;
}

export async function fetchRankings(
  params?: RankingsParams
): Promise<RankingListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.period) searchParams.set("period", params.period);
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.per_page != null)
    searchParams.set("per_page", String(params.per_page));

  const queryString = searchParams.toString();
  const path = queryString
    ? `/api/v1/rankings?${queryString}`
    : "/api/v1/rankings";

  return apiClient<RankingListResponse>({
    path,
    method: "GET",
    requiresAuth: false, // 공개, 내 랭킹은 응답에 포함될 수 있음
  });
}

// ============================================================
// GET /api/v1/rankings/me - 내 랭킹 상세 (인증 필요)
// ============================================================

export async function fetchMyRanking(): Promise<ApiMyRankingDetail> {
  return apiClient<ApiMyRankingDetail>({
    path: "/api/v1/rankings/me",
    method: "GET",
    requiresAuth: true,
  });
}
