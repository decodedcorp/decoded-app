# [SCR-DISC-04] Explore
> Route: `/explore` | Status: implemented | Updated: 2026-02-19

## Purpose

User browses content through an infinite physics-based drag canvas (ThiingsGrid) with hierarchical filter dropdowns on desktop and a bottom-sheet filter panel on mobile.

## Component Map

| Region | Component | File | Notes |
|--------|-----------|------|-------|
| Page | ExploreClient | `packages/web/app/explore/ExploreClient.tsx` | "use client" orchestrator |
| Desktop filter bar | ExploreFilterBar | `packages/web/lib/components/explore/ExploreFilterBar.tsx` | `hidden md:block`; hierarchical dropdowns |
| Desktop filter chips | FilterChip | `packages/web/lib/components/explore/FilterChip.tsx` | Active-filter removal chip |
| Sort controls | ExploreSortControls | `packages/web/lib/components/explore/ExploreSortControls.tsx` | Trending / Recent / Popular (UI-only) |
| Mobile filter toggle | inline button in ExploreClient | `packages/web/app/explore/ExploreClient.tsx` | Opens ExploreFilterSheet |
| Mobile filter sheet | ExploreFilterSheet | `packages/web/lib/components/explore/ExploreFilterSheet.tsx` | DS BottomSheet; 4-level hierarchy |
| Canvas grid | ThiingsGrid | `packages/web/lib/components/ThiingsGrid.tsx` | Physics spiral canvas; IntersectionObserver infinite load |
| Grid cell | ExploreCardCell | `packages/web/lib/components/explore/ExploreCardCell.tsx` | 3:4 aspect card; GSAP FLIP on click |
| Loading skeleton | ExploreSkeletonCell | `packages/web/lib/components/explore/ExploreCardCell.tsx` | Named export; same file |
| Header (unused) | ExploreHeader | `packages/web/lib/components/explore/ExploreHeader.tsx` | Exists; NOT rendered by ExploreClient |
| Category chips (unused) | CategoryFilter | `packages/web/lib/components/explore/CategoryFilter.tsx` | Uses filterStore; NOT rendered by ExploreClient |
| Data hook | useInfinitePosts | `packages/web/lib/hooks/useImages.ts` | React Query infinite; query key `["posts","infinite",{...}]` |
| Simple filter state | filterStore | `packages/shared/stores/filterStore.ts` | `activeFilter: FilterKey`; used by ExploreClient |
| Hierarchical filter state | hierarchicalFilterStore | `packages/shared/stores/hierarchicalFilterStore.ts` | Used by ExploreFilterBar/Sheet; category/media/cast/context |
| Transition state | transitionStore | `packages/web/lib/stores/transitionStore.ts` | GSAP FLIP state captured on card click |

## Layout

### Mobile (default)

```
┌────────────────────────┐
│ [NavBar / MobileHeader]│
├────────────────────────┤
│ [Filters] toggle btn   │  SlidersHorizontal icon; opens ExploreFilterSheet
├────────────────────────┤
│                        │
│  [ThiingsGrid canvas]  │  Infinite physics drag/pan canvas
│                        │  Cell size: 180×225px
│  [ExploreCardCell]×N   │  3:4 aspect ratio, spiral layout
│                        │
│  [ExploreSkeletonCell] │  During initial load
│                        │
└────────────────────────┘
[ExploreFilterSheet]  — BottomSheet overlay (snapPoints: 0.5, 0.8)
  Level tabs: Category > Media > Cast > Context
```

### Desktop (>=768px)

```
┌────────────────────────────────────────────────────┐
│ [DesktopHeader]                                    │
├────────────────────────────────────────────────────┤
│ [ExploreFilterBar]  — Category▼ Media▼ Cast▼  Sort │
│ [FilterChip] [FilterChip] [Clear all]              │
├────────────────────────────────────────────────────┤
│                                                    │
│  [ThiingsGrid canvas]  Cell size: 400×500px        │
│                                                    │
└────────────────────────────────────────────────────┘
```

| Element | Mobile | Desktop |
|---------|--------|---------|
| Filter bar | Hidden (button → bottom sheet) | `ExploreFilterBar` visible |
| Filter sheet | BottomSheet (snapPoints 0.5/0.8) | Not used |
| Grid cell size | 180×225px | 400×500px |
| Layout type | Spiral canvas | Spiral canvas (same) |

## Requirements

### Data Loading

- ✅ When explore page mounts, the system shall call `useInfinitePosts({ limit: 40, category: activeFilter })` and render posts in ThiingsGrid.
- ✅ When `filterStore.activeFilter` changes, the system shall re-fetch with the new category via AnimatePresence key change.
- ✅ When the initial fetch is in progress, the system shall render ExploreSkeletonCell items in ThiingsGrid.
- ✅ When the fetch fails, the system shall show an inline error message and Retry button.
- ✅ When no posts match, the system shall show an empty state message with filter guidance.

