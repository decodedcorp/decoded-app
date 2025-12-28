# Claude Profile – Small Refactor & Code Analysis (v1.0)

**Last verified**: 2025-01-27

## When to Use Claude

- Reading and summarizing unfamiliar modules.
- Designing or reviewing refactor plans.
- Validating spec coverage against implementation (with Speckit).

## Expectations

- **For refactors**:
  - Explain what changes and why.
  - List risks and how to test quickly.
- **For analysis**:
  - Provide high-level maps: "data flow", "component tree", "responsibility split".
  - Point out smells (e.g. duplication, god components, hidden coupling).

## Working Style

- **Prefer "plan first, code later"**:
  1. Summarize current state.
  2. Suggest refactor plan.
  3. Only then show example code changes.
- **Keep suggestions minimally invasive and reversible**.
