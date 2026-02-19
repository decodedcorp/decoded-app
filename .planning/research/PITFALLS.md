# Domain Pitfalls: AI-Consumable Spec Writing for Existing Codebases

**Domain:** Brownfield spec documentation for AI agent context injection
**Researched:** 2026-02-19
**Applies To:** v4.0 Spec Overhaul milestone

---

## Critical Pitfalls

Mistakes that cause AI agents to produce wrong output or require spec rewrites.

---

### Pitfall 1: Conflating "What Is" with "What Should Be"

**What goes wrong:** Specs mix implemented behavior with aspirational behavior without clear labeling. AI agents treat the spec as truth and implement changes that undo working code (because the spec says "should do X" but code already does X differently), or defer building things that need to exist (because the spec implies they're already done).

**Why it happens:** The natural impulse when documenting an existing codebase is to describe current behavior. But specs are design documents. When a single file contains "the filter shows categories A, B, C" (current) and "users can also filter by D" (aspirational), neither humans nor agents know which is implemented.

**Consequences:**
- AI agent attempts to "implement" already-working features
- Agent removes working code that "contradicts" the spec
- Roadmap phase estimates are wrong (thinking X is done when it's aspirational)
- Agent confidently implements the wrong version of a feature

**Prevention:**
- Enforce explicit status markers on every screen: `Status: implemented | planned | revised`
- Separate sections: "Current Implementation" vs. "Target Behavior"
- If a screen is mostly implemented, archive v2.1.0 spec first, then rewrite from scratch as target state
- Never update a v2.1.0 spec in-place — archive it, create a new file

**Detection:**
- Screen spec contains both present tense ("the grid displays") and future tense ("the grid will display") in the same section
- Spec references components that don't exist yet as if they're implemented
- `Status: 초안` on a screen that has been fully built for months

**Phase that must address it:** Phase 1 (archiving) and Phase 2 (spec format standardization) — before any screen is rewritten.

---

### Pitfall 2: Stale File Path References

**What goes wrong:** Specs reference specific file paths that have moved, been renamed, or deleted. AI agents look up those paths, find nothing, then either hallucinate a file in the wrong place or refuse to proceed.

**Why it happens:** File paths look authoritative in specs. Developers add them once and never update them. The codebase evolves: `lib/components/Header.tsx` becomes `lib/components/shared/Header.tsx`, but the spec still says the old path. This is "the silent killer" — the spec is wrong in a way that looks right.

**Real example from this project:**
- SCR-DISC-01 references `packages/web/lib/components/HomeClient.tsx` — but `HomeClient.tsx` is actually at `packages/web/app/HomeClient.tsx` (under `app/`, not `lib/components/`)
- SCR-DISC-01 references `packages/web/lib/components/Header.tsx` — but the header has split into `DesktopHeader` and `MobileHeader` in the design system

**Consequences:**
- Agent confidently reads wrong file
- Agent creates duplicate components in wrong directories
- "Component mapping" section becomes the most misleading part of a spec

**Prevention:**
- Treat all file paths as needing verification before spec publication, not during writing
- Add a "verified against codebase" date to component mapping tables
- Use component names as primary identifiers, file paths as secondary
- Format: `ComponentName (lib/path/to/file.tsx — verified 2026-02-19)`
- Write a brief codebase audit step into every spec-writing phase before writing paths

**Detection:**
- Component mapping table has no verification date
- Paths reference `lib/components/ComponentName.tsx` without checking the actual file exists
- Spec written more than 2 weeks ago without re-verification

**Phase that must address it:** Every spec-writing phase must start with a "path audit" step.

---

### Pitfall 3: Over-Specifying the Design System (Token Bloat)

**What goes wrong:** Each screen spec repeats design token values, color codes, and spacing values that are already defined in the design system. Instead of referencing `from "@/lib/design-system"`, specs duplicate values like `color: oklch(0.21 0.006 285.75)`. This inflates spec files, consumes context window budget on noise, and creates multiple sources of truth.

**Why it happens:** Spec writers want completeness. The screen template includes a "Design Token Reference" table that encourages listing every token. With 45+ design system components, this becomes unmanageable.

**Context window cost:** A screen spec with full token tables is 400-450 lines. A lean spec is 150-200 lines. With 25+ screens planned, the difference is 6,000-7,500 tokens of noise per injected context.

**Consequences:**
- Context window fills with token values, crowding out behavioral logic agents actually need
- Token values go stale when design system updates (now spec contradicts the source)
- AI agents may use spec token values instead of reading from the canonical source
- "Context rot" accelerates — the more tokens loaded, the worse recall gets

**Prevention:**
- Replace all token tables with a single pointer: `Design tokens: use @/lib/design-system — do not duplicate values here`
- Only document tokens in a spec when a screen deviates intentionally from the design system
- Reference component names (e.g., `<ProductCard>`) not their internal token values
- Rule of thumb: if the value is in design-system/tokens.ts, it has no place in a screen spec

**Detection:**
- Spec file has a "Design Token Reference" table with actual color/spacing values
- Spec file exceeds 300 lines for a single screen
- Multiple spec files contain the same token values

**Phase that must address it:** Phase 2 (format redesign) — establish the "reference, don't duplicate" principle in the template before writing any new specs.

---

### Pitfall 4: Instruction Budget Overflow in Root Context Files

**What goes wrong:** CLAUDE.md (or equivalent root context file) accumulates rules reactively — each project issue results in a new rule addition. After enough iterations, the file has 200+ lines of instructions. Research shows frontier LLMs follow ~150-200 instructions consistently. Claude Code's system prompt already occupies ~50 of that budget. A dense CLAUDE.md pushes total instructions past the reliable threshold, causing uniform degradation across all instructions.

**Why it happens:** Adding a rule feels like "fixing" a recurring problem. No rule ever gets removed. The file grows monotonically.

**Consequences:**
- Earlier rules become less reliably followed as file grows
- Agents ignore project conventions they were once respecting
- Developers add more rules to compensate, making things worse

**Prevention:**
- Keep CLAUDE.md root file under 60-80 lines of actual instruction content
- Move domain-specific guidance to separate files: `docs/conventions.md`, `docs/testing.md`
- Review CLAUDE.md every milestone: remove rules that are now encoded in ESLint/Prettier, tests, or CI
- Never auto-generate CLAUDE.md content — every line deserves manual curation

**Detection:**
- CLAUDE.md exceeds 200 lines (currently acceptable range — ours is detailed but structured)
- Rules overlap with what ESLint/Prettier already enforce
- Rules address scenarios that haven't occurred in the last 3 milestones

**Phase that must address it:** Not a spec-writing phase issue — ongoing CLAUDE.md hygiene.

---

### Pitfall 5: Patch-Update vs. Full Rewrite for Stale Specs

**What goes wrong:** Existing specs are "updated" in-place when the codebase changes significantly. A spec about the home screen that was 70% wrong gets partial corrections — the outdated parts that were noticed get fixed, but subtler misalignments remain. The result is a spec that's internally inconsistent: some sections reflect v2.1 implementation, some reflect a new v4.0 target, some are wrong in a way that's not obvious.

**Why it happens:** Full rewrites feel expensive. "Just updating" the paths and status looks like progress. The temptation is especially strong for specs with detailed wireframes — it's faster to fix one section than to redo the whole ASCII diagram.

**Consequences:**
- AI agents get internally contradictory context: section 3 says X, section 9 says not-X
- Spec history is lost (can't compare v2.1 intent to v4.0 target)
- "Context clash" — different parts of context contradict each other, degrading agent performance

**Prevention:**
- Archive first, always. Before touching any existing spec, copy it to `specs/v2.1.0/`
- Only then create a new spec file built from scratch with current codebase knowledge
- The question to ask: "Am I updating, or am I rewriting?" If > 40% changes, rewrite
- Treat old specs like old migrations — read-only, reference only

**Detection:**
- Version history shows direct edits to existing spec files rather than new files
- Spec contains references to both old component names and new ones
- Spec "status" field was changed but the wireframes weren't regenerated

**Phase that must address it:** Phase 1 (archiving) must complete before Phase 2 begins.

---

### Pitfall 6: Specifying Behavior the AI Can Read Directly from Code

**What goes wrong:** Specs document implementation details that are already authoritative in the codebase itself: exact store key names, TypeScript interface definitions, React Query query keys. These are better read directly from source by the agent during task execution than pre-loaded into a spec.

**Why it happens:** Spec writers want to be comprehensive. Including TypeScript types in a spec looks thorough. But types in source files are ground truth — types in specs are copies that diverge.

**Example from current project:**
SCR-DISC-01 includes:
```typescript
interface UiImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  aspectRatio: number;
  itemCount: number;
  ...
}
```
This type is already defined in `packages/shared/` and likely has diverged from the spec version.

**Consequences:**
- Agent uses spec type definition, misses fields added to actual type
- False confidence: spec "documents" the type, so nobody checks source
- Spec maintenance burden quadruples when types evolve

**Prevention:**
- Reference, don't copy: `Types: see packages/shared/types/ — do not duplicate here`
- In specs, only document the *semantic meaning* of data, not the TypeScript shape
- Data requirements section: "The screen needs a list of images with count and aspect ratio — see UiImage in packages/shared"
- Exception: document types only if they don't exist in code yet (aspirational spec for unbuilt features)

**Detection:**
- Spec file contains TypeScript interface or type definitions
- Zustand store keys are listed in spec that could be read from the store file directly
- React Query query keys in spec match (or don't match) actual code

**Phase that must address it:** Phase 2 (format redesign) — the new template must not have TypeScript code blocks for existing types.

---

## Moderate Pitfalls

Mistakes that cause delays or create technical debt in spec quality.

---

### Pitfall 7: Diverging Parallel Context Files

**What goes wrong:** This project has both `.planning/codebase/` files (AI-generated codebase analysis) and `specs/` files (design intent). As the codebase evolves, these diverge. An agent injected with both gets contradictory context: ARCHITECTURE.md says component X lives at path A, spec says it should live at path B.

**Prevention:**
- Establish clear priority chain in SSOT.md (already done): code > .planning/codebase > docs > specs
- When spec rewrites happen, verify against `.planning/codebase/` files first
- Run `/gsd:map-codebase` before starting any spec-writing phase to refresh codebase analysis
- Specs should reference `.planning/codebase/` files rather than duplicating their content

**Phase that must address it:** Phase 1 (establish what's current before writing specs).

---

### Pitfall 8: Monolithic Screen Specs (Too Much Per File)

**What goes wrong:** A single screen spec file tries to document everything: layout, state, API, types, performance, accessibility, animations, test scenarios. At 400+ lines per screen with 25+ screens, context injection becomes impractical. The entire `detail-view` bundle can't fit in one context window.

**Prevention:**
- Keep each screen spec under 200 lines
- Use progressive disclosure: screen spec links to `shared/api-contracts.md`, `shared/data-models.md` rather than embedding their content
- Remove sections that add no AI value: test checklists (tests define tests, not specs), i18n tables (not a current concern), accessibility boilerplate (generic, not screen-specific)
- Apply the "sledgehammer for a nut" test: would an agent doing a small task need this section? If almost never, cut it

**Detection:**
- Screen spec file exceeds 300 lines
- Screen spec contains generic boilerplate identical to other screen specs (error codes, accessibility checklist)
- Performance section lists techniques that apply to all screens, not screen-specific patterns

**Phase that must address it:** Phase 2 (template redesign must enforce limits).

---

### Pitfall 9: Specs That Ignore Mobile-First Reality

**What goes wrong:** Wireframes and UI element tables describe desktop layout first, with mobile as an afterthought in a brief subsection. For this project, which is mobile-first in practice, agents building from these specs produce desktop-centric implementations.

**Why it matters here:** The app is used primarily on mobile. The `NavBar` component is mobile-only. The `BottomSheet` is core to the mobile UX. When specs lead with desktop wireframes and treat mobile as a variant, agents weight desktop-first behavior.

**Prevention:**
- Invert the wireframe order: mobile first (primary), desktop second (variation)
- Name breakpoints consistently: use actual Tailwind breakpoints (`sm:`, `md:`, `lg:`) not "≥768px"
- For mobile-specific components (NavBar, BottomSheet), call them out in the mobile section, not as footnotes
- Lead with "Mobile Behavior" in state tables, then note desktop differences

**Phase that must address it:** Phase 2 (template redesign).

---

### Pitfall 10: Multi-Agent Context Mismatch (Claude vs. Gemini vs. Cursor)

**What goes wrong:** Specs written for one AI agent's context injection pattern work poorly for another. Claude handles long markdown well. Cursor with limited context window needs shorter, denser specs. Gemini 2.0 handles multi-file context differently. One spec format doesn't serve all three.

**Why it matters here:** This project actively uses multiple agents (as stated in project context). A spec that works perfectly as Claude context may be too long for Cursor's effective range.

**Prevention:**
- Design specs to be composable: each file should be independently meaningful, not dependent on other files being loaded simultaneously
- Use SSOT references rather than inline content — agents can choose which files to read
- Keep core screen spec dense and complete (150-200 lines), link to supplementary files for details
- Avoid assuming the agent has read "shared" files — critical decisions should appear in the screen spec itself

**Detection:**
- Spec says "see shared/api-contracts.md for endpoint details" but the endpoint used is only documented there
- Screen spec requires reading 4+ files to understand one implementation task

**Phase that must address it:** Phase 2 (format) and Phase 3+ (per-screen writing).

---

### Pitfall 11: The 45-Component Problem (Design System Over-Reference)

**What goes wrong:** With 45+ design system components, screen specs can reference any of them. Without discipline, component lists in specs become catch-all: a spec might list `ProductCard`, `GridCard`, `FeedCardBase`, `ArtistCard`, `SpotCard`, `ShopCarouselCard` — all on one screen. Agents are unsure which to use where.

**Prevention:**
- Every component reference must include a use-case qualifier: `<GridCard>` for image grid, not `<ProductCard>` (product listing) or `<FeedCardBase>` (social feed)
- If a spec references more than 5 design system components, question whether the screen scope is correct
- Reference the barrel import path: `from "@/lib/design-system"` with the specific named export
- Include one concrete usage example per component: `<GridCard imageUrl={...} aspectRatio={...} itemCount={...} />`

**Detection:**
- Component mapping table lists >5 design system components for one screen
- Multiple visually similar components referenced without distinguishing context
- No usage example provided for any component

**Phase that must address it:** Phase 3+ (per-screen spec writing).

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable without major rework.

---

### Pitfall 12: ID System Drift

**What goes wrong:** Screen IDs (SCR-DISC-01, SCR-VIEW-01) become inconsistent when screens are added or reordered. The convention becomes: "the ID is just a label, don't rely on it for ordering." But agents sometimes try to infer structure from IDs.

**Prevention:** Define IDs as stable identifiers, not as ordered sequences. Document this explicitly. When adding screens, use descriptive suffixes (SCR-DISC-04-gallery) not pure numbers.

---

### Pitfall 13: Missing "Why Not" Documentation

**What goes wrong:** Specs document what to build but not what was explicitly decided against. Agents are unaware of prior decisions and may implement the rejected approach. Example: if the decision was made not to use a particular library (like `react-virtual`), future agents may add it.

**Prevention:** Include a small "Not in Scope / Decided Against" section in specs covering significant alternatives that were rejected. Example: "Virtualization: not using react-virtual — ThiingsGrid handles its own virtualization at the physics engine level."

---

### Pitfall 14: Service Direction Ambiguity

**What goes wrong:** The project context notes the service direction is changing. If specs are written to the current direction and direction changes, all specs need updating again. Writing overly specific business logic into technical specs creates fragile coupling.

**Prevention:**
- Separate business rules from UI structure in specs
- Document the screen behavior (what a component does), not the business rationale (why the product works this way)
- Business rationale belongs in `PROJECT.md`, not screen specs
- Technical screens should be stable across service direction changes: a filter mechanism is a filter mechanism regardless of what's being filtered

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Archiving v2.1 specs | Temptation to "fix small things" during archiving | Strict rule: archive is read-only copy, no edits |
| Format/template design | Over-engineering the template with too many required sections | Start minimal, add sections only when multiple screens need them |
| Writing discovery bundle specs | Stale file paths (HomeClient location, Header split) | Verify all component paths before writing section 9 |
| Writing detail-view bundle specs | Over-specifying GSAP animation details | Reference `.planning/codebase/CONCERNS.md` on animation complexity; document intent not implementation |
| Writing shared foundation docs | Duplicating types from `packages/shared/` | Reference only; no TypeScript blocks for existing types |
| Any spec writing | Writing 400+ line files | Hard limit: 200 lines per screen spec, 300 max with justification |
| Cross-agent compatibility | Writing for Claude, forgetting Cursor's context limits | Test spec usability: can a task be understood from screen spec alone without loading 4 other files? |

---

## Quick Reference: Signs a Spec Is Agent-Hostile

A spec is actively harmful if it exhibits multiple of these:

- [ ] Contains TypeScript type definitions that exist in source code
- [ ] File paths not verified against current codebase structure
- [ ] Mixes implemented and planned behavior without labels
- [ ] Duplicates design token values instead of referencing design system
- [ ] Exceeds 350 lines
- [ ] References component files that have moved or been renamed
- [ ] Specifies things the agent can read directly from source (store keys, query keys, exact props)
- [ ] Generic boilerplate sections identical across all specs (error codes, a11y checklists)
- [ ] Desktop-first wireframes with mobile as afterthought

---

## Sources

- [Writing AI coding agent context files is easy. Keeping them accurate isn't.](https://packmind.com/evaluate-context-ai-coding-agent/) — Context staleness, diverging files
- [Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md) — Instruction budget, file length limits
- [A complete guide to AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md) — Anti-patterns, progressive disclosure
- [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) — Over-formalization, review burden
- [Spec-Driven Development: From Code to Contract](https://arxiv.org/html/2602.00180v1) — Over-specification, false specifications, specification rot
- [Advanced Context Engineering for Coding Agents](https://www.humanlayer.dev/blog/advanced-context-engineering) — Context window saturation, incorrect information cascade
- [How spec-driven development improves AI coding quality](https://developers.redhat.com/articles/2025/10/22/how-spec-driven-development-improves-ai-coding-quality) — Specification drift, scope overlap
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Context poisoning, context distraction
- [Spec-driven development pitfalls — Thoughtworks](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices) — Non-determinism, over-formalization

*Pitfall evidence cross-referenced with actual project files: specs/discovery/screens/SCR-DISC-01-home.md, .planning/codebase/CONCERNS.md, .planning/SSOT.md*

---

*Researched: 2026-02-19*
*Confidence: HIGH for pitfalls 1-8 (verified against project files and external sources), MEDIUM for 9-11 (external sources, project-specific extrapolation), LOW for 12-14 (reasoning from first principles)*
