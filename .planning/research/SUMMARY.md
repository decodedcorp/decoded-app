# Project Research Summary

**Project:** decoded-app v4.0 Spec Overhaul
**Domain:** AI-consumable spec documentation system for a brownfield Next.js / React mobile-first app
**Researched:** 2026-02-19
**Confidence:** HIGH

## Executive Summary

The v4.0 Spec Overhaul is a documentation-only milestone that rewrites the existing `specs/` system to be optimally consumable by AI coding agents. The core finding across all four research dimensions is consistent: the existing spec system has the right structure but is broken at the content level. The critical failures are stale file paths in component mapping tables, mixed implemented/aspirational status within single files, and token-inefficient formats (TypeScript type blocks, i18n tables, version history tables, and Korean prose) that waste context window budget on noise. The recommended approach is: archive the current v2.1.0 specs verbatim, build new shared foundation files from the current codebase state, then rewrite screen specs one-at-a-time in a lean, structured format.

The recommended format stack requires no new tooling — Markdown tables, EARS-syntax requirements (`When/While/If/Where` prefix), BDD acceptance criteria, and ASCII wireframes (mobile-first, 38-char wide). The discovery bundle `specs/discovery/spec.md` is the gold standard that already uses event flow diagrams, state transition diagrams, and edge case tables. The critical missing artifact is a Design System Component Catalog: with 35 components in `lib/design-system/`, no current spec document lists their props, variants, and usage examples. AI agents hallucinate these details because there is no canonical injectable reference.

The highest-leverage changes, in order of impact: (1) fix stale file paths in every component mapping table — this is the single most common failure mode where agents import from non-existent paths; (2) create `specs/_shared/component-registry.md` as the missing props catalog; (3) split monolith bundle `spec.md` files into per-screen `SCR-*.md` files + per-journey `FLW-*.md` files; (4) replace prose requirements with EARS statements. The milestone succeeds when each screen spec can be injected alone and give an AI agent sufficient context to implement or modify that screen without hallucination.

---

## Key Findings

### Format Stack (from STACK.md)

No new tooling is required. The format discipline is the work. The recommended format stack in order of AI token efficiency:

**Core formats:**
- **EARS syntax** (`When <trigger>, the system shall <response>`) — eliminates modal ambiguity that causes agents to hallucinate implementations; used by AWS Kiro's official spec format
- **Markdown tables** — highest information density per token, easiest for attention heads to parse
- **ASCII wireframes (38-char wide, mobile-first)** — spatial layout in ~50 tokens per screen vs. 10-50x more for image-based wireframes
- **TypeScript interfaces** (reference, not copy) — agents read existing TS types better than prose; never copy types into specs from source code
- **BDD Given/When/Then** — testable acceptance criteria that map directly to Playwright test cases

**File organization (new structure):**
- `specs/_shared/` — cross-cutting reference files injected selectively (data-models, api-contracts, component-registry, store-map, injection-guide)
- `specs/flows/FLW-*.md` — user journeys, multi-screen navigation contracts
- `specs/screens/{domain}/SCR-*.md` — one file per screen, ≤200 lines
- `specs/_archive/v2.1.0/` — frozen snapshot of current state before rewrite

**Token budgets per injection:**
- Single screen spec: ≤2,000 tokens
- Full task context (screen + shared refs): ≤4,000-8,000 tokens
- Never inject the entire `specs/` directory

### Expected Features / Spec Types (from FEATURES.md)

The features research analyzed the actual `specs/` directory (50+ files) and codebase directly. Feature = spec document type in this milestone context.

**Must have (table stakes — needed for system to function):**
- Bundle feature spec (`spec.md`) with feature ID registry, priority, status, dependencies, and explicit "not in scope" section
- Screen specs (`SCR-*-NN-name.md`) with UI element table, state table, data requirements, component mapping table (verified file paths), and error handling table
- Data models (`_shared/data-models.md`) — existing file is well-maintained and correctly formatted; keep as-is
- API contract map (`_shared/api-contracts.md`) — exists but inconsistently present per bundle; standardize
- Shared component specs (`CMN-*.md`) for header, footer, mobile nav — exist but stale (CMN-01 references split `DesktopHeader`/`MobileHeader` design system files, not the old monolithic `GlobalHeader.tsx`)
- Design system component catalog (`_shared/component-registry.md`) — **does not exist; this is the highest-priority missing artifact**

