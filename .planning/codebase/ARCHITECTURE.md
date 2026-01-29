# Decoded App - System Architecture

## Overview

**Decoded** is a modern web application for image/item discovery and curation with advanced filtering, detail views, and scroll animations. The application enables users to browse, search, and create requests for discovering items from images and posts.

## Architectural Layers

### 1. Presentation Layer (Next.js App Router)
**Location**: `packages/web/app/`

**Entry Points**:
- `layout.tsx` - Root layout with AppProviders wrapper and navigation
- `page.tsx` - Home page (SSR) with curated content sections
- `providers.tsx` - App-level provider composition (React Query, Theme, Auth)

**Page Routes**:
- `/` - Home (featured items, trending, artist spotlights)
- `/images` - Image browse/discovery grid
- `/images/[id]` - Image detail view
- `/posts/[id]` - Post detail view
- `/search` - Unified search interface
- `/explore` - Featured content exploration
- `/feed` - Feed with social-like content
- `/request` - Post creation workflow (3-step process)
- `/profile` - User profile
- `/login` - Authentication UI
- `/lab/*` - Experimental features (fashion-scan, ascii-text)

**Modal Routes**:
- `@modal/(.)images/[id]` - Image modal interceptor

### 2. State Management Layer
**Location**: `packages/web/lib/stores/` & `packages/shared/stores/`

**Zustand Stores**:
- `authStore.ts` - OAuth authentication (Kakao, Google, Apple) + guest mode
- `requestStore.ts` - Multi-step request/post creation workflow
- `profileStore.ts` - User profile data
- `searchStore.ts` - Search state and UI
- `filterStore.ts` - Category/filter state (in shared package)
- `transitionStore.ts` - Page transition animations

**Store Pattern**:
- Uses Zustand's selector pattern for optimal re-renders
- Supabase integration for persistence
- OAuth provider: Kakao (primary), Google, Apple
- Guest login option for unauthenticated users

### 3. Data Layer

#### A. React Query (Server State Management)
**Location**: `packages/web/lib/react-query/`

**Configuration**:
- Singleton QueryClient with custom defaults
- Stale time: 1 minute
- Cache time (gcTime): 5 minutes
- Retry: 1 attempt on failure
- Refetch on window focus: disabled

**Query Patterns**:
- `useInfiniteQuery` for pagination
- `useQuery` for single entity fetches
- Query key structure: `["domain", "resource", "params"]`

#### B. Backend API Routes
**Location**: `packages/web/app/api/v1/`

**Endpoints**:
- `POST /api/v1/posts` - Fetch paginated posts (with sorting, filtering)
- `POST /api/v1/posts/upload` - Upload image files to Supabase Storage
- `POST /api/v1/posts/analyze` - AI image analysis (object detection, tagging)
- `GET /api/v1/categories` - Fetch available categories

**Authentication**: JWT-based via Supabase Auth
**Response Format**: JSON with standardized error handling

#### C. Supabase Integration
**Location**: `packages/web/lib/supabase/`

**Key Files**:
- `init.ts` - Browser client initialization (side-effect import in providers)
- `server.ts` - Server-side admin client for SSR
- `client.ts` - Re-exports for backward compatibility
- `types.ts` - Auto-generated TypeScript types from database schema
- `storage.ts` - File storage operations (uploads, deletions)

**Database Schema**:
```
Tables:
  - image (id, image_url, status, image_hash, with_items)
  - item (id, image_id, product_name, brand, price, bboxes, center, citations, metadata, description)
  - post (id, account, ts, article, item_ids, metadata, created_at)
  - post_image (post_id, image_id, item_locations, curated_item_ids)

Relations:
  - item → image (many-to-one via image_id)
  - post_image → image (foreign key)
  - post_image → post (foreign key)
```

**Queries**:
- `queries/main-page.server.ts` - SSR queries for home page content
- `queries/images.ts` - Image queries (client-side)
- `queries/posts.ts` - Post queries with detailed joins
- `queries/items.ts` - Item queries
- `queries/debug/` - Debug/testing queries

### 4. Business Logic Layer

#### A. Custom Hooks
**Location**: `packages/web/lib/hooks/`

**Query Hooks**:
- `usePosts()` - Fetch single post with items/images
- `useInfinitePosts()` - Paginated posts via REST API
- `useImages()` - Fetch images with filtering
- `useItems()` - Fetch items from images
- `useImageById()` - Single image detail
- `useCategories()` - Available categories

