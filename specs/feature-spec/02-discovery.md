# Discovery

> Features: D-01 ~ D-04
> Status: 30% implemented
> Dependencies: Database hierarchical structure

---

## Overview

Discovery features enable users to explore and find fashion items through an immersive, drill-down experience. The goal is to facilitate deep-dive exploration from broad categories to specific items.

### Related Screens
- `/` - Home feed
- `/search` - Search results
- `/media/[id]` - Media gallery (drama, group)
- `/cast/[id]` - Cast page

### Current Implementation
- `app/page.tsx` - Home with infinite scroll feed
- `app/HomeClient.tsx` - Client-side feed logic
- `lib/components/grid/ThiingsGrid.tsx` - Masonry grid
- `lib/stores/filterStore.ts` - Basic filter state (2-level only)

---

## Features

### D-01 Responsive Magazine Feed

- **Description**: Mobile shows short-form vertical scroll; Web shows Pinterest-style masonry grid
- **Priority**: P0
- **Status**: **Implemented** ✅
- **Dependencies**: None

#### Current Implementation
- `ThiingsGrid.tsx` - Custom masonry grid with dynamic sizing
- `CardCell.tsx` - Individual feed cards
- `useInfiniteFilteredImages()` - Infinite scroll data fetching

#### Acceptance Criteria
- [x] Mobile: Vertical scroll with full-width cards
- [x] Web: Multi-column masonry layout
- [x] Infinite scroll pagination
- [x] Loading states and skeletons
- [x] Smooth scroll performance (60fps)
- [x] Image lazy loading

#### Related Files
- `lib/components/grid/ThiingsGrid.tsx`
- `lib/components/grid/CardCell.tsx`
- `lib/hooks/useInfiniteFilteredImages.ts`
- `app/HomeClient.tsx`

#### Future Improvements
- [ ] Skeleton loading animations
- [ ] Pull-to-refresh on mobile
- [ ] Grid layout persistence

---

### D-02 Hierarchical Filter (Deep Filter)

- **Description**: Drill-down filtering from Category → Media → Cast → Context
- **Priority**: P0
- **Status**: Not Started (only 2-level filter exists)
- **Dependencies**: Media/Cast database tables

#### Acceptance Criteria
- [ ] Level 1: Category selection (K-POP, K-Drama, etc.)
- [ ] Level 2: Media/Group selection (shows list based on category)
- [ ] Level 3: Cast selection (people in selected media)
- [ ] Level 4: Context selection (airport, stage, etc.)
- [ ] Breadcrumb navigation showing current filter path
- [ ] "Clear all" resets to no filter
- [ ] Each level click updates feed immediately
- [ ] URL reflects filter state (shareable links)
- [ ] Mobile: Bottom sheet filter UI
- [ ] Web: Sidebar or horizontal filter bar

#### UI/UX Requirements

**Desktop Filter Bar**:
```
┌──────────────────────────────────────────────────────────────────┐
│  Category ▼  │  Media/Group ▼  │  Cast ▼  │  Context ▼  │ ✕ Clear│
└──────────────────────────────────────────────────────────────────┘

Selected: K-POP > BTS > Jungkook > Airport
          ↑ clickable breadcrumb to go back
```

**Mobile Filter (Bottom Sheet)**:
```
┌─────────────────────────────────┐
│  ═══════════════════           │  ← drag handle
│                                 │
│  🔥 K-POP                      │
│     └─ BTS                     │
│        └─ Jungkook             │
│           └─ Airport ✓         │
│                                 │
│  Other categories...           │
│                                 │
│  [Apply Filter]                │
└─────────────────────────────────┘
```

**Filter Dropdown (Level 2 - Media)**:
```
┌─────────────────────────────────┐
│ Select Media/Group              │
├─────────────────────────────────┤
│ 🎵 BTS                    127   │
│ 🎵 BLACKPINK               89   │
│ 🎵 NewJeans                 65   │
│ 🎵 IVE                      54   │
│ 📺 Squid Game               43   │
│ 📺 Crash Course in Romance  28   │
└─────────────────────────────────┘
   ^ Shows count of items in each
```

#### Data Requirements

