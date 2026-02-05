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
export {
  uploadImage,
  analyzeImage,
  extractMetadata,
  createPost,
  createPostWithFile,
  createPostWithSolution,
} from "./posts";
export type { UploadImageOptions, CreatePostWithFileRequest } from "./posts";

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
