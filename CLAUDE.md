# decoded-app Development Guidelines

## Overview
Modern web application for image/item discovery and curation with advanced filtering, detail views, and scroll animations. Features AI-powered item detection, social feed, and comprehensive design system (v2.0).

## Tech Stack
- **Frontend**: Next.js 16.0.7, React 18.3.1, TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.18, CVA 0.7.1, tailwind-merge 3.4.0
- **State**: Zustand 4.5.7, React Query 5.90.11, React Query DevTools 5.91.1
- **Backend**: Supabase 2.86.0, Auth Helpers 0.15.0
- **Animations**: GSAP 3.13.0, Motion 12.23.12, Lenis 1.3.15, @use-gesture/react 10.3.1
- **UI Libraries**: Lucide React 0.555.0, React Icons 5.5.0, Radix UI, Sonner 2.0.7
- **3D/Media**: Three.js 0.167.1, browser-image-compression 2.0.2
- **Theme**: next-themes 0.4.6
- **Linting**: ESLint 9.39.1 (flat config), Prettier 3.6.2
- **Package Manager**: Yarn 4.9.2 (node-modules linker)

## Project Structure
```text
packages/web/
├── app/                    # Next.js App Router pages
│   ├── @modal/             # Parallel route for modals
│   ├── api/v1/             # API routes (posts, solutions, users, categories, spots)
│   ├── explore/            # Explore grid view
│   ├── feed/               # Social feed
│   ├── images/             # Image discovery & detail
│   ├── login/              # OAuth authentication
│   ├── posts/              # Post detail
│   ├── profile/            # User profile
│   ├── request/            # Upload & AI detection flow
│   ├── search/             # Full-screen search overlay
│   └── lab/                # Experimental features
├── lib/
│   ├── api/                # API client functions
│   ├── components/         # Feature-based components
│   │   ├── ui/             # Primitive UI (Card, Button, BottomSheet)
│   │   ├── main/           # Home page sections
│   │   ├── search/         # Search overlay & results
│   │   ├── detail/         # Image/post detail views
│   │   ├── request/        # Upload flow components
│   │   ├── explore/        # Explore grid
│   │   ├── feed/           # Feed components
│   │   ├── profile/        # Profile sections
│   │   ├── auth/           # Auth components
│   │   ├── dome/           # Dome experiment
│   │   ├── fashion-scan/   # AI fashion detection
│   │   └── shared/         # Shared components
│   ├── design-system/      # v2.0 Design System (35 components)
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand state stores
│   ├── supabase/           # Supabase client + queries
│   └── utils/              # Utility functions
└── __tests__/              # Test files

packages/shared/            # Shared types, hooks, utilities
specs/                      # Feature specifications
docs/                       # Documentation
.planning/                  # GSD workflow artifacts
```

## Implemented Features

### Core Pages & Routes
| Route | Description |
|-------|-------------|
| `/` | Home - Hero carousel, trending, best sections, celebrity grid |
| `/explore` | Grid view with category filtering |
| `/feed` | Social feed timeline |
| `/search` | Full-screen overlay search with multi-tab results |
| `/images` | Image discovery grid with infinite scroll |
| `/images/[id]` | Image detail with Lightbox, hero, related items, shop grid |
| `/posts/[id]` | Post detail view with metadata |
| `/profile` | User profile with activity, badges, stats, rankings |
| `/request/upload` | Image upload with DropZone |
| `/request/detect` | AI detection results with item spotting |
| `/login` | OAuth authentication (Kakao, Google, Apple) |
| `/lab/*` | Experimental (ascii-text, fashion-scan) |

### v2.0 Design Overhaul (Shipped)
- Search Overlay with responsive grid layouts
- Lightbox fullscreen image viewer
- Hero animations with GSAP scroll triggers
- Responsive 2-4 column grids
- Item spotting with shop integration
- "More from this Look" related content gallery
- Complete design system with 35 components

## v2.0 Design System

### Import Path

All design system components are exported from a single barrel import:

```typescript
import {
  // Typography
  Heading, Text,
  // Inputs
  Input, SearchInput,
  // Cards
  Card, CardHeader, CardContent, CardFooter, CardSkeleton,
  ProductCard, GridCard, FeedCardBase, ProfileHeaderCard,
  ArtistCard, SpotCard, SpotDetail, ShopCarouselCard,
  StatCard, RankingItem, LeaderItem, SkeletonCard,
  // Navigation & Layout
  DesktopHeader, MobileHeader, DesktopFooter,
  NavBar, NavItem, SectionHeader,
  // Buttons & Actions
  ActionButton, OAuthButton, GuestButton,
  // Indicators & Feedback
  Tag, Badge, Divider, Tabs, StepIndicator,
  LoadingSpinner, LoginCard, BottomSheet, Hotspot,
  // Tokens
  typography, colors, spacing, shadows, borderRadius, zIndex
} from "@/lib/design-system"
```

