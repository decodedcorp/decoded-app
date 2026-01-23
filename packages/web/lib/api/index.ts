/**
 * API Functions
 * Re-export all API functions and types
 */

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
