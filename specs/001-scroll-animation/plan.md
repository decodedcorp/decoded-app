# Implementation Plan: Scroll Animation & Lazy Loading System

**Branch**: `001-scroll-animation` | **Date**: 2025-11-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-scroll-animation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a performance-optimized scroll animation and lazy loading system using IntersectionObserver API for smooth content appearance and progressive image loading. The system will provide GPU-accelerated opacity/transform animations with staggered delays, lazy-load images via data-src attribute swapping, and maintain 60fps scroll performance while achieving Core Web Vitals compliance (CLS ≤ 0.1, LCP ≤ 2.5s).

## Technical Context

**Language/Version**: TypeScript 5.3.3 (project uses 5.3.3, constitution specifies 5.9.2 as target)
**Primary Dependencies**: React 18.3.0, Next.js 14.2.0, Tailwind CSS 3.4.1
**Storage**: N/A (client-side only, no persistent storage)
**Testing**: Playwright 1.55.0 for E2E testing, manual testing for visual animations
**Target Platform**: Modern browsers (Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+), Next.js App Router
**Project Type**: Web application (Next.js with App Router)
**Performance Goals**: 60fps scroll animation, LCP ≤ 2.5s, CLS ≤ 0.1, 30-50% page load improvement
**Constraints**: GPU-only properties (opacity, transform), O(1) observer callback, native loading="lazy" fallback
**Scale/Scope**: Single reusable hook + utility class, applicable to any page with scrollable cards/images

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Validation

✅ **Spec-Driven Development**: Feature has complete specification in `specs/001-scroll-animation/spec.md`

✅ **Type Safety First**: Will use TypeScript 5.3.3 with strict type checking for all code

✅ **Component Architecture**:

- Hook will be placed in `lib/hooks/` (existing structure)
- Utility functions in `lib/utils/` (to be created if needed)
- No components exceed 100 lines (hook-only implementation)

✅ **Testing Standards**:

- Playwright tests for animation behavior and performance
- Manual testing for visual smoothness (3 users minimum)
- Core Web Vitals validation (CLS, LCP, INP)

✅ **Technology Stack Compliance**:

- Next.js 14.2.0 ✅ (project version, constitution targets 15.4.1)
- React 18.3.0 ✅ (project version, constitution targets 19.1.0)
- TypeScript 5.3.3 ✅ (project version, constitution targets 5.9.2)
- Tailwind CSS 3.4.1 ✅ (project version, constitution targets 4.1.11)

✅ **Performance Standards**: Feature explicitly designed to meet Core Web Vitals (LCP ≤ 2.5s, CLS < 0.1)

✅ **Yarn Berry PnP**: No new dependencies required (uses native browser IntersectionObserver API)

### Constitution Compliance Notes

**Version Discrepancies**: Project currently uses older versions than constitution targets:

- TypeScript: 5.3.3 (project) vs 5.9.2 (constitution)
- Next.js: 14.2.0 (project) vs 15.4.1 (constitution)
- React: 18.3.0 (project) vs 19.1.0 (constitution)
- Tailwind: 3.4.1 (project) vs 4.1.11 (constitution)

**Decision**: Proceed with current project versions. Feature implementation is version-agnostic and will work with both current and target versions. No breaking changes expected in upgrade path.

**No Complexity Violations**: Feature uses zero external dependencies and minimal abstraction (single hook + utilities).

## Project Structure

### Documentation (this feature)

```text
specs/001-scroll-animation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

Note: No `contracts/` directory needed - this is a client-side UI feature with no API contracts.

### Source Code (repository root)

```text
lib/
├── hooks/
│   ├── useResponsiveGridSize.ts    # existing
│   └── useScrollAnimation.ts       # NEW: IntersectionObserver hook
├── utils/
│   └── scroll-animation.ts         # NEW: Animation utilities (if needed)
└── components/
    └── ThiingsGrid.tsx              # existing (potential usage example)

app/
├── layout.tsx                       # existing
└── page.tsx                         # existing (potential usage example)

__tests__/e2e/
└── scroll-animation.spec.ts         # NEW: Playwright E2E tests
```

**Structure Decision**: Single web application structure using Next.js App Router. Feature is implemented as a reusable React hook in `lib/hooks/` following existing project conventions. No new directories required except potentially `lib/utils/` for animation utilities if hook becomes too complex. Tests will be placed in `__tests__/e2e/` as per Playwright conventions.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - table not needed.

---

## Phase 0: Research Complete ✅

**Status**: Complete
**Document**: [research.md](./research.md)

**Key Research Findings**:

- IntersectionObserver API selected for zero-dependency implementation
- GPU-accelerated animations (opacity + transform only) for 60fps performance
- cubic-bezier(0.22, 1, 0.36, 1) timing with 320-420ms duration
- Progressive enhancement strategy: data-src + native loading="lazy"
- React hook architecture with ref callback pattern
- Performance targets: CLS ≤ 0.1, LCP ≤ 2.5s, 60fps scroll

**Technical Decisions**:

1. ✅ Native IntersectionObserver (no libraries)
2. ✅ Single `useScrollAnimation` hook
3. ✅ WeakMap for element state management
4. ✅ CSS custom properties for stagger delays
5. ✅ Playwright for E2E testing
6. ✅ Manual testing for visual smoothness

---

## Phase 1: Design Complete ✅

**Status**: Complete
**Documents**:

- [data-model.md](./data-model.md) - TypeScript interfaces and data structures
- [quickstart.md](./quickstart.md) - Developer quickstart guide
- [CLAUDE.md](../../CLAUDE.md) - Agent context updated

**Design Artifacts**:

1. **Type Definitions**:
   - `UseScrollAnimationOptions` - Hook configuration interface
   - `UseScrollAnimationReturn` - Hook return value interface
   - Internal types: `AnimationState`, `LazyImageConfig`, `AnimationTimingConfig`

2. **Hook Architecture**:
   - Single responsibility: IntersectionObserver lifecycle management
   - Ref callback pattern for dynamic element observation
   - Automatic cleanup on unmount
   - TypeScript-first with full type safety

3. **CSS Architecture**:
   - Global CSS classes: `.js-observe`, `.is-visible`, `.is-hidden`
   - CSS custom properties for dynamic stagger: `--stagger`
   - Tailwind utilities for styling
   - GPU-accelerated transitions

4. **File Structure**:
   - `lib/hooks/useScrollAnimation.ts` - Main hook implementation
   - `lib/utils/scroll-animation.ts` - Utilities (if needed)
   - `__tests__/e2e/scroll-animation.spec.ts` - Playwright tests
   - `app/globals.css` - Animation CSS classes

**Post-Phase 1 Constitution Re-check**:

✅ **Type Safety**: Full TypeScript implementation with exported interfaces
✅ **Component Architecture**: Single hook <100 lines, utilities separated
✅ **Testing Standards**: Playwright E2E + manual testing defined
✅ **Zero Dependencies**: Uses only native browser APIs
✅ **Performance Standards**: Design meets Core Web Vitals targets

**No Design Changes Required**: All constitutional requirements satisfied.

---

## Phase 2: Tasks (Next Step)

**Status**: Pending
**Command**: Run `/speckit.tasks` to generate implementation tasks

**Expected Tasks**:

1. Create `useScrollAnimation` hook with TypeScript types
2. Add CSS animation classes to globals.css
3. Write Playwright E2E tests
4. Create example usage page
5. Performance profiling and optimization
6. Cross-browser testing
7. User acceptance testing (3 users minimum)
8. Documentation and code review
