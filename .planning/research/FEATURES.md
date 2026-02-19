# Feature Landscape: AI-Consumable Spec System

**Domain:** Documentation system for a Next.js / React mobile-first app
**Researched:** 2026-02-19
**Confidence:** HIGH (based on direct analysis of 50+ existing spec files)

---

## Context: What the Existing System Does Well

Before categorizing, record what the existing spec system demonstrates.
The `specs/discovery/spec.md` file is the gold standard — it contains:
- Feature IDs (D-01, D-02) with priority and implementation status
- ASCII wireframes at desktop AND mobile breakpoints
- Component mapping (UI element → component name → file path)
- State transition diagrams showing Zustand store changes step-by-step
- Event flow diagrams (user action → store mutation → data fetch → render)
- Edge case tables (situation, handling, file location)

The `specs/shared/templates/screen-template.md` defines a 13-section template
that is thorough but has two structural problems: (1) it treats all sections as
equally mandatory, padding specs with boilerplate; (2) the component mapping
section references stale file paths because it is not auto-derived from code.

These observations drive the recommendations below.

---

## Table Stakes

Spec types that MUST exist for the system to function. Missing any of these
means an AI agent cannot reliably implement a feature without guessing.

### 1. Bundle Feature Spec (`spec.md`)

**What it contains:**
- Feature ID registry (D-01, V-02, C-03 format) with one-line description
- Priority (P0/P1/P2) and current implementation status (% done, blockers)
- Dependencies between features (what must exist before this can be built)
- Acceptance criteria checklist per feature (done/not-done, checkbox format)
- Data model pointers: which TypeScript interfaces and Zustand stores the feature touches
- Backend dependency flags: database tables, API endpoints required but not yet built
- "Not in scope" section — explicit list of deferred features to prevent scope creep

**Who consumes it:** AI agent (primary), human PM (secondary)

**How it connects to other spec types:**
- Every feature ID here has a corresponding `SCR-*` screen spec for visual detail
- Data model pointers link to `data-models.md`
- Backend flags link to `api-endpoints.md`

**Token estimate:** 800–2,500 tokens per bundle. The discovery `spec.md` is ~1,000
lines and costs approximately 2,200 tokens. This is acceptable because it covers
4 features; roughly 550 tokens per feature.

**Current gap:** All bundle specs exist but `creation-ai/spec.md` and
`user-system/spec.md` are nearly empty. Discovery spec is the only one with
event flow diagrams.

---

### 2. Screen Spec (`SCR-*-NN-name.md`)

**What it contains:**
- Header table: document ID, route path, date, version, status
- Desktop wireframe (ASCII, ≥768px) and mobile wireframe (<768px) — both required
- UI element table: UI_ID | type | element name | attributes/states | interaction/logic
- State table: state name | condition | UI change (loading, empty, error, end-of-list minimum)
- Data requirements: API calls with endpoint + trigger + response shape; state
  store keys with types
- Component mapping table: UI region | component name | file path (verified against
  codebase at time of writing — must be kept current)
- Error handling table: HTTP code | situation | user message | recovery action
- Implementation checklist

**Who consumes it:** AI agent (primary for implementation), human developer (review)

**How it connects:**
- References bundle `spec.md` via feature ID
- References `data-models.md` for TypeScript types
- References `CMN-*` shared component specs for header/nav/footer
- Component mapping is the primary link to actual codebase files

**Token estimate:** 600–1,800 tokens per screen. The `SCR-DISC-01-home.md` is
~290 lines = ~650 tokens. A dense detail-view screen with spots and animations
reaches ~1,400 tokens.

**Current gap:** Screen specs exist for all 4 bundles but component mapping paths
are stale (e.g., `packages/web/lib/components/HomeClient.tsx` does not exist at that
exact path — actual file is at `lib/components/HomeClient.tsx` within `packages/web`).
The stale paths are the single biggest AI-injection problem.

---

### 3. Data Models (`data-models.md`)

**What it contains:**
- TypeScript interfaces for every domain entity (Post, Image, Item, User, etc.)
- PostgreSQL schema (CREATE TABLE statements with indexes)
- Enum definitions matching both TypeScript and DB
- API response wrapper types (PaginatedResponse, ApiError)
- Zustand store interface definitions (FilterState, SearchState)
- Denormalized display types (FeedItem, DetailResponse, UiImage)

**Who consumes it:** AI agent (when writing hooks, API routes, Supabase queries)

**How it connects:**
- Referenced by every screen spec's data requirements section
- Referenced by `api-contracts.md` for request/response shapes
- Must stay synchronized with actual Supabase schema

