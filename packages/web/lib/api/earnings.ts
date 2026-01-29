/**
 * Earnings API Functions
 * Handles earnings data retrieval
 */

import { apiClient } from "./client";
import type { EarningsResponse } from "./types";

/**
 * Fetch earnings summary for current user
 * GET /api/v1/earnings
 * Requires authentication
 */
export async function fetchEarnings(): Promise<EarningsResponse> {
  return apiClient<EarningsResponse>({
    path: "/api/v1/earnings",
    method: "GET",
    requiresAuth: true,
  });
}
