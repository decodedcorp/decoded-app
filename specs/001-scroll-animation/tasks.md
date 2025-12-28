# Tasks: Scroll Animation & Lazy Loading System

**Input**: Design documents from `/specs/001-scroll-animation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Test tasks are included based on constitution requirements for Playwright E2E testing and manual testing.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project Type**: Web application (Next.js with App Router)
- **Structure**: `lib/hooks/`, `lib/utils/`, `app/`, `__tests__/e2e/`
- All paths relative to repository root: `/Users/kiyeol/development/decoded/decoded-app/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic CSS infrastructure

- [x] T001 Create CSS animation classes in app/globals.css with .js-observe, .is-visible, .is-hidden styles using GPU-accelerated properties (opacity, transform)
- [x] T002 [P] Add CSS custom property support for --stagger variable in app/globals.css
- [x] T003 [P] Verify TypeScript configuration supports React hooks and strict type checking in tsconfig.json

**Checkpoint**: CSS infrastructure ready for animation implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TypeScript types and interfaces that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create UseScrollAnimationOptions interface in lib/hooks/useScrollAnimation.ts with threshold, rootMargin, onEnter, onExit properties
- [x] T005 [P] Create UseScrollAnimationReturn interface in lib/hooks/useScrollAnimation.ts with observeRef, observe, unobserve, disconnect, isObserving methods
- [x] T006 [P] Create internal AnimationState interface for element state tracking (isVisible, imageLoaded, staggerDelay)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Smooth Content Appearance on Scroll (Priority: P1) 🎯 MVP

**Goal**: Implement core scroll animation system using IntersectionObserver with smooth opacity/transform transitions and staggered delays

**Independent Test**: Can be fully tested by scrolling a page with multiple card elements and verifying that each card transitions from invisible to visible with smooth opacity and transform animations over 320-420ms

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Create Playwright E2E test for basic card animation in **tests**/e2e/scroll-animation.spec.ts - verify .is-visible class added on scroll
- [x] T008 [P] [US1] Create Playwright E2E test for staggered animation timing in **tests**/e2e/scroll-animation.spec.ts - verify cascading effect with multiple cards
- [x] T009 [P] [US1] Create Playwright E2E test for exit animation in **tests**/e2e/scroll-animation.spec.ts - verify .is-hidden class added when scrolling away

### Implementation for User Story 1

- [x] T010 [US1] Implement IntersectionObserver initialization in useScrollAnimation hook in lib/hooks/useScrollAnimation.ts with threshold 0.15 and rootMargin "0px 0px -10% 0px"
- [x] T011 [US1] Implement observer callback logic in lib/hooks/useScrollAnimation.ts to handle intersection entries and toggle is-visible/is-hidden classes
- [x] T012 [US1] Implement stagger delay extraction from data-delay attribute in lib/hooks/useScrollAnimation.ts and set --stagger CSS custom property
- [x] T013 [US1] Implement observeRef callback function in lib/hooks/useScrollAnimation.ts using useCallback for element observation
- [x] T014 [US1] Implement cleanup and disconnect logic in lib/hooks/useScrollAnimation.ts using useEffect cleanup function
- [x] T015 [US1] Add proper TypeScript type exports for UseScrollAnimationOptions and UseScrollAnimationReturn in lib/hooks/useScrollAnimation.ts
- [x] T016 [US1] Create example usage page in app/examples/scroll-animation/page.tsx demonstrating basic card animation with 3-5 cards and varying stagger delays
- [ ] T017 [US1] Verify animations run at 60fps using Chrome DevTools Performance panel - no layout thrashing or paint operations

**Checkpoint**: At this point, User Story 1 should be fully functional - cards animate smoothly on scroll with staggered delays

---

## Phase 4: User Story 2 - Progressive Image Loading (Priority: P2)

**Goal**: Add lazy loading functionality for images using data-src attribute swapping with IntersectionObserver

**Independent Test**: Can be tested by loading a page with images, monitoring network requests, and verifying that below-the-fold images don't load until scrolled near

### Tests for User Story 2

- [x] T018 [P] [US2] Create Playwright E2E test for lazy image loading in **tests**/e2e/scroll-animation.spec.ts - verify images load only when scrolled near
- [x] T019 [P] [US2] Create Playwright E2E test for preventing image reload in **tests**/e2e/scroll-animation.spec.ts - verify data-loaded="true" prevents redundant loads
- [x] T020 [P] [US2] Create Playwright E2E test for above-the-fold images in **tests**/e2e/scroll-animation.spec.ts - verify hero images load immediately