**UI Hooks**:
- `useScrollAnimation()` - GSAP scroll-triggered animations
- `useFlipTransition()` - Flip animation state
- `useSearch()` - Search logic with debouncing
- `useSearchURLSync()` - URL query params sync
- `useMediaQuery()` - Responsive breakpoints
- `useResponsiveGridSize()` - Dynamic grid sizing
- `useDebounce()` - Debounce values
- `useSpotCardSync()` - Synchronize spot selection across components

**Action Hooks**:
- `useCreatePost()` - Multi-step post creation
- `useImageUpload()` - Image upload to storage
- `useNormalizedItems()` - Normalize item data

#### B. API Client Functions
**Location**: `packages/web/lib/api/`

**Functions**:
- `uploadImage(file)` - Upload to `/api/v1/posts/upload`
- `analyzeImage(imageUrl)` - Analyze via `/api/v1/posts/analyze`
- `createPost(data)` - Create post via `/api/v1/posts`
- `getCategories()` - Fetch categories

**Features**:
- Automatic JWT token acquisition from Supabase session
- Standardized error handling and API error types
- File compression before upload

#### C. Data Mappers
**Location**: `packages/web/lib/utils/`

**Mappers**:
- `main-page-mapper.ts` - Transform DB records to UI component props
- `color.ts` - Color utility functions
- `imageCompression.ts` - Client-side image compression
- `validation.ts` - Input validation
- `fallbackImages.ts` - Fallback image URLs
- `locale.ts` - Localization utilities

### 5. Presentation Components

#### A. Atomic Components
**Location**: `packages/web/lib/components/ui/`

Shadcn/ui-based reusable components (buttons, modals, cards, etc.)

#### B. Feature Components
**Location**: `packages/web/lib/components/`

**Main**:
- `HomeAnimatedContent` - Hero section with animations
- `MainFooter` - App footer
- Grid/card components for content display

**Search**:
- `SidebarSearchPanel` - Search input with suggestions
- Advanced filter UI

**Request**:
- `DetailsStep` - Multi-step form for post creation
- `SubmitStep` - Preview before submission
- `ArtistInput`, `MediaSourceInput`, `ContextSelector` - Form inputs
- `SubmitPreview` - Submission confirmation

**Detail**:
- Detail view components for images and posts
- Spot detection visualization

**Auth**:
- `LoginCard` - OAuth login UI
- `AuthProvider` - Auth context + session listener
- Strategy: OAuth + guest mode

**Other**:
- `ConditionalNav` - Responsive navigation (Sidebar + MobileNav)
- `Header` - Mobile header
- `Sidebar` - Main navigation
- `MobileNavBar` - Mobile navigation bar
- `DecodedLogo` - Logo component with animation
- `ThiingsGrid` - Grid component for items/images
- `FeedCard` - Social-like card component

### 6. Cross-Cutting Concerns

#### A. Authentication
- Provider: Supabase Auth
- Methods: OAuth (Kakao, Google, Apple) + Guest mode
- Persistence: Browser session via Supabase
- Store: `useAuthStore` (Zustand)
- Context: `AuthProvider` with `onAuthStateChange` listener

#### B. Styling
- **Framework**: Tailwind CSS 3.4.18
- **Design System**: Custom tokens in `docs/design-system/`
- **Animations**: GSAP 3.13.0 + Motion 12.23.12 + Lenis (smooth scroll)
- **Fonts**: Playfair Display (serif), Inter (sans-serif)
- **Theme**: Dark mode default via next-themes

#### C. Error Handling
- API layer: Try-catch with structured error types
- Components: Error boundaries and fallback states
- User feedback: Toast notifications via UI library

#### D. Development Tools
- **ESLint 9** - Flat config (eslint.config.mjs)
- **Prettier 3.6.2** - Code formatting
- **TypeScript 5.9.3** - Strict mode enabled
- **React DevTools** - React Query devtools included
- **Debug Pages** - `/debug/supabase/posts` for troubleshooting

## Data Flow Patterns

### 1. Server-Side Rendering (SSR)
```
User Request
    ↓
Next.js Route Handler (layout.tsx, page.tsx)
    ↓
Supabase Server Client (with RLS bypass)
    ↓
Query Execution + Data Mapping
    ↓
React Component Rendering
    ↓
HTML + Inline State
```

**Example**: Home page fetches curated content via:
- `fetchWeeklyBestImagesServer()`
- `fetchBestItemsServer()`
- `fetchFeaturedImageServer()`
- Parallel Promise.all() execution
- Map data through transformers