**New Tables/Columns**:
- `media` table with category reference
- `cast` table
- `media_cast` junction table
- `post.media_id` foreign key
- `post.context_type` enum

**Filter API**:
```
GET /api/filters/categories
  → Returns category list with counts

GET /api/filters/media?category=K-POP
  → Returns media list filtered by category

GET /api/filters/cast?mediaId=xxx
  → Returns cast list for specific media

GET /api/filters/contexts
  → Returns context type list with counts
```

#### State Management

```typescript
// lib/stores/filterStore.ts (updated)
interface FilterState {
  // Current selections
  category: CategoryType | null;
  mediaId: string | null;
  castId: string | null;
  contextType: ContextType | null;

  // Computed breadcrumb
  breadcrumb: FilterBreadcrumb[];

  // Available options at each level
  availableMedia: Media[];
  availableCast: Cast[];

  // Actions
  setCategory: (cat: CategoryType | null) => void;
  setMedia: (id: string | null) => void;
  setCast: (id: string | null) => void;
  setContext: (ctx: ContextType | null) => void;
  clearAll: () => void;
  navigateToBreadcrumb: (level: number) => void;
}
```

#### URL Schema
```
/?category=K-POP
/?category=K-POP&media=bts-uuid
/?category=K-POP&media=bts-uuid&cast=jungkook-uuid
/?category=K-POP&media=bts-uuid&cast=jungkook-uuid&context=airport
```

#### Files to Create/Modify
- `lib/stores/filterStore.ts` - Expand to 4 levels
- `lib/components/filter/HierarchicalFilter.tsx` - New component
- `lib/components/filter/FilterDropdown.tsx` - Dropdown for each level
- `lib/components/filter/FilterBreadcrumb.tsx` - Breadcrumb nav
- `lib/components/filter/MobileFilterSheet.tsx` - Bottom sheet
- `lib/hooks/useFilterOptions.ts` - Fetch filter options

---

### D-03 Media Gallery

- **Description**: Dedicated page for a specific show/drama/group showing all related content
- **Priority**: P1
- **Status**: Not Started
- **Dependencies**: D-02 (Hierarchical Filter), Media table

#### Acceptance Criteria
- [ ] `/media/[id]` route displays media details
- [ ] Hero section with media poster/logo
- [ ] "Featured Cast" section with member grid
- [ ] All posts filtered to this media
- [ ] Popular items from this media
- [ ] Related media suggestions

#### UI/UX Requirements

**Media Gallery Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  [Hero Image]                                               │
│                                                             │
│  🎬 Squid Game                                              │
│  Drama • 2021 • Netflix                                     │
│                                                             │
│  456 items found • 23 contributors                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Featured Cast                                              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                          │
│  │Jung │ │Lee  │ │Park │ │Wi   │                          │
│  │Ho-  │ │Jung-│ │Hae- │ │Ha-  │                          │
│  │yeon │ │jae  │ │soo  │ │joon │                          │
│  │(67) │ │(45) │ │(32) │ │(28) │ ← item counts             │
│  └─────┘ └─────┘ └─────┘ └─────┘                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  All Items                                    [Filter ▼]    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Masonry Grid of Posts]                             │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- Media details (name, type, year, platform, image)
- Cast associated with media
- Posts filtered by media_id
- Aggregate stats

#### API Endpoints
```
GET /api/media/:id
  → Media details with cast list

GET /api/media/:id/posts?page=1
  → Paginated posts for this media

GET /api/media/:id/stats
  → Item counts, contributor counts
```

#### Files to Create/Modify
- `app/media/[id]/page.tsx` - Media gallery page
- `lib/components/media/MediaHero.tsx`
- `lib/components/media/CastGrid.tsx`
- `lib/hooks/useMediaDetail.ts`

---

### D-04 Unified Search

- **Description**: Search across People, Media, and Items with tabbed results
- **Priority**: P0
- **Status**: Partial (keyword search exists, no tabs)
- **Dependencies**: None

#### Current Implementation
- `lib/stores/searchStore.ts` - Search query state
- `lib/components/header/SearchInput.tsx` - Search input