### Implementation for User Story 2

- [x] T021 [US2] Add image lazy loading logic to observer callback in lib/hooks/useScrollAnimation.ts - query for img[data-src] elements
- [x] T022 [US2] Implement data-src to src attribute swapping in lib/hooks/useScrollAnimation.ts when element enters viewport
- [x] T023 [US2] Implement data-loaded="true" marking in lib/hooks/useScrollAnimation.ts to prevent reload on re-entry
- [x] T024 [US2] Add enableLazyLoad option to UseScrollAnimationOptions interface in lib/hooks/useScrollAnimation.ts (default: true)
- [x] T025 [US2] Update example page in app/examples/scroll-animation/page.tsx to demonstrate lazy image loading with multiple images and proper dimensions (width/height)
- [x] T026 [US2] Verify images have fixed dimensions (width/height or aspect-ratio) in example page to prevent CLS
- [x] T027 [US2] Add native loading="lazy" attribute to all example images in app/examples/scroll-animation/page.tsx for progressive enhancement

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - animations work AND images lazy load

---

## Phase 5: User Story 3 - Performance-Optimized Scrolling (Priority: P3)

**Goal**: Optimize animation performance to maintain 60fps on mid-range devices and achieve Core Web Vitals compliance

**Independent Test**: Can be tested by measuring frame rates during scroll on various devices, checking Core Web Vitals (CLS ≤ 0.1, LCP ≤ 2.5s), and verifying GPU-accelerated rendering

### Tests for User Story 3

- [x] T028 [P] [US3] Create Playwright test for 60fps performance in **tests**/e2e/scroll-animation.spec.ts using performance.now() to measure frame times
- [x] T029 [P] [US3] Create Playwright test for Core Web Vitals in **tests**/e2e/scroll-animation.spec.ts - measure CLS, LCP, INP using web-vitals library
- [x] T030 [P] [US3] Create Playwright test for mobile performance in **tests**/e2e/scroll-animation.spec.ts using device emulation (iPhone 12, Galaxy S21)

### Implementation for User Story 3

- [x] T031 [US3] Add will-change: opacity, transform CSS hint to .js-observe class in app/globals.css (scoped to animated elements only)
- [x] T032 [US3] Implement O(1) complexity validation in observer callback in lib/hooks/useScrollAnimation.ts - no DOM queries or measurements
- [x] T033 [US3] Add input validation for threshold (0.0-1.0) and rootMargin (valid CSS string) in lib/hooks/useScrollAnimation.ts
- [x] T034 [US3] Optimize observer callback to avoid layout queries (getBoundingClientRect, offsetWidth) in lib/hooks/useScrollAnimation.ts
- [x] T035 [US3] Add WeakMap for element state storage in lib/hooks/useScrollAnimation.ts for automatic garbage collection
- [ ] T036 [US3] Profile animation performance using Chrome DevTools Performance panel - verify compositor thread usage and <16.67ms frame times
- [ ] T037 [US3] Test on mobile devices (real devices or BrowserStack) - verify 60fps on iPhone 12 and Samsung Galaxy S21
- [ ] T038 [US3] Run Lighthouse audit on example page - verify Core Web Vitals scores (LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms)