### Component Usage Guide

| Component | Use Case | Example |
|-----------|----------|---------|
| **Heading** | Page/section titles | `<Heading variant="h2">Title</Heading>` |
| **Text** | Body text, captions | `<Text variant="small">Description</Text>` |
| **Card** | Generic container | `<Card variant="elevated" size="md">...</Card>` |
| **ProductCard** | Product display | `<ProductCard image={url} title="..." price="$99"/>` |
| **Input** | Form inputs | `<Input variant="search" leftIcon={<Search/>}/>` |

### Design Token Reference

Access design tokens directly for custom styling:

```typescript
import { typography, spacing, colors } from "@/lib/design-system/tokens"

// Typography
typography.sizes.h1          // Font size for h1
responsiveTypography.pageTitle  // Responsive title sizing

// Spacing (4px base unit)
spacing[4]  // 16px
spacing[8]  // 32px

// Colors (CSS variable references)
colors.primary
colors.muted
```

### Documentation

For detailed design specifications and usage patterns:
- **[docs/design-system/](docs/design-system/)** - Design token documentation
- **[.planning/codebase/](/.planning/codebase/)** - Architecture and conventions

### Component List

Located in `lib/design-system/`:

| Component | File | Purpose |
|-----------|------|---------|
| **tokens.ts** | tokens.ts | Design tokens (colors, spacing, typography, shadows) |
| **Heading, Text** | typography.tsx | Typography with responsive size variants |
| **Input, SearchInput** | input.tsx | Form inputs with CVA variants |
| **Card, CardHeader, CardContent, CardFooter, CardSkeleton** | card.tsx | Base card with composable slots |
| **ProductCard** | product-card.tsx | Product display card |
| **GridCard** | grid-card.tsx | Grid layout card |
| **FeedCardBase** | feed-card.tsx | Social feed card |
| **ProfileHeaderCard** | profile-header-card.tsx | Profile header card |
| **ArtistCard** | artist-card.tsx | Artist/celebrity card |
| **SpotCard** | spot-card.tsx | Detected item spot card |
| **SpotDetail** | spot-detail.tsx | Spot detail panel |
| **ShopCarouselCard** | shop-carousel-card.tsx | Shop carousel item |
| **StatCard** | stat-card.tsx | Statistics display card |
| **RankingItem** | ranking-item.tsx | Ranking list item |
| **LeaderItem** | leader-item.tsx | Leaderboard item |
| **SkeletonCard** | skeleton-card.tsx | Generic skeleton loader |
| **DesktopHeader** | desktop-header.tsx | Desktop navigation header |
| **MobileHeader** | mobile-header.tsx | Mobile navigation header |
| **DesktopFooter** | desktop-footer.tsx | Desktop footer |
| **NavBar** | nav-bar.tsx | Navigation bar |
| **NavItem** | nav-item.tsx | Navigation item |
| **SectionHeader** | section-header.tsx | Section header with title |
| **ActionButton** | action-button.tsx | Action button with variants |
| **OAuthButton** | oauth-button.tsx | OAuth provider button |
| **GuestButton** | guest-button.tsx | Guest login button |
| **Tag** | tag.tsx | Tag/chip component |
| **Badge** | badge.tsx | Badge/indicator |
| **Divider** | divider.tsx | Section divider |
| **Tabs** | tabs.tsx | Tab navigation |
| **StepIndicator** | step-indicator.tsx | Multi-step progress |
| **LoadingSpinner** | loading-spinner.tsx | Loading indicator |
| **LoginCard** | login-card.tsx | Login card UI |
| **BottomSheet** | bottom-sheet.tsx | Bottom sheet drawer |
| **Hotspot** | hotspot.tsx | Interactive spot marker with brand colors |

## Key File Locations

| Area | Location | Description |
|------|----------|-------------|
| **Auth** | `lib/stores/authStore.ts` | OAuth (Kakao, Google, Apple) + session |
| **Search State** | `lib/stores/searchStore.ts` | Search query, filters, results |
| **Filter State** | `lib/stores/filterStore.ts` | Category and filter state |
| **Transition State** | `lib/stores/transitionStore.ts` | Page transition state |
| **API Client** | `lib/api/` | Backend API calls (posts, users, categories) |
| **API Routes** | `app/api/v1/` | Next.js API proxy & server logic |
| **Supabase** | `lib/supabase/queries/` | DB queries (server/client) |
| **Design System** | `lib/design-system/` | v2.0 components & tokens |
| **Components** | `lib/components/` | Feature components |
| **Hooks** | `lib/hooks/` | Custom hooks |
| **Stores** | `lib/stores/` | Zustand stores |

