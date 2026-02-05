# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-29)

**Core value:** 완전한 사용자 경험 — 모든 페이지가 실제 데이터로 동작
**Current focus:** v2.0 Design Overhaul

## Current Position

**Active Milestones:**
- **v2.0 Design Overhaul** - Phase v2-09 IN PROGRESS (1/3 plans done)

**v1.1 Status:** SHIPPED (2026-01-29) - All 4 tracks merged to main
**v2.0 Status:** Phase v2-09 IN PROGRESS (1/3 plans done)
**Last activity:** 2026-02-05 - Completed v2-09-01-PLAN.md (Design System Documentation)

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
   ├─ v2-Phase 3: Card Components ─── COMPLETE ✓
   │
   ├─ v2-Phase 4: Desktop Infrastructure ─── COMPLETE ✓
   │
   ├─ v2-Phase 5: Home & Explore Pages ─── COMPLETE ✓
   │
   ├─ v2-Phase 6: Feed & Profile Pages ─── COMPLETE ✓
   │
   ├─ v2-Phase 7: Search & Image Detail ─── COMPLETE ✓
   │
   ├─ v2-Phase 8: Request Flow & Login ─── COMPLETE ✓
   │
   └─ v2-Phase 9: Documentation & Polish ─── IN PROGRESS
       ├─ 01: Design System Docs ─── COMPLETE ✓
       ├─ 02: Project Docs Update ─── NOT STARTED
       └─ 03: Final Polish ─── NOT STARTED
