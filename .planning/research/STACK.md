# Technology Stack: AI-Ready Spec Documentation

**Project:** decoded-app v4.0 Spec Overhaul
**Researched:** 2026-02-19
**Focus:** Tools, formats, and conventions for spec documentation consumable by AI coding agents

---

## Executive Recommendation

Use **Markdown-first, modular spec files** with **EARS-syntax requirements**, **BDD scenario blocks**, and **TypeScript-typed component tables**. No new tooling required. The discipline is in the structure, not the toolchain.

The single biggest win: stop writing prose, start writing tables and code blocks. An agent injesting `Component: GridCard | Props: variant, size | File: lib/design-system/grid-card.tsx` extracts more signal per token than three paragraphs describing the same thing.

---

## Core Format Stack

### Spec Authoring Format

| Format | Version | Purpose | Why |
|--------|---------|---------|-----|
| Markdown (.md) | CommonMark | All spec files | De facto lingua franca for AI agents; 80% fewer tokens than HTML equivalents. Parses cleanly in Claude Code, Cursor, Gemini CLI without transformation |
| EARS syntax | v1.0 (Mavin 2009) | Functional requirements | Deterministic, unambiguous requirement statements. Used by Kiro's requirements.md. Eliminates modal ambiguity that causes agents to hallucinate implementations |
| BDD Given/When/Then | Standard | Acceptance criteria, flow specs | Testable, scenario-based. Maps directly to Playwright test cases. Both humans and agents parse reliably |
| TypeScript interfaces | ~5.9 (project existing) | Data model and component prop specs | Already in codebase. Agents read TS interfaces better than prose descriptions of the same types |
| ASCII wireframes | AsciiKit conventions | Layout specs (mobile-first) | 10-50x fewer tokens than image-based wireframes. 38-character-wide baseline forces mobile-first discipline. Use standard box-drawing chars: `┌─┐│└┘` |

### File Organization

| File | Purpose | Inclusion Mode |
|------|---------|---------------|
| `specs/AGENTS.md` | Project-wide agent instructions (spec reading conventions, file locations) | Always-loaded |
| `specs/{bundle}/spec.md` | Feature index + EARS requirements | Per-task injection |
| `specs/{bundle}/screens/SCR-*.md` | Single-screen spec with wireframe + component map | Per-screen injection |
| `specs/{bundle}/flows/FLOW-*.md` | User flow, state transitions, scenario-based | Per-flow injection |
| `specs/shared/data-models.md` | TypeScript interfaces, Supabase schema | Injected with data-heavy tasks |
| `specs/shared/components.md` | Design system component catalog (props, variants, file paths) | Injected with UI tasks |
| `specs/shared/api-contracts.md` | API endpoints, request/response schemas | Injected with API tasks |

### Confidence: HIGH
Source: Cloudflare "Markdown for Agents" (official), AGENTS.md open standard (Linux Foundation, 40,000+ projects), Addy Osmani's analysis of 2,500+ agent config files.

---

## EARS Requirements Syntax

**Recommendation:** Use EARS for all functional requirements inside spec.md files.

### Five EARS Patterns

```
# Ubiquitous (always active — no keyword)
The <system> shall <response>.
Example: The image grid shall render in a 2-column layout on mobile viewports.

# State-driven (while condition persists)
While <state>, the <system> shall <response>.
Example: While no auth session exists, the app shall display the discovery feed in read-only mode.

# Event-driven (triggered by user action)
When <trigger>, the <system> shall <response>.
Example: When the user taps an image card, the app shall navigate to the detail view via intercepting route.

# Optional feature (conditional capability)
Where <feature exists>, the <system> shall <response>.
Example: Where the device supports haptics, the app shall trigger haptic feedback on spot tap.

# Unwanted behavior (error handling)
If <condition>, then the <system> shall <response>.
Example: If the image fetch fails, then the app shall display a skeleton loader and retry after 3 seconds.
```

### Why EARS Over Plain Prose

Plain prose: "The search should show results and maybe filter them."
EARS: "When the user submits a search query, the app shall display matching posts within 500ms."

The EARS version is unambiguous, testable, and gives the agent a complete contract to implement. The prose version produces hallucinated behavior.

**Confidence:** HIGH. Source: Kiro IDE uses EARS for requirements.md (AWS official documentation). Thoughtworks SDD article (2025) recommends structured requirement syntax explicitly.