**Should have (differentiators — raise AI output quality significantly):**
- Event flow diagrams per bundle (currently only `discovery/spec.md` has them) — show user action → store mutation → React Query key → API call → render result with timing annotations
- State transition diagrams for all Zustand stores (currently only `filterStore` has one; `authStore`, `searchStore`, `transitionStore` need them)
- Responsive behavior matrix per bundle (mobile vs. desktop delta table per component)
- `_shared/injection-guide.md` — protocol file: "for task type X, inject these files" — eliminates agent guessing about which files to load

**Defer to post-overhaul:**
- Animation/transition spec sections with actual GSAP parameters (valuable but requires all bundles to have basic spec correctness first)
- CI script to validate component file paths exist in filesystem (correct solution to staleness long-term, not a doc milestone task)
- Per-bundle user scenario diagrams (app-level flow in `shared/workflows.md` is sufficient for most tasks)

**Anti-features to actively remove:**
- Section 10 (i18n) from screen template — app is Korean-first with no active i18n plan; adds 80-150 tokens of always-placeholder content
- Exhaustive generic implementation checklist (Section 13) — replace with specific acceptance criteria in bundle `spec.md`
- Version history tables in every file — git history serves this purpose; replace with single `**Last verified against codebase:** YYYY-MM-DD` line
- TypeScript type blocks copied from source into specs — reference `packages/shared/types/` by path, never copy
- Placeholder sections for undesigned features — features belong in spec only after they have acceptance criteria + wireframe + data model reference

### Architecture Approach (from ARCHITECTURE.md)

The system shifts from monolith-per-bundle to layered injection with atomic screen files. The fundamental architectural change is replacing `specs/[bundle]/spec.md` (500-1000+ line monoliths) with one file per screen plus one flow file per user journey.

**Three injection layers:**
1. **Always-loaded (CLAUDE.md)** — project-wide conventions, store names, design token pointer; keep lean
2. **Task-scoped injection (on-demand)** — screen spec + component registry + store map + flow file; 3-5 files per task
3. **Deep-dive references (agent fetches when needed)** — full API doc for one endpoint, full data model for one type

**Major components (new shared foundation):**
1. `_shared/store-map.md` — Zustand stores: name, file path, key fields, used-in (inject with any state-touching task)
2. `_shared/component-registry.md` — Design system: component name → file path → variants → use when (inject with any UI task)
3. `_shared/injection-guide.md` — Protocol file: task type → which files to inject (prevents random file selection)
4. `flows/FLW-*.md` — Navigation contracts: screen sequence, state carried between screens, responsive branching

**Critical architecture rule:** Screen file limit is 200 lines (300 max with justification). If a screen spec would exceed this, the screen scope is too broad — split it. Every component file path in the Component Map section must be verified against the actual filesystem before publishing the spec.

**Build order is dependency-driven:**
Archive → `_shared/` files → `flows/` → `screens/` → retire old bundle files

Do not write screen specs before shared files are complete. Agents working from incomplete screen specs create their own assumptions about shared state that diverge from actual shared files.

### Critical Pitfalls (from PITFALLS.md)

The pitfalls research cross-verified findings against actual project files (confirmed stale paths in `SCR-DISC-01-home.md`, confirmed missing component catalog, confirmed monolith bundle files).

1. **Conflating "What Is" with "What Should Be"** — Specs mix implemented vs. aspirational behavior without status markers. Prevention: enforce `Status: implemented | planned | revised` on every screen; archive v2.1.0 spec first, write v4.0 spec from scratch with current codebase knowledge. Detection: present tense and future tense in the same spec section.

2. **Stale file path references** — Confirmed in this project: `SCR-DISC-01` references `packages/web/lib/components/HomeClient.tsx` (wrong — actual file is under `app/`) and `packages/web/lib/components/Header.tsx` (wrong — split into `DesktopHeader`/`MobileHeader` in `lib/design-system/`). Prevention: treat all file paths as needing verification before spec publication; add "verified YYYY-MM-DD" note to every component mapping table. This is the most critical failure mode.

3. **Copying TypeScript types into specs** — Types duplicated from source diverge silently. Agents use spec version, miss new fields added to actual types. Prevention: reference only — `Types: see packages/shared/types/ — do not duplicate here`. Only document types in specs for features not yet built.

4. **Patch-updating stale specs instead of rewriting** — Partial updates leave specs internally contradictory: section 3 reflects v2.1 implementation, section 9 reflects v4.0 target. Prevention: archive first, always. The 40% rule: if more than 40% of a spec changes, it's a rewrite, not an update.

