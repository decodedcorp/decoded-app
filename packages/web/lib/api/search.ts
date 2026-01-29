/**
 * Search Suggestions API Functions
 * Handles popular and recent search terms
 *
 * Note: This is separate from packages/shared/api/search.ts which uses a different fetch pattern.
 * This module uses the shared apiClient for consistency with the rest of the app.
 */

import { apiClient } from "./client";
import type {
  PopularSearchResponse,
  RecentSearchResponse,
  RecentSearchParams,
} from "./types";

/**
 * Fetch popular search terms
 * GET /api/v1/search/popular
 * Does NOT require authentication
 */
export async function fetchPopularSearchTerms(): Promise<PopularSearchResponse> {
  return apiClient<PopularSearchResponse>({
    path: "/api/v1/search/popular",
    method: "GET",
    requiresAuth: false,
  });
}

/**
 * Fetch recent search terms for current user
 * GET /api/v1/search/recent
 * Requires authentication
 */
export async function fetchRecentSearchTerms(
  params?: RecentSearchParams
): Promise<RecentSearchResponse> {
  const queryParams = new URLSearchParams();
  if (params?.limit) {
    queryParams.set("limit", String(Math.min(params.limit, 20))); // max 20
  }
  const queryString = queryParams.toString();
  const path = queryString
    ? `/api/v1/search/recent?${queryString}`
    : "/api/v1/search/recent";

  return apiClient<RecentSearchResponse>({
    path,
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Delete a recent search entry
 * DELETE /api/v1/search/recent/{id}
 * Requires authentication
 */
export async function deleteRecentSearch(id: string): Promise<void> {
  await apiClient<void>({
    path: `/api/v1/search/recent/${id}`,
    method: "DELETE",
    requiresAuth: true,
  });
}