**Token estimate:** The current `shared/data-models.md` is ~865 lines = ~1,950 tokens.
This is on the high end; it works because it covers ALL domain entities in one place,
making it a reliable single source to inject rather than hunting across files.

**Current gap:** Data models file is well-maintained. Main risk is drift from actual
Supabase schema over time.

---

### 4. API Contract Map (`api-contracts.md` or per-bundle `api-endpoints.md`)

**What it contains:**
- Screen-to-API mapping table: which screen calls which endpoints
- For each endpoint: method, path, call trigger, response shape summary
- Multi-step flow diagrams (post creation flow, solution adoption flow)
- Explicit note when endpoint is not yet implemented vs. implemented

**Who consumes it:** AI agent (when writing React Query hooks or API route handlers)

**How it connects:**
- Consumed by screen specs' data requirements sections
- Connects to `data-models.md` for response shapes
- Must reference actual `app/api/v1/` route files

**Token estimate:** 300–600 tokens per bundle. The `shared/api-contracts.md` covering
5 bundles is ~220 lines = ~500 tokens, efficient for its coverage.

**Current gap:** The shared api-contracts exists but the per-bundle `api-endpoints.md`
files (e.g., `detail-view/api-endpoints.md`) are more detailed but inconsistently
present — only detail-view and discovery have them.

---

### 5. Shared Component Specs (`CMN-*-name.md`)

**What it contains:**
- For each shared/global component (header, footer, nav, modals, toasts):
- Desktop and mobile wireframes
- UI element table (same format as screen specs)
- All auth-conditional states (logged-in vs. logged-out)
- Props interface or state management interface
- All keyboard navigation and accessibility requirements
- Exact file path to implementation

**Who consumes it:** AI agent (any feature that uses the shared component),
human developer (to avoid duplicating)

**How it connects:**
- All screen specs reference CMN specs by ID (e.g., `[CMN-01 Header]`)
- Prevents screen specs from re-specifying header layout on every page

**Token estimate:** 400–900 tokens each. CMN-01 header spec is ~375 lines = ~850 tokens.

**Current gap:** CMN-01 (header), CMN-02 (footer), CMN-03 (mobile nav), CMN-04
(toasts) exist but are not current — CMN-01 references `GlobalHeader.tsx` which
does not match the current implementation split into `desktop-header.tsx` and
`mobile-header.tsx` in `lib/design-system/`.

---

### 6. Design System Component Catalog

**What it contains:**
For each of the 35 design system components in `lib/design-system/`:
- Exact import path (`import { ProductCard } from "@/lib/design-system"`)
- Props interface (required + optional props with types)
- All variants (CVA variants with their values)
- Usage example (real TypeScript JSX, not pseudocode)
- What NOT to use it for (prevents misuse)

**Who consumes it:** AI agent (when writing feature components), human developer

**How it connects:**
- Screen specs reference design system components in component mapping tables
- Prevents AI from re-inventing components that already exist

**Token estimate:** 50–150 tokens per component. Full catalog for 35 components
= ~3,500 tokens. Better served as a structured index file that can be partially
injected: inject only the components relevant to the feature being built.

**Current gap:** This catalog does NOT exist as a spec document. The `CLAUDE.md`
has a table of components but no props, variants, or usage examples. This is a
significant gap — AI agents will hallucinate props or miss variant options.

---

### 7. UI ID Convention (`ui-id-convention.md`)

**What it contains:**
- The `TYPE-SUBTYPE-PURPOSE` naming pattern for all UI elements
- Full type taxonomy (BTN, IMG, CARD, INP, SEL, etc.)
- Examples for each type
- Banned patterns with corrections
- TypeScript constants file location

**Who consumes it:** AI agent (when writing new screen specs or tests), human spec author

**Token estimate:** ~580 tokens. Small enough to inject into context for any
spec-writing task.

**Current gap:** Document exists and is well-written. No gap here.

---

## Differentiators

Spec types that provide competitive advantage in AI-assisted development.
These are not found in most spec systems and significantly improve AI output quality.

### 8. Event Flow Diagrams

**What it contains:**
Per-feature ASCII diagrams showing:
- User action (click, scroll, input)
- Which component handles it
- Which store mutation fires
- Which React Query key is invalidated or triggered
- What Supabase/API call is made
- What the render result is
- Timing annotations (debounce ms, staleTime, gcTime)