5. **Over-specifying design tokens (token bloat)** — Screen specs with full token tables are 400-450 lines; lean specs are 150-200 lines. With 25+ screens planned, the difference is 6,000+ tokens of noise per injected context. Prevention: replace all token tables with `Design tokens: use @/lib/design-system — do not duplicate values here`. Only document deviations from design system.

---

## Implications for Roadmap

Based on combined research, the build order is dictated by strict dependency direction: shared files must exist before screen specs that reference them, archive must exist before any rewrite begins.

### Phase 1: Archive and Audit
**Rationale:** Pitfalls 1, 2, and 5 all require knowing the current ground truth before writing new specs. Archiving creates a safety net and establishes the baseline. Auditing establishes verified file paths for Phase 2 to use.
**Delivers:** `specs/_archive/v2.1.0/` (frozen, read-only copy of all current specs), codebase path audit report (which component mapping paths in existing specs are stale vs. current)
**Addresses:** Pitfall 1 (conflated status), Pitfall 5 (patch vs. rewrite), Pitfall 7 (diverging parallel context files)
**Avoids:** The critical failure mode of writing new specs based on stale assumptions from old specs
**Research flag:** Standard pattern — no deep research needed; mechanical archiving task

### Phase 2: Shared Foundation
**Rationale:** All screen specs depend on shared files. Building them first means screen spec writers (human or agent) have authoritative references to point at rather than duplicating content inline. This phase eliminates the biggest current gap (missing component catalog).
**Delivers:**
- `specs/_shared/store-map.md` — all 5 Zustand stores with file paths and key fields
- `specs/_shared/component-registry.md` — all 35 design system components with props, variants, usage examples (this is the highest-priority missing artifact)
- `specs/_shared/data-models.md` — carry forward from existing, verify against codebase
- `specs/_shared/api-contracts.md` — carry forward, verify against `docs/api/`
- `specs/_shared/injection-guide.md` — task-type → files-to-inject protocol
**Uses:** TypeScript interface format (from STACK.md), ts-morph optional for props extraction
**Avoids:** Anti-Feature 4 (redundant sections), Pitfall 3 (copied type definitions), Pitfall 6 (over-specified implementation detail)
**Research flag:** Standard pattern — well-understood task, no deep research needed

### Phase 3: Flow Files
**Rationale:** Flow files define navigation contracts that screen specs reference. Screen specs cannot link to `FLW-*.md` files until those files exist. Flows are also faster to write than screen specs (one flow covers multiple screens).
**Delivers:** 4 flow files covering all major user journeys:
- `flows/FLW-01-discovery.md` — Home → Filter → Image Detail
- `flows/FLW-02-creation.md` — Upload → AI Detect → Tag → Spot → Publish
- `flows/FLW-03-user-system.md` — Landing → Login → Profile → Settings
- `flows/FLW-04-search.md` — Search entry → Results → Detail
**Avoids:** Pitfall 9 (mobile-first reality), Anti-Pattern 1 (monolith bundle file)
**Research flag:** Standard pattern — flow format is well-defined in ARCHITECTURE.md

### Phase 4: Discovery Bundle Screen Specs
**Rationale:** Discovery is the highest-traffic bundle and already has the most complete existing spec (`discovery/spec.md` is the gold standard with event flows, state diagrams, and edge case tables). Starting here provides the best model for subsequent bundles and validates the new format with a known-good reference.
**Delivers:** `screens/discovery/SCR-DISC-{01-04}-*.md` — home, filter, search, gallery screens in new format with verified paths, EARS requirements, mobile-first wireframes
**Implements:** Screen spec canonical template from ARCHITECTURE.md; event flow differentiators from FEATURES.md
**Avoids:** Pitfall 2 (stale paths — HomeClient and Header paths confirmed stale), Pitfall 9 (desktop-first wireframes)
**Research flag:** Standard pattern — discovery is well-documented; component path verification is a manual codebase check step, not research

