# Architecture Patterns: AI-Ready Spec Documentation System

**Domain:** Spec/docs architecture for selective AI agent context injection
**Researched:** 2026-02-19
**Mode:** Architecture dimension of project research

---

## Problem Statement

The current `specs/` + `docs/` system suffers from four compounding failures when used with AI agents:

1. **Monolith injection anti-pattern.** Agents either get the whole `specs/` directory (too much, wastes context) or a single screen file (too little, misses shared context).
2. **Stale code paths.** Component file paths reference pre-v2.0 structure (`packages/web/lib/components/Header.tsx` instead of the correct current path).
3. **Uneven depth.** `discovery/spec.md` is 1,000+ lines of detailed state diagrams. `admin/spec.md` has 3 bullet points. Agents get inconsistent signal.
4. **No injection protocol.** There is no documented standard for "when you need to work on screen X, inject these 3 files."

---

## Recommended Architecture

### Core Principle: Layered Context with Explicit Injection Points

The new system must support **three injection layers**:

```
Layer 1: Always-loaded (CLAUDE.md style)
  → Project-wide conventions, design tokens, store names
  → Already exists in CLAUDE.md — keep it lean

Layer 2: Task-scoped injection (on-demand)
  → Screen spec + its component map
  → Flow spec (if the task spans multiple screens)
  → Relevant shared contracts (data models, API)

Layer 3: Deep-dive references (agent fetches when needed)
  → Full API doc for one endpoint
  → Design system token reference
  → Database schema for one table
```

Agents receive Layer 1 always. When assigned a task, they receive relevant Layer 2 files. Layer 3 is referenced by path and fetched on demand.

---

## Proposed Directory Structure

```
specs/
├── _archive/                     # Versioned snapshots (read-only)
│   └── v2.1.0/                   # Current state, frozen before rewrite
│       └── ... (existing structure copied verbatim)
│
├── _shared/                      # Cross-cutting, injected selectively
│   ├── data-models.md            # TypeScript interfaces (source of truth)
│   ├── api-contracts.md          # Endpoint signatures + response shapes
│   ├── design-tokens.md          # Token → Tailwind class mapping
│   ├── store-map.md              # Zustand stores: name, file path, key fields
│   ├── component-registry.md     # Design system components: name → file path
│   └── injection-guide.md        # HOW TO: which files to inject for each task type
│
├── flows/                         # User journey documents (multi-screen)
│   ├── FLW-01-discovery.md       # Home → Filter → Image Detail
│   ├── FLW-02-creation.md        # Upload → AI Detect → Tag → Spot → Publish
│   ├── FLW-03-user-system.md     # Landing → Login → Profile → Settings
│   └── FLW-04-search.md          # Search entry → Results → Detail
│
├── screens/                       # One file per screen (the atomic unit)
│   ├── discovery/
│   │   ├── SCR-DISC-01-home.md
│   │   ├── SCR-DISC-02-filter.md
│   │   ├── SCR-DISC-03-search.md
│   │   └── SCR-DISC-04-gallery.md
│   ├── detail/
│   │   ├── SCR-VIEW-01-image-detail.md
│   │   ├── SCR-VIEW-02-spots.md
│   │   ├── SCR-VIEW-03-items.md
│   │   └── SCR-VIEW-04-related.md
│   ├── creation/
│   │   ├── SCR-CREA-01-upload.md
│   │   ├── SCR-CREA-02-detect.md
│   │   └── SCR-CREA-03-edit.md
│   ├── user/
│   │   ├── SCR-USER-01-login.md
│   │   ├── SCR-USER-02-profile.md
│   │   ├── SCR-USER-03-activity.md
│   │   ├── SCR-USER-04-earnings.md
│   │   └── SCR-USER-05-settings.md
│   └── shared/
│       ├── CMN-01-header.md
│       ├── CMN-02-footer.md
│       ├── CMN-03-mobile-nav.md
│       └── CMN-04-bottom-sheet.md
│
└── README.md                      # Index + injection guide summary
```

**What changed from current structure:**

