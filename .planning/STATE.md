# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-19)

**Core value:** 완전한 사용자 경험 — 일관된 디자인 시스템과 실제 데이터
**Current focus:** v4.0 Spec Overhaul — AI-Ready Documentation

## Current Position

Phase: v4-07 Screen Specs: User System — Complete
Plan: 1/1 plans complete
Status: v4-07-01 complete — all 3 User System screen specs written (SCR-USER-01 through SCR-USER-03)
Last activity: 2026-02-20 — Completed v4-07-01-PLAN.md (SCR-USER-01 Login, SCR-USER-02 Profile, SCR-USER-03 Earnings)

Progress: v4.0 [███████░░░] 7/9 phases (11/13 plans complete)

## Milestone Summary

| Milestone | Phases | Plans | Status | Date |
|-----------|--------|-------|--------|------|
| v1.0 Documentation | 5 | 5 | Shipped | 2026-01-29 |
| v1.1 API Integration | 5 | 13 | Shipped | 2026-01-29 |
| v2.0 Design Overhaul | 9 | 26 | Shipped | 2026-02-05 |
| v2.1 Design System | 6 | 14 | Shipped | 2026-02-06 |
| v3.0 Admin Panel | 6 | 12 | Shipped | 2026-02-19 |
| **v4.0 Spec Overhaul** | **9** | **10/13** | **In progress** | - |

## v4.0 Roadmap