Example pattern (exists in `discovery/spec.md` for D-01 and D-04):
```
[User scrolls near bottom]
       ↓
ThiingsGrid.tsx (IntersectionObserver fires)
       ↓
fetchNextPage() called
       ↓
React Query: queryKey ["images", "infinite", filter]
       ↓
fetchUnifiedImages({ cursor: lastCursor, limit: 50 })
       ↓
Supabase RPC → PostgreSQL
       ↓
normalizeImage() → UiImage[]
       ↓
ThiingsGrid re-renders with new cards appended
```

**Why this is a differentiator:** Event flows are the hardest thing for an AI
agent to get right without context. Without this, agents guess at store mutation
order, miss debounce requirements, and break state synchronization.

**Who consumes it:** AI agent (primary — high-value injection for implementation tasks)

**Token estimate:** 200–500 tokens per event flow. Three flows per bundle = ~600–1,500 tokens.

**Current gap:** Only `discovery/spec.md` has event flows. No other bundle has them.
These should be added to all bundles.

---

### 9. State Transition Diagrams

**What it contains:**
ASCII box-and-arrow diagrams showing Zustand store state transitions:
- Initial state (all fields set to null/default)
- Each action and the resulting state delta
- Cascading effects (e.g., `setCategory()` clears mediaId and castId)
- Navigation to earlier breadcrumb levels
- Reset behavior

Example (exists in `discovery/spec.md` for filterStore):
```
[Initial]: { category: null, mediaId: null, castId: null }
    ↓ setCategory('K-POP')
[Level 1]: { category: 'K-POP', mediaId: null, castId: null,
             breadcrumb: [{ level: 0, label: 'K-POP' }] }
    ↓ setMedia('bts-uuid')
[Level 2]: { category: 'K-POP', mediaId: 'bts-uuid', castId: null,
             breadcrumb: [{ ... 'K-POP' }, { ... 'BTS' }] }
    ↓ navigateToBreadcrumb(0)
[Level 1]: back to Level 1 (cascades clear)
```

**Why this is a differentiator:** Zustand stores with cascading side effects
(clear child selections when parent changes) are a common source of bugs.
Explicit state transition diagrams make the expected behavior unambiguous.

**Who consumes it:** AI agent (implementation), human developer (code review)

**Token estimate:** 200–400 tokens per store diagram.

**Current gap:** Only filterStore has this. authStore, searchStore, and transitionStore
should have them.

---

### 10. Responsive Behavior Matrix

**What it contains:**
Per-bundle table covering every component at each breakpoint:
- Component name
- Mobile behavior (<640px or <768px)
- Desktop behavior (>640px or >768px)
- Transition trigger (CSS breakpoint or JS `useMediaQuery` hook)
- File path

**Why this is a differentiator:** Mobile-first apps have components that radically
change behavior across breakpoints (e.g., image detail is a full-page route on mobile
but an intercepting-route modal on desktop). A matrix makes this unambiguous.
The `shared/workflows.md` has a good example for the overall app (section 3.2).

**Who consumes it:** AI agent (layout implementation), human QA

**Token estimate:** 200–500 tokens per bundle.

**Current gap:** Exists only at app level in `workflows.md`. Each bundle's screen
specs should have a condensed responsive matrix section.

---

### 11. Animation and Transition Spec

**What it contains:**
Per-screen table for screens with GSAP/Motion/Lenis animations:
- Trigger event
- Animation type and library (GSAP FLIP, Motion spring, Lenis smooth scroll)
- Duration, easing, and spring parameters
- Performance constraints (`transform`/`opacity` only, `prefers-reduced-motion` handling)
- File location of animation logic (hook or component)

**Why this is a differentiator:** Animation parameters are extremely specific.
Without this, AI agents use arbitrary values that don't match the app's motion design.
The existing screen template has a section for this (section 5) but it is marked
"if applicable" and frequently left empty.

**Who consumes it:** AI agent (animation implementation tasks)

**Token estimate:** 100–300 tokens per screen. Only needed for screens with animations,
so roughly 5–8 screens total across 4 bundles.

**Current gap:** No screen spec has this filled in with actual values. The template
has the placeholder but no content.

---

### 12. Error and Edge Case Catalog

**What it contains:**
Per-bundle table of every known edge case:
- Situation description
- How the UI should respond (which component, what state change)
- What component or file handles it
- Whether the handler is implemented or needs to be built

Example (from `discovery/spec.md`):
| Situation | Handling | File |
|-----------|----------|------|
| Images load = 0 | EmptyState component | ThiingsGrid.tsx:89 |
| Network error | ErrorBoundary + retry button | HomeClient.tsx:45 |
| Infinite scroll reaches end | "No more items" message | ThiingsGrid.tsx:134 |

