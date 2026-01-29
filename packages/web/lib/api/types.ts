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

// Metadata extraction
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

// ============================================================
// Comment API Types
// GET /api/v1/posts/{post_id}/comments
// POST /api/v1/posts/{post_id}/comments
// PATCH /api/v1/comments/{comment_id}
// DELETE /api/v1/comments/{comment_id}
// ============================================================

export interface CommentUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface CommentResponse {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  user: CommentUser;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  replies?: CommentResponse[];
}

export interface CreateCommentDto {
  content: string;
  parent_id?: string;
}

export interface UpdateCommentDto {
  content: string;
}

// ============================================================
// Vote API Types
// GET /api/v1/solutions/{solution_id}/votes - Get vote stats
// POST /api/v1/solutions/{solution_id}/votes - Create vote
// DELETE /api/v1/solutions/{solution_id}/votes - Delete vote
// ============================================================

export type VoteType = "accurate" | "different";

export interface VoteStatsResponse {
  solution_id: string;
  accurate_count: number;
  different_count: number;
  total_count: number;
  accuracy_rate: number; // 0.0 ~ 1.0
}

export interface CreateVoteDto {
  vote_type: VoteType;
}

export interface VoteResponse {
  id: string;
  solution_id: string;
  user_id: string;
  vote_type: VoteType;
  created_at: string;
}

// ============================================================
// Adopt API Types
// POST /api/v1/solutions/{solution_id}/adopt - Adopt solution
// DELETE /api/v1/solutions/{solution_id}/adopt - Unadopt solution
// ============================================================

export type MatchType = "perfect" | "close";

export interface AdoptSolutionDto {
  match_type: MatchType;
}

export interface UpdatedSpotInfo {
  spot_id: string;
  updated_fields: string[];
}

export interface AdoptResponse {
  solution_id: string;
  is_adopted: boolean;
  match_type: string;
  adopted_at: string;
  updated_spot: UpdatedSpotInfo | null;
}

// ============================================================
// Badges API Types
// GET /api/v1/badges, GET /api/v1/badges/me, GET /api/v1/badges/{badge_id}
// ============================================================

export type BadgeType =
  | 'specialist'
  | 'category'
  | 'achievement'
  | 'milestone'
  | 'explorer'
  | 'shopper';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeCriteria {
  type: string;
  threshold: number;
  category_code?: string;
  description?: string;
}

export interface BadgeResponse {
  id: string;
  type: BadgeType;
  name: string;
  criteria: BadgeCriteria;
  rarity: BadgeRarity;
  description?: string;
  icon_url?: string;
  created_at: string;
}

// GET /api/v1/badges response
export interface BadgeListResponse {
  data: BadgeResponse[];
}

// GET /api/v1/badges/me response - earned badges
export interface EarnedBadgeItem {
  id: string;
  badge: BadgeResponse;
  earned_at: string;
}

// GET /api/v1/badges/me response - available/in-progress badges
export interface BadgeProgress {
  current: number;
  target: number;
  percentage: number;
}

export interface AvailableBadgeItem {
  badge: BadgeResponse;
  progress: BadgeProgress;
}

export interface MyBadgesResponse {
  data: EarnedBadgeItem[];
  available_badges: AvailableBadgeItem[];
}

// ============================================================
// Rankings API Types
// GET /api/v1/rankings, GET /api/v1/rankings/me, GET /api/v1/rankings/{category}
// ============================================================

export type RankingPeriod = 'weekly' | 'monthly' | 'all_time';

export interface RankingUser {
  id: string;
  username: string;
  rank: string | null;
  avatar_url: string | null;
}

export interface RankingItem {
  rank: number;
  user: RankingUser;
  total_points: number;
  weekly_points: number;
  solution_count: number;
  adopted_count: number;
  verified_count: number;
}

export interface MyRanking {
  overall_rank: number;
  total_points: number;
  weekly_points: number;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

// GET /api/v1/rankings response
export interface RankingListResponse {
  data: RankingItem[];
  my_ranking?: MyRanking;  // Only present for authenticated users
  pagination: PaginationMeta;
}

export interface RankingsListParams {
  period?: RankingPeriod;
  page?: number;
  per_page?: number;
}

// GET /api/v1/rankings/me response
export interface SolutionStats {
  total: number;
  adopted: number;
  verified: number;
}

export interface CategoryRank {
  category_code: string;
  rank: number;
  points: number;
}

export interface MyRankingDetailResponse {
  overall_rank: number;
  total_points: number;
  weekly_points: number;
  monthly_points: number;
  solution_stats: SolutionStats;
  category_rankings: CategoryRank[];
}

// GET /api/v1/rankings/{category} response
export interface CategoryRankingItem {
  rank: number;
  user: RankingUser;
  points: number;
  solution_count: number;
}

export interface CategoryRankingResponse {
  category_code: string;
  data: CategoryRankingItem[];
  pagination: PaginationMeta;
}

export interface CategoryRankingsParams {
  page?: number;
  per_page?: number;
}