### Phase 5: Detail View Bundle Screen Specs
**Rationale:** Critical UX path (image detail, spots, items, related content). Contains the most complex interactions (GSAP FLIP animations, intercepting routes, Lightbox). Must come after discovery because it depends on shared files and builds on lessons from Phase 4.
**Delivers:** `screens/detail/SCR-VIEW-{01-04}-*.md` with animation intent (not implementation), responsive branching table (modal on desktop, full-page on mobile)
**Avoids:** Phase-specific warning: do not over-specify GSAP animation details — document intent and trigger, reference `lib/hooks/useScrollAnimation.ts` file path, not easing curve values
**Research flag:** Needs attention for GSAP FLIP interaction pattern documentation — verify current `transitionStore` shape against actual `lib/stores/transitionStore.ts` before writing

### Phase 6: Shared Components (CMN) Specs
**Rationale:** CMN specs are referenced by every screen spec. Updating them after discovery and detail-view screens are written means the CMN spec authors know which screens reference them and can include the correct "used by" list.
**Delivers:** Updated `screens/shared/CMN-{01-04}-*.md` with current component names (`DesktopHeader`/`MobileHeader` replacing `GlobalHeader`, `BottomSheet` with current props)
**Avoids:** Pitfall 2 (confirmed stale: CMN-01 references `GlobalHeader.tsx` which no longer exists)
**Research flag:** Standard pattern — mechanical update task, codebase is the source of truth

