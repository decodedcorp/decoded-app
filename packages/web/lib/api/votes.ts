/**
 * Vote and Adopt API Functions
 * - Vote endpoints
 * - Adopt/unadopt endpoints
 */

import { apiClient } from "./client";
import {
  VoteStatsResponse,
  CreateVoteDto,
  VoteResponse,
  AdoptSolutionDto,
  AdoptResponse,
} from "./types";

// ============================================================
// GET /api/v1/solutions/{solution_id}/votes
// Get vote stats for a solution (public)
// ============================================================

export async function fetchVoteStats(
  solutionId: string
): Promise<VoteStatsResponse> {
  return apiClient<VoteStatsResponse>({
    path: `/api/v1/solutions/${solutionId}/votes`,
    method: "GET",
    requiresAuth: false,
  });
}

// ============================================================
// POST /api/v1/solutions/{solution_id}/votes
// Create a vote on a solution (auth required)
// ============================================================

export async function createVote(
  solutionId: string,
  data: CreateVoteDto
): Promise<VoteResponse> {
  return apiClient<VoteResponse>({
    path: `/api/v1/solutions/${solutionId}/votes`,
    method: "POST",
    body: data,
    requiresAuth: true,
  });
}

// ============================================================
// DELETE /api/v1/solutions/{solution_id}/votes
// Delete/retract a vote (auth required)
// ============================================================

export async function deleteVote(solutionId: string): Promise<void> {
  return apiClient<void>({
    path: `/api/v1/solutions/${solutionId}/votes`,
    method: "DELETE",
    requiresAuth: true,
  });
}

// ============================================================
// POST /api/v1/solutions/{solution_id}/adopt
// Adopt a solution (auth required, spot owner only)
// ============================================================

export async function adoptSolution(
  solutionId: string,
  data: AdoptSolutionDto
): Promise<AdoptResponse> {
  return apiClient<AdoptResponse>({
    path: `/api/v1/solutions/${solutionId}/adopt`,
    method: "POST",
    body: data,
    requiresAuth: true,
  });
}

// ============================================================
// DELETE /api/v1/solutions/{solution_id}/adopt
// Unadopt a solution (auth required, spot owner only)
// ============================================================

export async function unadoptSolution(
  solutionId: string
): Promise<AdoptResponse> {
  return apiClient<AdoptResponse>({
    path: `/api/v1/solutions/${solutionId}/adopt`,
    method: "DELETE",
    requiresAuth: true,
  });
}