---

## Spec File Templates

### Screen Spec Template (SCR-*.md)

Minimum viable format that agents can act on without seeking clarification:

```markdown
# [SCR-ID] Screen Name

| Field | Value |
|-------|-------|
| Route | `/path` |
| Bundle | bundle-name |
| Status | draft | reviewed | approved |
| Viewport | mobile-first |

## Layout (Mobile — 390px baseline)

[38-char wide ASCII wireframe]
┌──────────────────────────────────────┐
│ [MobileHeader]                       │
├──────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐   │
│ │  [GridCard]  │ │  [GridCard]  │   │
│ │  img         │ │  img         │   │
│ │  [Badge]     │ │              │   │
│ └──────────────┘ └──────────────┘   │
│ ... (infinite scroll)                │
│ [LoadingSpinner]                     │
└──────────────────────────────────────┘

## Layout (Desktop — ≥768px delta)

Changes from mobile: 4-6 column Masonry grid, DesktopHeader replaces MobileHeader.

## Component Map

| Region | Component | File | Props |
|--------|-----------|------|-------|
| Header | `MobileHeader` | `lib/design-system/mobile-header.tsx` | `showSearch={true}` |
| Grid | `GridCard` | `lib/design-system/grid-card.tsx` | `variant="default" aspectRatio="dynamic"` |
| Loading | `LoadingSpinner` | `lib/design-system/loading-spinner.tsx` | `size="md"` |

## Requirements

When the page loads, the app shall fetch the first 20 images via `GET /api/v1/posts`.
When the user scrolls within 200px of the bottom, the app shall fetch the next page.
If a fetch fails, then the app shall show a retry button inline.
While images are loading, the app shall display skeleton cards.

## Acceptance Criteria

- GIVEN the user is on `/`
  WHEN the page renders
  THEN 20 image cards are visible without a login requirement

- GIVEN the user scrolls to the bottom
  WHEN 200px from the last card
  THEN the next page loads without a full-page refresh

## State & Data Flow

Data source: `useImages()` hook → `GET /api/v1/posts?page={n}&limit=20`
State: `filterStore.activeFilters`, `filterStore.category`
Mutations: none (read-only screen)

## Related

- Feature spec: `specs/discovery/spec.md#D-01`
- Next screen: `specs/detail-view/screens/SCR-VIEW-01.md`
- Data model: `specs/shared/data-models.md#Post`
```

### Feature Spec Template (spec.md)

```markdown
# Bundle: [Bundle Name]

> Features: [ID range]
> Implemented: [%]
> Dependencies: [list]

## Feature Index

| ID | Name | Priority | Status | Screen |
|----|------|----------|--------|--------|
| D-01 | Responsive Feed | P0 | done | SCR-DISC-01 |

## [D-01] Feature Name

**EARS Requirements:**
- When X, the system shall Y.
- While Z, the system shall A.

**Acceptance Criteria:**
- GIVEN ...
  WHEN ...
  THEN ...

**Files:**
- `app/page.tsx` — entry route
- `lib/components/grid/ThiingsGrid.tsx` — grid implementation
- `lib/hooks/useImages.ts` — data fetching

**Out of scope:** [explicit exclusions]
```

### Component Catalog Entry (shared/components.md)

```markdown
## GridCard

| Field | Value |
|-------|-------|
| File | `lib/design-system/grid-card.tsx` |
| Import | `import { GridCard } from "@/lib/design-system"` |
| Status | stable |

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "tall"` | `"default"` | Aspect ratio variant |
| `imageUrl` | `string` | required | Image source |
| `badge` | `BadgeProps \| undefined` | — | Optional top-left badge |

**Usage:**
\`\`\`tsx
<GridCard variant="default" imageUrl={post.imageUrl} badge={{ label: "NEW" }} />
\`\`\`

**Do not use for:** Full-width hero images (use `Card` with `variant="elevated"` instead)
```

**Confidence:** MEDIUM. Templates synthesized from GitHub Spec Kit patterns, Kiro documentation, and SoftwareSeni template research. Component catalog format derived from React component spec template (SoftwareSeni, verified).

---

## Token Efficiency Conventions

**Core problem:** Claude Code's context window is large (200K tokens) but attention degrades in the middle. Spec files injected as context must front-load critical constraints and minimize redundancy.

