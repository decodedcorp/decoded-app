/**
 * Solutions API Functions
 * - List solutions on a spot
 * - Create solution on a spot
 * - Update solution
 * - Delete solution
 * - Extract metadata from product URL
 * - Convert URL to affiliate link
 */

import { apiClient } from "./client";
import type {
  Solution,
  SolutionListResponse,
  CreateSolutionDto,
  UpdateSolutionDto,
  ExtractMetadataRequest,
  ExtractMetadataResponse,
  ConvertAffiliateRequest,
  ConvertAffiliateResponse,
} from "./types";

// ============================================================
// List Solutions
// GET /api/v1/spots/{spot_id}/solutions
// ============================================================

/**
 * Fetch all solutions for a spot
 */
export async function fetchSolutions(spotId: string): Promise<Solution[]> {
  const response = await apiClient<SolutionListResponse>({
    path: `/api/v1/spots/${spotId}/solutions`,
    method: "GET",
    requiresAuth: false, // Public data
  });
  return response.data;
}

// ============================================================
// Create Solution
// POST /api/v1/spots/{spot_id}/solutions
// Requires authentication
// ============================================================

/**
 * Create a new solution on a spot
 */
export async function createSolution(
  spotId: string,
  data: CreateSolutionDto
): Promise<Solution> {
  return apiClient<Solution>({
    path: `/api/v1/spots/${spotId}/solutions`,
    method: "POST",
    body: data,
    requiresAuth: true,
  });
}

// ============================================================
// Update Solution
// PATCH /api/v1/solutions/{solution_id}
// Requires authentication
// ============================================================

/**
 * Update an existing solution
 */
export async function updateSolution(
  solutionId: string,
  data: UpdateSolutionDto
): Promise<Solution> {
  return apiClient<Solution>({
    path: `/api/v1/solutions/${solutionId}`,
    method: "PATCH",
    body: data,
    requiresAuth: true,
  });
}

// ============================================================
// Delete Solution
// DELETE /api/v1/solutions/{solution_id}
// Requires authentication
// ============================================================

/**
 * Delete a solution
 */
export async function deleteSolution(solutionId: string): Promise<void> {
  await apiClient<void>({
    path: `/api/v1/solutions/${solutionId}`,
    method: "DELETE",
    requiresAuth: true,
  });
}

// ============================================================
// Extract Metadata
// POST /api/v1/solutions/extract-metadata
// Requires authentication
// ============================================================

/**
 * Extract product metadata from a URL
 */
export async function extractMetadata(
  url: string
): Promise<ExtractMetadataResponse> {
  const request: ExtractMetadataRequest = { url };
  return apiClient<ExtractMetadataResponse>({
    path: "/api/v1/solutions/extract-metadata",
    method: "POST",
    body: request,
    requiresAuth: true,
  });
}

// ============================================================
// Convert to Affiliate Link
// POST /api/v1/solutions/convert-affiliate
// Requires authentication
// ============================================================

/**
 * Convert a product URL to an affiliate link
 */
export async function convertAffiliate(
  url: string
): Promise<ConvertAffiliateResponse> {
  const request: ConvertAffiliateRequest = { url };
  return apiClient<ConvertAffiliateResponse>({
    path: "/api/v1/solutions/convert-affiliate",
    method: "POST",
    body: request,
    requiresAuth: true,
  });
}
