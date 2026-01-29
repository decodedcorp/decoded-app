# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-29)

**Core value:** 완전한 사용자 경험 — 모든 페이지가 실제 데이터로 동작
**Current focus:** v1.1 Full API Integration (Parallel Tracks) + v2.0 Design Overhaul (Parallel Branch)

## Current Position

**Active Milestones:**
- **v1.1 Full API Integration** - Phase 6 Complete, Tracks A-D Ready
- **v2.0 Design Overhaul** - Roadmap Created, Ready to Start

**v1.1 Status:** Phase 6 complete, ready for parallel tracks
**v2.0 Status:** Phase v2-01 in progress (Plan 02 complete)
**Last activity:** 2026-01-29 - Completed v2-01-02-PLAN.md (Typography Components)

### Execution Flow

```
v1.1 (main branch):
1. Phase 6 (Main Branch) ─── COMPLETE ✓
   │
   └─ Ready to create 4 worktrees:
      ├── Track A: Content CRUD
      ├── Track B: Engagement
      ├── Track C: Gamification
      └── Track D: Monetization

v2.0 (parallel branch):
feature/v2-design-overhaul
   │
   └─ v2-Phase 1: Design System Foundation (Ready)
```

**v1.1 Progress:** ███ (100% - 3 of 3 plans complete for Phase 6)
**v2.0 Progress:** ██░ (22% - 1 of 9 phases started, 2 of 3 plans in v2-01 complete)

## Milestones

| Version | Name | Status | Date |
|---------|------|--------|------|
| v1.0 | Documentation Optimization | SHIPPED | 2026-01-29 |
| v1.1 | Full API Integration | IN PROGRESS | 2026-01-29 |
| v2.0 | Design Overhaul | PLANNED | 2026-01-29 |

## Phase Progress

### v1.1 Sequential (Main Branch)

| Phase | Plans | Status |
|-------|-------|--------|
| Phase 6: API Foundation & Profile | 3/3 | **Complete** (06-03 verification pending) |

### v1.1 Parallel Tracks (Ready to Start)

| Track | Worktree | Plans | Status |
|-------|----------|-------|--------|
| A: Content CRUD | `../decoded-track-a` | 0/3 | Ready |
| B: Engagement | `../decoded-track-b` | 0/2 | Ready |
| C: Gamification | `../decoded-track-c` | 0/2 | Ready |
| D: Monetization | `../decoded-track-d` | 0/3 | Ready |

### v2.0 Sequential (Separate Branch)

See: .planning/ROADMAP-v2.md

| Phase | Plans | Status |
|-------|-------|--------|
| v2-1: Design System Foundation | 2/3 | In progress (v2-01-01, v2-01-02 complete) |
| v2-2: Core Interactive Components | 0/3 | Not started |
| v2-3: Card Components | 0/3 | Not started |
| v2-4: Desktop Infrastructure | 0/3 | Not started |
| v2-5: Home & Explore Pages | 0/3 | Not started |
| v2-6: Feed & Profile Pages | 0/3 | Not started |
| v2-7: Search & Image Detail | 0/3 | Not started |
| v2-8: Request Flow & Login | 0/3 | Not started |
| v2-9: Documentation & Polish | 0/3 | Not started |

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

### Decisions Made (v2.0)
- **Separate Branch Strategy:** v2.0 runs on `feature/v2-design-overhaul` branch
- **Parallel Development:** v1.1 and v2.0 work in parallel, merge coordinated later
- **Design Source:** decoded.pen as single source of truth for all design decisions
- **Pencil MCP:** Use Pencil MCP to extract design specs and generate component code
- **Preserve Functionality:** All existing features maintained, only design/layout changes
- **Documentation First:** Each phase ends with docs update (DOC-* requirements distributed)
- **Phase Naming:** Use `v2-Phase-N` prefix to distinguish from v1.1 milestone
- **Design Tokens Structure (v2-01-01):** Export const objects with 'as const' for type inference
- **Color Token Approach (v2-01-01):** Reference CSS variables instead of hardcoded values
- **Responsive Typography Format (v2-01-01):** Use Tailwind class names for responsive scales
- **Typography Component Pattern (v2-01-02):** Use cva for variant-based styling with type safety
- **Semantic Element Mapping (v2-01-02):** Auto-map typography variants to semantic HTML elements
- **Color Prop Conflict (v2-01-02):** Use textColor prop to avoid HTML color attribute conflict

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
**Stopped at:** Completed v2-01-02-PLAN.md (Typography Components)
**Resume file:** .planning/phases/v2-01-design-system-foundation/v2-01-02-SUMMARY.md

**Next Steps:**

For v1.1:
```bash
# Create worktrees for parallel tracks
git worktree add ../decoded-track-a -b feature/track-a-content
git worktree add ../decoded-track-b -b feature/track-b-engagement
git worktree add ../decoded-track-c -b feature/track-c-gamification
git worktree add ../decoded-track-d -b feature/track-d-monetization
```

For v2.0:
```bash
# Create v2.0 branch
git checkout -b feature/v2-design-overhaul

# Start with Phase 1
/gsd:plan-phase v2-1
```

## Worktree Commands (v1.1)

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

*Last updated: 2026-01-29 after v2-01-02 completion*
