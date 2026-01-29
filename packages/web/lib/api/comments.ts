/**
 * Comment API Functions
 * Client functions for post comments CRUD
 */

import { apiClient } from "./client";
import {
  CommentResponse,
  CreateCommentDto,
  UpdateCommentDto,
} from "./types";

/**
 * Fetch comments for a post
 * GET /api/v1/posts/{post_id}/comments
 */
export async function fetchComments(postId: string): Promise<CommentResponse[]> {
  return apiClient<CommentResponse[]>({
    path: `/api/v1/posts/${postId}/comments`,
    method: "GET",
    requiresAuth: false, // Comments are public
  });
}

/**
 * Create a comment on a post
 * POST /api/v1/posts/{post_id}/comments
 */
export async function createComment(
  postId: string,
  data: CreateCommentDto
): Promise<CommentResponse> {
  return apiClient<CommentResponse>({
    path: `/api/v1/posts/${postId}/comments`,
    method: "POST",
    body: data,
    requiresAuth: true,
  });
}

/**
 * Update a comment
 * PATCH /api/v1/comments/{comment_id}
 */
export async function updateComment(
  commentId: string,
  data: UpdateCommentDto
): Promise<CommentResponse> {
  return apiClient<CommentResponse>({
    path: `/api/v1/comments/${commentId}`,
    method: "PATCH",
    body: data,
    requiresAuth: true,
  });
}

/**
 * Delete a comment
 * DELETE /api/v1/comments/{comment_id}
 */
export async function deleteComment(commentId: string): Promise<void> {
  await apiClient<void>({
    path: `/api/v1/comments/${commentId}`,
    method: "DELETE",
    requiresAuth: true,
  });
}
