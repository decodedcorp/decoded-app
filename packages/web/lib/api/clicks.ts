/**
 * Click Tracking API Functions
 * Handles click recording and statistics retrieval
 */

import { apiClient } from "./client";
import type { ClickStatsResponse, CreateClickDto } from "./types";

/**
 * Fetch click statistics for current user
 * GET /api/v1/clicks/stats
 * Requires authentication
 */
export async function fetchClickStats(): Promise<ClickStatsResponse> {
  return apiClient<ClickStatsResponse>({
    path: "/api/v1/clicks/stats",
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Record a click event
 * POST /api/v1/clicks
 * Does NOT require authentication (tracking happens before login)
 */
export async function recordClick(data: CreateClickDto): Promise<void> {
  await apiClient<void>({
    path: "/api/v1/clicks",
    method: "POST",
    body: data,
    requiresAuth: false,
  });
}