### Phase 7: Creation-AI Bundle Screen Specs
**Rationale:** Creation flow is complex (multi-step wizard with AI detection), but self-contained. Currently `creation-ai/spec.md` is nearly empty. Phase 7 builds the most documentation-sparse bundle from scratch.
**Delivers:** `screens/creation/SCR-CREA-{01-03}-*.md` with upload flow, AI detection result states, tagging/spotting interaction; plus event flow diagrams (this bundle currently has none)
**Avoids:** Pitfall 6 (specifying behavior readable from `lib/stores/requestStore.ts` — reference the store file, don't document its keys inline)
**Research flag:** Needs attention for AI detection flow — verify `requestStore` step enum values and `app/api/v1/posts/analyze` response shape before writing

### Phase 8: User System Bundle Screen Specs
**Rationale:** User system is auth-dependent and the most state-complex bundle (`authStore` drives conditional rendering across all screens). Writing last ensures `authStore` state transitions (needed for CMN specs and flow files) are fully documented in shared files before user-specific screen specs are written.
**Delivers:** `screens/user/SCR-USER-{01-05}-*.md` covering login, profile, activity, earnings, settings; plus `authStore` state transition diagram
**Avoids:** Pitfall 14 (service direction ambiguity — document screen behavior, not business rationale for earnings/monetization features)
**Research flag:** Needs attention for auth-conditional rendering — document `authStore` user/session shape before writing any user screen spec

### Phase 9: Retire Old Bundle Files and Update Index
**Rationale:** Old bundle `spec.md` files can only be retired after their screen specs are fully rewritten and verified. Retiring them eliminates the risk of agents loading stale monolith files.
**Delivers:** Updated `specs/README.md` pointing to new structure; old bundle `spec.md` files moved to `_archive/v2.1.0/` (if not already there from Phase 1)
**Research flag:** Standard pattern — administrative task, no research needed

### Phase Ordering Rationale

- **Dependency chain is strict:** Shared files must precede screen specs. Archive must precede any rewrite. This ordering cannot be compressed by parallelizing phases 1-3.
- **Discovery first among screen bundles** because it is the most complete existing spec (good model) and the highest-traffic path (highest value if improved).
- **User system last** because it depends on `authStore` shape being well-documented and has the most conditional rendering complexity.
- **Creation-AI before user system** because it is simpler (wizard flow, no auth complexity) and allows flow file patterns to be validated before the most complex bundle.

### Research Flags

Phases likely needing deeper investigation during planning:
- **Phase 5 (Detail View):** Verify current `transitionStore` shape and GSAP FLIP usage in `useFlipTransition.ts` before writing specs — animation integration is underdocumented
- **Phase 7 (Creation-AI):** Verify `requestStore` step enum values against `app/request/` route files; verify `POST /api/v1/posts/analyze` response shape against actual API
- **Phase 8 (User System):** Document `authStore` user/session type before writing screen specs; verify auth-conditional rendering patterns in `DesktopHeader`/`MobileHeader`

Phases with standard patterns (skip additional research):
- **Phase 1 (Archive):** Mechanical copy operation
- **Phase 2 (Shared Foundation):** Codebase survey task — `lib/stores/` and `lib/design-system/` are the sources of truth
- **Phase 3 (Flows):** Format defined in ARCHITECTURE.md; navigation structure readable from `app/` directory
- **Phase 6 (CMN):** Mechanical update — codebase is the source of truth
- **Phase 9 (Retire/Index):** Administrative task

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Format Stack | HIGH | Multiple authoritative sources: AWS Kiro docs, Cloudflare engineering blog, Linux Foundation AGENTS.md standard, Addy Osmani analysis of 2,500+ agent config files |
| Feature/Spec Types | HIGH | Based on direct analysis of 50+ existing spec files and 35 design system components in this codebase — not extrapolated from external examples |
| Architecture | HIGH | Derived from context engineering research (Martin Fowler, Addy Osmani) plus direct codebase analysis; consistent findings across sources |
| Pitfalls | HIGH (1-8), MEDIUM (9-11), LOW (12-14) | Pitfalls 1-8 cross-verified against actual project files; Pitfalls 9-11 extrapolated from external sources; Pitfalls 12-14 from first principles reasoning |

**Overall confidence:** HIGH

### Gaps to Address

- **Component registry props accuracy:** The 35 design system components in `lib/design-system/` use CVA variant unions. Automated extraction via `ts-morph` may misread CVA patterns — manual review required for all variant prop types. Handle during Phase 2 with manual verification step.
- **Monorepo path prefix convention:** ARCHITECTURE.md recommends `packages/web/` prefix on all file paths (e.g., `packages/web/lib/components/ThiingsGrid.tsx`), but the project runs from `packages/web/` as working directory during development. Determine canonical prefix before Phase 2 and document in `_shared/injection-guide.md` to prevent inconsistency across screen specs.
- **Creation-AI API response shape:** `POST /api/v1/posts/analyze` response shape is undocumented in current `specs/shared/api-contracts.md`. Must be verified against `app/api/v1/posts/analyze/route.ts` before Phase 7. Flag as pre-condition for that phase.
- **`transitionStore` FLIP integration:** The FLIP animation pattern using `transitionStore` (origin rect + target rect) is critical to detail-view spec correctness but not documented in any current spec. Verify `lib/stores/transitionStore.ts` shape and `lib/hooks/useFlipTransition.ts` before Phase 5.

---

## Sources

### Primary (HIGH confidence)
- Kiro IDE spec format documentation — [https://kiro.dev/docs/steering/](https://kiro.dev/docs/steering/) — EARS requirements, spec file format
- Cloudflare engineering blog, "Markdown for Agents" — [https://blog.cloudflare.com/markdown-for-agents/](https://blog.cloudflare.com/markdown-for-agents/) — format efficiency
- AGENTS.md open standard (Linux Foundation / AAIF) — [https://agents.md/](https://agents.md/) — project-wide agent instruction conventions
- Addy Osmani, "How to Write a Good Spec for AI Agents" — [https://addyosmani.com/blog/good-spec/](https://addyosmani.com/blog/good-spec/) — token efficiency analysis, 2,500 agent file study
- EARS syntax (original) — [https://alistairmavin.com/ears/](https://alistairmavin.com/ears/) — IEEE-published requirement format
- Direct codebase analysis: `specs/` directory (50+ files, 2026-02-19), `lib/design-system/` (35 components), `lib/stores/` (5 stores), `lib/hooks/` (20+ hooks)

### Secondary (MEDIUM confidence)
- Thoughtworks, "Spec-Driven Development" (2025) — [https://www.thoughtworks.com/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices](https://www.thoughtworks.com/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices) — structured requirement syntax, phase warnings
- Martin Fowler, "Context Engineering for Coding Agents" — [https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html) — layered injection pattern, one-file-per-screen rationale
- GitHub Spec Kit — [https://github.com/github/spec-kit](https://github.com/github/spec-kit) — spec template patterns
- Faros AI Context Engineering Guide — [https://www.faros.ai/blog/context-engineering-for-developers](https://www.faros.ai/blog/context-engineering-for-developers) — context budgeting
- Anthropic, "Effective context engineering for AI agents" — [https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — context poisoning, context distraction patterns
- SoftwareSeni spec templates — practitioner guide, component catalog format

### Tertiary (LOW confidence)
- AsciiKit wireframing conventions — [https://asciikit.com/](https://asciikit.com/) — 38-character width baseline (single vendor source)
- ts-morph for component prop extraction — mature library, but benefit for CVA patterns unverified
- 300-line screen file limit — derived from context token budget reasoning, not an industry standard

---

*Research completed: 2026-02-19*
*Ready for roadmap: yes*
