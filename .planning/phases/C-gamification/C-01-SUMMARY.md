---
phase: C-gamification
plan: 01
subsystem: gamification
tags: [rankings, leaderboard, api, react-query, typescript]
requires: [06-01, 06-02, 06-03]
provides:
  - Rankings API types and functions
  - React Query hooks for rankings data
  - API proxy routes for rankings endpoints
affects: [C-02, C-03, C-04]
tech-stack:
  added: []
  patterns:
    - Infinite query pagination for rankings list
    - Public endpoint with optional auth context
    - Category-specific data filtering
key-files:
  created:
    - packages/web/lib/api/rankings.ts
    - packages/web/lib/hooks/useRankings.ts
    - packages/web/app/api/v1/rankings/route.ts
    - packages/web/app/api/v1/rankings/me/route.ts
    - packages/web/app/api/v1/rankings/[category]/route.ts
  modified:
    - packages/web/lib/api/types.ts
    - packages/web/lib/api/index.ts
decisions:
  - Rankings list uses infinite query for better UX
  - Period filter supports weekly/monthly/all_time
  - PaginationMeta reused across Rankings and Posts APIs
  - fetchRankings is public endpoint, includes my_ranking if authenticated
metrics:
  duration: 153s
  completed: 2026-01-29
---

# Phase [C] Plan [01]: Rankings Display Summary

**One-liner:** Complete Rankings API integration with TypeScript types, API functions, React Query hooks, and Next.js proxy routes for global/category/personal rankings display.

## Overview

Implemented full Rankings API integration layer following Phase 6 patterns (apiClient, proxy routes, React Query hooks). This provides the data layer for RANK-01 (global rankings), RANK-02 (personal ranking), and RANK-03 (category rankings) requirements.

## What Was Built

### TypeScript Types (types.ts)
- **RankingListResponse**: Global rankings with optional my_ranking field
- **MyRankingDetailResponse**: User's detailed ranking with category breakdowns
- **CategoryRankingResponse**: Category-specific rankings
- **Supporting types**: RankingItem, RankingUser, MyRanking, PaginationMeta, SolutionStats, CategoryRank
- **Params interfaces**: RankingsListParams, CategoryRankingsParams
- **RankingPeriod**: weekly | monthly | all_time

### API Functions (rankings.ts)
- **fetchRankings**: Global rankings with period/pagination filters
- **fetchMyRanking**: User's detailed ranking (auth required)
- **fetchCategoryRankings**: Category-specific rankings with pagination
- Query string builders for clean parameter handling

### React Query Hooks (useRankings.ts)
- **useRankings**: Infinite query for global rankings leaderboard
- **useMyRanking**: Single query for user's detailed ranking
- **useCategoryRankings**: Infinite query for category-specific rankings
- **rankingsKeys**: Query key factory for cache management

### API Proxy Routes
- **/api/v1/rankings/route.ts**: Global rankings (public, optional auth)
- **/api/v1/rankings/me/route.ts**: User ranking (auth required)
- **/api/v1/rankings/[category]/route.ts**: Category rankings (public)

## Tasks Completed

### Task 1: Add Rankings TypeScript types to types.ts
**Commit:** 4f2aa2f
**Files:** packages/web/lib/api/types.ts

Added comprehensive TypeScript interfaces for all three rankings endpoints:
- RankingListResponse (global rankings + optional my_ranking)
- MyRankingDetailResponse (detailed personal stats)
- CategoryRankingResponse (category-specific leaderboard)
- Supporting types for users, stats, and pagination

### Task 2: Create Rankings API functions and proxy routes
**Commit:** 09c32a6
**Files:**
- packages/web/lib/api/rankings.ts (new)
- packages/web/lib/api/index.ts (updated)
- packages/web/app/api/v1/rankings/route.ts (new)
- packages/web/app/api/v1/rankings/me/route.ts (new)
- packages/web/app/api/v1/rankings/[category]/route.ts (new)

Created three API functions following Phase 6 apiClient pattern:
- fetchRankings with period filtering
- fetchMyRanking with auth requirement
- fetchCategoryRankings with category path parameter

Added Next.js API proxy routes to avoid CORS issues, following the users routes pattern from Phase 6.

### Task 3: Create React Query hooks for rankings
**Commit:** 53c893a
**Files:** packages/web/lib/hooks/useRankings.ts (new)

