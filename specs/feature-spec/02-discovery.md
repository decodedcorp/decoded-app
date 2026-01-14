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

---

## Component Mapping (상세 구현 참조)

> 이 섹션은 각 UI 요소가 실제 코드에서 어떻게 구현되는지 매핑합니다.

### D-01 Magazine Feed - 컴포넌트 매핑

#### UI 다이어그램 + 컴포넌트 매핑

```
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                      │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ [Logo]                              [🔍]  [♡]  [👤]                    │ │
│ │   └─ Link to /                       │     │     └─ AuthButton.tsx     │ │
│ │                                      │     └─ WishlistButton (미구현)  │ │
│ │                                      └─ SearchInput.tsx                │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ 컴포넌트: packages/web/lib/components/layout/Header.tsx                    │
│ 상태: 없음 (stateless)                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ FILTER BAR (Desktop)                                                        │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ [All ▼] [Media ▼] [Cast ▼] [Context ▼]              [🔍 Search...]    │ │
│ │    │        │         │         │                         │            │ │
│ │    │        │         │         │                         └─ 검색 입력 │ │
│ │    │        │         │         └─ contextType 필터                    │ │
│ │    │        │         └─ castId 필터                                   │ │
│ │    │        └─ mediaId 필터                                            │ │
│ │    └─ category 필터                                                    │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ 컴포넌트: packages/web/lib/components/filter/DesktopFilterBar.tsx (예정)   │
│ 현재구현: packages/web/lib/components/filter/FilterTabs.tsx (2-level)      │
│ 상태: filterStore (Zustand)                                                │
├────────────────────────────────────────────────────────────────────────────┤
│ MASONRY GRID                                                                │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ ┌─────────┐ ┌─────────────┐ ┌─────────┐                               │ │
│ │ │ CardCell│ │  CardCell   │ │ CardCell│  ← 개별 이미지 카드           │ │
│ │ │ (이미지)│ │  (긴 이미지) │ │ (이미지)│     onClick → 상세 모달      │ │
│ │ │ ┌─────┐ │ │  ┌───────┐  │ │ ┌─────┐ │                               │ │
│ │ │ │아이템│ │ │  │아이템 │  │ │ │아이템│ │  ← 아이템 개수 배지          │ │
│ │ │ │개수 │ │ │  │개수   │  │ │ │개수 │ │                               │ │
│ │ │ └─────┘ │ │  └───────┘  │ │ └─────┘ │                               │ │
│ │ └─────────┘ └─────────────┘ └─────────┘                               │ │
│ │                                                                        │ │
│ │ ┌─────────────┐ ┌─────────┐ ┌─────────────┐                           │ │
│ │ │  CardCell   │ │ CardCell│ │  CardCell   │                           │ │
│ │ │             │ │         │ │             │                           │ │
│ │ └─────────────┘ └─────────┘ └─────────────┘                           │ │
│ │                                                                        │ │
│ │        ↓ 스크롤 하단 50px 접근 시 자동 로딩                            │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐ │ │
│ │ │              [Loading Spinner / Skeleton]                          │ │ │
│ │ └────────────────────────────────────────────────────────────────────┘ │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ 컴포넌트: packages/web/lib/components/grid/ThiingsGrid.tsx                 │
│ 자식: packages/web/lib/components/grid/CardCell.tsx                        │
│ 훅: packages/web/lib/hooks/useInfiniteFilteredImages.ts                    │
│ 상태: React Query (images cache), filterStore (필터)                       │
└────────────────────────────────────────────────────────────────────────────┘
```

#### ThiingsGrid 컴포넌트 상세

| 속성 | 타입 | 설명 |
|------|------|------|
| `columnCount` | `number` | 컬럼 수 (반응형: 2-5) |
| `gap` | `number` | 카드 간격 (px) |
| `observerMargin` | `string` | IntersectionObserver 마진 |

#### CardCell 컴포넌트 상세

| 요소 | 동작 | 상태 변경 | 파일 |
|------|------|----------|------|
| 이미지 영역 | 클릭 시 상세 모달 | `transitionStore.prepare()` | CardCell.tsx:45 |
| 아이템 배지 | 아이템 개수 표시 | - | CardCell.tsx:72 |
| 호버 효과 | 이미지 확대 | CSS transform | CardCell.tsx:23 |

