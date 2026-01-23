# Decoded App - Directory Structure & Conventions

## Monorepo Layout

```
decoded-app/
├── package.json              # Root workspace config (Yarn 4.9.2)
├── packages/
│   ├── web/                  # Main Next.js application
│   └── shared/               # Shared types, hooks, utilities
├── docs/                     # Documentation & design system
├── .claude/                  # Claude Code configuration
├── .cursor/                  # Cursor IDE rules
├── .specify/                 # SpecKit templates
├── .planning/                # Architecture & planning docs
└── .vscode/                  # VS Code settings
```

## Web Package Structure

### `packages/web/app/` - Next.js App Router

#### Page Organization
```
app/
├── page.tsx                  # Home page (/)
├── layout.tsx                # Root layout wrapper
├── providers.tsx             # App providers (React Query, Theme, Auth)
├── globals.css               # Global styles
│
├── api/v1/                   # API routes
│   ├── posts/
│   │   ├── route.ts         # POST /api/v1/posts - Fetch posts
│   │   ├── upload/route.ts  # POST /api/v1/posts/upload - Upload images
│   │   └── analyze/route.ts # POST /api/v1/posts/analyze - AI analysis
│   └── categories/route.ts  # GET /api/v1/categories - Fetch categories
│
├── @modal/                   # Parallel route for modals
│   └── (.)images/[id]/page.tsx
│
├── debug/                    # Debug/development pages
│   └── supabase/posts/page.tsx
│
├── images/
│   ├── page.tsx             # Image gallery browse
│   ├── [id]/page.tsx        # Image detail view
│   ├── ImagesClient.tsx      # Client component with hooks
│   ├── ImageCard.tsx         # Card component
│   ├── ImageCardSkeleton.tsx
│   ├── EmptyState.tsx
│   └── ErrorState.tsx
│
├── posts/
│   └── [id]/page.tsx        # Post detail view
│
├── explore/
│   ├── page.tsx             # Explore page
│   └── ExploreClient.tsx     # Client component
│
├── search/
│   ├── page.tsx             # Search results page
│   └── SearchPageClient.tsx  # Search UI logic
│
├── feed/
│   ├── page.tsx             # Social feed
│   └── FeedClient.tsx        # Feed client logic
│
├── request/                 # Post creation workflow
│   ├── page.tsx             # Upload step
│   ├── upload/page.tsx      # Image selection
│   ├── detect/page.tsx      # AI detection results
│   └── [...slug]/page.tsx   # Catch-all for flow
│
├── profile/
│   └── page.tsx             # User profile
│
├── login/
│   ├── layout.tsx           # Auth layout
│   └── page.tsx             # Login page
│
├── lab/                     # Experimental features
│   ├── fashion-scan/page.tsx
│   └── ascii-text/page.tsx
│
└── examples/
    └── scroll-animation/page.tsx
```

#### File Naming Conventions

| File Type | Convention | Example |
|-----------|-----------|---------|
| Pages | lowercase, kebab-case | `page.tsx`, `[id]/page.tsx` |
| Client Markers | "Client" suffix | `ExploreClient.tsx`, `FeedClient.tsx` |
| Server Markers | "Server" suffix | `main-page.server.ts` (queries only) |
| Components | PascalCase | `ImageCard.tsx`, `Header.tsx` |
| Utilities | camelCase | `imageCompression.ts`, `fallbackImages.ts` |
| Hooks | camelCase with "use" prefix | `usePosts.ts`, `useImageUpload.ts` |
| Stores | camelCase with "Store" suffix | `authStore.ts`, `requestStore.ts` |
| Types | camelCase | `types.ts`, `api/types.ts` |
| Tests | match source + ".test" or ".spec" | `Component.test.tsx` |

---

## `packages/web/lib/` - Application Logic Layer

### Directory Structure

