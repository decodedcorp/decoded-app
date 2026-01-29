/**
 * Rankings API Functions
 * - Global rankings leaderboard
 * - Personal ranking details
 * - Category-specific rankings
 */

import { apiClient } from "./client";
import {
  RankingListResponse,
  RankingsListParams,
  MyRankingDetailResponse,
  CategoryRankingResponse,
  CategoryRankingsParams,
} from "./types";

// ============================================================
// GET /api/v1/rankings
// Get global rankings leaderboard
// ============================================================

function buildRankingsQueryString(params?: RankingsListParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.period) searchParams.set("period", params.period);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.per_page !== undefined)
    searchParams.set("per_page", String(params.per_page));

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export async function fetchRankings(
  params?: RankingsListParams
): Promise<RankingListResponse> {
  const queryString = buildRankingsQueryString(params);

  return apiClient<RankingListResponse>({
    path: `/api/v1/rankings${queryString}`,
    method: "GET",
    requiresAuth: false, // Public endpoint, but includes my_ranking if authenticated
  });
}

// ============================================================
// GET /api/v1/rankings/me
// Get current user's detailed ranking info (auth required)
// ============================================================

export async function fetchMyRanking(): Promise<MyRankingDetailResponse> {
  return apiClient<MyRankingDetailResponse>({
    path: "/api/v1/rankings/me",
    method: "GET",
    requiresAuth: true,
  });
}

// ============================================================
// GET /api/v1/rankings/{category}
// Get rankings for a specific category
// ============================================================

function buildCategoryRankingsQueryString(
  params?: CategoryRankingsParams
): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.per_page !== undefined)
    searchParams.set("per_page", String(params.per_page));

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export async function fetchCategoryRankings(
  categoryCode: string,
  params?: CategoryRankingsParams
): Promise<CategoryRankingResponse> {
  const queryString = buildCategoryRankingsQueryString(params);

  return apiClient<CategoryRankingResponse>({
    path: `/api/v1/rankings/${categoryCode}${queryString}`,
    method: "GET",
    requiresAuth: false,
  });
}
