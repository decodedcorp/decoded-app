/**
 * Request API 타입 정의
 */

// ============================================================
// Common Types
// ============================================================

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ============================================================
// Upload API
// POST /api/v1/posts/upload
// ============================================================

export interface UploadResponse {
  image_url: string;
}

// ============================================================
// Analyze API
// POST /api/v1/posts/analyze
// ============================================================

export interface AnalyzeRequest {
  image_url: string;
}

export interface DetectedItem {
  left: number; // 백분율 숫자 (예: 45.5)
  top: number; // 백분율 숫자 (예: 30.2)
  category: string; // 카테고리 코드 (예: "fashion")
  label: string; // 아이템 라벨 (예: "jacket")
  confidence: number; // 신뢰도 (0-1)
}

export interface AnalyzeMetadata {
  artist_name?: string;
  context?: string;
}

export interface AnalyzeResponse {
  detected_items: DetectedItem[];
  metadata: AnalyzeMetadata;
}

// ============================================================
// Categories API
// GET /api/v1/categories
// ============================================================

export interface LocalizedName {
  ko: string;
  en: string;
}

export interface Category {
  id: string; // UUID
  code: string; // 예: "fashion"
  name: LocalizedName;
  color_hex: string; // 예: "#FF5733"
}

export type CategoriesResponse = Category[];

// ============================================================
// Create Post API
// POST /api/v1/posts
// ============================================================

export type MediaSourceType =
  | "drama"
  | "movie"
  | "music_video"
  | "variety"
  | "other";

export interface MediaSource {
  type: MediaSourceType;
  title: string;
  platform?: string;
  year?: number;
}

export interface SpotRequest {
  position_left: string; // 백분율 문자열 (예: "45.5%")
  position_top: string; // 백분율 문자열 (예: "30.2%")
  category_id: string; // UUID
}

export type ContextType =
  | "airport"
  | "stage"
  | "drama"
  | "variety"
  | "daily"
  | "photoshoot"
  | "event"
  | "other";

export interface MediaMetadataItem {
  key: string; // e.g., "platform", "season", "episode"
  value: string; // e.g., "Netflix", "2", "3"
}

export interface CreatePostRequest {
  image_url: string;
  media_source: MediaSource;
  spots: SpotRequest[];
  artist_name?: string;
  group_name?: string;
  context?: ContextType;
  description?: string;
  media_metadata?: MediaMetadataItem[];
}

export interface CreatePostResponse {
  id: string; // 생성된 Post ID
  slug?: string; // 상세 페이지 접근용 slug
}

// ============================================================
// Create Post with Solution API
// POST /api/v1/posts/with-solution
// Solution을 아는 유저용
// ============================================================

/**
 * Solution 정보 (spot과 함께 제출)
 */
export interface SpotSolution {
  title: string;
  original_url: string;
  thumbnail_url?: string;
  price_amount?: number;
  price_currency?: string; // default: 'KRW'
  description?: string;
}

/**
 * Spot with solution request
 */
export interface SpotWithSolutionRequest {
  position_left: string; // 백분율 문자열 (예: "45.5%")
  position_top: string; // 백분율 문자열 (예: "30.2%")
  category_id: string; // UUID
  solution: SpotSolution;
}

/**
 * Create post with solutions request
 * Solution을 아는 유저가 spot과 함께 solution을 제출
 */
export interface CreatePostWithSolutionRequest {
  image_url: string;
  media_source: MediaSource;
  spots: SpotWithSolutionRequest[];
  artist_name?: string;
  group_name?: string;
  context?: ContextType;
  description?: string;
  media_metadata?: MediaMetadataItem[];
}

// ============================================================
// Posts List API
// GET /api/v1/posts
// ============================================================

export interface PostUser {
  id: string;
  username: string;
  avatar_url: string | null;
  rank: string | null;
}

export interface PostMediaSource {
  type: string;
  title: string;
  platform?: string;
  year?: number;
}

export interface Post {
  id: string;
  user: PostUser;
  image_url: string;
  media_source: PostMediaSource | null;
  artist_name: string | null;
  group_name: string | null;
  context: string | null;
  spot_count: number;
  view_count: number;
  comment_count: number;
  created_at: string;
}

