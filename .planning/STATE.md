# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-29)

**Core value:** 완전한 사용자 경험 — 모든 페이지가 실제 데이터로 동작
**Current focus:** v2.0 Design Overhaul

## Current Position

**Active Milestones:**
- **v2.0 Design Overhaul** - Phase v2-03 COMPLETE (3/3 plans done)

**v1.1 Status:** SHIPPED (2026-01-29) - All 4 tracks merged to main
**v2.0 Status:** Phase v2-03 COMPLETE, ready for Phase v2-04
**Last activity:** 2026-01-29 - Completed v2-03-03-PLAN.md (FeedCard & ProfileHeaderCard)

### Execution Flow

```
v1.1 (main branch): ─── SHIPPED ✓
   Phase 6 + Tracks A-D merged

v2.0 (feature/v2-design-overhaul):
   │
   ├─ v2-Phase 1: Design System Foundation ─── COMPLETE ✓
   │
   ├─ v2-Phase 2: Core Interactive Components ─── COMPLETE ✓
   │
   └─ v2-Phase 3: Card Components ─── READY
```

**v1.1 Progress:** ██████████ (100% - SHIPPED)
**v2.0 Progress:** ███░░░░░░░ (33% - 9 of 27 plans complete)

## Milestones

| Version | Name | Status | Date |
|---------|------|--------|------|
| v1.0 | Documentation Optimization | SHIPPED | 2026-01-29 |
| v1.1 | Full API Integration | SHIPPED | 2026-01-29 |
| v2.0 | Design Overhaul | IN PROGRESS | 2026-01-29 |

## Phase Progress

### v1.1 Full API Integration (SHIPPED)

| Phase/Track | Plans | Status |
|-------------|-------|--------|
| Phase 6: API Foundation | 3/3 | ✅ Complete |
| Track A: Content CRUD | 3/3 | ✅ Merged |
| Track B: Engagement | 2/2 | ✅ Merged |
| Track C: Gamification | 2/2 | ✅ Merged |
| Track D: Monetization | 3/3 | ✅ Merged |
| **Total** | **13/13** | **SHIPPED** |

### v2.0 Design Overhaul (IN PROGRESS)

See: .planning/ROADMAP-v2.md

| Phase | Plans | Status |
|-------|-------|--------|
| v2-1: Design System Foundation | 3/3 | **Complete** (v2-01-01, v2-01-02, v2-01-03 done) |
| v2-2: Core Interactive Components | 3/3 | **Complete** (v2-02-01, v2-02-02, v2-02-03 done) |
| v2-3: Card Components | 3/3 | **Complete** (v2-03-01, v2-03-02, v2-03-03 done) |
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
- **Semantic Typography Sizes (v2-01-03):** Add h1-h4, body variants as fontSize tokens with line-height tuples for single-class application
- **CSS Variable Naming (v2-01-03):** Use semantic names (--text-h1) instead of scale names (--text-3xl) for clearer intent
- **Utility Class Approach (v2-01-03):** Create @layer utilities with responsive typography presets for quick application
- **Icon Button Sizing (v2-02-01):** Added icon-sm (32px) and icon-lg (48px) variants for flexible icon button sizing
- **Loading State Pattern (v2-02-01):** Use isLoading prop with Loader2 spinner and pointer-events-none instead of disabled attribute
- **Input Icon Pattern (v2-02-02):** Icon containers use absolute positioning with pointer-events-none, conditional padding (pl-10/pr-10) when icons present
- **Error Precedence (v2-02-02):** Error prop overrides variant prop to ensure consistent error display
- **SearchInput Design (v2-02-02):** Built-in search icon left, conditional clear button right when value present, uses variant="search" internally
- **Card Slot Components (v2-03-01):** Use type instead of empty interface for slot components to satisfy ESLint no-empty-object-type rule
- **Card Size Variants (v2-03-01):** Size controls padding (sm: p-3, md: p-4, lg: p-6), not overall dimensions
- **Interactive Cards (v2-03-01):** Interactive prop adds cursor-pointer and hover:shadow-lg with transition-shadow
- **ProductCard Wrapper Strategy (v2-03-02):** Use Link when link provided, div when onClick provided, bare content otherwise
- **GridCard Padding Override (v2-03-02):** GridCard uses p-0 on Card for full-image display, unlike ProductCard with content padding
- **Badge Style Extraction (v2-03-02):** Badge styles as const object for reusability (TOP/NEW/BEST/SALE)
- **FeedCard Base/Feature Separation (v2-03-03):** Design-system provides base FeedCard for composition, feature component adds GSAP Flip animations
- **ProfileHeaderCard Layout (v2-03-03):** Avatar + info in flex row, optional stats row below with dividers for clean separation
- **Refactoring Preservation (v2-03-03):** Maintain GSAP Flip animations and store integrations while migrating to Card base

### Open Items
- v2 deferred: Admin dashboard, real-time notifications

### Tech Debt
- Supabase direct queries -> REST API migration (some pages)

### Backend API Reference
- OpenAPI: https://dev.decoded.style/api-docs/openapi.json
- Base URL: https://dev.decoded.style/api/v1

## Session Continuity

**Last session:** 2026-01-29
**Stopped at:** Completed v2-03-03-PLAN.md - Phase v2-03 COMPLETE
**Resume file:** None

**Next Steps:**

```bash
# Phase v2-03 is complete! Ready for Phase v2-04: Desktop Infrastructure
git checkout feature/v2-design-overhaul  # 현재 브랜치
/gsd:discuss-phase v2-04  # Plan Desktop Infrastructure phase
# Or continue with next phase execution
/gsd:execute-phase v2-04-01  # Start Desktop Infrastructure
```

---

*Last updated: 2026-01-29 after v2-03-01 plan completion*
