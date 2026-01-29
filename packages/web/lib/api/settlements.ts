/**
 * Settlements API Functions
 * Handles settlement history and withdrawal requests
 */

import { apiClient } from "./client";
import type { SettlementsResponse, WithdrawRequest, WithdrawResponse } from "./types";

/**
 * Fetch settlements history for current user
 * GET /api/v1/settlements
 * Requires authentication
 */
export async function fetchSettlements(): Promise<SettlementsResponse> {
  return apiClient<SettlementsResponse>({
    path: "/api/v1/settlements",
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Request a withdrawal
 * POST /api/v1/settlements/withdraw
 * Requires authentication
 *
 * Note: Backend currently returns "아직 지원하지 않습니다" (not yet supported)
 */
export async function requestWithdrawal(data: WithdrawRequest): Promise<WithdrawResponse> {
  return apiClient<WithdrawResponse>({
    path: "/api/v1/settlements/withdraw",
    method: "POST",
    body: data,
    requiresAuth: true,
  });
}