export interface PostsListPagination {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface PostsListResponse {
  data: Post[];
  pagination: PostsListPagination;
}

export interface PostsListParams {
  artist_name?: string;
  group_name?: string;
  context?: string;
  category?: string;
  user_id?: string;
  sort?: "recent" | "popular" | "trending";
  page?: number;
  per_page?: number;
}

// ============================================================
// Coordinate Conversion Utilities
// ============================================================

/**
 * API 좌표 (백분율 숫자) → Store 좌표 (0-1 비율)
 */
export function apiToStoreCoord(value: number): number {
  return value / 100;
}

/**
 * Store 좌표 (0-1 비율) → API 좌표 (백분율 문자열)
 */
export function storeToApiCoord(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// ============================================================
// User API Types
// GET /api/v1/users/me, PATCH /api/v1/users/me, GET /api/v1/users/{user_id}
// ============================================================

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  rank: string | null;
  total_points: number;
  is_admin: boolean;
  avatar_url: string | null;
  bio: string | null;
  display_name: string | null;
}

export interface UpdateUserDto {
  avatar_url?: string;
  bio?: string;
  display_name?: string;
}

// ============================================================
// User Stats API Types
// GET /api/v1/users/me/stats
// ============================================================

export interface UserStatsResponse {
  total_posts: number;
  total_comments: number;
  total_likes_received: number;
  total_points: number;
  rank: string | null;
}

// ============================================================
// User Activity API Types
// GET /api/v1/users/me/activities
// ============================================================

export type UserActivityType = "post" | "spot" | "solution";

export interface UserActivityItem {
  id: string;
  type: UserActivityType;
  title: string;
  created_at: string;
  // Add other fields as needed based on actual API response
}

export interface PaginatedActivitiesResponse {
  data: UserActivityItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface ActivitiesListParams {
  type?: UserActivityType;
  page?: number;
  per_page?: number;
}

// ============================================================
// Extract Post Metadata API (for post creation)
// POST /api/v1/posts/extract-metadata
// ============================================================

export interface ExtractPostMetadataRequest {
  description: string;
}

export interface ExtractPostMetadataResponse {
  title?: string;
  media_metadata: MediaMetadataItem[];
}

// ============================================================
// Spot API Types
// GET /api/v1/posts/{post_id}/spots
// POST /api/v1/posts/{post_id}/spots
// PATCH /api/v1/spots/{spot_id}
// DELETE /api/v1/spots/{spot_id}
// ============================================================

export interface Spot {
  id: string;
  post_id: string;
  position_left: string;  // e.g., "45.5%"
  position_top: string;   // e.g., "30.2%"
  category_id: string;
  category?: Category;    // Populated on GET
  solution_count: number;
  created_at: string;
}

export interface SpotListResponse {
  data: Spot[];
}

export interface CreateSpotDto {
  position_left: string;
  position_top: string;
  category_id: string;
}

export interface UpdateSpotDto {
  position_left?: string;
  position_top?: string;
  category_id?: string;
}

// ============================================================
// Post Update/Delete API Types
// PATCH /api/v1/posts/{post_id}, DELETE /api/v1/posts/{post_id}
// ============================================================

export interface UpdatePostDto {
  artist_name?: string;
  group_name?: string;
  context?: ContextType;
  media_source?: MediaSource;
}

export interface PostResponse extends Post {
  // Full post response after update (same as Post type)
}

// ============================================================
// Solution API Types
// GET /api/v1/spots/{spot_id}/solutions
// POST /api/v1/spots/{spot_id}/solutions
// PATCH /api/v1/solutions/{solution_id}
// DELETE /api/v1/solutions/{solution_id}
// POST /api/v1/solutions/extract-metadata
// POST /api/v1/solutions/convert-affiliate
// ============================================================

export interface Solution {
  id: string;
  spot_id: string;
  user_id: string;
  user?: PostUser;           // Populated on GET
  product_url: string;
  affiliate_url: string | null;
  product_name: string | null;
  brand: string | null;
  price: number | null;
  currency: string | null;
  image_url: string | null;
  vote_count: number;
  is_adopted: boolean;
  created_at: string;
  updated_at: string;
}

export interface SolutionListResponse {
  data: Solution[];
}

export interface CreateSolutionDto {
  product_url: string;
  product_name?: string;
  brand?: string;
  price?: number;
  currency?: string;
  image_url?: string;
}

export interface UpdateSolutionDto {
  product_url?: string;
  product_name?: string;
  brand?: string;
  price?: number;
  currency?: string;
  image_url?: string;
}

// Solution metadata extraction
export interface ExtractMetadataRequest {
  url: string;
}

export interface ExtractMetadataResponse {
  product_name: string | null;
  brand: string | null;
  price: number | null;
  currency: string | null;
  image_url: string | null;
  description: string | null;
}

// Affiliate link conversion
export interface ConvertAffiliateRequest {
  url: string;
}

export interface ConvertAffiliateResponse {
  affiliate_url: string;
  original_url: string;
}