| Old | New | Reason |
|-----|-----|--------|
| `specs/[bundle]/spec.md` (monolith) | `flows/FLW-*.md` (journey) | Separates navigation flow from screen detail |
| `specs/[bundle]/screens/` | `specs/screens/[domain]/` | Flat per-domain grouping, easier glob patterns |
| `specs/shared/` (mixed content) | `specs/_shared/` (underscore = metadata) | Convention: underscore folders are not feature screens |
| No version management | `specs/_archive/v2.1.0/` | Frozen snapshot before rewrite |
| No injection protocol | `_shared/injection-guide.md` | Explicit protocol for which files to load |

---

## Screen File Format (Canonical Template)

Each screen file (`SCR-*.md`) must answer exactly what an AI agent needs to implement or modify it — no more, no less.

```markdown
# [SCR-ID] Screen Name

## Context

| Field | Value |
|-------|-------|
| Route | `/path/to/route` |
| Flow | [FLW-01](../../flows/FLW-01-discovery.md) — step 3 of 5 |
| Status | draft / implemented / needs-update |
| Updated | YYYY-MM-DD |

## Purpose

One sentence: what user problem does this screen solve.

## Mobile Layout (Primary)

ASCII wireframe of the <640px layout.

```
┌────────────────────────────────┐
│ [CMN-01 MobileHeader]          │
├────────────────────────────────┤
│                                │
│  [component rendering here]    │
│                                │
└────────────────────────────────┘
```

## Desktop Variations

Only document where desktop *differs* from mobile. Use a diff table:

| Element | Mobile (<640px) | Desktop (≥768px) |
|---------|-----------------|-----------------|
| Grid | 2 columns | 4-6 columns (masonry) |
| Detail view | Full page `/images/[id]` | Modal overlay `/@modal/(.)images/[id]` |
| Filter UI | Bottom sheet | Top filter bar |

## Component Map

The critical section for AI agents. Maps wireframe regions to actual code.

| Region | Component | File Path | Notes |
|--------|-----------|-----------|-------|
| Grid | `ThiingsGrid` | `packages/web/lib/components/ThiingsGrid.tsx` | |
| Card | `CardCell` | `packages/web/lib/components/CardCell.tsx` | onClick → FLIP transition |
| Header | `MobileHeader` | `packages/web/lib/design-system/mobile-header.tsx` | |

## State

| Store | Key | Type | Purpose |
|-------|-----|------|---------|
| `filterStore` | `activeFilter` | `string \| null` | Active category filter |
| React Query | `["images", "infinite", filter]` | `InfiniteData<ImagePage>` | Paginated images |

## Data Requirements

| API | Method | Endpoint | Trigger |
|-----|--------|----------|---------|
| Image list | GET | `fetchUnifiedImages()` via Supabase RPC | Page load, filter change |

## Key Interactions

Only the non-obvious ones. Skip "button shows text" level detail.

- Card click: saves DOM rect to `transitionStore`, navigates, triggers GSAP FLIP
- Scroll to bottom 50px: triggers `fetchNextPage()` via IntersectionObserver

## States

| State | Condition | UI |
|-------|-----------|-----|
| Loading | First load | 12 skeleton cards (shimmer) |
| Loaded | Data ready | Card grid with FLIP animation |
| Empty | No results | `EmptyState` component |
| Error | API failure | Error message + retry button |

## Cross-References

Related specs to inject together:
- [_shared/store-map.md](../../_shared/store-map.md) — filterStore, searchStore
- [_shared/data-models.md](../../_shared/data-models.md) — UiImage type
- [CMN-01-header.md](../shared/CMN-01-header.md) — shared header component
```

**Critical rule:** No screen file exceeds 300 lines. If it would exceed 300 lines, the screen is doing too much — split it.

---

## Flow File Format

Flow files (`FLW-*.md`) document multi-screen user journeys. They are not screen specs — they are navigation contracts.

```markdown
# [FLW-ID] Flow Name

## Journey

User goal: [one sentence user intent]

## Screen Sequence

| Step | Screen | Entry Trigger | Exit Trigger | Notes |
|------|--------|---------------|--------------|-------|
| 1 | [SCR-DISC-01-home.md](../screens/discovery/SCR-DISC-01-home.md) | App load | Card click | Infinite scroll |
| 2 | [SCR-VIEW-01-image-detail.md](../screens/detail/SCR-VIEW-01-image-detail.md) | Card click | Back/close | FLIP animation |

## State Carried Between Screens

| State | Source Screen | Target Screen | Mechanism |
|-------|---------------|---------------|-----------|
| Image ID | SCR-DISC-01 | SCR-VIEW-01 | URL param `/images/[id]` |
| Origin rect | SCR-DISC-01 | SCR-VIEW-01 | `transitionStore.originState` |

## Responsive Branching

| Viewport | Behavior |
|----------|----------|
| Mobile (<640px) | Detail is full page at `/images/[id]` |
| Desktop (≥768px) | Detail is modal at `/@modal/(.)images/[id]` |
```

