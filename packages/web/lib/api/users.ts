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

export async function getMe(): Promise<UserResponse> {
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

export async function getMyStats(): Promise<UserStatsResponse> {
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

export async function getUserById(userId: string): Promise<UserResponse> {
  return apiClient<UserResponse>({
    path: `/api/v1/users/${userId}`,
    method: "GET",
    requiresAuth: false,
  });
}
