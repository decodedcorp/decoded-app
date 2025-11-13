# AI Usage Guide (per feature)

## Tools & Roles

### Cursor
- Main coding environment.
- Use `spec-workflow.mdc` when implementing a spec from `specs/`.
- Auto-loads rules from `.cursor/rules/*.mdc` directory.

### Codex CLI
- Use for spec-driven, repo-wide changes and terminal-based work.
- Example: run `scripts/run-spec-workflow.sh FEATURE-xxx`.
- Configuration: Copy `.codex/config.toml` to `~/.codex/config.toml` for global use.

### SpecKit/Specify CLI
- **Separate installation required**: Install via `uvx specify` or `specify init`.
- This boilerplate provides directory structure (`specs/`) and templates only.
- Use Specify CLI to create and manage spec files.
- Reference: Official SpecKit documentation.

### Claude
- Architecture and spec compliance review.
- Paste spec + diff and ask for missing cases, risks, and refactor suggestions.
- Configuration: `.claude/settings.json` and `CLAUDE.md` (Phase 2).

### GPT
- Research, ADR/PRD drafting, and learning notes.
- Use for initial research before writing specs.

### Gemini
- Data analysis (e.g., Sheets), GCP scripts, operational tooling.

## Typical Flow (per feature)

1. **Create a spec** under `specs/feature/FEATURE-*.yml`.
   - Use SpecKit/Specify CLI if installed, or manually create from template.

2. **Use Cursor Plan** to design file-level implementation.
   - Cursor will automatically reference specs via `spec-workflow.mdc` rule.

3. **Use Codex CLI** (via `run-spec-workflow.sh`) for repo-wide or script-heavy changes.
   ```bash
   scripts/run-spec-workflow.sh FEATURE-xxx
   ```

4. **Ask Claude** to review spec compliance and architecture.
   - Share spec file and code diff for review.

5. **Ask GPT** to generate tests, ADRs, and learning notes.
   - Use spec context when generating documentation.

6. **Record key decisions** in `docs/adr/`.
   - Use `ADR-0000-template.md` as starting point.

## Phase 1 vs Phase 2 Usage

### Phase 1 (Core Skeleton)
- Specs directory structure
- ADR templates
- Cursor spec-workflow rule
- Codex config template
- Workflow script

### Phase 2 (Advanced Integration)
- Claude configuration (`CLAUDE.md`, `.claude/settings.json`)
- Cursor MCP configuration (`.cursor/mcp.json`)
- Comprehensive documentation
- Full AI tool integration

## Integration Patterns

### Spec-Driven Development
1. Write spec first (or use SpecKit CLI)
2. Cursor reads spec automatically via rules
3. Codex uses spec context via workflow script
4. Claude reviews against spec
5. Document decisions in ADR

### Multi-AI Collaboration
- **Cursor**: Primary coding environment
- **Codex**: Terminal-based refactoring and script work
- **Claude**: Architecture and compliance review
- **GPT**: Documentation and research
- **Gemini**: Data analysis and operations

## Best Practices

- Always reference spec ID in code comments: `// spec: FEATURE-xxx - description`
- Keep specs updated as implementation evolves
- Use ADRs for significant architectural decisions
- Test Phase 1 workflow with one small feature before Phase 2