## API Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/v1/posts` | GET | List posts with pagination |
| `/api/v1/posts/with-solution` | GET | Posts with solution data |
| `/api/v1/posts/extract-metadata` | POST | Extract metadata from URL |
| `/api/v1/posts/analyze` | POST | AI image analysis |
| `/api/v1/posts/upload` | POST | Upload post image |
| `/api/v1/posts/[postId]` | GET | Single post detail |
| `/api/v1/posts/[postId]/spots` | GET/POST | Spots for a post |
| `/api/v1/solutions/convert-affiliate` | POST | Convert affiliate links |
| `/api/v1/solutions/[solutionId]` | GET/PATCH | Solution CRUD |
| `/api/v1/solutions/extract-metadata` | POST | Solution metadata extraction |
| `/api/v1/users/me` | GET | Current user profile |
| `/api/v1/users/me/activities` | GET | User activities |
| `/api/v1/users/me/stats` | GET | User statistics |
| `/api/v1/users/[userId]` | GET | User by ID |
| `/api/v1/categories` | GET | Category list |
| `/api/v1/spots/[spotId]` | GET/PATCH | Spot CRUD |
| `/api/v1/spots/[spotId]/solutions` | GET/POST | Solutions for spot |

## Custom Hooks

### Data Fetching
- `useImages()` - Fetch and paginate images with filters
- `usePosts()` - Fetch and manage posts
- `useProfile()` - Fetch user profile data
- `useCategories()` - Fetch category list
- `useItems()` - Fetch items for posts
- `useNormalizedItems()` - Normalize item data structure
- `useSolutions()` - Fetch solutions for items
- `useSpots()` - Fetch spot data for images

### Form & Input
- `useCreatePost()` - Multi-step post creation flow
- `useImageUpload()` - Image uploads with compression
- `useSearch()` - Search with debouncing
- `useSearchURLSync()` - URL-based search state sync

### UI & Animation
- `useResponsiveGridSize()` - Calculate grid columns
- `useScrollAnimation()` - Scroll-triggered animations
- `useFlipTransition()` - Flip card animations
- `useMediaQuery()` - Responsive breakpoint detection
- `useSpotCardSync()` - Sync spot selection with card UI
- `useDebounce()` - Debounce value changes

## Commands
```bash
yarn dev              # Development server
yarn build            # Production build
yarn start            # Start production server
yarn lint             # ESLint
yarn format           # Prettier formatting
yarn format:check     # Check Prettier formatting
```

## Code Style
- TypeScript strict mode enabled
- ESLint + Prettier applied
- Conventional Commits format

## Important Notes
- Uses Yarn 4 with node-modules linker - use `yarn` commands (not npm)
- ESLint 9 with flat config (eslint.config.mjs)
- Environment variables: .env.local (gitignored, see .env.local.example)
- Supabase integration required for data/auth

## Codebase Documentation

상세한 코드베이스 분석은 `.planning/codebase/`에서 확인:

| 문서 | 내용 |
|------|------|
| [STACK.md](.planning/codebase/STACK.md) | 기술 스택, 의존성, 설정 |
| [ARCHITECTURE.md](.planning/codebase/ARCHITECTURE.md) | 시스템 아키텍처, 레이어, 데이터 흐름 |
| [STRUCTURE.md](.planning/codebase/STRUCTURE.md) | 디렉토리 구조, 파일 위치 |
| [CONVENTIONS.md](.planning/codebase/CONVENTIONS.md) | 코딩 컨벤션, 네이밍 패턴 |
| [TESTING.md](.planning/codebase/TESTING.md) | 테스트 구조, 패턴 |
| [INTEGRATIONS.md](.planning/codebase/INTEGRATIONS.md) | 외부 서비스, API 연동 |
| [CONCERNS.md](.planning/codebase/CONCERNS.md) | 기술 부채, 주의 사항 |

## GSD Workflow

프로젝트 관리 명령어:

```bash
# 현황 확인
/gsd:progress          # 전체 진행 상황

# 페이즈 작업
/gsd:discuss-phase N   # 페이즈 N 논의
/gsd:plan-phase N      # 페이즈 N 계획
/gsd:execute-phase N   # 페이즈 N 실행
/gsd:verify-work       # 작업 검증

# 기타
/gsd:help              # 전체 명령어 목록
/gsd:quick             # 빠른 작업 (계획 없이)
```

## SpecKit Integration
- Specs 위치: `specs/` (feature별 폴더)
- Commands: `/speckit.*` (in Claude Code)

## Documentation
- **[docs/README.md](docs/README.md)** - 문서 인덱스
- **[.planning/](.planning/)** - GSD 워크플로우 아티팩트
- docs/adr/ - Architecture Decision Records
- docs/api/ - API integration guides
- docs/ai-playbook/ - AI tool usage guides
- docs/design-system/ - Design tokens

<!-- Last Updated: 2026-02-12 -->

<!-- MANUAL ADDITIONS START -->
- [Antigravity Rules](file:///Users/kiyeol/development/decoded/decoded-app/.antigravity/rules.md) - Autonomous execution policy and language preferences.
<!-- MANUAL ADDITIONS END -->
