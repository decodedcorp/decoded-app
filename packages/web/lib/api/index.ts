/**
 * API Functions
 * Re-export all API functions and types
 */

// Client
export { apiClient, getAuthToken } from "./client";
export type { ApiClientOptions } from "./client";

// Types
export * from "./types";

// Post APIs
export { uploadImage, analyzeImage, createPost } from "./posts";
export type { UploadImageOptions } from "./posts";

// Category APIs
export {
  getCategories,
  findCategoryIdByCode,
  findCategoryById,
} from "./categories";

// User APIs
export {
  fetchMe,
  updateMe,
  fetchUserStats,
  fetchUserById,
  fetchUserActivities,
} from "./users";

// Spot APIs
export { fetchSpots, createSpot, updateSpot, deleteSpot } from "./spots";

// Solution APIs
export {
  fetchSolutions,
  createSolution,
  updateSolution,
  deleteSolution,
  extractMetadata,
  convertAffiliate,
} from "./solutions";

// Comment APIs
export * from "./comments";

// Vote and Adopt APIs
export {
  fetchVoteStats,
  createVote,
  deleteVote,
  adoptSolution,
  unadoptSolution,
} from "./votes";

// Badge APIs
export {
  fetchBadges,
  fetchMyBadges,
  fetchBadgeById,
} from "./badges";

// Ranking APIs
export {
  fetchRankings,
  fetchMyRanking,
  fetchCategoryRankings,
} from "./rankings";
