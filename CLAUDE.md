# Claude Code Instructions

## Project Guidelines and Rules

**Import all development guidelines from Cursor rules - treat these as core project standards:**

- Code Quality: 100-line file limit, single responsibility, prop limits, naming conventions
- Design System: Enforce color tokens, spacing scale, typography, semantic naming
- Performance: React.memo, useCallback, lazy loading, image optimization
- Tailwind: Consistent utility usage, custom component patterns
- React Query: Data fetching patterns, cache management
- Zustand: State management conventions
- Git: Conventional commits, proper workflow

### Code Quality Standards

- **File Length Limit**: Keep components and utilities within 100 lines
- **Single Responsibility**: Each component should have one focused purpose
- **Props Limit**: Components should receive max 5 props (use composition/grouping)
- **Hook Reuse**: Avoid redefining logic - abstract into reusable hooks
- **Control Flow**: Flatten nested conditions with early returns
- **Naming**: Strict camelCase/PascalCase/kebab-case conventions
- **Folder Structure**: Clear module boundaries, group related logic

### Design System Enforcement

- **Colors**: Only use theme-defined color tokens from `src/constants/colors.ts`
- **Spacing**: Follow spacing scale from `tailwind.config.ts`
- **Typography**: Use defined type scale (heading/body/caption)
- **Components**: Semantic naming (PrimaryButton, AlertCard, etc.)
- **Hierarchy**: Align visual hierarchy with design tokens

### Performance Requirements

- **Memoization**: Wrap expensive components with `React.memo`
- **Callbacks**: Use `useCallback` for event handlers in child props
- **Lazy Loading**: Dynamic imports for routes and heavy components
- **Image Optimization**: Use `next/image` with responsive formats
- **Dependencies**: Minimize third-party libraries, import only needed modules
- **JSX Functions**: Avoid inline anonymous functions
- **Suspense**: Use meaningful fallback UI for lazy-loaded content

### Tailwind Guidelines

- Use established spacing tokens (`space-x-4`, `py-6`)
- Follow responsive patterns (`md:grid-cols-3`, `lg:text-xl`)
- Utilize custom utilities from `tailwind.config.ts`
- Maintain consistent animation/transition durations
- Use semantic color classes over arbitrary values

### React Query Patterns

- Consistent query key structure using `queryKeys.ts`
- Proper error boundary implementation
- Optimistic updates for mutations
- Background refetch configuration
- Cache invalidation strategies

### Zustand State Management

- Store slice isolation by domain
- Action grouping within stores
- Immer integration for complex state updates
- Subscription optimization
- Dev tools integration

### Git & Documentation Standards

- Conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)
- PR descriptions with context and testing notes
- Code comments only when business logic is complex
- Update relevant documentation when changing APIs

**Follow all above guidelines strictly** - they ensure code consistency, maintainability, and performance across the frontend application.

## Task Master AI Instructions

**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
