---
phase: B-engagement
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/web/lib/api/types.ts
  - packages/web/lib/api/comments.ts
  - packages/web/lib/api/index.ts
  - packages/web/lib/hooks/useComments.ts
  - packages/web/app/api/v1/posts/[postId]/comments/route.ts
  - packages/web/app/api/v1/comments/[commentId]/route.ts
autonomous: true

must_haves:
  truths:
    - "User can view comments on a post"
    - "User can write a new comment"
    - "User can edit their own comment"
    - "User can delete their own comment"
    - "User can reply to a comment (nested)"
  artifacts:
    - path: "packages/web/lib/api/types.ts"
      provides: "Comment TypeScript types matching OpenAPI spec"
      contains: "CommentResponse"
    - path: "packages/web/lib/api/comments.ts"
      provides: "Comment API client functions"
      exports: ["fetchComments", "createComment", "updateComment", "deleteComment"]
    - path: "packages/web/lib/hooks/useComments.ts"
      provides: "React Query hooks for comments"
      exports: ["useComments", "useCreateComment", "useUpdateComment", "useDeleteComment"]
    - path: "packages/web/app/api/v1/posts/[postId]/comments/route.ts"
      provides: "API proxy for comment list and create endpoints"
      exports: ["GET", "POST"]
    - path: "packages/web/app/api/v1/comments/[commentId]/route.ts"
      provides: "API proxy for comment update and delete endpoints"
      exports: ["PATCH", "DELETE"]
  key_links:
    - from: "packages/web/lib/api/comments.ts"
      to: "/api/v1/posts/{postId}/comments"
      via: "apiClient"
      pattern: "apiClient.*posts.*comments"
    - from: "packages/web/lib/hooks/useComments.ts"
      to: "packages/web/lib/api/comments.ts"
      via: "React Query mutation/query"
      pattern: "useMutation.*createComment|useQuery.*fetchComments"
---

<objective>
Implement comment CRUD API integration for posts

Purpose: Enable users to view, create, edit, and delete comments on posts, with support for nested replies.

Output:
- Comment types in types.ts
- API client functions in comments.ts
- React Query hooks in useComments.ts
- API proxy routes for comment endpoints
</objective>

<execution_context>
@/Users/kiyeol/.claude-work/get-shit-done/workflows/execute-plan.md
@/Users/kiyeol/.claude-work/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/06-api-foundation-profile/06-01-SUMMARY.md
@packages/web/lib/api/client.ts
@packages/web/lib/api/types.ts
@packages/web/lib/hooks/useProfile.ts
@packages/web/app/api/v1/users/me/route.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Comment types to types.ts</name>
  <files>packages/web/lib/api/types.ts</files>
  <action>
Add the following types at the end of types.ts, following the OpenAPI spec pattern:

```typescript
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
```
  </action>
  <verify>yarn tsc --noEmit passes without errors</verify>
  <done>Comment types (CommentResponse, CreateCommentDto, UpdateCommentDto, CommentUser) added to types.ts</done>
</task>

<task type="auto">
  <name>Task 2: Create comment API functions and proxy routes</name>
  <files>
    packages/web/lib/api/comments.ts
    packages/web/lib/api/index.ts
    packages/web/app/api/v1/posts/[postId]/comments/route.ts
    packages/web/app/api/v1/comments/[commentId]/route.ts
  </files>
  <action>
**Create packages/web/lib/api/comments.ts:**

```typescript
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
```

**Update packages/web/lib/api/index.ts** - Add comment exports:

```typescript
export * from "./comments";
```

**Create packages/web/app/api/v1/posts/[postId]/comments/route.ts:**

