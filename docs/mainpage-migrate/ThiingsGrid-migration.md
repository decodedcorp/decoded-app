# ThiingsGrid Migration & Refactoring Log

## Overview

ThiingsGrid is the infinite omnidirectional scroll grid component for the main page.
This document tracks the migration, refactoring, and testing process from legacy to v2.

## Migration Steps

- [x] Initial code copy from backup to `src/domains/main/ThiingsGrid.tsx`
- [ ] Remove legacy dependencies, props, and state
- [ ] Refactor to use v2 data/state management (store, react-query, etc)
- [ ] Apply design system/tokens for all styles
- [ ] Add tests, Storybook stories, and documentation

## Key Decisions

- Only essential logic and UI are migrated; unnecessary legacy code will be removed.
- All styles must use Tailwind design tokens.
- State management will be unified with v2 store/react-query.

## Issues & Solutions

- [2024-06-23] Found direct function props from server to client: fixed by making MainPage a client component.

## TODO

- [ ] Refactor props and types for clarity and maintainability
- [ ] Add usage examples and API documentation
- [ ] Write Storybook stories for all grid features

## References

- [src/domains/main/ThiingsGrid.tsx](../../src/domains/main/ThiingsGrid.tsx)
- [main migration log](./2024-06-22-init.md)
