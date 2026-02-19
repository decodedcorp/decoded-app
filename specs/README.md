# DECODED Specifications

> Version: 4.0 | Updated: 2026-02-19

## Overview

This directory contains feature specifications (design intent) for decoded-app.

- **specs/**: Design intent — what should exist and how it should behave
- **docs/**: Implementation records — what is currently built
- **.planning/codebase/**: Current code analysis — how it actually works

Specs are optimized for AI agent context injection: compact, structured, verified paths.

## Directory Structure

```
specs/
├── _archive/v2.1.0/       # Previous version snapshot (read-only)
├── _shared/               # Shared foundation
│   ├── component-registry.md    # All components with verified file paths
│   ├── data-models.md           # Canonical data shapes
│   ├── api-contracts.md         # API endpoint contracts
│   ├── store-map.md             # Zustand store inventory
│   └── injection-guide.md       # How to inject specs into AI prompts
├── _next/                 # Future feature drafts (DRAFT status)
├── flows/                 # User journey flows (FLW-*)
├── screens/               # Screen specs by bundle
│   ├── detail/            # SCR-VIEW-* (detail view screens)
│   ├── discovery/         # SCR-DISC-* (home, search, feed)
│   ├── creation/          # SCR-CREA-* (upload, AI tagging)
│   └── user/              # SCR-USER-* (login, profile, settings)
├── shared/                # Legacy shared (templates, conventions)
│   └── templates/         # Spec templates
└── README.md
```

> Note: `_shared/`, `flows/`, and `screens/` will be populated in v4-02 through v4-07.
> Do not create empty directories.

## ID Scheme

| Prefix | Category | Format | Example |
|--------|----------|--------|---------|
| SCR-VIEW- | Detail view screens | SCR-VIEW-NN | SCR-VIEW-01 |
| SCR-DISC- | Discovery screens | SCR-DISC-NN | SCR-DISC-01 |
| SCR-CREA- | Creation screens | SCR-CREA-NN | SCR-CREA-01 |
| SCR-USER- | User system screens | SCR-USER-NN | SCR-USER-01 |
| FLW- | User journey flows | FLW-NN | FLW-01 |
| CMN- | Shared components | CMN-NN | CMN-01 |

## Spec Format Rules

1. **200-line target** (300-line max with written justification in frontmatter)
2. **EARS syntax** for requirements: "When [trigger], the system shall [behavior]"
3. **Mobile-first** layout: mobile wireframe is the primary design, desktop is adaptation
4. **Verified file paths**: every component path checked against filesystem before publishing
5. **No anti-features**:
   - No i18n sections (handled separately)
   - No version history tables (use git log)
   - No copied TypeScript type definitions (reference the source file)
   - No placeholder sections (omit sections that don't apply)
   - No implementation checklists (not design intent)
   - No test scenario tables (separate test docs)

## AI Agent Injection Guide

Quick reference for loading specs into AI agent prompts:

| Task | Load These Files |
|------|-----------------|
| Modifying a screen | Screen spec + `_shared/component-registry.md` + `_shared/store-map.md` |
| Adding a feature | Flow spec + affected screen specs + `_shared/api-contracts.md` |
| Fixing a bug | Screen spec + `_shared/component-registry.md` + `_shared/store-map.md` |
| Understanding data | `_shared/data-models.md` + `_shared/api-contracts.md` |
| New screen from scratch | `shared/templates/screen-spec-template.md` + `_shared/component-registry.md` |

> Full injection guide: `_shared/injection-guide.md` (created in v4-02)

## Templates

- [Screen spec template](./shared/templates/screen-spec-template.md) — for SCR-* documents
- [Flow spec template](./shared/templates/flow-spec-template.md) — for FLW-* documents

## Related Docs

- [.planning/codebase/ARCHITECTURE.md](../.planning/codebase/ARCHITECTURE.md) — system architecture
- [.planning/codebase/STRUCTURE.md](../.planning/codebase/STRUCTURE.md) — directory structure
- [.planning/codebase/CONVENTIONS.md](../.planning/codebase/CONVENTIONS.md) — coding conventions
- [docs/design-system/](../docs/design-system/) — design tokens
- [docs/api/](../docs/api/) — implemented API docs