```typescript
/**
 * Comments Proxy API Route
 * GET /api/v1/posts/[postId]/comments - Fetch comments for a post
 * POST /api/v1/posts/[postId]/comments - Create comment (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

type RouteContext = {
  params: Promise<{ postId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { postId } = await context.params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/posts/${postId}/comments`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Comments GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { postId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Comments POST proxy error:", error);
    return NextResponse.json(
      { message: "Failed to create comment" },
      { status: 500 }
    );
  }
}
```

**Create packages/web/app/api/v1/comments/[commentId]/route.ts:**

```typescript
/**
 * Comment Proxy API Route
 * PATCH /api/v1/comments/[commentId] - Update comment (auth required)
 * DELETE /api/v1/comments/[commentId] - Delete comment (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

type RouteContext = {
  params: Promise<{ commentId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { commentId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/comments/${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Comment PATCH proxy error:", error);
    return NextResponse.json(
      { message: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { commentId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Comment DELETE proxy error:", error);
    return NextResponse.json(
      { message: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
```
  </action>
  <verify>
- yarn tsc --noEmit passes
- Files exist: comments.ts, posts/[postId]/comments/route.ts, comments/[commentId]/route.ts
- index.ts exports comment functions
  </verify>
  <done>
- comments.ts with fetchComments, createComment, updateComment, deleteComment
- Proxy routes for /posts/[postId]/comments and /comments/[commentId]
- index.ts updated with comment exports
  </done>
</task>

<task type="auto">
  <name>Task 3: Create React Query hooks for comments</name>
  <files>packages/web/lib/hooks/useComments.ts</files>
  <action>
Create packages/web/lib/hooks/useComments.ts following the useProfile.ts pattern:

```typescript
/**
 * Comment Hooks
 * React Query hooks for post comments CRUD
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/api/comments";
import {
  CommentResponse,
  CreateCommentDto,
  UpdateCommentDto,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const commentKeys = {
  all: ["comments"] as const,
  list: (postId: string) => [...commentKeys.all, "list", postId] as const,
  detail: (commentId: string) => [...commentKeys.all, "detail", commentId] as const,
};

// ============================================================
// useComments - Fetch comments for a post
// ============================================================

export function useComments(
  postId: string,
  options?: Omit<UseQueryOptions<CommentResponse[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

// ============================================================
// useCreateComment - Create a new comment
// ============================================================

interface CreateCommentVariables {
  postId: string;
  data: CreateCommentDto;
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: CreateCommentVariables) =>
      createComment(postId, data),
    onSuccess: (newComment, variables) => {
      // Optimistically add comment to cache
      queryClient.setQueryData<CommentResponse[]>(
        commentKeys.list(variables.postId),
        (old) => {
          if (!old) return [newComment];

          // If it's a reply, find parent and add to replies
          if (newComment.parent_id) {
            return old.map((comment) => {
              if (comment.id === newComment.parent_id) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newComment],
                };
              }
              return comment;
            });
          }

          // Top-level comment
          return [...old, newComment];
        }
      );

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.postId),
      });
    },
  });
}

// ============================================================
// useUpdateComment - Update an existing comment
// ============================================================

interface UpdateCommentVariables {
  commentId: string;
  postId: string; // Needed for cache invalidation
  data: UpdateCommentDto;
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: UpdateCommentVariables) =>
      updateComment(commentId, data),
    onMutate: async ({ commentId, postId, data }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });

      const previousComments = queryClient.getQueryData<CommentResponse[]>(
        commentKeys.list(postId)
      );

      // Optimistically update the comment
      if (previousComments) {
        const updateRecursive = (comments: CommentResponse[]): CommentResponse[] => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                content: data.content,
                updated_at: new Date().toISOString(),
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateRecursive(comment.replies),
              };
            }
            return comment;
          });
        };

        queryClient.setQueryData(
          commentKeys.list(postId),
          updateRecursive(previousComments)
        );
      }

      return { previousComments, postId };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(context.postId),
          context.previousComments
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.postId),
      });
    },
  });
}

// ============================================================
// useDeleteComment - Delete a comment
// ============================================================

interface DeleteCommentVariables {
  commentId: string;
  postId: string; // Needed for cache invalidation
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentVariables) =>
      deleteComment(commentId),
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });

      const previousComments = queryClient.getQueryData<CommentResponse[]>(
        commentKeys.list(postId)
      );

      // Optimistically remove the comment
      if (previousComments) {
        const removeRecursive = (comments: CommentResponse[]): CommentResponse[] => {
          return comments
            .filter((comment) => comment.id !== commentId)
            .map((comment) => {
              if (comment.replies) {
                return {
                  ...comment,
                  replies: removeRecursive(comment.replies),
                };
              }
              return comment;
            });
        };

        queryClient.setQueryData(
          commentKeys.list(postId),
          removeRecursive(previousComments)
        );
      }

      return { previousComments, postId };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(context.postId),
          context.previousComments
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.postId),
      });
    },
  });
}
```
  </action>
  <verify>
- yarn tsc --noEmit passes
- Exports: useComments, useCreateComment, useUpdateComment, useDeleteComment
  </verify>
  <done>
React Query hooks created:
- useComments: Query for fetching comments list
- useCreateComment: Mutation with optimistic update (supports replies)
- useUpdateComment: Mutation with optimistic update
- useDeleteComment: Mutation with optimistic removal
  </done>
</task>

</tasks>

<verification>
After all tasks complete:

1. **Type check**: `yarn tsc --noEmit` passes
2. **Files exist**:
   - packages/web/lib/api/comments.ts
   - packages/web/lib/hooks/useComments.ts
   - packages/web/app/api/v1/posts/[postId]/comments/route.ts
   - packages/web/app/api/v1/comments/[commentId]/route.ts
3. **Exports verified**:
   - types.ts exports CommentResponse, CreateCommentDto, UpdateCommentDto
   - comments.ts exports fetchComments, createComment, updateComment, deleteComment
   - useComments.ts exports useComments, useCreateComment, useUpdateComment, useDeleteComment
</verification>

<success_criteria>
- All comment types match OpenAPI spec
- API functions follow established pattern (apiClient with path, method, requiresAuth)
- Proxy routes forward requests to backend correctly
- React Query hooks provide optimistic updates for immediate UI feedback
- Nested replies are handled in cache updates
- TypeScript compilation succeeds
</success_criteria>

<output>
After completion, create `.planning/phases/B-engagement/B-02-SUMMARY.md`
</output>