### Budgeting Rules

| Context Type | Token Budget | Strategy |
|-------------|-------------|---------|
| Single screen spec | ≤2,000 tokens | One file, one screen, no prose padding |
| Feature bundle spec | ≤4,000 tokens | Requirements table + EARS statements, no full UI descriptions |
| Shared data models | ≤3,000 tokens | TypeScript interfaces only, no paragraph explanations |
| Shared component catalog | ≤5,000 tokens | Table format, props only, one usage example per component |
| Full bundle context (spec + screens) | ≤15,000 tokens | Inject only relevant screens for the current task |

### Format Efficiency Rankings (HIGH confidence, multiple sources)

Best to worst for AI token efficiency:
1. TypeScript interfaces — dense semantic signal, agents already trained on them
2. Markdown tables — most info per line, easy to parse with attention heads
3. EARS statements — deterministic, no ambiguity resolution overhead
4. Code examples — concrete, eliminates inference
5. ASCII wireframes — spatial layout in ~50 tokens per screen
6. BDD scenarios — slightly verbose but maps to test code directly
7. Prose paragraphs — worst ratio, avoid for requirements
8. ASCII art with pipes and boxes in prose — avoid, wastes tokens on decoration

### Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Alternative |
|-------------|---------|-------------|
| Korean prose descriptions of UI layout | Agent must translate intent; ambiguous for non-Korean-trained model configs | ASCII wireframe + component map table |
| Repeating type definitions across spec files | Token waste; divergence risk | Single `specs/shared/data-models.md`, cross-reference by ID |
| ASCII wireframes of desktop-first layouts | Forces agent to infer mobile behavior | Always wireframe mobile first, describe desktop as deltas |
| "상태: 구현됨 ✅" without file paths | Agent doesn't know what file implements it | Always include `File: path/to/file.tsx` |
| Section headers that describe structure ("## 2. UI 와이어프레임") | Tokens wasted on numbering and Korean headers | Flat, English section names: `## Layout`, `## Requirements` |
| Requirement checklists (`- [ ] feature`) | No contractual force; ambiguous to agents | EARS syntax with `When/While/If` prefix |
| Inline cross-file requirements | Creates tangled context; agent must load multiple files | Each screen spec is self-contained; link by ID, don't embed |

**Confidence:** HIGH. Sources: Addy Osmani (2,500 agent file analysis), Faros AI context engineering guide, Thoughtworks SDD article.

---

## Auto-Documentation Tooling

**Recommendation:** Minimal new tooling. Use TypeScript compiler API directly for component extraction. Do not add Storybook for this milestone (overhead exceeds benefit for spec authoring).

### What to Use

| Tool | Purpose | Why |
|------|---------|-----|
| `ts-morph` (optional) | Extract component props from TypeScript source into markdown tables | Faster than manual, stays in sync with code. Lightweight (no test runner needed). Run as one-off script |
| TypeDoc (optional) | Generate JSON from TSDoc comments | Only worth it if JSDoc comments are already maintained. Skip if not |
| Existing TypeScript types | Primary source of truth for data models | Already in `specs/shared/data-models.md`, keep updated manually during spec rewrite |

### ts-morph Script Pattern

If implementing automated prop extraction:

```typescript
// scripts/extract-component-props.ts
import { Project } from "ts-morph";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const file = project.getSourceFileOrThrow("lib/design-system/grid-card.tsx");

// Extract exported interfaces → markdown table
// Output: specs/shared/components.md section
```

Run once per milestone, not in CI. Manual review required — agents misread CVA variant unions if auto-extracted without context.

**Confidence:** MEDIUM. ts-morph is a mature library (HIGH confidence for capability), but automation benefit for this specific CVA pattern is unverified — treat as optional optimization, not required tooling.

---

## Injection Conventions (Claude Code / Cursor / Gemini)

**How specs get consumed:**

### 1. CLAUDE.md Reference Pattern (HIGH confidence)
Add spec bundle index references in `CLAUDE.md` under a `## Specs` section. Claude Code reads CLAUDE.md on session start. Reference paths, not file content:

```markdown
## Specs

Spec bundles are in `specs/`. For any screen or feature work, read the relevant spec first:
- Discovery: `specs/discovery/spec.md`
- Detail View: `specs/detail-view/spec.md`
- Screen specs: `specs/{bundle}/screens/SCR-*.md`
- Shared models: `specs/shared/data-models.md`
- Shared components: `specs/shared/components.md`
```

### 2. Per-Task Injection Pattern
When starting implementation, include the specific screen spec as context: "Implement per `specs/discovery/screens/SCR-DISC-01.md`." Claude Code will read the file if referenced with a file path.

### 3. Modular, Not Monolithic
Do not create a single `MASTER-SPEC.md` that concatenates everything. Each task should inject only relevant files. Budget ≤3 spec files per implementation task.

### 4. Canonical ID System
Maintain the existing `SCR-DISC-01`, `D-01` ID system. It is the cross-reference key. An agent that sees `SCR-VIEW-02` in a requirement knows exactly which file to read. Do not rename to prose titles.

---

## What NOT to Use

| Approach | Why Not |
|---------|---------|
| Figma MCP for spec generation | Adds toolchain dependency; Figma states are not code states; generates pixel specs not component specs. Decoded has no Figma source of truth currently |
| Storybook for documentation | 8+ second cold start, heavy dependency, MDX overhead. Correct for component library, wrong scope for spec documentation |
| OpenAPI/Swagger for screen specs | Correct for API contracts (which already exist at `https://dev.decoded.style`), not for UI specs |
| Notion or Confluence | Not version-controlled, not injectable as file context, not readable by Claude Code's file tools |
| YAML-only specs | More token-efficient than JSON but less readable than markdown tables for humans; misses the dual-audience requirement |
| Separate video/prototype links | AI agents cannot consume them; Playwright screenshots in CI serve the visual QA need already |

---

## Integration with Existing Workflow

The decoded-app project already has:
- `specs/` directory with 9 bundles in current format
- `.planning/codebase/` as codebase SSOT
- `CLAUDE.md` referencing codebase docs
- GSD workflow with `/gsd:execute-phase` commands
- Playwright visual QA in CI

**Spec format migration does not require new tooling.** It requires:
1. Establishing English section headers as standard (reduces ambiguity for non-Korean LLM configs)
2. Replacing prose requirements with EARS statements
3. Adding component map tables to every screen spec
4. Adding file paths to every feature reference
5. Archiving existing specs as `specs/v2.1.0/`

The existing `specs/shared/data-models.md` TypeScript interface format is already correct — it is the best-performing format in this codebase for AI consumption. All other spec files should adopt the same density.

---

## Sources

- Addy Osmani, "How to write a good spec for AI agents": [https://addyosmani.com/blog/good-spec/](https://addyosmani.com/blog/good-spec/) (HIGH confidence — analysis of 2,500+ agent config files)
- Thoughtworks, "Spec-Driven Development": [https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices) (HIGH confidence — enterprise practitioner guidance)
- AGENTS.md standard: [https://agents.md/](https://agents.md/) (HIGH confidence — Linux Foundation / AAIF spec)
- Kiro steering and spec format: [https://kiro.dev/docs/steering/](https://kiro.dev/docs/steering/) (HIGH confidence — AWS official docs)
- Cloudflare "Markdown for Agents": [https://blog.cloudflare.com/markdown-for-agents/](https://blog.cloudflare.com/markdown-for-agents/) (HIGH confidence — official Cloudflare engineering blog)
- GitHub Spec Kit: [https://github.com/github/spec-kit](https://github.com/github/spec-kit) (HIGH confidence — GitHub official open source)
- Faros AI Context Engineering Guide: [https://www.faros.ai/blog/context-engineering-for-developers](https://www.faros.ai/blog/context-engineering-for-developers) (MEDIUM confidence — practitioner blog, well-sourced)
- AsciiKit wireframing conventions: [https://asciikit.com/](https://asciikit.com/) (MEDIUM confidence — single vendor source)
- SoftwareSeni spec templates: [https://www.softwareseni.com/specification-templates-for-ai-code-generation-from-first-draft-to-production/](https://www.softwareseni.com/specification-templates-for-ai-code-generation-from-first-draft-to-production/) (MEDIUM confidence — practitioner guide, unverified empirically)
- EARS syntax: [https://alistairmavin.com/ears/](https://alistairmavin.com/ears/) (HIGH confidence — original author's site, IEEE published)
