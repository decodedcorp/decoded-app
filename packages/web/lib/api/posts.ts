/**
 * Posts API 함수
 * - 이미지 업로드
 * - AI 분석
 * - Post 생성
 */

import { apiClient, getAuthToken } from "./client";
import {
  UploadResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  CreatePostRequest,
  CreatePostResponse,
  PostsListResponse,
  PostsListParams,
  UpdatePostDto,
  PostResponse,
  ApiError,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ============================================================
// Image Upload
// POST /api/v1/posts/upload
// 인증 필요
// ============================================================

export interface UploadImageOptions {
  file: File;
  onProgress?: (progress: number) => void;
}

export async function uploadImage({
  file,
  onProgress,
}: UploadImageOptions): Promise<UploadResponse> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const formData = new FormData();
  formData.append("file", file);

  // Progress 시뮬레이션 (XMLHttpRequest로 변경하면 실제 progress 가능)
  onProgress?.(10);

  const response = await fetch(`${API_BASE_URL}/api/v1/posts/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  onProgress?.(70);

  if (!response.ok) {
    let errorData: ApiError;

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }

    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  onProgress?.(100);

  return response.json();
}

// ============================================================
// AI Image Analysis
// POST /api/v1/posts/analyze
// 인증 불필요
// ============================================================

export async function analyzeImage(imageUrl: string): Promise<AnalyzeResponse> {
  const request: AnalyzeRequest = { image_url: imageUrl };

  return apiClient<AnalyzeResponse>({
    path: "/api/v1/posts/analyze",
    method: "POST",
    body: request,
    requiresAuth: false,
  });
}

// ============================================================
// Create Post
// POST /api/v1/posts
// 인증 필요
// ============================================================

export async function createPost(
  request: CreatePostRequest
): Promise<CreatePostResponse> {
  return apiClient<CreatePostResponse>({
    path: "/api/v1/posts",
    method: "POST",
    body: request,
    requiresAuth: true,
  });
}

// ============================================================
// Fetch Posts List
// GET /api/v1/posts
// 인증 불필요
// ============================================================

/**
 * Build query string from PostsListParams
 */
function buildPostsQueryString(params?: PostsListParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.artist_name) searchParams.set("artist_name", params.artist_name);
  if (params.group_name) searchParams.set("group_name", params.group_name);
  if (params.context) searchParams.set("context", params.context);
  if (params.category) searchParams.set("category", params.category);
  if (params.user_id) searchParams.set("user_id", params.user_id);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.per_page !== undefined)
    searchParams.set("per_page", String(params.per_page));

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Fetch posts list from API
 */
export async function fetchPosts(
  params?: PostsListParams
): Promise<PostsListResponse> {
  const queryString = buildPostsQueryString(params);

  return apiClient<PostsListResponse>({
    path: `/api/v1/posts${queryString}`,
    method: "GET",
    requiresAuth: false,
  });
}

/**
 * Fetch posts list from API (server-side)
 * For use in server components where Supabase auth is not available
 */
export async function fetchPostsServer(
  params?: PostsListParams
): Promise<PostsListResponse> {
  const queryString = buildPostsQueryString(params);

  const response = await fetch(`${API_BASE_URL}/api/v1/posts${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    // Return empty response on error for graceful degradation
    console.error(`Failed to fetch posts: ${response.status}`);
    return {
      data: [],
      pagination: {
        current_page: params?.page ?? 1,
        per_page: params?.per_page ?? 20,
        total_items: 0,
        total_pages: 0,
      },
    };
  }

  return response.json();
}

// ============================================================
// Update Post
// PATCH /api/v1/posts/{postId}
// 인증 필요
// ============================================================

/**
 * Update a post
 * PATCH /api/v1/posts/{postId}
 * Requires authentication
 */
export async function updatePost(
  postId: string,
  data: UpdatePostDto
): Promise<PostResponse> {
  return apiClient<PostResponse>({
    path: `/api/v1/posts/${postId}`,
    method: "PATCH",
    body: data,
    requiresAuth: true,
  });
}

// ============================================================
// Delete Post
// DELETE /api/v1/posts/{postId}
// 인증 필요
// ============================================================

/**
 * Delete a post
 * DELETE /api/v1/posts/{postId}
 * Requires authentication
 */
export async function deletePost(postId: string): Promise<void> {
  await apiClient<void>({
    path: `/api/v1/posts/${postId}`,
    method: "DELETE",
    requiresAuth: true,
  });
}