---

## Shared Files Format

### store-map.md (HIGH VALUE — inject with any task touching state)

```markdown
# Zustand Store Map

| Store | File | Key Fields | Used In |
|-------|------|-----------|---------|
| `filterStore` | `lib/stores/filterStore.ts` | `activeFilter`, `category`, `mediaId`, `castId` | Discovery, Home |
| `searchStore` | `lib/stores/searchStore.ts` | `query`, `debouncedQuery` | Header, Search |
| `authStore` | `lib/stores/authStore.ts` | `user`, `session` | Global |
| `requestStore` | `lib/stores/requestStore.ts` | `step`, `imageUrl`, `detectedItems` | Creation flow |
| `transitionStore` | `lib/stores/transitionStore.ts` | `selectedId`, `originState`, `rect` | FLIP animation |
```

### component-registry.md (inject when building UI)

```markdown
# Design System Component Registry

All components export from: `@/lib/design-system`

| Component | File | Variants | Use When |
|-----------|------|---------|----------|
| `MobileHeader` | `lib/design-system/mobile-header.tsx` | - | Mobile page header |
| `DesktopHeader` | `lib/design-system/desktop-header.tsx` | - | Desktop page header |
| `Card` | `lib/design-system/card.tsx` | `elevated`, `flat` | Generic container |
| `ProductCard` | `lib/design-system/product-card.tsx` | - | Product display |
...
```

### injection-guide.md (the protocol file — always available)

```markdown
# Context Injection Guide

When working on a specific task, inject these files:

## Task: Implement a screen
1. The screen's SCR-*.md file
2. _shared/component-registry.md
3. _shared/store-map.md
4. _shared/data-models.md (if data structures involved)
5. The flow file (FLW-*.md) the screen belongs to

## Task: Fix a bug on a screen
1. The screen's SCR-*.md file
2. _shared/store-map.md (if state-related)

## Task: Build a new feature that spans multiple screens
1. The relevant flow's FLW-*.md
2. All SCR-*.md files in that flow
3. _shared/data-models.md
4. _shared/api-contracts.md

## Task: Update shared components
1. The CMN-*.md for the component
2. All SCR-*.md files that reference it (listed in CMN file)

## What NOT to inject
- Archive files (specs/_archive/)
- Other screens not in the current task scope
- Full API docs when only endpoint signatures are needed
```

---

## Context Injection Patterns

### Pattern 1: Single Screen Task (most common)

```bash
# Inject these 3-5 files as context
specs/screens/discovery/SCR-DISC-01-home.md
specs/_shared/store-map.md
specs/_shared/component-registry.md
```

Token estimate: ~2,000-4,000 tokens total. Leaves 95%+ context window for code.

### Pattern 2: Flow Task (cross-screen feature)

```bash
# Inject flow + all screens in the flow
specs/flows/FLW-01-discovery.md
specs/screens/discovery/SCR-DISC-01-home.md
specs/screens/discovery/SCR-DISC-02-filter.md
specs/_shared/store-map.md
specs/_shared/data-models.md
```

Token estimate: ~8,000-12,000 tokens. Still leaves 85%+ context for a 100K window.

### Pattern 3: Shared Component Update

```bash
# Inject the component spec + its consumers
specs/screens/shared/CMN-01-header.md
# Then grep for SCR-* files that reference CMN-01
```

### Anti-Pattern: Do NOT Inject

```bash
# WRONG: Too much, wastes context, no focus
specs/                              # entire directory
specs/discovery/spec.md             # monolith bundle files
docs/api/                           # all API docs
```

---

## Cross-Reference Strategy

### Reference Types

| Reference Type | Syntax | Example |
|---------------|--------|---------|
| Another screen | `[SCR-ID](relative/path/to/file.md)` | `[SCR-VIEW-01](../detail/SCR-VIEW-01-image-detail.md)` |
| A flow | `[FLW-ID](../../flows/FLW-01-discovery.md)` | Links to user journey |
| Shared contract | `[_shared/store-map.md](../../_shared/store-map.md)` | |
| Actual code file | inline backtick | `` `packages/web/lib/components/ThiingsGrid.tsx` `` |

