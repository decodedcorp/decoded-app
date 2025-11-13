# ADR-20251113: Introduce AI Dev Boilerplate (Cursor + Codex + SpecKit + Claude/GPT)

## Status

- Status: Trial
- Date: 2025-11-13
- Related Spec: N/A (meta decision)
- Related Issues: #<init-ai-dev-boilerplate>

## Context

- We are using multiple AI tools (Cursor, Codex, Claude, GPT, Gemini) without a unified workflow.
- Spec-driven development (SpecKit) and project rules (Cursor MDC) are emerging best practices for AI-assisted coding.
- Need for consistent AI behavior across tools and projects.

## Decision

- Create a reusable AI Dev Boilerplate with:
  - `specs/`, `docs/adr/`, `docs/ai-playbook/`
  - `.cursor/rules/spec-workflow.mdc`, `.codex/config.toml`
  - `scripts/run-spec-workflow.sh`
- Roll out in two phases:
  - Phase 1: Core skeleton + minimal integration.
  - Phase 2: Claude settings, MCP configs, README updates.

## Consequences

### Positive

- Consistent AI behavior across tools and projects.
- Easier to onboard future features and team members.
- Reduced cognitive load through standardized workflows.

### Negative

- Initial overhead in writing and maintaining specs and docs.
- Risk of over-design if the workflow is not actually used.

### Open Questions

- Will this boilerplate actually reduce rework/refactor commits?
- Should we enforce spec-driven development for all features or make it optional?

## How to Revert

- Remove boilerplate directories and configs.
- Fall back to per-project ad-hoc AI usage.