```
lib/
├── api/                      # API client functions
│   ├── index.ts             # Export barrel (re-exports)
│   ├── posts.ts             # POST APIs (upload, analyze, create)
│   ├── categories.ts        # Category endpoints
│   └── types.ts             # API request/response types
│
├── components/              # React components (organized by feature)
│   ├── index.ts             # Main barrel export
│   ├── auth/                # Authentication components
│   │   ├── index.ts
│   │   ├── AuthProvider.tsx # OAuth setup + session listener
│   │   └── LoginCard.tsx    # Login UI
│   │
│   ├── ui/                  # Atomic UI components (shadcn/ui based)
│   │   ├── button.tsx
│   │   ├── modal.tsx
│   │   ├── card.tsx
│   │   └── ...more
│   │
│   ├── main/                # Home page components
│   │   ├── index.ts
│   │   ├── HomeAnimatedContent.tsx
│   │   ├── MainFooter.tsx
│   │   ├── HeroSection.tsx
│   │   └── ...feature sections
│   │
│   ├── search/              # Search page components
│   │   ├── index.ts
│   │   ├── SidebarSearchPanel.tsx
│   │   └── ...search UI
│   │
│   ├── request/             # Post creation workflow components
│   │   ├── RequestModal.tsx    # Main modal container
│   │   ├── ArtistInput.tsx
│   │   ├── ContextSelector.tsx
│   │   ├── DetailsStep.tsx     # Step 2: Details form
│   │   ├── SubmitStep.tsx      # Step 3: Review form
│   │   ├── SubmitPreview.tsx
│   │   ├── MediaSourceInput.tsx
│   │   └── ...form components
│   │
│   ├── detail/              # Detail view components
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── ...detail UI
│   │
│   ├── profile/             # User profile components
│   │   ├── index.ts
│   │   └── ...profile UI
│   │
│   ├── fashion-scan/        # Fashion scanning feature
│   │   ├── types.ts
│   │   ├── callout-utils.ts
│   │   └── ...components
│   │
│   ├── dome/                # Visualization components
│   │   └── index.ts
│   │
│   ├── ConditionalNav.tsx   # Responsive nav (sidebar + mobile)
│   ├── Header.tsx           # Mobile header
│   ├── Sidebar.tsx          # Main sidebar navigation
│   ├── MobileNavBar.tsx     # Mobile bottom nav
│   ├── DecodedLogo.tsx      # Logo with animation
│   ├── ThiingsGrid.tsx      # Main grid component
│   ├── FeedCard.tsx         # Social-like card
│   ├── FilterTabs.tsx
│   ├── SearchInput.tsx
│   ├── SidebarFilterPanel.tsx
│   ├── SimpleFilterDropdown.tsx
│   ├── VerticalFeed.tsx
│   ├── ASCIIText.tsx        # ASCII text component
│   ├── PostBadge.tsx
│   └── ThiingsGrid.best-practices.md
│
├── hooks/                   # Custom React hooks
│   ├── debug/               # Debug-specific hooks
│   │   └── usePosts.ts
│   │
│   ├── useImages.ts         # Fetch images with filtering
│   ├── usePosts.ts          # Fetch posts (single + infinite)
│   ├── useItems.ts          # Fetch items from images
│   ├── useImageById.ts      # Single image query
│   ├── useCreatePost.ts     # Post creation workflow
│   ├── useImageUpload.ts    # Image upload to storage
│   ├── useCategories.ts     # Fetch categories
│   ├── useSearch.ts         # Search logic + debouncing
│   ├── useSearchURLSync.ts  # Sync search to URL params
│   ├── useScrollAnimation.ts # GSAP scroll animations
│   ├── useFlipTransition.ts # Flip animation state
│   ├── useMediaQuery.ts     # Responsive breakpoints
│   ├── useResponsiveGridSize.ts
│   ├── useNormalizedItems.ts
│   ├── useDebounce.ts
│   ├── useSpotCardSync.ts
│   └── debug/usePosts.ts
│
├── stores/                  # Zustand state stores
│   ├── authStore.ts         # OAuth + auth state
│   ├── requestStore.ts      # Multi-step post creation
│   ├── profileStore.ts      # User profile data
│   ├── searchStore.ts       # Search state
│   ├── filterStore.ts       # Category filters (re-export from shared)
│   ├── transitionStore.ts   # Page transition animations
│   └── example-store.ts
│
├── supabase/                # Supabase client + queries
│   ├── init.ts             # Browser client init (side-effect)
│   ├── server.ts           # Server-side admin client
│   ├── client.ts           # Re-exports (backward compatibility)
│   ├── env.ts              # Environment config
│   ├── types.ts            # Generated TypeScript types from DB
│   ├── storage.ts          # File storage operations
│   │
│   └── queries/
│       ├── main-page.server.ts    # SSR: home page content
│       ├── images.ts              # Client: image queries
│       ├── images.server.ts       # Server: image queries for SSR
│       ├── posts.ts               # Client: post queries with joins
│       ├── posts.server.ts        # Server: post SSR queries
│       ├── items.ts               # Client: item queries
│       ├── debug/
│       │   ├── posts.ts
│       │   └── posts.server.ts
│       └── [more query files]
│
├── react-query/             # React Query configuration
│   └── client.ts            # QueryClient singleton + defaults
│
├── utils/                   # Utility functions
│   ├── main-page-mapper.ts  # Transform DB records → UI props
│   ├── color.ts             # Color utilities
│   ├── imageCompression.ts  # Client-side image compression
│   ├── validation.ts        # Input validation functions
│   ├── fallbackImages.ts    # Fallback image URLs
│   ├── locale.ts            # Localization utilities
│   └── utils.ts             # General utilities
│
└── data/                    # Static data
    └── heroSlides.ts        # Hero carousel data
```

