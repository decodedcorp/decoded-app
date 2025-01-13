# Utilities

This directory contains utility functions used throughout the application.

## Directory Structure

```
utils/
├── string/            # String manipulation utilities
│   ├── format.ts     # String formatting functions
│   └── transform.ts  # String transformation functions
├── object/           # Object manipulation utilities
│   ├── transform.ts  # Object transformation functions
│   └── object.ts     # Object utility functions
└── style/            # Style-related utilities
    └── index.ts      # Style utility functions
```

## Usage Guidelines

1. Group related utilities in appropriate directories
2. Each utility function should:
   - Be pure (no side effects)
   - Be well-documented with JSDoc comments
   - Include proper TypeScript types
   - Have a clear, single responsibility
3. Export all utilities as named exports
4. Use descriptive names that indicate the function's purpose 