Created three React Query hooks:
- useRankings: Infinite query for scrolling through leaderboard
- useMyRanking: Standard query for user's personal ranking
- useCategoryRankings: Infinite query for category leaderboards

Defined rankingsKeys query key factory for efficient cache management.

## Decisions Made

### 1. Infinite Query for Rankings Lists
**Context:** Rankings lists can be long (hundreds of users)
**Decision:** Use `useInfiniteQuery` for useRankings and useCategoryRankings
**Rationale:** Better UX with load-more pattern, reduces initial load time
**Trade-offs:** Slightly more complex cache management vs. better performance

### 2. Public Endpoint with Optional Auth
**Context:** Rankings are public data, but authenticated users get their own rank
**Decision:** fetchRankings doesn't require auth but passes it if available
**Rationale:** Matches backend API design, allows unauthenticated browsing
**Affects:** UI components can show leaderboard to all users, highlight position for logged-in users

### 3. PaginationMeta Reuse
**Context:** Rankings and Posts both need pagination metadata
**Decision:** Use same PaginationMeta interface across both
**Rationale:** Type consistency, easier to build shared pagination components
**Note:** If other endpoints need different pagination structure, create separate types

## Technical Details

### API Client Pattern Adherence
Follows Phase 6 patterns:
- Uses shared apiClient with auth injection
- Query string builders for clean URL construction
- requiresAuth flag for clarity
- Consistent error handling

### React Query Configuration
- **Stale time**: 2 minutes (rankings update more frequently than profiles)
- **Infinite query**: Uses getNextPageParam with total_pages comparison
- **Initial page**: Always starts at page 1
- **Query keys**: Hierarchical structure (all > list/me/category)

### Type Safety
All types match backend OpenAPI spec:
- RankingPeriod: 'weekly' | 'monthly' | 'all_time'
- Required fields: rank, user, total_points, weekly_points
- Optional fields: my_ranking (only if authenticated)

## Integration Points

### Dependencies
- **Phase 6 (06-01)**: Uses apiClient and getAuthToken
- **Phase 6 (06-02)**: Follows fetch* naming convention
- **Phase 6 (06-03)**: Uses API proxy route pattern

### Provides For
- **Track C-02**: Rankings page UI will consume these hooks
- **Track C-03**: Badge display may link to category rankings
- **Track C-04**: Profile page may show user's rank position

### Data Flow
```
Component → useRankings hook
         → /api/v1/rankings proxy
         → Backend API
         → React Query cache
         → Component re-render
```

## Next Phase Readiness

### Ready for C-02 (Rankings Page UI)
- [x] Types defined for all ranking endpoints
- [x] Hooks available: useRankings, useMyRanking, useCategoryRankings
- [x] Infinite pagination support
- [x] Period filtering support

### Potential Considerations
- **Performance**: Rankings list may be large; consider virtualization in UI
- **Real-time updates**: Current 2-minute stale time may not show live changes; consider WebSocket for live leaderboard
- **Cache strategy**: Infinite queries accumulate pages; may need cleanup strategy for long sessions

## Deviations from Plan

None - plan executed exactly as written.

## Files Changed

### Created
1. `packages/web/lib/api/rankings.ts` (92 lines)
   - fetchRankings, fetchMyRanking, fetchCategoryRankings
   - Query string builders

2. `packages/web/lib/hooks/useRankings.ts` (112 lines)
   - useRankings, useMyRanking, useCategoryRankings
   - rankingsKeys factory

3. `packages/web/app/api/v1/rankings/route.ts` (57 lines)
   - GET handler for global rankings

4. `packages/web/app/api/v1/rankings/me/route.ts` (48 lines)
   - GET handler for user ranking

5. `packages/web/app/api/v1/rankings/[category]/route.ts` (52 lines)
   - GET handler for category rankings

### Modified
1. `packages/web/lib/api/types.ts` (+91 lines)
   - Added Rankings section with all interfaces

2. `packages/web/lib/api/index.ts` (+6 lines)
   - Export rankings functions

## Commits
- `4f2aa2f`: feat(C-01): add Rankings API TypeScript types
- `09c32a6`: feat(C-01): create Rankings API functions and proxy routes
- `53c893a`: feat(C-01): create React Query hooks for rankings

---

**Plan Status:** Complete
**Ready for:** C-02 Rankings Page UI implementation