**Why this is a differentiator:** Edge cases are where AI-generated code most
commonly fails silent. Explicit edge case catalogs turn vague requirements into
testable behavior.

**Who consumes it:** AI agent (implementation completeness), human QA (test writing)

**Token estimate:** 100–300 tokens per bundle.

**Current gap:** Discovery spec has edge case tables. Other bundle specs do not.

---

### 13. User Flow / Scenario Diagram

**What it contains:**
End-to-end scenario diagrams for critical user journeys (not just single-screen flows):
- Start state (e.g., user lands on home, not logged in)
- Decision branches (filter → result exists vs. empty)
- Cross-screen navigation chain with route paths
- Auth gate points (what redirects to login)
- Success/failure terminal states

The `shared/workflows.md` has a strong example at the app level.
What is missing is per-bundle scenario diagrams for the 3–4 key flows within each bundle.

**Who consumes it:** AI agent (when building navigation or redirect logic),
human PM (acceptance testing reference)

**Token estimate:** 300–600 tokens per scenario. 3 scenarios per bundle = 900–1,800 tokens.

**Current gap:** App-level flow exists. Bundle-level scenarios exist only for
discovery. No user-system, creation-ai, or detail-view bundle scenarios.

---

## Anti-Features

Spec patterns to deliberately NOT include. These actively degrade AI context quality.

### Anti-Feature 1: Section 10 — i18n Considerations

**What it is:** The screen template section 10 covers internationalization:
translated strings, character limits, RTL mirroring.

**Why to avoid:** This app is Korean-first with no active i18n plan. Including
this section in every spec document adds ~80–150 tokens of content that is
always placeholder text (`YYYY-MM-DD`, `작성자`). AI agents read it as a real
constraint and may waste generation capacity on non-existent i18n requirements.

**What to do instead:** Create a single `shared/i18n-policy.md` document that
states the current policy (Korean default, English secondary, no i18n library in
use). Reference it once from the shared README. Remove from screen template.

---

### Anti-Feature 2: Exhaustive Implementation Checklist

**What it is:** Section 13 of the screen template is a 10-item checklist
(UI layout, interactions, API wiring, error handling, responsive, animation,
performance, accessibility, i18n, unit test, E2E test).

**Why to avoid:** For AI context injection, a generic checklist adds ~100 tokens
with zero decision-relevant content. Every item is "yes, do this" without specifics.
Worse, it trains the AI to think "I completed the checklist" rather than "I satisfied
the specific acceptance criteria defined in the feature spec."

**What to do instead:** Remove the generic checklist. Move acceptance criteria
to the feature spec (`spec.md`) where they are specific and checkable. The screen
spec should only contain a short "implementation status" note: percentage done,
known blockers, what was last changed.

---

### Anti-Feature 3: Version History Table in Every File

**What it is:** Every spec file ends with a version history table:
`v1.0 | YYYY-MM-DD | 작성자 | 초기 작성`.

**Why to avoid:** Version history in spec documents is nearly always either
empty (always shows v1.0 initial) or wrong (people forget to update it).
Git history serves this purpose. In AI context, a stale version table costs
~80–120 tokens and may actively mislead — an agent that sees "v1.0, 2026-01-14"
on a spec with wrong file paths has no signal that the paths are stale.

**What to do instead:** Remove version history tables entirely from spec documents.
Add a single `**Last verified against codebase:** YYYY-MM-DD` line at the top
of each spec. This single field is the only staleness signal that matters.

---

### Anti-Feature 4: Redundant Sections Across Screen and Bundle Specs

**What it is:** Both `spec.md` and `SCR-*.md` sometimes document the same
TypeScript interfaces, store shapes, and API endpoints.

**Why to avoid:** Duplication means they diverge. When an AI injects both
`spec.md` and `SCR-DISC-01.md` into context, it may encounter two versions of
`FilterState` interface and generate code that satisfies neither.

**What to do instead:** Canonical location rule:
- TypeScript interfaces → `shared/data-models.md` only
- Store shape definitions → `shared/data-models.md` only
- API endpoint contracts → `shared/api-contracts.md` or bundle `api-endpoints.md` only
- Screen specs reference by ID, never repeat the full definition

---

### Anti-Feature 5: Sections on Features Not Yet Designed

**What it is:** Some specs contain placeholder sections for features that
are explicitly "not yet designed" or "post-MVP." Example: `system-backend/spec.md`
has S-01 through S-08 but most are one-line placeholders.