#### 이벤트 흐름 다이어그램

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        D-01 Feed Event Flow                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [페이지 로드]                                                           │
│       │                                                                  │
│       ▼                                                                  │
│  HomeClient.tsx                                                          │
│       │                                                                  │
│       ├─── useInfiniteFilteredImages() ────────────────────┐             │
│       │         │                                          │             │
│       │         ▼                                          │             │
│       │    queryKey: ["images", "infinite",                │             │
│       │              { accountId, limit, search }]         │             │
│       │         │                                          │             │
│       │         ▼                                          │             │
│       │    fetchUnifiedImages()                            │             │
│       │         │                                          │             │
│       │         ▼                                          │             │
│       │    Supabase RPC ──► PostgreSQL                     │             │
│       │         │                                          │             │
│       │         ▼                                          │             │
│       │    normalizeImage() → UiImage[]                    │             │
│       │                                          캐시 저장 │             │
│       │                                          (5분 gcTime)            │
│       ▼                                                                  │
│  ThiingsGrid.tsx                                                         │
│       │                                                                  │
│       ├─── IntersectionObserver ───────────────────────────┐             │
│       │         │                                          │             │
│       │    하단 50px 접근?                                 │             │
│       │         │                                          │             │
│       │    YES  ▼                                          │             │
│       │    fetchNextPage() ─────────────────────────────►  │             │
│       │                                        다음 페이지 로드          │
│       │                                                                  │
│       ▼                                                                  │
│  CardCell.tsx (각 이미지)                                                │
│       │                                                                  │
│       ├─── onClick ────────────────────────────────────────┐             │
│       │         │                                          │             │
│       │         ▼                                          │             │
│       │    transitionStore.prepare(rect, imageId)          │             │
│       │         │                                          │             │
│       │         ▼                                          │             │
│       │    router.push(`/(.)images/${id}`, { scroll: false })            │
│       │         │                                          │             │
│       │         ▼                                          │             │
│       │    GSAP FLIP 애니메이션 시작                       │             │
│       │         │                                          │             │
│       │         ▼                                          │             │
│       │    DetailModal 렌더링                              │             │
│       │                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

#### 상태 동기화 패턴

```typescript
// 필터 변경 시 데이터 갱신 흐름
filterStore.setFilter({ accountId: 'xxx' })
    ↓
// React Query queryKey 변경 감지
queryKey: ["images", "infinite", { accountId: 'xxx', ... }]
    ↓
// 캐시 미스 → 새로운 데이터 fetch
fetchUnifiedImages({ accountId: 'xxx', cursor: null })
    ↓
// 그리드 자동 리렌더링
ThiingsGrid → CardCell[] 업데이트
```

---

### D-02 Hierarchical Filter - 컴포넌트 매핑

#### 데스크톱 필터바 상세

