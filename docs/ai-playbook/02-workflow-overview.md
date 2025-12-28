# Workflow Overview (v1.0)

**Last verified**: 2025-01-27  
**Version**: 1.0

## Default Feature Workflow

This is the standard pipeline for implementing a new feature. Read this first to understand how AI tools work together in this project.

### 1. Define

- Create or refine a GitHub Issue.
- Use Codex + `docs/prompts/codex/spec-from-issue.md` to generate a feature spec under `specs/feature/`.

### 2. Review

- Use Speckit + Claude to:
  - Check assumptions, edge cases, and risks.
  - Align with `docs/ai-playbook/01-principles.md`.

### 3. Implement

- Use Cursor as main coding assistant:
  - Read the spec.
  - Apply `.cursor/rules/*` (base + frontend + ai-collab).
  - Implement changes with small commits.

### 4. Document

- Use Gemini with `docs/prompts/gemini/feature-doc.md`:
  - Generate `docs/features/<feature-id>.md`.
  - Produce a short summary for release notes.

### 5. Log & Reflect

- Add one entry to `docs/ai-playbook/usage-log.md` with:
  - Date
  - Task
  - Tools used (and tools NOT used + why)
  - What worked / what was confusing

This single workflow covers most feature work. See tool profiles for specific use cases.

## Other Workflows

### Small Refactor

1. **Claude**: Analyze code and propose refactor plan
2. **Cursor**: Apply refactor following plan

### Bug Fix

1. **Codex**: Create bugfix spec (optional for simple fixes)
2. **Cursor**: Implement fix
3. **Gemini**: Document fix (optional)

## Integration Notes

- **Speckit** (`.specify/`): Existing infrastructure preserved. Claude uses `.claude/commands/speckit.*` for spec review.
- **Cursor Rules** (`.cursor/rules/`): Automatically applied when using Cursor.
- **Templates**: Located in `docs/prompts/` for Gemini and Codex.
