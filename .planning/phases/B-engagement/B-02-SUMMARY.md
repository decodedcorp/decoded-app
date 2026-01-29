---
phase: B-engagement
plan: 02
subsystem: api
tags: [comments, react-query, api-client, next.js, typescript]

# Dependency graph
requires:
  - phase: 06-api-foundation-profile
    provides: API client pattern with shared apiClient and auth injection
provides:
  - Comment CRUD API integration (types, client functions, hooks)
  - API proxy routes for comment endpoints
  - React Query hooks with optimistic updates for comments
  - Nested reply support in comment hooks
affects: [B-engagement-ui, post-detail-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Comment hooks follow profile hooks pattern (useProfile.ts)"
    - "Optimistic updates with rollback on error"
    - "Recursive comment updates for nested replies"

key-files:
  created:
    - packages/web/lib/api/comments.ts
    - packages/web/lib/hooks/useComments.ts
    - packages/web/app/api/v1/posts/[postId]/comments/route.ts
    - packages/web/app/api/v1/comments/[commentId]/route.ts
  modified:
    - packages/web/lib/api/types.ts
    - packages/web/lib/api/index.ts

key-decisions:
  - "Comments are public (fetchComments requires no auth)"
  - "Create/update/delete require authentication"
  - "Optimistic updates handle nested replies via recursive transformations"

patterns-established:
  - "Comment mutation hooks require postId for cache invalidation"
  - "Recursive helper functions (updateRecursive, removeRecursive) for nested data"
  - "Query keys use hierarchical structure: comments.all -> comments.list(postId)"

# Metrics
duration: 3min
completed: 2026-01-29
---

# Phase B Plan 02: Comment API Integration Summary

**Comment CRUD with React Query hooks, optimistic updates, and nested reply support via recursive cache transformations**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-29T10:10:19Z
- **Completed:** 2026-01-29T10:13:14Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Comment types matching OpenAPI spec (CommentResponse, CreateCommentDto, UpdateCommentDto)
- API client functions with proper auth requirements
- API proxy routes for comment list, create, update, delete endpoints
- React Query hooks with optimistic updates and rollback on error
- Nested reply handling via recursive cache updates

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Comment types to types.ts** - `9014ead` (feat)
2. **Task 2: Create comment API functions and proxy routes** - `32d09c7` (feat)
3. **Task 3: Create React Query hooks for comments** - `f78380a` (feat)

## Files Created/Modified
- `packages/web/lib/api/types.ts` - Added CommentResponse, CommentUser, CreateCommentDto, UpdateCommentDto
- `packages/web/lib/api/comments.ts` - fetchComments, createComment, updateComment, deleteComment
- `packages/web/lib/api/index.ts` - Export comment functions
- `packages/web/app/api/v1/posts/[postId]/comments/route.ts` - Proxy for GET (list) and POST (create)
- `packages/web/app/api/v1/comments/[commentId]/route.ts` - Proxy for PATCH (update) and DELETE (delete)
- `packages/web/lib/hooks/useComments.ts` - React Query hooks: useComments, useCreateComment, useUpdateComment, useDeleteComment

## Decisions Made

**Commenting access control:**
- Viewing comments is public (no auth required)
- Creating, updating, and deleting comments require authentication
- Backend enforces ownership validation (users can only edit/delete their own comments)

**Cache update strategy:**
- Optimistic updates for immediate UI feedback
- Recursive transformations for nested reply updates
- Rollback on error to maintain consistency
- Post-mutation invalidation ensures backend sync

**Hook API design:**
- Mutation hooks require postId for cache invalidation (can't infer from commentId alone)
- CreateCommentVariables: `{ postId, data }` - supports both top-level comments and replies
- UpdateCommentVariables: `{ commentId, postId, data }` - needs postId for cache key
- DeleteCommentVariables: `{ commentId, postId }` - needs postId for cache key

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without issues.

## Next Phase Readiness

**Ready for:**
- Comment UI components (comment list, form, edit/delete actions)
- Post detail page integration
- Nested reply UI implementation

**Provides:**
- Complete comment CRUD API integration
- Type-safe comment operations
- Optimistic UI update patterns
- Cache management for nested data structures

---
*Phase: B-engagement*
*Completed: 2026-01-29*