#### Acceptance Criteria
- [ ] Single search input in header
- [ ] Results page with tabs: [All] [People] [Media] [Items]
- [ ] "All" tab shows mixed results with section headers
- [ ] Each tab shows filtered results
- [ ] Search highlights matching text
- [ ] Recent searches stored locally
- [ ] Search suggestions as user types
- [ ] Empty state with popular searches

#### UI/UX Requirements

**Search Input (Header)**:
```
┌─────────────────────────────────────┐
│ 🔍 Search people, shows, items...  │
└─────────────────────────────────────┘
```

**Search Suggestions Dropdown**:
```
┌─────────────────────────────────────┐
│ Recent Searches                     │
│   ji-su                             │
│   squid game jacket                 │
│                                     │
│ Popular                             │
│   NewJeans                          │
│   IVE Wonyoung                     │
│   Airport fashion                   │
└─────────────────────────────────────┘
```

**Search Results Page**:
```
┌─────────────────────────────────────────────────────────────┐
│ Results for "jisoo"                                         │
│                                                             │
│ [All] [People (3)] [Media (1)] [Items (47)]                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 👤 People                              [See all →]          │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ [Photo] Jisoo (BLACKPINK) - 42 items               │    │
│ │ [Photo] Kim Ji-soo (Actor) - 15 items              │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ 🎬 Media                               [See all →]          │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ [Poster] Snowdrop (ft. Jisoo) - 28 items           │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ 👗 Items                               [See all →]          │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ [Grid of item thumbnails]                           │    │
│ └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- Full-text search on: `cast.name`, `cast.name_ko`, `media.name`, `media.name_ko`, `item.product_name`, `item.brand`
- Search index for performance

#### API Endpoints
```
GET /api/search?q=jisoo&type=all
  → Returns mixed results: { people: [], media: [], items: [] }

GET /api/search?q=jisoo&type=people
  → Returns only people results

GET /api/search/suggestions?q=ji
  → Returns autocomplete suggestions

GET /api/search/popular
  → Returns trending search terms
```

#### Implementation Notes
```typescript
// lib/hooks/useSearch.ts
export function useSearch(query: string, type: 'all' | 'people' | 'media' | 'items') {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: () => searchApi(query, type),
    enabled: query.length >= 2,
    staleTime: 60_000,
  });
}
```

#### Files to Create/Modify
- `app/search/page.tsx` - Search results page
- `lib/components/search/SearchResults.tsx`
- `lib/components/search/SearchTabs.tsx`
- `lib/components/search/SearchSuggestions.tsx`
- `lib/components/search/PeopleResult.tsx`
- `lib/components/search/MediaResult.tsx`
- `lib/components/search/ItemResult.tsx`
- `lib/hooks/useSearch.ts`

---

## Data Models

See [data-models.md](./data-models.md) for full type definitions.

### Key Types for Discovery

```typescript
type CategoryType = 'K-POP' | 'K-Drama' | 'K-Movie' | 'K-Variety' | 'K-Fashion';

interface Media {
  id: string;
  type: 'group' | 'show' | 'drama' | 'movie';
  name: string;
  nameKo: string;
  category: CategoryType;
  imageUrl?: string;
}

interface Cast {
  id: string;
  name: string;
  nameKo: string;
  profileImageUrl?: string;
}

interface FilterState {
  category: CategoryType | null;
  mediaId: string | null;
  castId: string | null;
  contextType: ContextType | null;
  breadcrumb: FilterBreadcrumb[];
}

interface SearchResults {
  people: Cast[];
  media: Media[];
  items: Item[];
  totalCount: number;
}
```

---

## Migration Path

### Phase 1: Database Setup
1. Create `media` table with seed data
2. Create `cast` table with seed data
3. Create `media_cast` junction
4. Add `media_id` to existing posts
5. Backfill existing data

### Phase 2: Filter UI
1. Update filterStore to 4 levels
2. Build filter components
3. Implement filter API endpoints
4. Connect to feed

### Phase 3: Search
1. Create search API with full-text
2. Build search results page
3. Add suggestions feature

### Phase 4: Media Gallery
1. Create media detail page
2. Build cast grid component
3. Add related media logic

---

## Performance Considerations

- Filter counts should be cached/materialized
- Search should use PostgreSQL full-text indexes
- Infinite scroll should use cursor pagination
- Images should be lazy loaded with blur placeholder