### Import Path Aliases

```json
{
  "paths": {
    "@/*": ["./*"],                    // Relative to packages/web/
    "@decoded/shared": ["../shared/index.ts"],
    "@decoded/shared/*": ["../shared/*"]
  }
}
```

---

## `packages/shared/` - Shared Code

### Structure

```
shared/
├── index.ts                 # Main barrel export
├── package.json
├── tsconfig.json
│
├── api/                     # Shared API utilities
│   └── ...types/functions
│
├── hooks/                   # Shared React hooks
│   └── useFilterStore.ts
│
├── stores/                  # Shared Zustand stores
│   └── filterStore.ts       # Category/filter state
│
├── supabase/                # Shared Supabase logic
│   ├── queries/
│   │   ├── images.ts        # Image queries (used by web)
│   │   ├── posts.ts
│   │   └── items.ts
│   └── types.ts
│
├── types/                   # TypeScript type definitions
│   ├── index.ts
│   ├── api.ts
│   ├── database.ts
│   └── domain.ts
│
├── data/                    # Shared static data
│   └── ...data files
│
└── react-query/             # Shared React Query config
    └── client.ts
```

---

## `docs/` - Documentation

```
docs/
├── README.md                # Documentation index
├── adr/                     # Architecture Decision Records
├── api/                     # API documentation
├── ai-playbook/             # AI tool usage guides
├── design-system/           # Design tokens & guidelines
│   ├── components/          # Component specifications
│   └── tokens.md            # Design tokens
├── database/                # Database schemas & migrations
├── architecture/            # Architecture diagrams
└── diagrams/                # Visual diagrams (PNG, SVG)
```

---

## Key File Locations by Feature

### Authentication
- **Store**: `lib/stores/authStore.ts`
- **Provider**: `lib/components/auth/AuthProvider.tsx`
- **UI**: `lib/components/auth/LoginCard.tsx`
- **Client Init**: `lib/supabase/init.ts`
- **Page**: `app/login/page.tsx`

### Image Upload & Analysis
- **API**: `lib/api/posts.ts` (uploadImage, analyzeImage)
- **Hook**: `lib/hooks/useImageUpload.ts`
- **Store**: `lib/stores/requestStore.ts`
- **Routes**: `app/api/v1/posts/{upload,analyze}/`
- **Page**: `app/request/upload/page.tsx`

### Post Creation Workflow
- **Store**: `lib/stores/requestStore.ts` (steps 1-4)
- **Components**: `lib/components/request/DetailsStep.tsx`, etc.
- **Hook**: `lib/hooks/useCreatePost.ts`
- **Modal**: `lib/components/request/RequestModal.tsx`
- **API**: `lib/api/posts.ts` (createPost)

### Search & Discovery
- **Pages**: `app/search/`, `app/explore/`, `app/images/`
- **Store**: `lib/stores/searchStore.ts`, `@decoded/shared` filterStore
- **Hooks**: `useSearch()`, `useSearchURLSync()`, `useImages()`
- **Components**: `lib/components/search/*`

### Image & Post Browsing
- **Gallery**: `app/images/page.tsx` + `ImagesClient.tsx`
- **Grid**: `lib/components/ThiingsGrid.tsx`
- **Card**: `lib/components/ImageCard.tsx`, `FeedCard.tsx`
- **Detail**: `app/images/[id]/page.tsx`, `app/posts/[id]/page.tsx`
- **Hooks**: `useImages()`, `useImageById()`, `usePosts()`