```

**v1.1 Progress:** ██████████ (100% - SHIPPED)
**v2.0 Progress:** █████████░ (93% - 25 of 27 plans complete)

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
| v2-4: Desktop Infrastructure | 3/3 | **Complete** (v2-04-01, v2-04-02, v2-04-03 done) |
| v2-5: Home & Explore Pages | 3/3 | **Complete** (v2-05-01, v2-05-02, v2-05-03 done) |
| v2-6: Feed & Profile Pages | 3/3 | **Complete** (v2-06-01, v2-06-02, v2-06-03 done) |
| v2-7: Search & Image Detail | 3/3 | **Complete** (v2-07-01, v2-07-02, v2-07-03 done) |
| v2-8: Request Flow & Login | 3/3 | **Complete** (v2-08-01, v2-08-02, v2-08-03 done) |
| v2-9: Documentation & Polish | 1/3 | **In Progress** (v2-09-01 done) |

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
- **Desktop Header Pattern (v2-04-01):** Replace sidebar navigation with top header (64px) for modern UX, more screen space for content
- **Separate Header Components (v2-04-01):** Desktop (DesktopHeader, md+) and mobile (MobileHeader, <md) as distinct components for clean separation
- **Header Height Tokens (v2-04-01):** Desktop 64px, Mobile 56px from decoded.pen design system
- **Footer Logo Approach (v2-04-02):** Use simple text logo (font-mono) in footer instead of complex 3D ASCII logo
- **Selective Mobile Accordion (v2-04-02):** Only Company and Support sections collapse on mobile, Brand and Connect always visible
- **Flex Column Layout (v2-04-03):** Wrap layout in flex column container with mt-auto footer for proper bottom positioning
- **Sidebar Preservation (v2-04-03):** Keep deprecated Sidebar file for reference during transition, safe to delete after v2.0 launch
- **Header Padding Strategy (v2-04-03):** Desktop 64px top (pt-16), Mobile 56px top + 56px bottom (pt-14 pb-14)
- **Filter State Management (v2-05-02):** Extended FilterKey type to include fashion/beauty/lifestyle/accessories categories for explore page filtering
- **Filter Animation Pattern (v2-05-02):** Use AnimatePresence with mode="wait" for filter changes to create smooth 0.2s fade transitions
- **Explore Layout Structure (v2-05-02):** Flex column layout with header/filter in flex-shrink-0 and grid in flex-1 for proper height allocation
- **SectionHeader Typography (v2-05-01):** Use design-system Heading variant="h2" for titles, Text variant="small" for subtitles
- **Section Wrapper Pattern (v2-05-01):** py-10 md:py-16, px-4 md:px-6 lg:px-8, max-w-7xl mx-auto for all sections
- **Alternating Backgrounds (v2-05-01):** card/background pattern for visual section separation on Home page
- **Reduced DecodedPickSection Padding (v2-05-01):** Changed from py-20 md:py-32 to py-10 md:py-16 for consistency
- **Card Component Integration (v2-05-03):** All Home and Explore page cards use design-system Card components for consistent styling
- **Dedicated Cell Components (v2-05-03):** Extract grid cells into dedicated components (ExploreCardCell pattern) for reusability
- **FLIP with Custom Wrappers (v2-05-03):** Wrap Card in Link when FLIP animation control needed, use Card's built-in link prop otherwise
- **Feed Header Desktop-Only (v2-06-01):** Feed header hidden on mobile for space efficiency (hidden md:block pattern)
- **Grid Layout Responsive (v2-06-01):** Responsive grid layout (1/2/3 columns) for feed cards following decoded.pen design
- **Source Badge Gradient (v2-06-01):** Instagram/TikTok source badges with platform-specific gradients for brand recognition
- **Relative Time Format (v2-06-01):** Relative time format (1m, 2h, 3d) matching social media conventions
- **Profile Stats Integration (v2-06-02):** Stats integrated into ProfileHeaderCard on desktop, separate StatsCards on mobile for optimal UX
- **Mobile Profile Header (v2-06-02):** Custom sticky header with back button, title, settings for profile-specific actions
- **Badge Locked State Prep (v2-06-02):** Badge styling ready for locked state (secondary bg, lock icon) pending API data
- **Desktop Profile Layout (v2-06-02):** 2-column layout (320px profile + flex activity) via ProfileDesktopLayout component
- **Activity Tab Navigation (v2-06-03):** 4 tabs (posts, spots, solutions, saved) with border-bottom underline indicator
- **Tab Transition Pattern (v2-06-03):** AnimatePresence mode="wait" with 0.2s fade for smooth content switching
- **Empty State Structure (v2-06-03):** Icon circle + message + CTA button with tab-specific configurations
- **Engagement Overlay (v2-06-03):** Like, comment, share buttons in FeedCard bottom gradient with scale animations
- **Like Animation Pattern (v2-06-03):** scale-110 + primary color fill on active state for visual feedback
- **Share Strategy (v2-06-03):** navigator.share API on mobile, clipboard copy on desktop as fallback
- **Search Overlay Slide Direction (v2-07-01):** Slide from top instead of bottom for iOS Safari keyboard compatibility
- **Tab Underline Animation (v2-07-01):** Motion layoutId with spring animation (stiffness 500, damping 30) for smooth tab transitions
- **Tab Count Format (v2-07-01):** Inline "Label (count)" format instead of separate badge for cleaner visual hierarchy
- **Recent Searches Limit (v2-07-01):** Default max 8 items, configurable via prop, with individual/bulk clear operations
- **Mobile Hero Height (v2-07-02):** Fixed 426px per decoded.pen spec, desktop 60vh max 600px for balanced proportions
- **Parallax Ratio (v2-07-02):** Image moves 100px over hero height for subtle depth effect (ratio ~0.3)
- **Title Fade Timing (v2-07-02):** Fade completes at 30% scroll for smooth transition before user scrolls past hero
- **Lightbox z-index (v2-07-02):** z-[60] to stack above header (z-50), z-[70] for close button
- **Simple Zoom Pattern (v2-07-02):** Toggle between scale 1 and 1.5 instead of complex zoom library for MVP
- **Shop Grid Spotted First (v2-07-03):** Prioritize spotted items (with normalizedCenter) before suggested items in shop carousel
- **Shop Grid Responsive Layout (v2-07-03):** Mobile carousel with snap points, desktop 3-4 column grid for optimal browsing
- **Related Images Gallery Title (v2-07-03):** "More from this look" with subtitle "From @account" more engaging than generic title
- **Search Page Overlay Pattern (v2-07-03):** Full-screen fixed overlay (inset-0 z-50) with router.back() for consistent mobile/desktop UX
- **Search Grid Layouts (v2-07-03):** Grid layouts for all tabs (People: 1-2 col, Media: 2-4 col, Items: 3-6 col) for uniform browsing
- **3-Step Request Flow (v2-08-01):** Consolidated 4-step flow to 3 steps (Upload, Detect, Details) by merging Submit into Details
- **StepIndicator Simplification (v2-08-01):** Remove connecting lines, fixed 8px dots with 8px gap, Primary color for active/completed
- **RequestFlowHeader Layout (v2-08-01):** 56px height with centered StepIndicator, no title text
- **DropZone Design Tokens (v2-08-01):** Use design system tokens (border-border, bg-muted), Upload icon instead of Camera
- **Step Transition Pattern (v2-08-02):** Direction-aware slide animations (forward: right-to-left, backward: left-to-right) with 0.2s ease-out
- **Direction Tracking (v2-08-02):** Use useRef to track previous step for direction calculation without triggering re-renders
- **AnimatePresence mode="wait" (v2-08-02):** Prevent content overlap during transitions, old content exits before new enters
- **Google-Only OAuth (v2-08-03):** Simplified Login to single Google button for v2.0 launch, Kakao/Apple deferred
- **OAuth Button Dimensions (v2-08-03):** 320px width, 52px height, 12px border-radius per decoded.pen spec
- **Unified Tokens Documentation (v2-09-01):** Single tokens.md file consolidates all token types for easier navigation than separate files
- **Component Docs Per Category (v2-09-01):** Group related components (typography, inputs, cards, headers) instead of one file per component
- **Korean Documentation Language (v2-09-01):** All design system documentation in Korean for team's primary language comprehension
- **Anti-Pattern Documentation (v2-09-01):** Include "Correct vs Incorrect" examples in patterns.md to prevent common mistakes
- **Design System Import Pattern (v2-09-02):** Use single barrel export from @/lib/design-system for all design system imports
- **Consistent Documentation Dates (v2-09-02):** Update all codebase analysis dates to 2026-02-05 for freshness clarity

### Open Items
- v2 deferred: Admin dashboard, real-time notifications

### Tech Debt
- Supabase direct queries -> REST API migration (some pages)

### Backend API Reference
- OpenAPI: https://dev.decoded.style/api-docs/openapi.json
- Base URL: https://dev.decoded.style/api/v1

## Session Continuity

**Last session:** 2026-02-05
**Stopped at:** Completed quick task 014 (Fix upload 502 error handling)
**Resume file:** None

**Next Steps:**

```bash
# Phase v2-09: Documentation & Polish - IN PROGRESS (1/3 done)
git checkout feature/v2-design-overhaul  # 현재 브랜치
/gsd:plan-phase v2-09  # Next: Plan remaining phase tasks (v2-09-02, v2-09-03)
# Or view completed design system docs
open docs/design-system/README.md  # View updated v2.0 documentation
```

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 001 | Fix header and mobile nav design to match decoded.pen | 2026-01-29 | 76f9be1 | [001-fix-header-mobile-nav-design](./quick/001-fix-header-mobile-nav-design/) |
| 002 | Add optional description field with AI metadata extraction to post creation | 2026-02-05 | e66645a | [002-post-optional-fields-media-metadata](./quick/002-post-optional-fields-media-metadata/) |
| 003 | Explore 페이지 things 그리드 + footer 제거 | 2026-02-05 | c19e536 | [003-explore-things-grid-no-footer](./quick/003-explore-things-grid-no-footer/) |
| 004 | Fix feed page footer overlap and responsive grid | 2026-02-05 | 960d37d | [004-fix-feed-page-footer-overlap-responsive-grid](./quick/004-fix-feed-page-footer-overlap-responsive-grid/) |
| 005 | Fix explore page ThiingsGrid not visible | 2026-02-05 | e95ce37 | [005-fix-explore-page-things-grid-not-visible](./quick/005-fix-explore-page-things-grid-not-visible/) |
| 006 | Desktop request page modal (intercepting routes) | 2026-02-05 | ab7c9c1 | [006-desktop-request-page-modal](./quick/006-desktop-request-page-modal/) |
| 007 | Fix explore page "Failed to load images" error | 2026-02-05 | 6cc6cb2 | [007-fix-explore-page-failed-to-load-images-e](./quick/007-fix-explore-page-failed-to-load-images-e/) |
| 008 | Feed 페이지 Supabase → REST API 마이그레이션 | 2026-02-05 | 5467cf2 | [008-fix-feed-page-use-api-instead-of-sup](./quick/008-fix-feed-page-use-api-instead-of-sup/) |
| 009 | Request 모달 이미지 크기 확대 | 2026-02-05 | 04b5c4f | [009-fix-request-modal-image-not-filling-screen](./quick/009-fix-request-modal-image-not-filling-screen/) |
| 010 | Request 이미지 업로드 API 사용 (Supabase Storage 대체) | 2026-02-05 | 1b23b3c | [010-fix-request-use-api-instead-of-sup](./quick/010-fix-request-use-api-instead-of-sup/) |
| 011 | Desktop header avatar links to /profile | 2026-02-05 | af8a5f2 | [011-header-avatar-profile-link](./quick/011-header-avatar-profile-link/) |
| 012 | Profile 페이지 REST API 연결 | 2026-02-05 | 867bf97 | [012-profile-page-api-connection](./quick/012-profile-page-api-connection/) |
| 013 | Fix request page excessive re-renders | 2026-02-05 | a591e1e | [013-fix-request-page-excessive-rerenders](./quick/013-fix-request-page-excessive-rerenders/) |
| 014 | Fix upload 502 error handling with retry | 2026-02-05 | 49c288b | [014-fix-upload-502-error-handling](./quick/014-fix-upload-502-error-handling/) |
| 015 | Pencil Screen UI Skill 생성 | 2026-02-05 | TBD | [015-pencil-screen-ui-skill](./quick/015-pencil-screen-ui-skill/) |

---

*Last updated: 2026-02-05 after quick task 015*