```
┌────────────────────────────────────────────────────────────────────────────┐
│ DESKTOP FILTER BAR                                                         │
│                                                                            │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│ │ All ▼   │  │ Media ▼  │  │ Cast ▼   │  │Context ▼ │  │🔍 Search...  │  │
│ └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│      │             │             │             │                │          │
│      ▼             ▼             ▼             ▼                ▼          │
│ ┌──────────────────────────────────────────────────────────────────────┐  │
│ │ 드롭다운 메뉴 (FilterDropdown.tsx)                                   │  │
│ │ ┌────────────────────────────────────────────────────────────────┐  │  │
│ │ │ ○ K-POP                                                  127  │  │  │
│ │ │ ○ K-Drama                                                 89  │  │  │
│ │ │ ● K-Variety (선택됨)                                      65  │  │  │
│ │ │ ○ K-Movie                                                 43  │  │  │
│ │ └────────────────────────────────────────────────────────────────┘  │  │
│ └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│ 컴포넌트 구조:                                                             │
│ ├─ DesktopFilterBar.tsx (예정)                                            │
│ │   ├─ FilterDropdown.tsx (Level 1: Category)                             │
│ │   │   └─ FilterOption.tsx (각 옵션)                                     │
│ │   ├─ FilterDropdown.tsx (Level 2: Media)                                │
│ │   ├─ FilterDropdown.tsx (Level 3: Cast)                                 │
│ │   ├─ FilterDropdown.tsx (Level 4: Context)                              │
│ │   └─ SearchInput.tsx                                                    │
│ └─ FilterBreadcrumb.tsx (선택된 필터 경로 표시)                            │
│                                                                            │
│ 상태 관리: filterStore (Zustand)                                           │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 모바일 필터 바텀시트 상세

```
┌─────────────────────────────────────────┐
│ MOBILE FILTER BOTTOM SHEET              │
│                                         │
│  ═══════════════════                    │  ← 드래그 핸들
│  ┌───────────────────────────────────┐  │     onDragEnd → 닫기/열기
│  │ Select Category                   │  │
│  ├───────────────────────────────────┤  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ 🔥 K-POP                 127│  │  │  ← 터치 시 선택
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ 🎬 K-Drama               89 │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ 📺 K-Variety        ✓    65 │  │  │  ← 선택된 항목
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  다음 레벨로 이동 →               │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │        [Apply Filter]             │  │  ← 터치 시 필터 적용
│  └───────────────────────────────────┘  │     filterStore.apply()
│                                         │
│ 컴포넌트: MobileFilterSheet.tsx (예정)  │
│ 애니메이션: Motion (spring transition) │
│ 상태: filterStore + 로컬 임시 상태     │
└─────────────────────────────────────────┘
```

#### 필터 이벤트 흐름

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    D-02 Filter Event Flow                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [사용자 액션: 필터 드롭다운 클릭]                                        │
│       │                                                                  │
│       ▼                                                                  │
│  FilterDropdown.tsx                                                      │
│       │                                                                  │
│       ├─── onClick (드롭다운 열기) ───────────────────────┐              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    setOpen(true)                                  │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    useFilterOptions() 호출                        │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    Supabase 쿼리 (필터 옵션 + 카운트)             │              │
│       │                                                   │              │
│       ▼                                                   │              │
│  FilterOption.tsx (옵션 선택)                             │              │
│       │                                                   │              │
│       ├─── onClick (옵션 선택) ───────────────────────────┤              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    filterStore.setCategory('K-POP')               │              │
│       │         │                                         │              │
│       │         ├─── 하위 레벨 초기화                      │              │
│       │         │    filterStore.setMedia(null)           │              │
│       │         │    filterStore.setCast(null)            │              │
│       │         │                                         │              │
│       │         ├─── Breadcrumb 업데이트                   │              │
│       │         │    breadcrumb: [{ level: 'category',    │              │
│       │         │                   value: 'K-POP' }]     │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    URL 업데이트                                   │              │
│       │    router.push('/?category=K-POP')                │              │
│       │                                                   │              │
│       ▼                                                   │              │
│  React Query 자동 갱신                                    │              │
│       │                                                   │              │
│       ├─── queryKey 변경 감지 ────────────────────────────┤              │
│       │    ["images", "infinite", { category: 'K-POP' }]  │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    fetchUnifiedImages({ category: 'K-POP' })      │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    그리드 리렌더링                                 │              │
│       │                                                   │              │
└──────────────────────────────────────────────────────────────────────────┘
```

#### filterStore 상태 전이

```
┌────────────────────────────────────────────────────────────────────────┐
│                    filterStore State Transitions                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [초기 상태]                                                           │
│  {                                                                     │
│    category: null,                                                     │
│    mediaId: null,                                                      │
│    castId: null,                                                       │
│    contextType: null,                                                  │
│    breadcrumb: []                                                      │
│  }                                                                     │
│       │                                                                │
│       │ setCategory('K-POP')                                           │
│       ▼                                                                │
│  [Level 1 선택]                                                        │
│  {                                                                     │
│    category: 'K-POP',                                                  │
│    mediaId: null,      ← 하위 레벨 자동 초기화                         │
│    castId: null,                                                       │
│    contextType: null,                                                  │
│    breadcrumb: [{ level: 0, label: 'K-POP', type: 'category' }]       │
│  }                                                                     │
│       │                                                                │
│       │ setMedia('bts-uuid')                                           │
│       ▼                                                                │
│  [Level 2 선택]                                                        │
│  {                                                                     │
│    category: 'K-POP',                                                  │
│    mediaId: 'bts-uuid',                                                │
│    castId: null,       ← 하위 레벨 자동 초기화                         │
│    contextType: null,                                                  │
│    breadcrumb: [                                                       │
│      { level: 0, label: 'K-POP', type: 'category' },                  │
│      { level: 1, label: 'BTS', type: 'media' }                        │
│    ]                                                                   │
│  }                                                                     │
│       │                                                                │
│       │ navigateToBreadcrumb(0)  ← Breadcrumb 클릭                     │
│       ▼                                                                │
│  [Level 1로 복귀]                                                      │
│  {                                                                     │
│    category: 'K-POP',                                                  │
│    mediaId: null,      ← 해당 레벨 이하 초기화                         │
│    castId: null,                                                       │
│    contextType: null,                                                  │
│    breadcrumb: [{ level: 0, label: 'K-POP', type: 'category' }]       │
│  }                                                                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### D-04 Unified Search - 컴포넌트 매핑

#### 검색 UI 컴포넌트 상세

```
┌────────────────────────────────────────────────────────────────────────────┐
│ SEARCH INPUT (Header)                                                       │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔍 │ Search people, shows, items...                              [×]  │ │
│ └──┬───────────────────────────────────────────────────────────────┬────┘ │
│    │                                                               │      │
│    │ ┌─────────────────────────────────────────────────────────────┴────┐ │
│    │ │ SUGGESTIONS DROPDOWN (SearchSuggestions.tsx)                     │ │
│    │ │ ┌────────────────────────────────────────────────────────────┐  │ │
│    │ │ │ Recent Searches                                    [Clear] │  │ │
│    │ │ │   🕐 jisoo                                      ← 클릭 시  │  │ │
│    │ │ │   🕐 squid game                                   검색 실행│  │ │
│    │ │ ├────────────────────────────────────────────────────────────┤  │ │
│    │ │ │ Popular                                                    │  │ │
│    │ │ │   🔥 NewJeans                                              │  │ │
│    │ │ │   🔥 IVE Wonyoung                                          │  │ │
│    │ │ └────────────────────────────────────────────────────────────┘  │ │
│    │ └──────────────────────────────────────────────────────────────────┘ │
│    │                                                                      │
│    └─ 입력값 변경 (250ms debounce) → searchStore.setQuery()               │
│                                                                            │
│ 컴포넌트: packages/web/lib/components/header/SearchInput.tsx               │
│ 훅: useDebounce(query, 250)                                               │
│ 상태: searchStore (Zustand)                                               │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 검색 결과 페이지 상세