### Code Path Discipline

Every component reference must use the actual current file path:
- Prefix with `packages/web/` or `packages/shared/`
- Never use `lib/` without the package prefix
- Verify paths exist before writing them into specs

Example:
```
WRONG: lib/components/ThiingsGrid.tsx
RIGHT: packages/web/lib/components/ThiingsGrid.tsx
```

### Preventing Stale References

Include a "Last verified" date at the top of each spec file in the front matter. When the date is more than 60 days old, flag for review.

Spec staleness sources to watch:
1. Component renames/moves after design system refactors
2. API endpoint changes (backend API URL or response shape)
3. Store restructuring (new store keys or merged stores)
4. Route changes (Next.js App Router restructures)

---

## Architecture Patterns to Follow

### Pattern: Mobile-First Screen Spec

Write the mobile layout in full detail (primary). Describe desktop only as a diff from mobile. This matches how the product is built — mobile is the default rendering path, desktop adds complexity on top.

Do not write separate "mobile spec" and "desktop spec." One file, mobile primary, desktop documented as variations.

### Pattern: Component Map as Ground Truth

The Component Map section of each screen spec is the highest-value section for AI agents. It must be:
- Complete (every visible region mapped)
- Accurate (paths verified against current codebase)
- Concise (name + path + one-line note, nothing more)

If the Component Map is wrong, the agent will generate code referencing non-existent paths. This is the most common failure mode in spec-driven AI development.

### Pattern: State Before API

In screen specs, document Zustand stores before API calls. Agents that see state first understand the data flow direction: API populates cache → React Query caches → component reads from Zustand or React Query. This prevents agents from writing direct fetch calls where React Query hooks are expected.

### Pattern: Key Interactions, Not All Interactions

Only document interactions that are non-obvious or have side effects beyond what the UI shows. "Button click shows toast" is obvious. "Card click stores DOM rect in transitionStore then navigates" is not — document it.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: The Monolith Bundle File

**What it is:** A single `spec.md` per feature bundle with 500-1000+ lines covering multiple screens, all states, all edge cases, all component mappings.

**Why it fails:** Agents injected with the monolith get too much context. They lose precision. Specific screen work gets contaminated by unrelated screen details. Token waste is severe.

**Instead:** Split into one `SCR-*.md` per screen and one `FLW-*.md` per user journey.

### Anti-Pattern 2: Prose-Heavy Specs

**What it is:** Spec sections written as paragraphs explaining the feature rationale, history, and business logic.

**Why it fails:** Agents prefer structured tables, code blocks, and lists. Prose requires the agent to parse and extract before it can use the information. Prose also tends toward ambiguity.

**Instead:** Default to tables. Use prose only for "why" explanations that have no natural table structure.

### Anti-Pattern 3: Specs That Live in a Different Directory from Code

**What it is:** Specs in `specs/discovery/screens/SCR-DISC-01-home.md` referencing components at paths that don't match the actual monorepo structure.

**Why it fails:** The spec becomes a fiction. Agents generate code that imports from non-existent paths.

**Instead:** Verify every file path in the Component Map section before writing the spec. Run a `find` command to confirm.

### Anti-Pattern 4: Duplicate Information Across Shared and Screen Files

**What it is:** Repeating the full UiImage interface definition in both `data-models.md` and every screen spec that uses it.

**Why it fails:** Duplication diverges. The screen spec's copy becomes stale while `data-models.md` stays current. Agents get contradictory type definitions.

**Instead:** Reference, don't repeat. Screen specs should reference `_shared/data-models.md` by path, not copy the type definitions inline.

---

## Migration Strategy

### Phase 1: Archive (no production risk)

Create `specs/_archive/v2.1.0/` and copy the current `specs/` tree verbatim. This preserves the existing work without deletion risk.

Files to copy:
- All `specs/**/*.md` files except README

Verify archive is complete, then mark as read-only in git with a note in `_archive/README.md` that these files are frozen.

### Phase 2: Build Shared Foundation

Create the `_shared/` files first because all screen specs reference them. Build order:

1. `_shared/store-map.md` — survey `lib/stores/` directory, document all stores
2. `_shared/component-registry.md` — survey `lib/design-system/`, document all exports
3. `_shared/data-models.md` — carry forward from existing `specs/shared/data-models.md`, verify types against codebase
4. `_shared/api-contracts.md` — carry forward from existing `specs/shared/api-contracts.md`, verify against `docs/api/`
5. `_shared/injection-guide.md` — write last (references all other shared files)

### Phase 3: Create Flow Files

Write flow files before screen files. Flows define the navigation graph. Screen specs reference flows.

Build order:
1. `FLW-01-discovery.md` (most complete feature set, good model)
2. `FLW-02-creation.md` (multi-step wizard flow)
3. `FLW-03-user-system.md` (auth-gated flow)
4. `FLW-04-search.md` (overlay/modal flow pattern)

### Phase 4: Rewrite Screen Specs

Rewrite one domain at a time, starting with the most-used screens. Use the canonical template. Verify every component file path before writing.

Build order:
1. `screens/discovery/` — highest traffic, most complete feature implementation
2. `screens/detail/` — critical user experience path
3. `screens/shared/` — shared components used across domains
4. `screens/creation/` — complex but self-contained flow
5. `screens/user/` — auth-dependent, complex state

### Phase 5: Retire Old Bundle Files

After screen specs are complete and verified, delete or archive the old bundle `spec.md` files (keep the archive copy). Update `specs/README.md` to point to new structure.

---

## Build Order Rationale (for Roadmap)

The suggested phase ordering above (Archive → Shared → Flows → Screens → Retire) is dictated by dependency direction:

```
_archive/          (no dependencies, create first for safety)
    ↓
_shared/           (depended on by all screen specs)
    ↓
flows/             (depended on by screen specs for "step N of M" references)
    ↓
screens/           (consumes shared and flows)
    ↓
README update      (points to new structure, retire old)
```

Do not write screen specs before shared files are complete. Agents working from incomplete screen specs will create their own assumptions about shared state, which will diverge from the actual shared files later.

---

## Scalability Considerations

| Concern | Now (~30 screens) | At 100+ screens |
|---------|-------------------|----------------|
| Finding a screen | Browse `screens/[domain]/` | Add `_shared/screen-index.md` with filterable table |
| Cross-reference accuracy | Manual verification | CI script that validates all `[SCR-*]` links resolve |
| Injection efficiency | Manual file selection | Injection guide file, or CLAUDE.md `@` includes |
| Component path accuracy | Human-verified on write | CI script that verifies paths exist in filesystem |
| Version tracking | Archive snapshot | Tag archive with git tags, add semver to frontmatter |

---

## Confidence Assessment

| Claim | Confidence | Source |
|-------|------------|--------|
| One-file-per-screen is better than bundle monoliths | HIGH | Context engineering research (Martin Fowler), "curse of instructions" studies |
| Mobile-first layout, desktop-as-diff pattern | HIGH | Matches current product architecture, responsive design conventions |
| Component Map is highest-value section | HIGH | Consistent finding in spec-driven dev literature, directly from current failure mode analysis |
| 300-line screen file limit | MEDIUM | Derived from context token budget reasoning, not an industry standard |
| `_shared/injection-guide.md` as protocol file | MEDIUM | Novel approach derived from AGENTS.md standard and Skills pattern |
| Path verification CI as anti-staleness | MEDIUM | Best practice extrapolation from link-checking tools, not spec-specific research |

---

## Sources

- [Context Engineering for Coding Agents — Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- [How to Write a Good Spec for AI Agents — Addy Osmani](https://addyosmani.com/blog/good-spec/)
- [AGENTS.md — Open Standard for AI Coding Agents](https://agents.md/)
- [Spec-Driven Development: Unpacking 2025's Key Practice — Thoughtworks](https://www.thoughtworks.com/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices)
- [Spec-Driven Development with Claude Code — alexop.dev](https://alexop.dev/posts/spec-driven-development-claude-code-in-action/)
- [Context Engineering: Optimizing LLM Memory — Medium](https://medium.com/@kuldeep.paul08/context-engineering-optimizing-llm-memory-for-production-ai-agents-6a7c9165a431)
- Existing codebase analysis: `.planning/codebase/ARCHITECTURE.md`, `specs/` survey (2026-02-19)
