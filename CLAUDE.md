# Claude Code Instructions

## Project Guidelines and Rules

**Import all development guidelines from Cursor rules - treat these as core project standards:**

- Code Quality: 100-line file limit, single responsibility, prop limits, naming conventions
- Design System: Enforce color tokens, spacing scale, typography, semantic naming
- Performance: React.memo, useCallback, lazy loading, image optimization
- **Mobile Optimization: Viewport meta, safe area, touch targets, dynamic viewport units**
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

### Design System Enforcement (v3)

- **Colors**: Use role-based design tokens from Design System v3 (NO hardcoded hex values)
  - Use `text-primary`, `bg-primary`, `border-primary-bd` instead of `#EAFD66`
  - Use `text-primary-on` for text on primary backgrounds
  - Use `bg-primary-bg` for subtle primary backgrounds
  - Legacy colors available during migration via alias layer
- **Spacing**: Follow spacing scale from `tailwind.config.ts`
- **Typography**: Use defined type scale (heading/body/caption)
- **Components**: Semantic naming (PrimaryButton, AlertCard, etc.)
- **Hierarchy**: Align visual hierarchy with design tokens
- **Theme Support**: All components must work in both dark and light themes

### Performance Requirements

- **Memoization**: Wrap expensive components with `React.memo`
- **Callbacks**: Use `useCallback` for event handlers in child props
- **Lazy Loading**: Dynamic imports for routes and heavy components
- **Image Optimization**: Use `next/image` with responsive formats
- **Dependencies**: Minimize third-party libraries, import only needed modules
- **JSX Functions**: Avoid inline anonymous functions
- **Suspense**: Use meaningful fallback UI for lazy-loaded content

### Mobile Optimization Standards

- **Viewport Configuration**: Use `viewport-fit=cover` with safe area insets
- **Dynamic Viewport Units**: Use `dvh`/`svh`/`lvh` instead of `vh` for mobile
- **Touch Targets**: Minimum 44px (iOS) or 48dp (Android) touch targets
- **Image Optimization**: Always include `width`, `height`, `srcset`, `sizes`
- **Form UX**: Use `inputmode`, `enterkeyhint`, `autocomplete` attributes
- **Scroll Performance**: Use passive scroll listeners, content-visibility
- **Gesture Handling**: Avoid conflicts with system edge gestures
- **Accessibility**: Maintain 4.5:1 text contrast, 3:1 UI contrast
- **Core Web Vitals**: Target LCP ≤ 2.5s, INP ≤ 200ms, CLS < 0.1

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

## Design System v3 Migration Status

**✅ Infrastructure Complete** - All foundation components ready for migration:
- Role-based design tokens (`src/styles/design-tokens.css`)
- Legacy compatibility layer (`src/styles/design-alias.css`)
- SSR theme system with FOUC prevention (`src/hooks/useTheme.ts`)
- Updated Tailwind config with new color mappings
- Comprehensive migration guide (`docs/design-system-migration-guide.md`)
- PR template with DoD checklist (`docs/pr-template.md`)

**🎯 Current Migration Phase**: Replace hardcoded `#EAFD66` with semantic tokens

**Priority Order for Component Migration**:
1. **Button Component** - `packages/ui/src/components/Button/Button.tsx`
2. **Header Component** - `src/shared/components/Header.tsx`
3. **Notification Components** - `src/shared/components/NotificationButton.tsx`
4. **Search Components** - `src/domains/search/components/SearchAutocomplete.tsx`

**Key Migration Rules**:
- Replace `text-[#EAFD66]` → `text-primary`
- Replace `bg-[#EAFD66]` → `bg-primary`
- Replace `bg-[#EAFD66] text-black` → `bg-primary text-primary-on`
- Replace `border-[#EAFD66]` → `border-primary-bd`
- Use `bg-primary-bg` for subtle backgrounds (replaces `bg-[#EAFD66]/10`)

## Task Master AI Instructions

**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