| Phase | Goal | Requirements | Plans | Status |
|-------|------|--------------|-------|--------|
| v4-01 | Archive & Foundation | ARCH-01~04 | 2/2 | Complete |
| v4-02 | Shared Foundation | SHRD-01~05 | 2/2 | Complete |
| v4-03 | Flow Documents | FLOW-01~05 | 1/1 | Complete |
| v4-04 | Screen Specs: Detail View | DETL-01~04 | 2/2 | Complete |
| v4-05 | Screen Specs: Discovery | DISC-01~04 | 2/2 | Complete |
| v4-06 | Screen Specs: Creation-AI | CREA-01~03 | 1/1 | Complete |
| v4-07 | Screen Specs: User System | USER-01~03 | 1/1 | Complete |
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
- v4-02-02: searchStore and filterStore documented from packages/shared/stores/ (source of truth); web stubs are re-export only
- v4-02-02: CMN specs fully rewritten (not appended) to comply with v4.0 spec rules — 693 lines removed across 3 files
- v4-02-02: injection-guide.md is single source of truth for AI context loading; README links to it (not duplicated)
- v4-03-01: Flow diagram type chosen per flow nature — flowchart for navigation-heavy (FLW-01/03), stateDiagram for interaction-state-heavy (FLW-02/04)
- v4-03-01: Transition tables use 5 columns (From | Trigger | To | Store Changes | Data Fetched) — established as flow format standard
- v4-03-01: FLW-02 framed as interaction-state flow within a single page (not route navigation sequence)
- v4-04-01: /images/[id] server-redirects to /posts/[id] — ImageDetailPage component only serves intercepted parallel modal route (@modal/(.)images/[id])
- v4-04-01: PostDetailContent uses inline spot dot markers (animate-ping), not DS Hotspot — DS Hotspot is used only in ImageCanvas (legacy image flow); Hotspot→BottomSheet panel for post flow is ⚠️ NOT-IMPL
- v4-04-01: transitionStore.selectedId tracks the image being FLIP-transitioned (not per-spot selection); per-spot state is local activeIndex in InteractiveShowcase
- v4-04-01: useSpotCardSync is for request/detect flow only (takes DetectedSpot from requestStore); not used in detail view components
- v4-04-02: Affiliate URL delivery is pre-stored in SolutionRow.affiliate_url at solution-creation time; useConvertAffiliate hook exists but is NOT called at tap time in current UI — runtime conversion is NOT-IMPL
- v4-04-02: ItemVoting is a UI-only stub (itemId prop unused, hardcoded counts 24/3, no API persistence); VoteButton/VotingSection components do not exist on filesystem
- v4-04-02: Related content recommendation is artist-based only (useInfinitePosts artistName filter); no ML/category/tag-based recommendation logic exists
- v4-04-02: SmartTagsBreadcrumb is purely presentational (tags passed as props, no data fetching, no filtering query triggered on tag tap)
- v4-04-02: CommentSection lives in shared/ with MOCK_COMMENTS; detail-specific CommentForm/Item/List/Section components confirmed missing
- v4-05-01: HomeClient.tsx at app/HomeClient.tsx is a legacy vertical-feed component NOT used by the current home page; HomeAnimatedContent (lib/components/main/HomeAnimatedContent.tsx) is the actual client entry point for the SSR home page
- v4-05-01: Search is a full-screen page route (/search), not a modal — SearchPageClient renders fixed inset-0 z-50 within the page
- v4-05-01: Search tabs are All/People/Media/Items (actual implementation); useGroupedSearch enabled guard is debouncedQuery.length >= 2
- v4-05-02: FeedCard in components/ (not DS FeedCardBase) is the actual feed card — wraps DS FeedCard and adds GSAP FLIP + social metadata (useSpots, AccountAvatar, FollowButton)
- v4-05-02: ExploreClient does NOT render ExploreHeader or CategoryFilter — those components exist but are not rendered by the current page orchestrator
- v4-05-02: hierarchicalFilterStore selections (category/media/cast/context) are NOT passed to useInfinitePosts — ExploreClient reads only filterStore.activeFilter; the two filter systems are disconnected
- v4-05-02: ThiingsGrid is a physics-based spiral canvas (not CSS columns) — cell sizes are fixed px (mobile 180x225, desktop 400x500), not responsive columns
- v4-05-02: FeedTabs (Following/ForYou/Trending) are UI-only — all tabs fetch identical data (sort:recent); per-tab filtering is NOT-IMPL
- v4-05-02: ExploreSortControls (Trending/Recent/Popular) is UI-only — sort selection not passed to useInfinitePosts
- v4-06-01: /request/upload is a COMBINED single-page flow (upload + spot tap + solution + submit) — does NOT navigate to /request/detect
- v4-06-01: /request/detect is a separate alternative path, not triggered from upload page in current code
- v4-06-01: autoUpload=false and autoAnalyze=false on upload page — user manually taps spots on local preview (no server upload until Post tapped)
- v4-06-01: media_source is hardcoded to {type:"youtube",title:"User Upload"} — DetailsStep/ArtistInput/ContextSelector/MediaSourceInput exist on filesystem but are NOT rendered
- v4-06-01: isSubmitting is local useState in upload page component, NOT stored in requestStore
- v4-06-01: DetectionToolbar (Select/Draw/Zoom) is UI-ONLY — tool state not connected to any behavior
- v4-06-01: COMPRESSION_CONFIG: maxSizeMB=2, maxWidthOrHeight=1920, initialQuality=0.85, useWebWorker=true
- v4-07-01: Middleware only protects /admin/:path* — /login and /profile have no route-level auth guard
- v4-07-01: Profile auth is API-response-driven: useMe() error → ProfileError component, not redirect to /login
- v4-07-01: selectIsAuthenticated (!!user || isGuest) vs selectIsLoggedIn (!!user) — key distinction for browse vs account-required features
- v4-07-01: StatsCards renders 3 cards (Posts/Solutions/Points), not 4 — both Posts and Points cards trigger alert (NOT-IMPL)
- v4-07-01: isEditModalOpen and activeTab are local useState in ProfileClient — NOT in profileStore; profileStore only holds badgeModalMode + selectedBadge

### Pending Todos

**From v2-09-03 Visual QA:**
1. Quick task: Fix images page raw JSON error exposure (API error handling - major UX/security)

**For v4.0 execution:**
1. ~~Before v4-04: Verify `transitionStore` shape + `useFlipTransition.ts`~~ — DONE in v4-04-01
2. ~~Before v4-06: Verify `requestStore` step enum values + `POST /api/v1/posts/analyze` response shape~~ — DONE in v4-06-01
3. ~~Before v4-07: Verify `authStore` user/session type + auth-conditional rendering patterns~~ — DONE in v4-07-01

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-02-20T00:22Z
Stopped at: Completed v4-07-01-PLAN.md (SCR-USER-01 Login, SCR-USER-02 Profile, SCR-USER-03 Earnings)
Resume file: None

---

*Created: 2026-02-05*
*Last updated: 2026-02-20 after v4-07-01 completion*