```
┌────────────────────────────────────────────────────────────────────────────┐
│ SEARCH RESULTS PAGE (/search?q=jisoo)                                       │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Results for "jisoo"                                                    │ │
│ │                                                                        │ │
│ │ ┌──────────┐ ┌──────────────┐ ┌──────────┐ ┌──────────────┐           │ │
│ │ │   All    │ │ People (3)   │ │ Media(1) │ │  Items (47)  │           │ │
│ │ │ (active) │ │              │ │          │ │              │           │ │
│ │ └────┬─────┘ └──────────────┘ └──────────┘ └──────────────┘           │ │
│ │      │                                                                 │ │
│ │      └─ onClick → setActiveTab('all' | 'people' | 'media' | 'items') │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ 컴포넌트: SearchTabs.tsx                                                   │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ 👤 People                                              [See all →]    │ │
│ │ ┌──────────────────────────────────────────────────────────────────┐  │ │
│ │ │ ┌─────────────────────────────────────────────────────────────┐ │  │ │
│ │ │ │ [Photo] │ Jisoo (BLACKPINK)                                 │ │  │ │
│ │ │ │         │ 42 items                              [→]        │ │  │ │
│ │ │ └─────────────────────────────────────────────────────────────┘ │  │ │
│ │ │ ┌─────────────────────────────────────────────────────────────┐ │  │ │
│ │ │ │ [Photo] │ Kim Ji-soo (Actor)                                │ │  │ │
│ │ │ │         │ 15 items                              [→]        │ │  │ │
│ │ │ └─────────────────────────────────────────────────────────────┘ │  │ │
│ │ └──────────────────────────────────────────────────────────────────┘  │ │
│ │ 컴포넌트: PeopleResultSection.tsx                                     │ │
│ │ 자식: PeopleResultItem.tsx                                           │ │
│ │ onClick → router.push(`/cast/${castId}`)                             │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ 🎬 Media                                               [See all →]    │ │
│ │ ┌──────────────────────────────────────────────────────────────────┐  │ │
│ │ │ [Poster] │ Snowdrop (ft. Jisoo)                                  │  │ │
│ │ │          │ Drama • 2021 • 28 items                   [→]        │  │ │
│ │ └──────────────────────────────────────────────────────────────────┘  │ │
│ │ 컴포넌트: MediaResultSection.tsx                                      │ │
│ │ onClick → router.push(`/media/${mediaId}`)                           │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ 👗 Items                                               [See all →]    │ │
│ │ ┌──────────────────────────────────────────────────────────────────┐  │ │
│ │ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                        │  │ │
│ │ │ │Item │ │Item │ │Item │ │Item │ │Item │  ← 그리드 형태         │  │ │
│ │ │ │Thumb│ │Thumb│ │Thumb│ │Thumb│ │Thumb│                        │  │ │
│ │ │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                        │  │ │
│ │ └──────────────────────────────────────────────────────────────────┘  │ │
│ │ 컴포넌트: ItemResultSection.tsx                                       │ │
│ │ 자식: ItemThumbnail.tsx                                              │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 페이지: packages/web/app/search/page.tsx                                   │
│ 훅: useSearch(query, activeTab)                                           │
│ 상태: searchStore (query), 로컬 state (activeTab)                         │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 검색 이벤트 흐름

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    D-04 Search Event Flow                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [사용자 입력: 검색어 타이핑]                                            │
│       │                                                                  │
│       ▼                                                                  │
│  SearchInput.tsx                                                         │
│       │                                                                  │
│       ├─── onChange ──────────────────────────────────────┐              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    setLocalQuery(value)                           │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    useDebounce(localQuery, 250ms)                 │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    debouncedQuery 변경 감지                        │              │
│       │         │                                         │              │
│       │         ├── 길이 >= 2?                            │              │
│       │         │      │                                  │              │
│       │         │  YES ▼                                  │              │
│       │         │  searchStore.setQuery(debouncedQuery)   │              │
│       │         │      │                                  │              │
│       │         │      ▼                                  │              │
│       │         │  useSuggestions() 호출                  │              │
│       │         │      │                                  │              │
│       │         │      ▼                                  │              │
│       │         │  드롭다운에 suggestions 표시            │              │
│       │         │                                         │              │
│       ▼         │                                         │              │
│  [Enter 키 또는 검색 버튼 클릭]                            │              │
│       │                                                   │              │
│       ├─── onSubmit ──────────────────────────────────────┤              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    addToRecentSearches(query)                     │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    router.push(`/search?q=${query}`)              │              │
│       │                                                   │              │
│       ▼                                                   │              │
│  /search/page.tsx                                         │              │
│       │                                                   │              │
│       ├─── useSearch(query, 'all') ──────────────────────┤              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    Supabase full-text search                      │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    {                                              │              │
│       │      people: Cast[],                              │              │
│       │      media: Media[],                              │              │
│       │      items: Item[]                                │              │
│       │    }                                              │              │
│       │         │                                         │              │
│       │         ▼                                         │              │
│       │    SearchResults 렌더링                           │              │
│       │                                                   │              │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 에지 케이스 및 에러 처리

### D-01 Magazine Feed

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 이미지 0개 | EmptyState 컴포넌트 표시 | ThiingsGrid.tsx:89 |
| 네트워크 오류 | ErrorBoundary + 재시도 버튼 | HomeClient.tsx:45 |
| 이미지 로드 실패 | placeholder 이미지 표시 | CardCell.tsx:112 |
| 무한 스크롤 끝 | "No more items" 표시 | ThiingsGrid.tsx:134 |

### D-02 Hierarchical Filter

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 필터 결과 0개 | "No items match" + 필터 초기화 버튼 | FilterResults.tsx |
| 옵션 로딩 지연 | 스피너 표시 | FilterDropdown.tsx |
| URL 파라미터 무효 | 기본값으로 fallback | useFilterFromURL.ts |

### D-04 Unified Search

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 검색어 2글자 미만 | 검색 비활성화 | useSearch.ts:12 |
| 검색 결과 0개 | EmptySearchState 표시 | SearchResults.tsx |
| 검색 타임아웃 | 재시도 옵션 | useSearch.ts:34 |

---

## 구현 상태 체크리스트

### D-01 Magazine Feed
- [x] 기본 그리드 렌더링
- [x] 무한 스크롤
- [x] 이미지 lazy loading
- [x] 반응형 컬럼 조정
- [ ] Pull-to-refresh (모바일)
- [ ] 스켈레톤 애니메이션

### D-02 Hierarchical Filter
- [ ] 4-level 필터 UI
- [ ] 드롭다운 컴포넌트
- [ ] Breadcrumb 네비게이션
- [ ] 모바일 바텀시트
- [ ] URL 상태 동기화
- [ ] 필터 카운트 표시

### D-03 Media Gallery
- [ ] 미디어 상세 페이지
- [ ] Hero 섹션
- [ ] Cast 그리드
- [ ] 관련 미디어

### D-04 Unified Search
- [x] 기본 검색 입력
- [x] 검색 쿼리 상태
- [ ] 탭 기반 결과 분류
- [ ] 자동완성 suggestions
- [ ] 최근 검색 기록
- [ ] Full-text 검색 인덱스
