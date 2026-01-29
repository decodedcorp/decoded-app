# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-29)

**Core value:** 완전한 사용자 경험 — 모든 페이지가 실제 데이터로 동작
**Current focus:** v1.1 Full API Integration (Parallel Tracks)

## Current Position

**Milestone:** v1.1 Full API Integration
**Structure:** Phase 6 Complete → Tracks A-D (Parallel)
**Status:** Track B in progress
**Last activity:** 2026-01-29 - Completed Track B Plan 02 (Comment API)

### Execution Flow

```
1. Phase 6 (Main Branch) ─── COMPLETE ✓
   │
   └─ Parallel Tracks:
      ├── Track A: Content CRUD      - Not started
      ├── Track B: Engagement        - IN PROGRESS (2/2 plans)
      ├── Track C: Gamification      - Not started
      └── Track D: Monetization      - Not started
```

**Track B Progress:** ██████████ (100% - 2 of 2 plans complete)

## Milestones

| Version | Name | Status | Date |
|---------|------|--------|------|
| v1.0 | Documentation Optimization | SHIPPED | 2026-01-29 |
| v1.1 | Full API Integration | IN PROGRESS | 2026-01-29 |

## Phase Progress

### Sequential (Main Branch)

| Phase | Plans | Status |
|-------|-------|--------|
| Phase 6: API Foundation & Profile | 3/3 | **Complete** (06-03 verification pending) |

### Parallel Tracks

| Track | Worktree | Plans | Status |
|-------|----------|-------|--------|
| A: Content CRUD | `../decoded-track-a` | 0/3 | Ready |
| B: Engagement | `../decoded-track-b` | 2/2 | **Complete** |
| C: Gamification | `../decoded-track-c` | 0/2 | Ready |
| D: Monetization | `../decoded-track-d` | 0/3 | Ready |

## Accumulated Context

### Decisions Made (v1.0)
- .planning/codebase/ = source of truth for codebase analysis
- SSOT principle: docs/ = implemented, specs/ = designed, codebase/ = analyzed

### Decisions Made (v1.1)
- Backend API: https://dev.decoded.style/api/v1
- OpenAPI spec available at /api-docs/openapi.json
- **Parallel execution via git worktrees** for independent tracks
- Phase 6 establishes API client patterns, then 4 tracks run in parallel
- **API Client Pattern (06-01):** All endpoints use shared apiClient with auth injection
- **Type Safety:** All API types match OpenAPI spec exactly
- **Naming Convention (06-02):** Use fetch* for API functions (fetchMe, fetchUserStats)
- **Store Sync (06-02):** Keep mock data as fallback, sync from API via explicit actions
- **Points Mapping (06-02):** Map API points to earnings until Track C implements full gamification
- **API Proxy (06-03):** Use Next.js API routes to proxy backend calls, avoiding CORS
- **Dual State Sync (06-03):** React Query cache + Zustand store for immediate UI updates
- **Vote Stats Cache (B-01):** Vote stats have 30s staleTime (more frequent changes than profile)
- **Vote Mutations (B-01):** All vote/adopt mutations invalidate vote stats cache for immediate UI feedback
- **Comment Access (B-02):** Comments are public (fetch), create/update/delete require auth
- **Optimistic Updates (B-02):** Mutation hooks use recursive transformations for nested replies

### Pending Verification
- **06-03 Profile Edit:** Code complete, verification blocked by backend DB error
- Action: Re-test when backend is restored

### Open Items
- v2 deferred: Admin dashboard, real-time notifications

### Tech Debt
- Supabase direct queries -> REST API migration (some pages)

### Backend API Reference
- OpenAPI: https://dev.decoded.style/api-docs/openapi.json
- Base URL: https://dev.decoded.style/api/v1

## Session Continuity

**Last session:** 2026-01-29
**Stopped at:** Track B complete (B-01, B-02)
**Resume file:** None - track complete

## Worktree Commands

Phase 6 complete. Ready to create worktrees:

```bash
# Create worktrees
git worktree add ../decoded-track-a -b feature/track-a-content
git worktree add ../decoded-track-b -b feature/track-b-engagement
git worktree add ../decoded-track-c -b feature/track-c-gamification
git worktree add ../decoded-track-d -b feature/track-d-monetization

# Run Claude in each (separate terminals)
cd ../decoded-track-a && claude  # /gsd:plan-phase A
cd ../decoded-track-b && claude  # /gsd:plan-phase B
cd ../decoded-track-c && claude  # /gsd:plan-phase C
cd ../decoded-track-d && claude  # /gsd:plan-phase D

# After all complete, merge
git checkout main
git merge feature/track-a-content
git merge feature/track-b-engagement
git merge feature/track-c-gamification
git merge feature/track-d-monetization

# Cleanup
git worktree remove ../decoded-track-a
git worktree remove ../decoded-track-b
git worktree remove ../decoded-track-c
git worktree remove ../decoded-track-d
```

---

*Last updated: 2026-01-29 after Track B completion*
