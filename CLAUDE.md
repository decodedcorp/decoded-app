# Claude Code Instructions

## Project Guidelines and Rules

**Import all development guidelines from Cursor rules - treat these as core project standards:**

- Code Quality: 100-line file limit, single responsibility, prop limits, naming conventions
- Design System: Enforce color tokens, spacing scale, typography, semantic naming
- Performance: React.memo, useCallback, lazy loading, image optimization
- Mobile Optimization: Viewport meta, safe area, touch targets, dynamic viewport units
- Tailwind: Consistent utility usage, custom component patterns
- React Query: Data fetching patterns, cache management
- Zustand: State management conventions
- Git: Conventional commits, proper workflow
- **Spec-Driven Development: Always reference specs/ directory before implementation**

## Spec-Driven Development Workflow

### Core Principles

- **Specs First**: Before writing code, check `specs/feature/`, `specs/bugfix/`, or `specs/experiment/` for relevant specifications.
- **Spec Reference**: When implementing features, reference spec IDs in code comments: `// spec: FEATURE-xxx - description`
- **ADR Documentation**: Document significant architectural decisions in `docs/adr/` using the ADR template.

### Workflow Integration

1. **Spec Creation**: Use SpecKit/Specify CLI (`uvx specify` or `specify init`) or manually create specs from templates in `specs/feature/`.
2. **Implementation**: Cursor automatically reads specs via `.cursor/rules/spec-workflow.mdc` rule.
3. **Codex Integration**: Use `scripts/run-spec-workflow.sh FEATURE-xxx` for terminal-based spec-driven work.
4. **Review**: Ask Claude to review code against spec requirements for compliance and architecture.

### Spec Structure

Specs follow this structure (see `specs/feature/FEATURE-sample-feature.yml`):
- `id`: Unique spec identifier
- `title`: Brief description
- `context`: Problem statement and user story
- `requirements`: Functional and non-functional requirements
- `acceptance_criteria`: Measurable success criteria
- `non_goals`: Explicitly out-of-scope items
- `notes`: Related PRDs, issues, etc.

## Code Quality Standards

- **File Length Limit**: Keep components and utilities within 100 lines
- **Single Responsibility**: Each component should have one focused purpose
- **Props Limit**: Components should receive max 5 props (use composition/grouping)
- **Hook Reuse**: Avoid redefining logic - abstract into reusable hooks
- **Control Flow**: Flatten nested conditions with early returns
- **Naming**: Strict camelCase/PascalCase/kebab-case conventions
- **Folder Structure**: Clear module boundaries, group related logic

## Design System Enforcement (v3)

- **Colors**: Use role-based design tokens from Design System v3 (NO hardcoded hex values)
- **Spacing**: Follow spacing scale from `tailwind.config.ts`
- **Typography**: Use defined type scale (heading/body/caption)
- **Components**: Semantic naming (PrimaryButton, AlertCard, etc.)
- **Hierarchy**: Align visual hierarchy with design tokens
- **Theme Support**: All components must work in both dark and light themes

## Performance Requirements

- **Memoization**: Wrap expensive components with `React.memo`
- **Callbacks**: Use `useCallback` for event handlers in child props
- **Lazy Loading**: Dynamic imports for routes and heavy components
- **Image Optimization**: Use `next/image` with responsive formats
- **Dependencies**: Minimize third-party libraries, import only needed modules
- **JSX Functions**: Avoid inline anonymous functions
- **Suspense**: Use meaningful fallback UI for lazy-loaded content

## Mobile Optimization Standards

- **Viewport Configuration**: Use `viewport-fit=cover` with safe area insets
- **Dynamic Viewport Units**: Use `dvh`/`svh`/`lvh` instead of `vh` for mobile
- **Touch Targets**: Minimum 44px (iOS) or 48dp (Android) touch targets
- **Image Optimization**: Always include `width`, `height`, `srcset`, `sizes`
- **Form UX**: Use `inputmode`, `enterkeyhint`, `autocomplete` attributes
- **Scroll Performance**: Use passive scroll listeners, content-visibility
- **Gesture Handling**: Avoid conflicts with system edge gestures
- **Accessibility**: Maintain 4.5:1 text contrast, 3:1 UI contrast
- **Core Web Vitals**: Target LCP ≤ 2.5s, INP ≤ 200ms, CLS < 0.1

## Tailwind Guidelines

- Use established spacing tokens (`space-x-4`, `py-6`)
- Follow responsive patterns (`md:grid-cols-3`, `lg:text-xl`)
- Utilize custom utilities from `tailwind.config.ts`
- Maintain consistent animation/transition durations
- Use semantic color classes over arbitrary values

## React Query Patterns

- Consistent query key structure using `queryKeys.ts`
- Proper error boundary implementation
- Optimistic updates for mutations
- Background refetch configuration
- Cache invalidation strategies

## Zustand State Management

- Store slice isolation by domain
- Action grouping within stores
- Immer integration for complex state updates
- Subscription optimization
- Dev tools integration

## Git & Documentation Standards

- Conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)
- PR descriptions with context and testing notes
- Code comments only when business logic is complex
- Update relevant documentation when changing APIs
- Reference spec IDs in commit messages when applicable

**Follow all above guidelines strictly** - they ensure code consistency, maintainability, and performance across the frontend application.

## AI Tool Integration

- **Cursor**: Primary coding environment with spec-driven workflow rules
- **Codex CLI**: Terminal-based refactoring and script work via `scripts/run-spec-workflow.sh`
- **Claude**: Architecture review and spec compliance checking
- **GPT**: Documentation generation and research
- **Gemini**: Data analysis and operational tooling

See `docs/ai-playbook/ai-usage-guide.md` for detailed usage patterns.

