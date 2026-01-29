/**
 * User API Functions
 * - Profile endpoints
 * - Stats and activities
 */

import { apiClient } from "./client";
import {
  UserResponse,
  UpdateUserDto,
  UserStatsResponse,
  PaginatedActivitiesResponse,
  ActivitiesListParams,
} from "./types";

// ============================================================
// GET /api/v1/users/me
// Get current user profile (auth required)
// ============================================================

export async function fetchMe(): Promise<UserResponse> {
  return apiClient<UserResponse>({
    path: "/api/v1/users/me",
    method: "GET",
    requiresAuth: true,
  });
}

// ============================================================
// PATCH /api/v1/users/me
// Update current user's profile (auth required)
// ============================================================

export async function updateMe(data: UpdateUserDto): Promise<UserResponse> {
  return apiClient<UserResponse>({
    path: "/api/v1/users/me",
    method: "PATCH",
    body: data,
    requiresAuth: true,
  });
}

// ============================================================
// GET /api/v1/users/me/stats
// Get current user's stats (auth required)
// ============================================================

export async function fetchUserStats(): Promise<UserStatsResponse> {
  return apiClient<UserStatsResponse>({
    path: "/api/v1/users/me/stats",
    method: "GET",
    requiresAuth: true,
  });
}

// ============================================================
// GET /api/v1/users/{user_id}
// Get public user profile
// ============================================================

export async function fetchUserById(userId: string): Promise<UserResponse> {
  return apiClient<UserResponse>({
    path: `/api/v1/users/${userId}`,
    method: "GET",
    requiresAuth: false,
  });
}

// ============================================================
// GET /api/v1/users/me/activities
// Fetch current user's activity history (auth required)
// ============================================================

function buildActivitiesQueryString(params?: ActivitiesListParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.type) searchParams.set("type", params.type);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.per_page !== undefined) searchParams.set("per_page", String(params.per_page));

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export async function fetchUserActivities(
  params?: ActivitiesListParams
): Promise<PaginatedActivitiesResponse> {
  const queryString = buildActivitiesQueryString(params);

  return apiClient<PaginatedActivitiesResponse>({
    path: `/api/v1/users/me/activities${queryString}`,
    method: "GET",
    requiresAuth: true,
  });
}