### Infinite Scroll (Canvas)

- ✅ When ThiingsGrid's `maxVisibleIndex` approaches `items.length - PRELOAD_MARGIN (50)`, the system shall call `onReachEnd()` → `fetchNextPage()`.
- ✅ When a new page loads, the system shall append `GridItem[]` to ThiingsGrid items without resetting canvas position.
- ✅ When `isFetchingNextPage` is true, the system shall show a LoadingSpinner overlay at bottom-center.

### Filter Bar (Desktop)

- ✅ When user selects Category in ExploreFilterBar, the system shall set `hierarchicalFilterStore.category` and reveal Media dropdown.
- ✅ When user selects Media, the system shall set `hierarchicalFilterStore.mediaId` and reveal Cast dropdown.
- ✅ When user selects Cast, the system shall set `hierarchicalFilterStore.castId` and reveal Context dropdown.
- ⚠️ NOT-IMPL: `hierarchicalFilterStore` selections are not passed to `useInfinitePosts`; ExploreClient reads only `filterStore.activeFilter`. Hierarchical filter UI does not affect the data fetched.
- ⚠️ NOT-IMPL: Filter data comes from `getMockCategories / getMockMediaByCategory / getMockCastByMedia` (mock data, not API).

### Sort Controls

- ✅ When user clicks a sort option (Trending / Recent / Popular), the system shall update `ExploreSortControls` internal state.
- ⚠️ NOT-IMPL: Sort selection is not passed to `useInfinitePosts`; data always fetches with default sort.

### Filter Sheet (Mobile)

- ✅ When user taps the Filters toggle button, the system shall open ExploreFilterSheet as DS BottomSheet (snapPoints: [0.5, 0.8]).
- ✅ When user taps Apply, the system shall close the sheet.
- ✅ When user taps Clear All, the system shall reset `hierarchicalFilterStore` to initial state.

### Card Interaction

- ✅ When user taps an ExploreCardCell, the system shall capture GSAP FLIP state via `Flip.getState()` and store in `transitionStore`, then navigate to `/images/[id]`.

## State

- **filterStore** (`packages/shared/stores/filterStore.ts`): `activeFilter` — `FilterKey` (`"all" | "fashion" | "beauty" | "lifestyle" | "accessories"`) — wired to API call
- **hierarchicalFilterStore** (`packages/shared/stores/hierarchicalFilterStore.ts`): category / mediaId / castId / contextType / breadcrumb — wired to ExploreFilterBar/Sheet UI only
- **Local state**: `filterSheetOpen` (boolean), `gridSize` ({ width, height }) updated on resize
- **transitionStore**: GSAP FLIP state captured on card click
- **React Query**: key `["posts","infinite",{ category, limit:40 }]`

## Responsive Grid

ThiingsGrid uses fixed cell sizes (not CSS columns) set by ExploreClient's local `gridSize` state:

| Breakpoint | Trigger | Cell Size |
|------------|---------|-----------|
| Mobile | `window.innerWidth < 768` | 180×225px |
| Desktop | `window.innerWidth >= 768` | 400×500px |

Grid updates via `window.addEventListener("resize", ...)` in a `useEffect`. Canvas layout is spiral (not columns).

## Data Flow

```
Mount → useInfinitePosts(limit:40, category:activeFilter) → GET /api/v1/posts?page=1
  → map to GridItem[] → ThiingsGrid renders spiral canvas
  → user drags canvas → maxVisibleIndex increases
  → PRELOAD_MARGIN check → fetchNextPage()
  → GET /api/v1/posts?page=N → append items
```

## Navigation

| Trigger | Destination | Data Passed |
|---------|-------------|-------------|
| ExploreCardCell tap | `/images/[id]` | GSAP FLIP state via transitionStore |
| Explore nav tab | `/explore` | — |

See: SCR-DISC-01 — Home page (sibling discovery screen)
See: SCR-DISC-02 — Search overlay (search icon from header)
See: SCR-VIEW-01 — Post detail (card tap destination)
See: FLW-01 — Discovery Flow (explore entry in navigation contract)

## Error & Empty States

| State | Condition | UI |
|-------|-----------|-----|
| Loading | Initial fetch | ExploreSkeletonCell items in ThiingsGrid |
| Empty | No posts for filter | Icon + "No posts found" + filter guidance |
| Error | API 4xx/5xx | Error message + Retry button (refetch) |
| Loading more | `isFetchingNextPage` | LoadingSpinner overlay at bottom-center |