**Why to avoid:** An AI agent that reads a placeholder section (with no content
beyond a feature ID) treats it as designed intent. It may attempt to implement
based on the feature ID alone, guessing the requirements.

**What to do instead:** Do not include feature sections in a spec until they have:
(1) acceptance criteria, (2) at least one wireframe, (3) a data model reference.
Undesigned features belong only in a roadmap or backlog document, not in spec files.

---

### Anti-Feature 6: Overly Detailed Performance Sections for Simple Screens

**What it is:** The screen template's section 7 (Performance Optimization) lists
virtualization, lazy loading, memoization, and debounce for every screen.

**Why to avoid:** A login screen does not need a virtualization strategy.
A settings page does not need IntersectionObserver configuration. Applying the
full section to simple screens adds ~100 tokens of irrelevant content and may
cause an AI agent to over-engineer the implementation.

**What to do instead:** The performance section is optional (the template marks it
"if applicable") — enforce this. Apply it ONLY to screens with infinite scrolling,
large image grids, or complex animations. Specifically: home feed, explore grid,
image detail (GSAP animations). Omit from: login, profile settings, upload, earnings.

---

## Feature Dependencies

```
data-models.md
    └── referenced by: all screen specs, api-contracts.md, bundle spec.md

bundle spec.md (discovery/spec.md, etc.)
    └── defines: feature IDs
    └── referenced by: all screens in bundle (via feature ID in header)
    └── references: data-models.md, api-contracts.md

SCR-*-NN-name.md
    └── references: CMN-* specs (header, footer, nav)
    └── references: feature ID in bundle spec.md
    └── references: data-models.md (data types section)
    └── references: api-contracts.md (API calls section)

CMN-*.md (shared components)
    └── referenced by: every screen spec that uses the component
    └── references: design system catalog (for component file paths)

design-system catalog (NEW - does not exist yet)
    └── referenced by: screen specs (component mapping section)
    └── referenced by: CMN-* specs
    └── source: lib/design-system/index.ts

ui-id-convention.md
    └── referenced by: all spec authors when creating new screen specs

workflows.md (user flows)
    └── references: screen specs by route path
    └── referenced by: none (standalone reference document)

event-flow diagrams (currently embedded in bundle spec.md)
    └── references: store interfaces from data-models.md
    └── references: component file paths (must be verified)
    └── referenced by: AI agent during implementation
```

---

## MVP Recommendation

For the spec overhaul milestone, prioritize in this order:

**Phase 1 — Fix correctness (highest AI value, low token cost):**
1. Update all component mapping file paths in existing screen specs to match actual codebase
2. Add `**Last verified:** YYYY-MM-DD` header to all spec files
3. Remove version history tables and i18n sections from all specs
4. Canonicalize: move any TypeScript interfaces embedded in screen specs to `data-models.md`

**Phase 2 — Fill the critical gap (creates the single biggest missing piece):**
5. Create design system component catalog (`shared/components/design-system-catalog.md`)
   with props, variants, usage examples for all 35 components in `lib/design-system/`

**Phase 3 — Add differentiators to incomplete bundles:**
6. Add event flow diagrams to `creation-ai/spec.md` and `user-system/spec.md`
7. Add state transition diagrams for `authStore` and `searchStore`
8. Add responsive behavior matrices to screen specs for the 4 main bundles

**Defer to post-MVP:**
- Animation/transition spec sections (valuable but all 4 bundles must have basic
  spec correctness first)
- Bundle-level user scenario diagrams (the app-level diagram in `workflows.md` is
  sufficient for most tasks)
- Edge case catalog for user-system and creation-ai bundles

---

## Sources

- Direct analysis: `/Users/kiyeol/development/decoded/decoded-app/specs/` (50+ files)
- Direct analysis: `/Users/kiyeol/development/decoded/decoded-app/packages/web/lib/design-system/` (35 components)
- Direct analysis: `/Users/kiyeol/development/decoded/decoded-app/packages/web/lib/components/` (actual file structure)
- Direct analysis: `/Users/kiyeol/development/decoded/decoded-app/packages/web/lib/hooks/` (20 custom hooks)
- Reference: `specs/discovery/spec.md` as gold-standard example (HIGH confidence — examined in full)
- Reference: `specs/shared/templates/screen-template.md` as baseline template (HIGH confidence)
- Reference: `specs/shared/data-models.md` for domain type coverage (HIGH confidence)
- Reference: `specs/shared/workflows.md` for flow diagram patterns (HIGH confidence)
- Reference: `CLAUDE.md` (project-level) for confirmed tech stack and component list (HIGH confidence)