### Animations
- **Hooks**: `lib/hooks/useScrollAnimation.ts`, `useFlipTransition.ts`
- **Stores**: `lib/stores/transitionStore.ts`
- **Example**: `app/examples/scroll-animation/page.tsx`
- **Libraries**: GSAP 3.13.0, Motion 12.23.12, Lenis 1.3.15

---

## Database & Backend

### Supabase Tables
- **image**: `{ id, image_url, status, image_hash, with_items }`
- **item**: `{ id, image_id, product_name, brand, price, bboxes, center, ... }`
- **post**: `{ id, account, ts, article, item_ids, metadata }`
- **post_image**: `{ post_id, image_id, item_locations, curated_item_ids }`

### Type Generation
- Types auto-generated from Supabase schema
- Location: `lib/supabase/types.ts`
- Command: (via Supabase CLI)

### Query Patterns
```typescript
// Server-side (SSR)
const data = await fetchWeeklyBestImagesServer(limit);

// Client-side (React Query)
const { data } = useInfinitePosts({ sort: "recent" });
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript compiler options, path aliases |
| `eslint.config.mjs` | ESLint 9 flat config |
| `.prettierrc` | Prettier formatting rules |
| `next.config.ts` | Next.js build configuration |
| `.env.local` | Local environment variables (gitignored) |
| `.env.local.example` | Template for environment variables |
| `.gitignore` | Git exclusions |

---

## Testing & Quality

```
__tests__/
├── e2e/                     # End-to-end tests
└── [test files by feature]
```

- **Testing Framework**: Playwright (for E2E)
- **Linting**: ESLint 9 with Next.js plugin
- **Formatting**: Prettier 3.6.2
- **Type Checking**: TypeScript strict mode

---

## Build Output

```
.next/
├── dev/                     # Development build
├── static/                  # Static assets
├── server/                  # Server components
└── types/                   # Generated type files
```

---

## Naming & Code Organization Conventions

### Component Organization
- One component per file (unless very small)
- File name matches component name (PascalCase)
- Related components in feature folder
- Shared components in `lib/components/ui/` or at root

### Hook Organization
- Custom hooks in `lib/hooks/` directory
- File name matches hook name (camelCase with "use" prefix)
- Grouped by type: query, UI, action, debug

### Store Organization
- One store per file in `lib/stores/`
- Zustand pattern with selector functions
- File name matches store name (camelCase with "Store" suffix)
- Example: `useAuthStore` in `authStore.ts`

### Query Organization
- Server queries: `queries/*.server.ts` suffix
- Client queries: `queries/*.ts` (no suffix)
- Query function naming: `fetch{Entity}ByX` pattern

### Type Definitions
- Inline types in source files when possible
- Separate `types.ts` for shared/complex types
- Database types: `lib/supabase/types.ts` (auto-generated)
- API types: `lib/api/types.ts`

### Utility Functions
- Group related utilities in files: `color.ts`, `validation.ts`, etc.
- Descriptive names: `imageCompression`, `fallbackImages`
- No default exports; use named exports

---

## Startup & Development

### Required Setup
1. Node.js 18+ (recommended 20+)
2. Yarn 4.9.2
3. `.env.local` file with Supabase credentials
4. Supabase project created

### Start Commands
```bash
yarn dev              # Development server (localhost:3000)
yarn build            # Production build
yarn start            # Start production server
yarn lint             # ESLint check
yarn format           # Prettier format
yarn format:check     # Check formatting
```

### Environment Variables
See `.env.local.example` for required variables:
- Supabase URL & API keys
- Next.js API base URL
- OAuth provider credentials

---

## Performance & Optimization Patterns

### Image Optimization
- Use Next.js `Image` component
- Client-side compression before upload
- Lazy loading with intersection observer

### Code Splitting
- Dynamic imports for heavy components
- Modal routes via `@modal` parallel slots
- Automatic by Next.js App Router

### Data Fetching
- SSR for home page via `page.tsx`
- Client-side React Query for pagination/filtering
- Zustand for UI state (non-persisted)
- Supabase for persistence

### Caching
- React Query: 1 min stale time, 5 min cache time
- Browser cache via HTTP headers
- Static generation where possible

---

**Last Updated**: 2026-01-23
