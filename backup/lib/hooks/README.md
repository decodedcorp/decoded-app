# Hooks

This directory contains React hooks used throughout the application.

## Directory Structure

```
hooks/
├── common/              # Common utility hooks
│   ├── useBoolean.ts   # Boolean state management
│   ├── useDebounce.ts  # Debounced value management
│   └── useModalClose.ts # Modal closing logic
├── features/           # Feature-specific hooks
│   ├── auth/          # Authentication related hooks
│   ├── images/        # Image management hooks
│   └── ui/            # UI related hooks
```

## Usage Guidelines

1. Place common, reusable hooks in the `common` directory
2. Feature-specific hooks should go in the appropriate subdirectory under `features`
3. Each hook should:
   - Have a clear, single responsibility
   - Be well-documented with JSDoc comments
   - Include proper TypeScript types
   - Follow the naming convention: use[HookName] 