**Checkpoint**: All user stories should now be independently functional with performance targets met

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T039 [P] Add JSDoc documentation to useScrollAnimation hook in lib/hooks/useScrollAnimation.ts with usage examples
- [ ] T040 [P] Create README.md in specs/001-scroll-animation/ documenting API usage and examples
- [ ] T041 [P] Add error handling for invalid options (threshold, rootMargin) in lib/hooks/useScrollAnimation.ts with descriptive error messages
- [ ] T042 [P] Add accessibility considerations documentation - note that animations respect prefers-reduced-motion (future enhancement)
- [ ] T043 Create comprehensive example page in app/examples/scroll-animation/page.tsx demonstrating all features (animation, lazy loading, stagger, performance)
- [ ] T044 Run quickstart.md validation - follow 5-minute quick start guide and verify all steps work
- [ ] T045 Cross-browser testing - verify functionality in Chrome, Firefox, Safari, Edge (latest versions)
- [ ] T046 Manual user testing - recruit 3 users to test animation smoothness and provide feedback (per constitution requirement)
- [ ] T047 Update CLAUDE.md agent context with final implementation notes and usage patterns
- [ ] T048 Code review and refactoring - ensure hook is <100 lines and follows React best practices
- [ ] T049 [P] Optimize bundle size - verify zero external dependencies and minimal code footprint
- [ ] T050 Final performance validation - run full Lighthouse audit and verify all Core Web Vitals targets met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - No dependencies on US1 (can run in parallel)
  - User Story 3 (P3): Depends on US1 and US2 implementation for performance testing
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ Independent
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1 ✅ Independent (can run in parallel with US1)
- **User Story 3 (P3)**: Requires US1 and US2 implementation for performance testing ⚠️ Sequential

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Core hook logic before example pages
- Animation system before lazy loading integration
- Implementation before performance optimization
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: T001, T002, T003 can run in parallel
- **Foundational Phase**: T005, T006 can run in parallel (after T004 interface created)
- **User Story 1 Tests**: T007, T008, T009 can run in parallel
- **User Story 2 Tests**: T018, T019, T020 can run in parallel
- **User Story 3 Tests**: T028, T029, T030 can run in parallel
- **User Stories 1 & 2**: Can be implemented in parallel by different developers (after Foundational phase)
- **Polish Phase**: T039, T040, T041, T042, T049 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T007: "Create Playwright E2E test for basic card animation in __tests__/e2e/scroll-animation.spec.ts"
Task T008: "Create Playwright E2E test for staggered animation timing in __tests__/e2e/scroll-animation.spec.ts"
Task T009: "Create Playwright E2E test for exit animation in __tests__/e2e/scroll-animation.spec.ts"

# After tests fail, implement core hook (sequential):
Task T010 → T011 → T012 → T013 → T014 → T015
# Then create example page and validate:
Task T016 → T017
```

## Parallel Example: User Story 1 & 2 (Multi-developer)

```bash
# Developer A: User Story 1 (Animation)
Phase 3: T007-T017

# Developer B: User Story 2 (Lazy Loading) - can start at same time after Foundational
Phase 4: T018-T027

# Both stories can be implemented independently and merged without conflicts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T007-T017)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo basic scroll animations ✅ MVP Delivered!

**MVP Deliverable**: Working scroll animation system with smooth opacity/transform transitions and staggered delays

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T007-T017) → Test independently → Deploy/Demo ✅ MVP!
3. Add User Story 2 (T018-T027) → Test independently → Deploy/Demo ✅ Lazy Loading!
4. Add User Story 3 (T028-T038) → Test independently → Deploy/Demo ✅ Performance Optimized!
5. Polish (T039-T050) → Final validation → Production Ready ✅

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T006)
2. Once Foundational is done:
   - Developer A: User Story 1 (T007-T017) - Animation system
   - Developer B: User Story 2 (T018-T027) - Lazy loading (can start in parallel!)
3. Developer C: User Story 3 (T028-T038) - Performance optimization (requires US1 & US2)
4. Team: Polish phase together (T039-T050)

---

## Task Breakdown by User Story

### User Story 1 (P1): Smooth Content Appearance - 11 tasks

- Tests: 3 tasks (T007-T009)
- Implementation: 8 tasks (T010-T017)
- **Can deliver as MVP**: YES ✅

### User Story 2 (P2): Progressive Image Loading - 10 tasks

- Tests: 3 tasks (T018-T020)
- Implementation: 7 tasks (T021-T027)
- **Can deliver independently**: YES ✅

### User Story 3 (P3): Performance-Optimized Scrolling - 11 tasks

- Tests: 3 tasks (T028-T030)
- Implementation: 8 tasks (T031-T038)
- **Can deliver independently**: NO ⚠️ (requires US1 & US2 for testing)

### Total Tasks: 50 tasks

- Setup: 3 tasks
- Foundational: 3 tasks
- User Stories: 32 tasks
- Polish: 12 tasks

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable (US1 and US2 are fully independent)
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution requires: Playwright E2E testing ✅, Manual testing with 3 users ✅, Type safety ✅
- Zero external dependencies - uses only native browser APIs ✅
- Performance targets: 60fps, CLS ≤ 0.1, LCP ≤ 2.5s ✅

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
✅ All user story tasks include [US1], [US2], or [US3] labels
✅ All tasks include specific file paths for implementation
✅ Sequential task IDs (T001-T050)
✅ Parallel opportunities marked with [P]
✅ Tests included per constitution requirements
✅ Independent test criteria defined for each user story