### 2. Client-Side Data Fetching
```
User Interaction (Click, Scroll, Filter)
    ↓
React Hook Triggered (e.g., useInfinitePosts)
    ↓
React Query Query Function
    ↓
API Route (/api/v1/*) or Direct Supabase Query
    ↓
JWT Auth + Data Retrieval
    ↓
Query Cache + Component Re-render
```

### 3. Image Upload Workflow
```
User selects file(s)
    ↓
useImageUpload Hook
    ↓
Client-side compression (if needed)
    ↓
Upload to /api/v1/posts/upload
    ↓
API stores in Supabase Storage
    ↓
requestStore updates with image URLs
    ↓
Analysis trigger (optional)
```

### 4. Post Creation Workflow
```
Step 1: Upload Images (requestStore.images)
    ↓
Step 2: Select Details (category, artist, context)
    ↓
Step 3: AI Analysis (if enabled)
    ↓
Step 4: Review & Submit
    ↓
API POST /api/v1/posts
    ↓
Create post + link items
    ↓
Success notification + redirect
```

## Key Abstractions

### 1. Query Key Strategy
```typescript
["images", "detail", id] // Single image
["posts", "infinite", params] // Paginated posts
["categories"] // Static categories
```

### 2. Component Props Pattern
```typescript
// Server components receive data directly
<HomeAnimatedContent
  heroData={heroData}
  weeklyBestStyles={styles}
/>

// Client components use hooks
<ExploreClient>
  uses useImages(), useFilterStore()
</ExploreClient>
```

### 3. Store Selectors
```typescript
const user = useAuthStore((state) => state.user);
const images = requestStore((state) => state.images);
```

### 4. Error Types
```typescript
interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
```

## Build & Deployment Configuration

### Package Manager
- **Yarn 4.9.2** (node-modules linker)
- Monorepo with workspaces: `packages/web`, `packages/shared`

### Next.js Configuration
- Image optimization enabled
- App Router architecture
- Middleware support for auth flows

### Environment Variables
- `.env.local` (gitignored)
- `.env.local.example` (reference)
- Required: `NEXT_PUBLIC_API_BASE_URL`, Supabase config, etc.

## Directory Structure Hierarchy

```
packages/web/
├── app/                      # Next.js App Router pages
│   ├── api/v1/              # API routes
│   ├── @modal/              # Modal slots
│   ├── [feature]/           # Feature routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── providers.tsx        # Provider composition
├── lib/
│   ├── api/                 # API client functions
│   ├── components/          # React components (by feature)
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand stores
│   ├── supabase/            # Supabase client + queries
│   ├── react-query/         # React Query config
│   ├── utils/               # Utility functions
│   └── data/                # Static data (hero slides, etc.)
├── __tests__/               # Test files
└── package.json
```

## Integration Points

### External Services
1. **Supabase** - PostgreSQL database + Auth + Storage
2. **OAuth Providers** - Kakao (primary), Google, Apple
3. **Image Analysis** - AI-powered detection (via API)
4. **Image Storage** - Supabase Storage buckets

### Shared Package
- `@decoded/shared` - Type definitions, constants, shared hooks
- Imported via path alias: `@decoded/shared`

## Performance Considerations

1. **Image Optimization**
   - Next.js Image component for lazy loading
   - Client-side compression before upload
   - Fallback images for missing URLs

2. **Caching Strategy**
   - React Query stale time: 1 min
   - Cache time (gcTime): 5 min
   - Disable refetch on window focus (to avoid excessive API calls)

3. **Code Splitting**
   - Automatic via Next.js
   - Dynamic imports for heavy components
   - Lazy-loaded modal routes via `@modal` slots

4. **Animations**
   - GSAP for scroll-triggered animations
   - Motion library for component transitions
   - Lenis for smooth scroll hijacking

## Security Considerations

1. **Authentication**
   - Supabase-managed OAuth tokens
   - JWT validation on API routes
   - Guest mode for unauthenticated users

2. **Authorization**
   - Row-Level Security (RLS) on Supabase tables
   - API routes validate user context
   - File uploads scoped to user/session

3. **Data Validation**
   - Input validation utility functions
   - API request type checking
   - Error messages sanitized

4. **Environment Secrets**
   - `.env.local` with API keys (not committed)
   - Supabase keys scoped appropriately
   - Session tokens managed by Supabase

---

**Last Updated**: 2026-01-23
