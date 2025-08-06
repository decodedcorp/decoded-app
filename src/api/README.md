# API Layer

This directory manages the API-related code for the application.

## Structure

```
src/api/
├── config.ts              # API basic configuration (OpenAPI setup, token management)
├── generated/             # OpenAPI TypeScript generated files
├── hooks/
│   └── useApi.ts         # Unified file that re-exports domain-specific hooks
└── README.md             # This file
```

## Key Files

### `config.ts`

- OpenAPI basic configuration
- API token management
- Development environment logging setup

### `hooks/useApi.ts`

- Re-exports domain-specific API hooks
- Provides unified interface for backward compatibility

### `generated/`

- TypeScript files automatically generated from OpenAPI spec
- Includes API client, type definitions, and service classes

## Domain-Specific API Hooks

Each domain has its own API hooks:

- `src/domains/channels/hooks/useChannels.ts` - Channel-related APIs
- `src/domains/contents/hooks/useContents.ts` - Content-related APIs
- `src/domains/feeds/hooks/useFeeds.ts` - Feed-related APIs
- `src/domains/interactions/hooks/useInteractions.ts` - Interaction-related APIs
- `src/domains/auth/hooks/useAuthMutations.ts` - Authentication-related APIs

## Usage

```typescript
// Using domain-specific hooks (recommended)
import { useChannels, useChannel } from '@/domains/channels';
import { useContentsByChannel } from '@/domains/contents';

// Using unified hooks (backward compatibility)
import { useChannels, useContentsByChannel } from '@/api/hooks/useApi';
```

## Query Keys

All query keys are centrally managed in `src/lib/api/queryKeys.ts`.

## Configuration

API configuration is managed in `src/api/config.ts` and configured through environment variables:

- `NEXT_PUBLIC_API_BASE_URL`: API base URL
- Logging is automatically enabled in development environment.
