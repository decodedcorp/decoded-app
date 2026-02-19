# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-19)

**Core value:** 완전한 사용자 경험 — 일관된 디자인 시스템과 실제 데이터
**Current focus:** v3.0 Admin Panel — AI Management

## Current Position

Phase: v3-01 (Admin Foundation)
Plan: —
Status: Roadmap defined, ready to plan phase
Last activity: 2026-02-19 — Roadmap created for v3.0

Progress: [----------] 0/5 phases complete (v3.0)

## Milestone Summary

| Milestone | Phases | Plans | Status | Date |
|-----------|--------|-------|--------|------|
| v1.0 Documentation | 5 | 5 | Shipped | 2026-01-29 |
| v1.1 API Integration | 5 | 13 | Shipped | 2026-01-29 |
| v2.0 Design Overhaul | 9 | 26 | Shipped | 2026-02-05 |
| v2.1 Design System | 6 | 14 | Shipped | 2026-02-06 |
| **v3.0 Admin Panel** | **5** | **0** | **In Progress** | - |
| **Total** | **30** | **58** | **Ongoing** | - |

## v3.0 Roadmap

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| v3-01 | Admin Foundation | AAUTH-01~03 | Not started |
| v3-02 | Dashboard | DASH-01~03 | Not started |
| v3-03 | AI Audit | AUDIT-01~04 | Not started |
| v3-04 | AI Cost Monitoring | COST-01~03 | Not started |
| v3-05 | Pipeline & Server Logs | PIPE-01~03, SLOG-01~03 | Not started |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Key decisions affecting future work:

- v2.1: Tech debt accepted (15 orphaned components, 35% integration)
- v2.1: Visual QA infrastructure established for regression testing
- v2.1: CVA pattern standard for all design-system components
- v2-09-03: Playwright for visual QA automation over manual capture
- v2-09-03: 4 breakpoints (375/768/1280/1440px) for responsive coverage
- v2-09-03: API error handling issues deferred to quick tasks (out of visual QA scope)
- quick-026: Negative margin technique for full-bleed content under fixed headers
- quick-026: Child pages must NOT duplicate global layout headers/padding
- quick-027: object-contain with fixed hero height for consistent layout (vs dynamic height)
- quick-027: Pixel-based spot positioning with ResizeObserver + natural dimensions tracking
- quick-027: isModal prop pattern for conditional ScrollTrigger animations in different contexts
- quick-029: Clear z-index hierarchy: headers z-40, content sections z-20 or below, modals z-50+
- quick-030: Deterministic brand color via string hash for consistent visual identity
- quick-030: Hotspot design system component supports optional color override
- quick-033: Hotspot absorbs SpotMarker functionality, single source of truth for spot/marker UI
- quick-033: SpotMarker deprecated re-export maintains backward compatibility during migration
- quick-033: brandToColor utility shared across design system for consistent brand colors
- quick-033: Glow effects use CSS custom property --hotspot-color for flexible color overrides
- quick-033: spot-reveal animation in both Tailwind config and globals.css for compatibility
- quick-036: Conditional spot fetching pattern with enabled option prevents unnecessary API calls
- quick-036: Context-specific Hotspot sizing using important prefix (!w-3 !h-3) overrides CVA defaults
- v3.0: Mock data first approach — AI audit, pipeline, server log use mock data; dashboard uses existing admin APIs
- v3.0: Admin auth based on `is_admin` field in Supabase profiles table
- v3.0: Charts will require a chart library (recharts or similar) — decide at v3-02 planning

### Tech Debt (from v2.1)

**Orphaned Components (15):**
- Tag, ActionButton, StepIndicator, Hotspot (Phase 1)
- ArtistCard (Phase 3)
- Badge, LeaderItem, RankingItem (Phase 4)
- OAuthButton, GuestButton, Divider, LoginCard, LoadingSpinner, SkeletonCard, BottomSheet (Phase 5)

**Missing Components (2):**
- EmptyState (custom exists in profile/images)
- ErrorState (custom exists in images)

**Duplicate Implementations:**
- LoginCard: design-system vs lib/components/auth
- StepIndicator: design-system vs lib/components/request
- Hotspot vs SpotMarker: different use cases

### Pending Todos

**From v2-09-03 Visual QA:**
1. Quick task: Fix images page raw JSON error exposure (API error handling - major UX/security)
2. Re-run visual QA when API stable for complete decoded.pen comparison

**From v3.0 Planning:**
1. Decide chart library at v3-02 planning (recharts recommended for React ecosystem)
2. Confirm which admin APIs are available for DASH-01~03 before v3-02 execution

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-02-19
Stopped at: v3.0 roadmap created, ready to plan v3-01
Resume file: None

## Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 016 | Fix upload page excessive re-renders | 2026-02-05 | ccab256 | [016-fix-upload-page-excessive-rerenders](./quick/016-fix-upload-page-excessive-rerenders/) |
| 017 | Split request API by solution knowledge | 2026-02-05 | d7de2d9 | [017-request-api-split-by-solution](./quick/017-request-api-split-by-solution/) |
| 018 | Add solution input UI for detected items | 2026-02-05 | 22888dd | [018-solution-input-ui](./quick/018-solution-input-ui/) |
| 019 | Switch to manual spot creation flow | 2026-02-05 | e418240 | [019-manual-spot-creation](./quick/019-manual-spot-creation/) |
| 020 | Unified upload + spot creation UI | 2026-02-05 | 8b08a6c | [020-request-upload-direct-spot-ui](./quick/020-request-upload-direct-spot-ui/) |
| 021 | Fix request upload spot creation missing | 2026-02-06 | 72dee3c | [021-fix-request-upload-spot-creation-missing](./quick/021-fix-request-upload-spot-creation-missing/) |
| 022 | Fix analyze proxy JSON error | 2026-02-06 | 4f7e896 | [022-fix-analyze-proxy-json-error](./quick/022-fix-analyze-proxy-json-error/) |
| 023 | Post detail page completion (editorial redesign) | 2026-02-12 | d5099ef | [023-post-detail-page-completion](./quick/023-post-detail-page-completion/) |
| 024 | Post detail remaining sections (Decoded Items, Gallery, Shop, Related) | 2026-02-12 | 3f90d6a | [024-post-detail-remaining-sections](./quick/024-post-detail-remaining-sections/) |
| 025 | Replace unconnected image sections with post data | 2026-02-12 | a420e82 | [025-replace-unconnected-image-sections-with-post](./quick/025-replace-unconnected-image-sections-with-post/) |
| 026 | Fix feed header clip and post detail scroll | 2026-02-12 | 8afb9c0 | [026-fix-feed-header-clip-and-post-detail-scroll](./quick/026-fix-feed-header-clip-and-post-detail-scroll/) |
| 027 | Fix post detail image clip and spots | 2026-02-12 | ad09695 | [027-fix-post-detail-image-clip-and-spots](./quick/027-fix-post-detail-image-clip-and-spots/) |
| 028 | Remove Achievements section from home page | 2026-02-12 | d807df3 | [028-remove-achievements-challenge-achieve-ma](./quick/028-remove-achievements-challenge-achieve-ma/) |
| 029 | Fix header scroll disappear | 2026-02-12 | c8ff602 | [029-fix-header-scroll-disappear](./quick/029-fix-header-scroll-disappear/) |
| 030 | Fix desktop sidebar image spot brand | 2026-02-12 | 4c99cb3 | [030-fix-desktop-sidebar-image-spot-brand](./quick/030-fix-desktop-sidebar-image-spot-brand/) |
| 031 | Fix feed card image top crop | 2026-02-12 | 8b22163 | [031-fix-feed-card-image-top-crop](./quick/031-fix-feed-card-image-top-crop/) |
| 032 | Fix activeImageSrc TDZ reference error | 2026-02-12 | f6fc515 | [032-fix-activeimagesrc-tdz-reference-error](./quick/032-fix-activeimagesrc-tdz-reference-error/) |
| 033 | Unify spot brand color animation design | 2026-02-12 | 034312f | [033-unify-spot-brand-color-animation-design](./quick/033-unify-spot-brand-color-animation-design/) |
| 034 | Remove post detail x-axis scroll | 2026-02-12 | c2265ea | [034-remove-post-detail-x-axis-scroll](./quick/034-remove-post-detail-x-axis-scroll/) |
| 035 | Replace empty main sections with mockup data | 2026-02-12 | 708cc70 | [035-replace-empty-main-sections-with-mockup](./quick/035-replace-empty-main-sections-with-mockup/) |
| 036 | Feed card subtle spot overlay | 2026-02-12 | 59834da | [036-feed-card-subtle-spot-overlay](./quick/036-feed-card-subtle-spot-overlay/) |
| 037 | Update specs/docs to match codebase | 2026-02-12 | 7594c92 | [037-update-specs-docs-to-match-codebase](./quick/037-update-specs-docs-to-match-codebase/) |

---

*Created: 2026-02-05*
*Last updated: 2026-02-19 after v3.0 roadmap creation*
