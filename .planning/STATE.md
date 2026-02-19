# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-19)

**Core value:** 완전한 사용자 경험 — 일관된 디자인 시스템과 실제 데이터
**Current focus:** v4.0 Spec Overhaul — AI-Ready Documentation

## Current Position

Phase: v4-02 Shared Foundation — In progress
Plan: 1/2 plans complete
Status: v4-02-01 complete — 3 shared reference docs created
Last activity: 2026-02-19 — Completed v4-02-01-PLAN.md (component-registry, data-models, api-contracts)

Progress: v4.0 [█░░░░░░░░░] 1/9 phases (3/13 plans complete)

## Milestone Summary

| Milestone | Phases | Plans | Status | Date |
|-----------|--------|-------|--------|------|
| v1.0 Documentation | 5 | 5 | Shipped | 2026-01-29 |
| v1.1 API Integration | 5 | 13 | Shipped | 2026-01-29 |
| v2.0 Design Overhaul | 9 | 26 | Shipped | 2026-02-05 |
| v2.1 Design System | 6 | 14 | Shipped | 2026-02-06 |
| v3.0 Admin Panel | 6 | 12 | Shipped | 2026-02-19 |
| **v4.0 Spec Overhaul** | **9** | **2/13** | **In progress** | - |

## v4.0 Roadmap

| Phase | Goal | Requirements | Plans | Status |
|-------|------|--------------|-------|--------|
| v4-01 | Archive & Foundation | ARCH-01~04 | 2/2 | Complete |
| v4-02 | Shared Foundation | SHRD-01~05 | 1/2 | In progress |
| v4-03 | Flow Documents | FLOW-01~05 | 0/1 | Not started |
| v4-04 | Screen Specs: Detail View | DETL-01~04 | 0/2 | Not started |
| v4-05 | Screen Specs: Discovery | DISC-01~04 | 0/2 | Not started |
| v4-06 | Screen Specs: Creation-AI | CREA-01~03 | 0/1 | Not started |
| v4-07 | Screen Specs: User System | USER-01~03 | 0/1 | Not started |
| v4-08 | Next Version Draft | NEXT-01~04 | 0/1 | Not started |
| v4-09 | Cleanup | CLEN-01 | 0/1 | Not started |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.

Key decisions affecting v4.0 work:

- v4.0: Documentation-only milestone — no code changes
- v4.0: Archive first, then shared foundation, then screens (strict dependency order)
- v4.0: Screen spec limit is 200 lines (300 max with justification)
- v4.0: Every component file path must be verified against actual filesystem before publishing spec
- v4.0: FLOW-05 (VTON) and NEXT-01~04 are DRAFT — pending service direction approval
- v4.0: Detail View (v4-04) precedes Discovery (v4-05) per user priority
- v4.0: Anti-features to remove from specs: i18n sections, version history tables, copied TypeScript types, placeholder sections
- v4-01-02: EARS syntax adopted as requirement format standard ("When [trigger], the system shall [behavior]")
- v4-01-02: Mobile-first ordering enforced in screen spec template (mobile wireframe primary, desktop is adaptation delta)
- v4-01-02: AI injection guide quick-reference table in README; full guide deferred to _shared/injection-guide.md (v4-02)
- v4-01-01: specs/_archive/v2.1.0/ is read-only snapshot; 60 stale paths documented in STALE-PATHS-AUDIT.md for v4-04 through v4-07 reference
- v4-01-01: grid/ThiingsGrid.tsx and lib/components/HomeClient.tsx are path renames not deletions; most unimplemented feature components (voting, comments, filter) have no filesystem counterpart
- v4-02-01: component-registry uses compact prop tables (not TS interface copies); data-models uses TypeScript code blocks as primary format — these formats are locked
- v4-02-01: API vs DB type differences documented explicitly (spots.subcategory_id→API category_id abstraction; SolutionRow has more fields than API Solution)
- v4-02-01: debug-env route exists at /api/v1/debug-env but is not env-guarded and is not user-facing

### Pending Todos

**From v2-09-03 Visual QA:**
1. Quick task: Fix images page raw JSON error exposure (API error handling - major UX/security)

**For v4.0 execution:**
1. Before v4-04: Verify `transitionStore` shape + `useFlipTransition.ts` (FLIP animation pattern underdocumented)
2. Before v4-06: Verify `requestStore` step enum values + `POST /api/v1/posts/analyze` response shape
3. Before v4-07: Verify `authStore` user/session type + auth-conditional rendering patterns

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-02-19T11:41:36Z
Stopped at: Completed v4-02-01-PLAN.md (component-registry, data-models, api-contracts)
Resume file: None

---

*Created: 2026-02-05*
*Last updated: 2026-02-19 after v4-02-01 completion*
