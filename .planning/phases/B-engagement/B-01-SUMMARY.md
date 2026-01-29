---
phase: B-engagement
plan: 01
subsystem: api
tags: [votes, adoption, react-query, api-client, next.js]

# Dependency graph
requires:
  - phase: Phase 6
    provides: API client with auth injection pattern, API proxy pattern
provides:
  - Vote API types (VoteStatsResponse, CreateVoteDto, VoteResponse)
  - Adopt API types (AdoptSolutionDto, AdoptResponse, MatchType)
  - Vote API client functions (fetchVoteStats, createVote, deleteVote)
  - Adopt API client functions (adoptSolution, unadoptSolution)
  - Vote React Query hooks (useVoteStats, useVote, useRetractVote)
  - Adopt React Query hooks (useAdoptSolution, useUnadoptSolution)
  - API proxy routes for votes (GET, POST, DELETE)
  - API proxy routes for adopt (POST, DELETE)
affects: [B-02, Track-B-UI]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Vote/Adopt API integration following established apiClient pattern
    - React Query hooks with cache invalidation on mutations

key-files:
  created:
    - packages/web/lib/api/votes.ts
    - packages/web/lib/hooks/useVotes.ts
    - packages/web/app/api/v1/solutions/[solutionId]/votes/route.ts
    - packages/web/app/api/v1/solutions/[solutionId]/adopt/route.ts
  modified:
    - packages/web/lib/api/types.ts
    - packages/web/lib/api/index.ts

key-decisions:
  - "Vote stats query has 30s staleTime (votes change more frequently than profile)"
  - "All mutation hooks invalidate vote stats cache for immediate UI updates"
  - "Added TODO comments for spot/solution query invalidation when those hooks exist"

patterns-established:
  - "Vote API follows fetch* naming convention (fetchVoteStats, etc.)"
  - "Mutation hooks accept {solutionId, data} object for consistency"
  - "API proxy routes handle 204 No Content for DELETE operations"

# Metrics
duration: 3min
completed: 2026-01-29
---

# Phase B-01: Vote and Adopt Integration Summary

**Vote and adopt API integration with React Query hooks, enabling users to vote on solutions (accurate/different) and post owners to adopt solutions with match type selection**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-29T10:10:19Z
- **Completed:** 2026-01-29T10:13:02Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Complete vote API integration (stats, create, delete) with types matching OpenAPI spec
- Adopt/unadopt API integration with match type support (perfect/close)
- React Query hooks with proper cache invalidation for real-time UI updates
- API proxy routes following established CORS avoidance pattern

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Vote and Adopt types to types.ts** - `7f95d2e` (feat)
2. **Task 2: Create vote API functions and proxy routes** - `4368389` (feat)
3. **Task 3: Create React Query hooks for votes** - `043d249` (feat)

## Files Created/Modified
- `packages/web/lib/api/types.ts` - Added VoteStatsResponse, CreateVoteDto, VoteResponse, AdoptSolutionDto, AdoptResponse, MatchType
- `packages/web/lib/api/votes.ts` - Vote and adopt API client functions
- `packages/web/lib/api/index.ts` - Export vote API functions
- `packages/web/lib/hooks/useVotes.ts` - React Query hooks for votes and adoption
- `packages/web/app/api/v1/solutions/[solutionId]/votes/route.ts` - Vote API proxy (GET, POST, DELETE)
- `packages/web/app/api/v1/solutions/[solutionId]/adopt/route.ts` - Adopt API proxy (POST, DELETE)

## Decisions Made
- Used 30-second staleTime for vote stats (shorter than profile due to frequent changes)
- All mutation hooks invalidate vote stats cache for immediate feedback
- Added TODO comments for future spot/solution query invalidation
- Followed established patterns from Phase 6 (apiClient, proxy routes, React Query)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Vote and adopt infrastructure complete. Ready for:
- B-02: Comment API integration
- UI components that display vote stats and vote/adopt controls
- Integration with spot/solution detail pages

All API endpoints tested and following established patterns. No blockers.

---
*Phase: B-engagement*
*Completed: 2026-01-29*
