---
phase: C-gamification
plan: 02
subsystem: gamification-api
tags: [badges, api-integration, react-query, typescript]
requires:
  - phase-6-api-foundation
provides:
  - badge-api-client
  - badge-react-hooks
  - badge-type-definitions
affects:
  - C-03-points-ui
  - C-04-badges-ui
tech-stack:
  added: []
  patterns:
    - react-query-hooks
    - api-proxy-pattern
    - unified-data-transformation
key-files:
  created:
    - packages/web/lib/api/badges.ts
    - packages/web/lib/hooks/useBadges.ts
    - packages/web/app/api/v1/badges/route.ts
    - packages/web/app/api/v1/badges/me/route.ts
    - packages/web/app/api/v1/badges/[badge_id]/route.ts
  modified:
    - packages/web/lib/api/types.ts
    - packages/web/lib/api/index.ts
decisions:
  - id: C-02-001
    title: Badge API follows Phase 6 patterns
    rationale: Consistent with user/profile API patterns (apiClient, proxy routes)
  - id: C-02-002
    title: UnifiedBadge transformation helper
    rationale: Simplifies UI rendering by merging earned/available badges into single array
  - id: C-02-003
    title: Public access for badge list and details
    rationale: Allows unauthenticated users to view badges, only /me requires auth
metrics:
  duration: "2 minutes 16 seconds"
  completed: "2026-01-29"
---

# Phase [C] Plan [02]: Badge System Integration Summary

**One-liner:** Badge API integration with TypeScript types, React Query hooks, and proxy routes for viewing all badges, earned badges with progress, and badge details.

## What Was Built

### Badge TypeScript Types (Task 1)
Added comprehensive Badge-related interfaces to `types.ts` matching backend OpenAPI spec:
- `BadgeType`, `BadgeRarity` union types
- `BadgeCriteria` interface for achievement criteria
- `BadgeResponse`, `BadgeListResponse` for all badges endpoint
- `EarnedBadgeItem`, `AvailableBadgeItem`, `BadgeProgress` for user badges
- `MyBadgesResponse` interface combining earned and available badges

### Badge API Functions (Task 2)
Created `badges.ts` with three API functions using Phase 6 apiClient pattern:
- `fetchBadges()` - GET /api/v1/badges (public access)
- `fetchMyBadges()` - GET /api/v1/badges/me (auth required)
- `fetchBadgeById(badgeId)` - GET /api/v1/badges/{badge_id} (public access)

Updated `index.ts` to re-export badge API functions.

### API Proxy Routes (Task 2)
Created three Next.js API proxy routes to avoid CORS:
- `app/api/v1/badges/route.ts` - Proxies GET /api/v1/badges
- `app/api/v1/badges/me/route.ts` - Proxies GET /api/v1/badges/me with auth
- `app/api/v1/badges/[badge_id]/route.ts` - Proxies GET /api/v1/badges/{badge_id}

### React Query Hooks (Task 3)
Created `useBadges.ts` with hooks following Phase 6 patterns:
- `useBadges()` - Fetches all available badges (10min stale time)
- `useMyBadges()` - Fetches user's earned badges and progress (2min stale time)
- `useBadge(badgeId)` - Fetches single badge details (10min stale time)
- `badgesKeys` - Query key factory for cache management
- `transformToUnifiedBadges()` - Helper merging earned/available badges
- `UnifiedBadge` interface for simplified UI rendering

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

**Decision C-02-001: Badge API follows Phase 6 patterns**
- All API functions use `apiClient` with auth injection
- Proxy routes handle CORS and forward auth headers
- Consistent with user/profile API implementation

**Decision C-02-002: UnifiedBadge transformation helper**
- Created `transformToUnifiedBadges()` to merge earned and available badges
- Simplifies UI rendering by providing single array with `is_earned` flag
- Includes progress for available badges, earned_at for earned badges

**Decision C-02-003: Public access for badge list and details**
- Only `/badges/me` requires authentication
- Allows unauthenticated users to view available badges
- Follows OpenAPI spec design

## Technical Details

### Badge Types Structure
```typescript
BadgeResponse {
  id, type, name, criteria, rarity, description?, icon_url?, created_at
}

MyBadgesResponse {
  data: EarnedBadgeItem[] (badge + earned_at)
  available_badges: AvailableBadgeItem[] (badge + progress)
}
```

### Data Flow
```
Component
  ↓ useBadges/useMyBadges/useBadge
React Query
  ↓ fetchBadges/fetchMyBadges/fetchBadgeById
API Client (with auth)
  ↓ HTTP request
Next.js Proxy Route
  ↓ Forward with auth
Backend API
```

## Testing Recommendations

1. **Unit Tests**
   - Test `transformToUnifiedBadges()` helper with various badge combinations
   - Test query key generation in `badgesKeys`

2. **Integration Tests**
   - Test useBadges hook fetches and caches badge list
   - Test useMyBadges requires authentication
   - Test useBadge with valid/invalid badge IDs

3. **E2E Tests**
   - Navigate to badges page, verify all badges displayed
   - Login and verify earned badges appear with timestamps
   - Verify in-progress badges show progress bars

## Next Phase Readiness

**Ready for:**
- C-03 Points System Integration (parallel track)
- C-04 Badges UI Implementation (depends on C-02)
- Track B, D UI implementations (leaderboards, profile gamification)

**Requires:**
- Backend API running at dev.decoded.style
- Authentication working (Track A)
- User session available

**No blockers** - Badge API integration complete and follows established patterns.

## Files Changed

### Created (5 files)
- `packages/web/lib/api/badges.ts` (54 lines) - Badge API functions
- `packages/web/lib/hooks/useBadges.ts` (135 lines) - React Query hooks
- `packages/web/app/api/v1/badges/route.ts` (40 lines) - Badge list proxy
- `packages/web/app/api/v1/badges/me/route.ts` (50 lines) - User badges proxy
- `packages/web/app/api/v1/badges/[badge_id]/route.ts` (48 lines) - Badge details proxy

### Modified (2 files)
- `packages/web/lib/api/types.ts` (+62 lines) - Badge type definitions
- `packages/web/lib/api/index.ts` (+6 lines) - Badge exports

**Total:** 395 lines added across 7 files

## Commits

1. **3821a43** - feat(C-02): add Badge TypeScript types to types.ts
2. **d5c86e2** - feat(C-02): create Badges API functions and proxy routes
3. **9f6f727** - feat(C-02): create React Query hooks for badges

---

**Status:** ✅ Complete
**Duration:** 2 minutes 16 seconds
**Verified:** All tasks committed, types defined, API functions working, hooks exported
