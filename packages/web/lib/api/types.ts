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

export interface CreatePostRequest {
  image_url: string;
  media_source: MediaSource;
  spots: SpotRequest[];
  artist_name?: string;
  group_name?: string;
  context?: ContextType;
}

export interface CreatePostResponse {
  id: string; // 생성된 Post ID
  slug?: string; // 상세 페이지 접근용 slug
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

export type UserActivityType = 'post' | 'spot' | 'solution';

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
// Popular Search API Types
// GET /api/v1/search/popular
// ============================================================

export interface PopularSearchTerm {
  keyword: string;
  count: number;
}

export interface PopularSearchResponse {
  data: PopularSearchTerm[];
}

// ============================================================
// Recent Search API Types
// GET /api/v1/search/recent
// DELETE /api/v1/search/recent/{id}
// ============================================================

export interface RecentSearchTerm {
  id: string;
  query: string;
  searched_at: string;
}

export interface RecentSearchResponse {
  data: RecentSearchTerm[];
}

export interface RecentSearchParams {
  limit?: number;  // max 20
}

// ============================================================
// Click Stats API Types
// GET /api/v1/clicks/stats
// ============================================================

export interface MonthlyClickStat {
  month: string;  // YYYY-MM format
  clicks: number;
  unique_clicks: number;
}

export interface ClickStatsResponse {
  total_clicks: number;
  unique_clicks: number;
  monthly_stats: MonthlyClickStat[];
}

// ============================================================
// Record Click API Types
// POST /api/v1/clicks
// ============================================================

export interface CreateClickDto {
  solution_id: string;
  referrer?: string;
}

// ============================================================
// Earnings API Types
// GET /api/v1/earnings
// ============================================================

export interface MonthlyEarning {
  month: string;  // YYYY-MM format
  earnings: number;
}

export interface EarningsResponse {
  total_earnings: number;
  available_balance: number;
  pending_settlement: number;
  monthly_earnings: MonthlyEarning[];
}

// ============================================================
// Settlements API Types
// GET /api/v1/settlements
// ============================================================

export type SettlementStatus = "pending" | "processing" | "completed" | "failed";

export interface Settlement {
  id: string;
  amount: number;
  currency: string;  // e.g., "KRW"
  status: SettlementStatus;
  created_at: string;
  completed_at?: string;
}

export interface SettlementsResponse {
  data: Settlement[];
}

// ============================================================
// Withdrawal Request API Types
// POST /api/v1/settlements/withdraw
// ============================================================

export interface WithdrawRequest {
  amount: number;
  bank_code: string;
  account_number: string;
  account_holder: string;
}

export interface WithdrawResponse {
  id?: string;
  message?: string;  // Backend returns error message for unsupported operation
}
