# Detail & Interaction

> Features: V-01 ~ V-06
> Status: 40% implemented
> Dependencies: Item detection pipeline

---

## Overview

Detail features handle the presentation of posts and items, including the pin system that connects visual elements to product information. Interaction features enable community engagement through voting and comments.

### Related Screens
- `/images/[id]` - Full page detail view
- `/@modal/(.)images/[id]` - Modal detail view (intercepting route)

### Current Implementation
- `app/images/[id]/page.tsx` - Full page route
- `app/@modal/(.)images/[id]/page.tsx` - Modal route
- `lib/components/detail/ImageDetailContent.tsx` - Shared detail logic
- `lib/components/detail/ItemDetailCard.tsx` - Item card
- `lib/components/detail/ConnectorLayer.tsx` - Pin connection lines

---

## Features

### V-01 Responsive Detail View

- **Description**: Mobile shows bottom sheet; Web shows split modal view
- **Priority**: P0
- **Status**: **Implemented** ✅
- **Dependencies**: None

#### Current Implementation
- Modal intercepting route for web
- Full page for direct navigation/mobile
- Shared content component

#### Acceptance Criteria
- [x] Mobile: Full page view with scrollable content
- [x] Web: Modal overlay with image left, details right
- [x] Swipe/click to navigate between images
- [x] Close button returns to feed
- [x] URL updates when viewing detail
- [x] Back button works correctly

#### Related Files
- `app/images/[id]/page.tsx`
- `app/@modal/(.)images/[id]/page.tsx`
- `lib/components/detail/ImageDetailPage.tsx`
- `lib/components/detail/ImageDetailModal.tsx`
- `lib/components/detail/ImageDetailContent.tsx`

#### Future Improvements
- [ ] Swipe gestures on mobile
- [ ] Keyboard navigation (←/→)
- [ ] Preload adjacent images

---

### V-02 Pin Interaction

- **Description**: Display pins on image at item coordinates; clicking pin highlights item card
- **Priority**: P0
- **Status**: Partial (coordinate system exists, interaction incomplete)
- **Dependencies**: Item detection with bounding boxes

#### Current Implementation
- `ConnectorLayer.tsx` - Draws lines from pins to cards
- Items have `center` coordinate (normalized 0-1)
- Basic visual display exists

#### Acceptance Criteria
- [ ] Pins display at correct positions on image
- [ ] Pins use numbered labels matching item list
- [ ] Clicking pin scrolls to and highlights corresponding item card
- [ ] Clicking item card highlights corresponding pin
- [ ] Hover states on both pins and cards
- [ ] Mobile: Tap interaction works smoothly
- [ ] Connection lines animate on hover/select
- [ ] Pins scale appropriately at different image sizes

#### UI/UX Requirements

**Pin Design**:
```
    ┌───┐
    │ 1 │  ← numbered circle (24px)
    └─┬─┘
      │    ← connector line
      ▼
   [item]
```

**Interaction States**:
```
Default:     ●1 (white fill, dark border)
Hover:       ●1 (primary color fill)
Selected:    ●1 (primary fill, glow effect)
Connected:   ●1──────[Card highlighted]
```

**Split View Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌────────────────────────┐  ┌────────────────────────────────┐│
│  │                        │  │ Item Details                   ││
│  │      [Image]           │  │                                ││
│  │         ●1             │  │ ┌────────────────────────────┐││
│  │              ●2        │  │ │ 1. Jacket                  │││
│  │     ●3                 │  │ │    Brand Name              │││
│  │                        │  │ │    $299                    │││
│  │                        │  │ └────────────────────────────┘││
│  │                        │  │ ┌────────────────────────────┐││
│  │                        │  │ │ 2. Bag              ●      │││
│  │                        │  │ │    Brand Name       ← dot  │││
│  └────────────────────────┘  │ └────────────────────────────┘││
│                              │                                ││
│                              └────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- Item `center` coordinate (already exists)
- Item ordering/numbering

#### Implementation Notes
```typescript
// lib/components/detail/PinOverlay.tsx
interface Pin {
  itemId: string;
  index: number;
  position: { x: number; y: number }; // normalized 0-1
}

function PinOverlay({ pins, selectedPinId, onPinClick }: Props) {
  return (
    <div className="absolute inset-0">
      {pins.map(pin => (
        <PinMarker
          key={pin.itemId}
          index={pin.index}
          style={{
            left: `${pin.position.x * 100}%`,
            top: `${pin.position.y * 100}%`,
          }}
          isSelected={pin.itemId === selectedPinId}
          onClick={() => onPinClick(pin.itemId)}
        />
      ))}
    </div>
  );
}
```

#### Files to Create/Modify
- `lib/components/detail/PinOverlay.tsx` - Pin container
- `lib/components/detail/PinMarker.tsx` - Individual pin
- `lib/components/detail/ConnectorLayer.tsx` - Update connection logic
- `lib/components/detail/ItemDetailCard.tsx` - Add highlight state

---

### V-03 Dual Match List

- **Description**: Show "The Original" (exact match) vs "The Vibe" (similar affordable alternative)
- **Priority**: P0
- **Status**: Not Started
- **Dependencies**: V-02 (Pin System), Item match_type field

#### Acceptance Criteria
- [ ] Items grouped into "Original" and "Vibe" sections
- [ ] Clear visual distinction between sections
- [ ] "Original" shows exact product with brand/price
- [ ] "Vibe" shows similar alternatives (usually cheaper)
- [ ] Price comparison visible
- [ ] User can submit "Vibe" suggestions
- [ ] Voting determines best "Vibe" match

#### UI/UX Requirements

**Dual Match Layout**:
```
┌─────────────────────────────────────────┐
│  👗 Item #1: Jacket                     │
│                                         │
│  THE ORIGINAL                           │
│  ┌─────────────────────────────────┐   │
│  │ [Img] Celine Triomphe Jacket    │   │
│  │       $2,850                    │   │
│  │       [Buy Original →]          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  THE VIBE                    +Add Vibe  │
│  ┌─────────────────────────────────┐   │
│  │ [Img] Zara Structured Blazer    │   │
│  │       $129          ▲12 ▼2      │   │
│  │       [Buy Vibe →]              │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ [Img] H&M Premium Jacket        │   │
│  │       $89           ▲8 ▼1       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Show 2 more vibes]                   │
└─────────────────────────────────────────┘
```

#### Data Requirements
- Item `match_type`: 'original' | 'vibe'
- Items linked by `original_item_id` (vibe references original)
- Vote counts per vibe item

#### Implementation Notes
```typescript
interface ItemGroup {
  original: Item;
  vibes: ItemWithVotes[];
}

// Group items by original
function groupItems(items: Item[]): ItemGroup[] {
  const originals = items.filter(i => i.matchType === 'original');
  return originals.map(original => ({
    original,
    vibes: items.filter(i =>
      i.matchType === 'vibe' &&
      i.originalItemId === original.id
    ).sort((a, b) => b.voteScore - a.voteScore)
  }));
}
```

#### Files to Create/Modify
- `lib/components/detail/DualMatchSection.tsx`
- `lib/components/detail/OriginalItemCard.tsx`
- `lib/components/detail/VibeItemCard.tsx`
- `lib/components/detail/AddVibeButton.tsx`

---

### V-04 Smart Tags (Breadcrumb)

- **Description**: Display context tags like "Squid Game > Sae-byeok > Training Suit" at top of detail view
- **Priority**: P0
- **Status**: Not Started
- **Dependencies**: D-02 (Hierarchical Filter), Post metadata

#### Acceptance Criteria
- [ ] Tags display at top of detail view
- [ ] Shows: Media > Cast > Context
- [ ] Each tag is clickable (navigates to filtered feed)
- [ ] Tags adapt based on available metadata
- [ ] Visual styling matches design system

#### UI/UX Requirements

**Tag Display**:
```
┌─────────────────────────────────────────────────────────────┐
│  🎬 Squid Game  ›  👤 Jung Ho-yeon  ›  🏃 Training Scene   │
│  ↑ clickable      ↑ clickable          ↑ clickable          │
└─────────────────────────────────────────────────────────────┘
```

**Partial Tags** (when not all metadata available):
```
┌─────────────────────────────────────────────────────────────┐
│  🎵 BLACKPINK  ›  👤 Jisoo                                  │
└─────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- Post with `media_id`, `cast_ids`, `context_type`
- Joined media and cast data

#### Implementation Notes
```typescript
// lib/components/detail/SmartTags.tsx
interface SmartTagsProps {
  media?: Media;
  cast?: Cast[];
  contextType?: ContextType;
}

function SmartTags({ media, cast, contextType }: SmartTagsProps) {
  const tags: Tag[] = [];

  if (media) {
    tags.push({
      icon: media.type === 'group' ? '🎵' : '🎬',
      label: media.name,
      href: `/media/${media.id}`
    });
  }

  if (cast?.[0]) {
    tags.push({
      icon: '👤',
      label: cast[0].name,
      href: `/cast/${cast[0].id}`
    });
  }

  if (contextType) {
    tags.push({
      icon: contextIcons[contextType],
      label: contextLabels[contextType],
      href: `/?context=${contextType}`
    });
  }

  return <TagBreadcrumb tags={tags} />;
}
```

#### Files to Create/Modify
- `lib/components/detail/SmartTags.tsx`
- `lib/components/detail/TagBreadcrumb.tsx`
- Add to `ImageDetailContent.tsx`

---

### V-05 Purchase Link (Outlink)

- **Description**: "Buy" button opens affiliate link in new tab with tracking
- **Priority**: P0
- **Status**: Not Started
- **Dependencies**: S-05 (Click Tracker), S-03 (Deep Link Generator)

#### Acceptance Criteria
- [ ] "Buy" button visible on each item card
- [ ] Click opens affiliate link in new tab
- [ ] Click event logged for analytics
- [ ] User attribution tracked (if logged in)
- [ ] Loading state while generating tracked link
- [ ] Error handling if link generation fails
- [ ] Mobile: Opens in-app browser or external browser

#### UI/UX Requirements

**Buy Button**:
```
┌────────────────────────────────────┐
│ [Buy Now →]    or    [View Item →] │
└────────────────────────────────────┘

States:
- Default: Primary color, "Buy Now →"
- Hover: Darker shade
- Loading: Spinner + "Opening..."
- No link: "View Item" (opens product page without affiliate)
```

**Price Display**:
```
₩ 299,000
$299.00 USD  ← show both if available
```

#### Data Requirements
- Item `purchase_url`
- Affiliate code injection
- Click event logging

#### Implementation Notes
```typescript
// lib/utils/affiliateLink.ts
async function generateAffiliateLink(item: Item, userId?: string): Promise<string> {
  const baseUrl = item.purchaseUrl;
  const trackingParams = new URLSearchParams({
    utm_source: 'decoded',
    utm_medium: 'affiliate',
    item_id: item.id,
    ...(userId && { user_id: userId })
  });

  // Log click event
  await logClickEvent({
    itemId: item.id,
    userId,
    originalUrl: baseUrl
  });

  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${trackingParams}`;
}
```

#### Files to Create/Modify
- `lib/components/detail/BuyButton.tsx`
- `lib/utils/affiliateLink.ts`
- `lib/hooks/useTrackClick.ts`
- `app/api/track/click/route.ts` - Click logging endpoint

---

### V-06 Voting & Comments

- **Description**: Users can vote on item accuracy and leave comments
- **Priority**: P0
- **Status**: Not Started
- **Dependencies**: U-01 (Authentication)

#### Acceptance Criteria

**Voting**:
- [ ] "Accurate" / "Inaccurate" vote buttons on each item
- [ ] User can vote once per item
- [ ] Vote counts displayed
- [ ] Accuracy percentage calculated
- [ ] Can change vote
- [ ] Requires login to vote

**Comments**:
- [ ] Comment section below items
- [ ] Threaded replies supported
- [ ] Markdown formatting (basic)
- [ ] Edit own comments
- [ ] Delete own comments
- [ ] Report inappropriate comments
- [ ] Requires login to comment

#### UI/UX Requirements

**Voting UI**:
```
┌────────────────────────────────────────────┐
│ Is this identification accurate?           │
│                                            │
│ [👍 Accurate (47)]   [👎 Inaccurate (3)]  │
│                                            │
│ 94% accuracy                               │
└────────────────────────────────────────────┘

Voted state:
┌────────────────────────────────────────────┐
│ [👍 Accurate (48)] ✓   [👎 Inaccurate (3)]│
└────────────────────────────────────────────┘
```

**Comments UI**:
```
┌────────────────────────────────────────────┐
│ 💬 Comments (12)                           │
├────────────────────────────────────────────┤
│ [Avatar] user123 • 2 hours ago             │
│ I think this is actually from the 2023    │
│ collection, not 2024.                      │
│ [Reply] [Report]                           │
│                                            │
│   ↳ [Avatar] original_poster • 1 hour ago │
│     Thanks for the correction! Updated.   │
│     [Reply] [Report]                       │
│                                            │
│ [Avatar] fashionista • 5 hours ago        │
│ Great find! 🔥                            │
│ [Reply] [Report]                           │
├────────────────────────────────────────────┤
│ [Add a comment...]            [Post]       │
└────────────────────────────────────────────┘
```

#### Data Requirements

**Vote Table**:
```sql
CREATE TABLE vote (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user(id),
  item_id UUID REFERENCES item(id),
  type VARCHAR(20), -- 'accurate' | 'inaccurate'
  created_at TIMESTAMPTZ,
  UNIQUE(user_id, item_id)
);
```

**Comment Table**:
```sql
CREATE TABLE comment (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user(id),
  target_type VARCHAR(20), -- 'post' | 'item'
  target_id UUID,
  content TEXT,
  parent_id UUID REFERENCES comment(id),
  status VARCHAR(20) DEFAULT 'visible',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

#### API Endpoints
```
POST /api/items/:id/vote
  body: { type: 'accurate' | 'inaccurate' }

DELETE /api/items/:id/vote

GET /api/items/:id/comments?page=1
POST /api/items/:id/comments
  body: { content: string, parentId?: string }

PATCH /api/comments/:id
  body: { content: string }

DELETE /api/comments/:id

POST /api/comments/:id/report
  body: { reason: string }
```

#### Files to Create/Modify
- `lib/components/detail/VotingSection.tsx`
- `lib/components/detail/VoteButton.tsx`
- `lib/components/detail/CommentSection.tsx`
- `lib/components/detail/CommentItem.tsx`
- `lib/components/detail/CommentForm.tsx`
- `lib/hooks/useVote.ts`
- `lib/hooks/useComments.ts`
- `app/api/items/[id]/vote/route.ts`
- `app/api/items/[id]/comments/route.ts`
- `app/api/comments/[id]/route.ts`

---

## Data Models

See [data-models.md](./data-models.md) for full type definitions.

### Key Types for Detail & Interaction

```typescript
interface ItemWithVotes extends Item {
  votes: {
    accurateCount: number;
    inaccurateCount: number;
    accuracyScore: number;
    userVote?: 'accurate' | 'inaccurate';
  };
}

interface Comment {
  id: string;
  userId: string;
  user: { displayName: string; avatarUrl: string };
  content: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

interface Vote {
  userId: string;
  itemId: string;
  type: 'accurate' | 'inaccurate';
}
```

---

## Migration Path

### Phase 1: Complete Pin System
1. Finalize PinOverlay component
2. Add click-to-scroll interaction
3. Test on various image sizes

### Phase 2: Smart Tags
1. Add metadata to posts
2. Build SmartTags component
3. Add navigation links

### Phase 3: Dual Match
1. Add match_type to items
2. Build grouped item display
3. Add "Add Vibe" flow

### Phase 4: Purchase & Voting
1. Implement click tracking
2. Build buy button with affiliate links
3. Implement voting system
4. Add comment section

---

## Performance Considerations

- Pin positions should be calculated once and cached
- Comments should be paginated
- Vote counts can be eventually consistent (use optimistic updates)
- Image should have priority loading in detail view

---

## Component Mapping (상세 구현 참조)

> 이 섹션은 각 UI 요소가 실제 코드에서 어떻게 구현되는지 매핑합니다.

### V-01 Responsive Detail View - 컴포넌트 매핑

#### 모달 vs 풀페이지 라우팅 구조

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        ROUTING ARCHITECTURE                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  URL: /images/[id]                                                         │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Case 1: Soft Navigation (카드 클릭)                                 │  │
│  │                                                                      │  │
│  │ CardCell.tsx onClick                                                 │  │
│  │      │                                                               │  │
│  │      ▼                                                               │  │
│  │ transitionStore.prepare(rect, imageId)                              │  │
│  │      │                                                               │  │
│  │      ▼                                                               │  │
│  │ router.push(`/(.)images/${id}`, { scroll: false })                  │  │
│  │      │                                                               │  │
│  │      ▼                                                               │  │
│  │ Intercepting Route 활성화                                           │  │
│  │ app/@modal/(.)images/[id]/page.tsx                                  │  │
│  │      │                                                               │  │
│  │      ▼                                                               │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │ │                    MODAL OVERLAY                                │ │  │
│  │ │  ┌─────────────────────────────────────────────────────────┐   │ │  │
│  │ │  │ 배경 피드 (blur + dim)                                   │   │ │  │
│  │ │  │                                                          │   │ │  │
│  │ │  │     ┌────────────────────────────────────────────┐      │   │ │  │
│  │ │  │     │          ImageDetailModal.tsx             │      │   │ │  │
│  │ │  │     │                                            │      │   │ │  │
│  │ │  │     │  ┌──────────────────────────────────────┐ │      │   │ │  │
│  │ │  │     │  │    ImageDetailContent.tsx           │ │      │   │ │  │
│  │ │  │     │  │    (공유 컨텐츠 컴포넌트)           │ │      │   │ │  │
│  │ │  │     │  └──────────────────────────────────────┘ │      │   │ │  │
│  │ │  │     │                                            │      │   │ │  │
│  │ │  │     └────────────────────────────────────────────┘      │   │ │  │
│  │ │  │                                                          │   │ │  │
│  │ │  └─────────────────────────────────────────────────────────┘   │ │  │
│  │ └─────────────────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Case 2: Hard Navigation (직접 URL 접근, 새로고침)                   │  │
│  │                                                                      │  │
│  │ Direct URL: /images/[id]                                            │  │
│  │      │                                                               │  │
│  │      ▼                                                               │  │
│  │ app/images/[id]/page.tsx (Full Page)                                │  │
│  │      │                                                               │  │
│  │      ▼                                                               │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │ │                    FULL PAGE VIEW                               │ │  │
│  │ │                                                                  │ │  │
│  │ │  ┌────────────────────────────────────────────────────────────┐ │ │  │
│  │ │  │              ImageDetailPage.tsx                           │ │ │  │
│  │ │  │                                                             │ │ │  │
│  │ │  │  ┌────────────────────────────────────────────────────────┐│ │ │  │
│  │ │  │  │    ImageDetailContent.tsx                              ││ │ │  │
│  │ │  │  │    (공유 컨텐츠 컴포넌트)                              ││ │ │  │
│  │ │  │  └────────────────────────────────────────────────────────┘│ │ │  │
│  │ │  │                                                             │ │ │  │
│  │ │  └────────────────────────────────────────────────────────────┘ │ │  │
│  │ └─────────────────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│ 파일 구조:                                                                 │
│ packages/web/app/                                                          │
│ ├── @modal/                                                                │
│ │   └── (.)images/                                                         │
│ │       └── [id]/                                                          │
│ │           └── page.tsx  ← Intercepting Route (모달)                     │
│ │                                                                          │
│ └── images/                                                                │
│     └── [id]/                                                              │
│         └── page.tsx      ← Full Page Route                               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 데스크톱 분할 뷰 레이아웃

```
┌────────────────────────────────────────────────────────────────────────────┐
│ DESKTOP DETAIL VIEW (ImageDetailContent.tsx)                               │
│                                                                            │
│ ┌─────────────────────────────┬──────────────────────────────────────────┐ │
│ │                             │                                          │ │
│ │      IMAGE SECTION          │         ITEM SECTION                     │ │
│ │                             │                                          │ │
│ │ ┌─────────────────────────┐ │  ┌────────────────────────────────────┐ │ │
│ │ │                         │ │  │ SmartTags.tsx                      │ │ │
│ │ │    InteractiveShowcase  │ │  │ ┌──────────────────────────────┐  │ │ │
│ │ │        .tsx             │ │  │ │ 🎬 Squid Game › 👤 호연 › 🏃 │  │ │ │
│ │ │                         │ │  │ └──────────────────────────────┘  │ │ │
│ │ │  ┌───────────────────┐  │ │  └────────────────────────────────────┘ │ │
│ │ │  │                   │  │ │                                          │ │
│ │ │  │    [이미지]       │  │ │  ┌────────────────────────────────────┐ │ │
│ │ │  │       ●1          │  │ │  │ ItemList.tsx                       │ │ │
│ │ │  │            ●2     │  │ │  │                                    │ │ │
│ │ │  │    ●3             │  │ │  │ ┌────────────────────────────────┐│ │ │
│ │ │  │                   │  │ │  │ │ 1. ItemDetailCard.tsx          ││ │ │
│ │ │  └───────────────────┘  │ │  │ │ ┌────────────────────────────┐││ │ │
│ │ │                         │ │  │ │ │ [Img] Celine Jacket        │││ │ │
│ │ │  ┌───────────────────┐  │ │  │ │ │       $2,850               │││ │ │
│ │ │  │ PinOverlay.tsx    │  │ │  │ │ │       [Buy →]              │││ │ │
│ │ │  │ (핀 오버레이)     │  │ │  │ │ └────────────────────────────┘││ │ │
│ │ │  └───────────────────┘  │ │  │ └────────────────────────────────┘│ │ │
│ │ │                         │ │  │                                    │ │ │
│ │ │  ┌───────────────────┐  │ │  │ ┌────────────────────────────────┐│ │ │
│ │ │  │ ConnectorLayer    │  │ │  │ │ 2. ItemDetailCard.tsx          ││ │ │
│ │ │  │ (핀-카드 연결선)  │  │ │  │ │ ┌────────────────────────────┐││ │ │
│ │ │  └───────────────────┘  │ │  │ │ │ [Img] Prada Bag            │││ │ │
│ │ │                         │ │  │ │ │       $1,950               │││ │ │
│ │ └─────────────────────────┘ │  │ │ └────────────────────────────┘││ │ │
│ │                             │  │ └────────────────────────────────┘│ │ │
│ │ width: 60%                  │  │                                    │ │ │
│ │                             │  │ width: 40%                        │ │ │
│ │                             │  └────────────────────────────────────┘ │ │
│ │                             │                                          │ │
│ └─────────────────────────────┴──────────────────────────────────────────┘ │
│                                                                            │
│ 컴포넌트 트리:                                                             │
│ ImageDetailContent.tsx                                                     │
│ ├── InteractiveShowcase.tsx (이미지 + 핀 + 연결선)                        │
│ │   ├── Image (next/image)                                                │
│ │   ├── PinOverlay.tsx                                                    │
│ │   │   └── PinMarker.tsx (×N)                                           │
│ │   └── ConnectorLayer.tsx (SVG)                                         │
│ │                                                                          │
│ └── ItemSection.tsx (아이템 목록)                                         │
│     ├── SmartTags.tsx                                                      │
│     └── ItemList.tsx                                                       │
│         └── ItemDetailCard.tsx (×N)                                       │
│             ├── ItemImage                                                  │
│             ├── ItemInfo                                                   │
│             ├── VotingSection.tsx                                          │
│             └── BuyButton.tsx                                              │
│                                                                            │
│ 상태 관리:                                                                 │
│ - selectedPinId: 로컬 state (useState)                                    │
│ - imageData: React Query cache                                             │
│ - items: useNormalizedItems() 훅                                          │
│ - transitionState: transitionStore (GSAP 애니메이션)                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### GSAP FLIP 전환 애니메이션

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    FLIP ANIMATION SEQUENCE                                  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  [1. CAPTURE] 카드 클릭 시                                                 │
│       │                                                                    │
│       ▼                                                                    │
│  CardCell.tsx:onClick                                                      │
│       │                                                                    │
│       ├─── GSAP Flip.getState(cardElement) ────────────────┐              │
│       │         │                                          │              │
│       │         ▼                                          │              │
│       │    원본 위치/크기 저장                              │              │
│       │    {                                               │              │
│       │      x, y, width, height,                          │              │
│       │      scaleX, scaleY, rotation                      │              │
│       │    }                                               │              │
│       │                                                    │              │
│       ├─── transitionStore.prepare(state, imageId) ───────┤              │
│       │                                                    │              │
│       ▼                                                    │              │
│  [2. NAVIGATE] 라우트 변경                                  │              │
│       │                                                    │              │
│       ├─── router.push(`/(.)images/${id}`) ───────────────┤              │
│       │                                                    │              │
│       ▼                                                    │              │
│  [3. ANIMATE] 모달 마운트 시                                │              │
│       │                                                    │              │
│       ├─── ImageDetailModal.tsx:useEffect ────────────────┤              │
│       │         │                                          │              │
│       │         ▼                                          │              │
│       │    Flip.from(storedState, {                        │              │
│       │      duration: 0.5,                                │              │
│       │      ease: "power2.out",                           │              │
│       │      scale: true,                                  │              │
│       │      absolute: true,                               │              │
│       │      onComplete: () => {                           │              │
│       │        transitionStore.complete()                  │              │
│       │      }                                             │              │
│       │    })                                              │              │
│       │         │                                          │              │
│       │         ▼                                          │              │
│       │    ┌────────────────────────────────────────┐      │              │
│       │    │                                        │      │              │
│       │    │  카드 위치 ───────────▶ 모달 위치      │      │              │
│       │    │                                        │      │              │
│       │    │  [Small]          [Large + Details]   │      │              │
│       │    │     ↗                    ↗            │      │              │
│       │    │      \                  /             │      │              │
│       │    │       \────────────────/              │      │              │
│       │    │         FLIP Animation                │      │              │
│       │    │                                        │      │              │
│       │    └────────────────────────────────────────┘      │              │
│       │                                                    │              │
│       ▼                                                    │              │
│  [4. REVERSE] 모달 닫기 시                                  │              │
│       │                                                    │              │
│       ├─── onClose 또는 router.back() ────────────────────┤              │
│       │         │                                          │              │
│       │         ▼                                          │              │
│       │    Flip.from(modalState, {                         │              │
│       │      duration: 0.4,                                │              │
│       │      ease: "power2.in",                            │              │
│       │      targets: originalCard,                        │              │
│       │      onComplete: () => {                           │              │
│       │        transitionStore.reset()                     │              │
│       │      }                                             │              │
│       │    })                                              │              │
│       │                                                    │              │
│       ▼                                                    │              │
│  [5. CLEANUP] 애니메이션 완료                               │              │
│                                                            │              │
└────────────────────────────────────────────────────────────────────────────┘

transitionStore 상태:
┌────────────────────────────────────────────────────────────┐
│ {                                                          │
│   isTransitioning: boolean,                                │
│   sourceState: Flip.State | null,                         │
│   targetImageId: string | null,                           │
│   prepare: (state, id) => void,                           │
│   complete: () => void,                                    │
│   reset: () => void                                        │
│ }                                                          │
└────────────────────────────────────────────────────────────┘
```

---

### V-02 Pin Interaction - 컴포넌트 매핑

#### 핀 시스템 상세 구조

```
┌────────────────────────────────────────────────────────────────────────────┐
│ PIN INTERACTION SYSTEM                                                      │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ InteractiveShowcase.tsx                                                │ │
│ │                                                                        │ │
│ │  ┌────────────────────────────────────────┐                           │ │
│ │  │ 이미지 컨테이너 (position: relative)   │                           │ │
│ │  │                                         │                           │ │
│ │  │  ┌─────────────────────────────────┐   │                           │ │
│ │  │  │ <Image />                       │   │                           │ │
│ │  │  │ priority={true}                 │   │                           │ │
│ │  │  │ onLoad → setImageLoaded(true)   │   │                           │ │
│ │  │  └─────────────────────────────────┘   │                           │ │
│ │  │                                         │                           │ │
│ │  │  ┌─────────────────────────────────┐   │                           │ │
│ │  │  │ PinOverlay.tsx                  │   │  ← position: absolute    │ │
│ │  │  │ (inset: 0)                      │   │     pointer-events: none │ │
│ │  │  │                                  │   │     (개별 핀만 이벤트)   │ │
│ │  │  │  ●1 ──────────────────────────────────▶ PinMarker #1          │ │
│ │  │  │       left: 32%                  │   │    onClick → select(1)  │ │
│ │  │  │       top: 45%                   │   │                          │ │
│ │  │  │                                  │   │                          │ │
│ │  │  │            ●2 ────────────────────────▶ PinMarker #2          │ │
│ │  │  │                 left: 67%        │   │    onClick → select(2)  │ │
│ │  │  │                 top: 28%         │   │                          │ │
│ │  │  │                                  │   │                          │ │
│ │  │  │    ●3 ────────────────────────────────▶ PinMarker #3          │ │
│ │  │  │         left: 23%                │   │    onClick → select(3)  │ │
│ │  │  │         top: 72%                 │   │                          │ │
│ │  │  │                                  │   │                          │ │
│ │  │  └─────────────────────────────────┘   │                           │ │
│ │  │                                         │                           │ │
│ │  └────────────────────────────────────────┘                           │ │
│ │                                                                        │ │
│ │  ┌────────────────────────────────────────┐                           │ │
│ │  │ ConnectorLayer.tsx (SVG)               │  ← position: absolute    │ │
│ │  │                                         │     pointer-events: none │ │
│ │  │  <svg viewBox="0 0 100 100">           │                           │ │
│ │  │    <path                               │                           │ │
│ │  │      d="M 32,45 Q 50,45 68,45"         │  ← 핀1 → 카드1 연결      │ │
│ │  │      stroke={selected ? 'primary' :    │                           │ │
│ │  │              'gray'}                   │                           │ │
│ │  │      strokeDasharray={selected ?       │                           │ │
│ │  │                       "none" : "4,4"} │                           │ │
│ │  │    />                                  │                           │ │
│ │  │    ...                                 │                           │ │
│ │  │  </svg>                                │                           │ │
│ │  │                                         │                           │ │
│ │  └────────────────────────────────────────┘                           │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 컴포넌트 파일 위치:                                                        │
│ packages/web/lib/components/detail/                                        │
│ ├── InteractiveShowcase.tsx                                               │
│ ├── PinOverlay.tsx                                                        │
│ ├── PinMarker.tsx                                                         │
│ └── ConnectorLayer.tsx                                                    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### PinMarker 상태 및 스타일

```
┌────────────────────────────────────────────────────────────────────────────┐
│ PinMarker STATES                                                           │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ STATE: default                                                         │ │
│ │                                                                        │ │
│ │    ┌───┐                                                               │ │
│ │    │ 1 │   bg: white                                                   │ │
│ │    └───┘   border: 2px solid gray-400                                 │ │
│ │            size: 24px                                                  │ │
│ │            font: 12px bold                                             │ │
│ │            shadow: sm                                                  │ │
│ │            transform: scale(1)                                         │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ STATE: hover                                                           │ │
│ │                                                                        │ │
│ │    ┌───┐                                                               │ │
│ │    │ 1 │   bg: primary-100                                             │ │
│ │    └───┘   border: 2px solid primary                                  │ │
│ │            size: 24px → 28px (transition 150ms)                       │ │
│ │            shadow: md                                                  │ │
│ │            transform: scale(1.1)                                       │ │
│ │            cursor: pointer                                             │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ STATE: selected                                                        │ │
│ │                                                                        │ │
│ │    ╭───╮                                                               │ │
│ │    │ 1 │   bg: primary                                                 │ │
│ │    ╰───╯   border: 2px solid primary-dark                             │ │
│ │      │     color: white                                                │ │
│ │      │     size: 32px                                                  │ │
│ │      │     shadow: lg + glow effect                                    │ │
│ │      │     transform: scale(1.2)                                       │ │
│ │      │                                                                 │ │
│ │      │     ring: 0 0 0 4px primary/30 (GSAP 애니메이션)               │ │
│ │      │                                                                 │ │
│ │      └─── 선택 시 카드로 스크롤                                        │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 좌표 변환:                                                                 │
│ item.center = { x: 0.32, y: 0.45 }  (정규화된 0-1 값)                     │
│      ↓                                                                     │
│ style = {                                                                  │
│   left: `${0.32 * 100}%`,  // 32%                                         │
│   top: `${0.45 * 100}%`,   // 45%                                         │
│   transform: 'translate(-50%, -50%)'  // 중앙 정렬                        │
│ }                                                                          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 핀-카드 인터랙션 이벤트 흐름

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    PIN-CARD INTERACTION EVENT FLOW                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [FLOW A: 핀 클릭 → 카드 하이라이트]                                     │
│                                                                          │
│  PinMarker #2 onClick                                                    │
│       │                                                                  │
│       ▼                                                                  │
│  InteractiveShowcase.tsx                                                 │
│       │                                                                  │
│       ├─── setSelectedPinId(item2.id) ──────────────────────┐            │
│       │                                                      │            │
│       │    상태 변경으로 인한 리렌더링:                        │            │
│       │                                                      │            │
│       ├─── PinMarker #2: isSelected={true}                   │            │
│       │         └─── selected 스타일 적용                     │            │
│       │                                                      │            │
│       ├─── ConnectorLayer: 연결선 #2 활성화                  │            │
│       │         └─── stroke: primary, dasharray: none        │            │
│       │                                                      │            │
│       └─── ItemList: item #2 하이라이트                       │            │
│             │                                                │            │
│             ▼                                                │            │
│       ItemDetailCard #2                                      │            │
│             │                                                │            │
│             ├─── ref.scrollIntoView({ behavior: 'smooth' })  │            │
│             │                                                │            │
│             └─── className: ring-2 ring-primary              │            │
│                                                              │            │
│                                                                          │
│  [FLOW B: 카드 클릭 → 핀 하이라이트]                                     │
│                                                                          │
│  ItemDetailCard #3 onClick                                               │
│       │                                                                  │
│       ▼                                                                  │
│  InteractiveShowcase.tsx                                                 │
│       │                                                                  │
│       ├─── setSelectedPinId(item3.id) ──────────────────────┐            │
│       │                                                      │            │
│       │    상태 변경:                                         │            │
│       │                                                      │            │
│       ├─── PinMarker #3: isSelected={true}                   │            │
│       │         │                                            │            │
│       │         └─── GSAP 펄스 애니메이션                     │            │
│       │              gsap.to(pin, {                          │            │
│       │                scale: 1.3,                           │            │
│       │                boxShadow: '0 0 0 8px primary/30',    │            │
│       │                repeat: 2,                            │            │
│       │                yoyo: true,                           │            │
│       │                duration: 0.3                         │            │
│       │              })                                      │            │
│       │                                                      │            │
│       └─── ConnectorLayer: 연결선 #3 활성화                  │            │
│                                                              │            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### V-03 Dual Match - 컴포넌트 매핑

#### Dual Match 레이아웃 상세

```
┌────────────────────────────────────────────────────────────────────────────┐
│ DUAL MATCH COMPONENT STRUCTURE                                              │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ DualMatchSection.tsx                                                   │ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ 👗 Item #1: Jacket                                      [Pin #1]  ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ THE ORIGINAL                                                   │││ │
│ │ │ │ ┌────────────────────────────────────────────────────────────┐│││ │
│ │ │ │ │ OriginalItemCard.tsx                                       ││││ │
│ │ │ │ │                                                            ││││ │
│ │ │ │ │ ┌──────────┐  Celine Triomphe Jacket                      ││││ │
│ │ │ │ │ │          │  브랜드: CELINE                               ││││ │
│ │ │ │ │ │  [Img]   │  가격: $2,850                                ││││ │
│ │ │ │ │ │          │                                               ││││ │
│ │ │ │ │ └──────────┘  ┌─────────────────────────────────────────┐ ││││ │
│ │ │ │ │               │ VotingSection.tsx                       │ ││││ │
│ │ │ │ │               │ [👍 Accurate (47)] [👎 Inaccurate (3)] │ ││││ │
│ │ │ │ │               └─────────────────────────────────────────┘ ││││ │
│ │ │ │ │                                                            ││││ │
│ │ │ │ │               ┌─────────────────┐                         ││││ │
│ │ │ │ │               │ BuyButton.tsx   │                         ││││ │
│ │ │ │ │               │ [Buy Original →]│ → affiliateLink()       ││││ │
│ │ │ │ │               └─────────────────┘                         ││││ │
│ │ │ │ └────────────────────────────────────────────────────────────┘│││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ THE VIBE                                        [+ Add Vibe]  │││ │
│ │ │ │                                                                │││ │
│ │ │ │ ┌────────────────────────────────────────────────────────────┐│││ │
│ │ │ │ │ VibeItemCard.tsx (sorted by voteScore DESC)                ││││ │
│ │ │ │ │                                                            ││││ │
│ │ │ │ │ ┌──────────┐  Zara Structured Blazer                      ││││ │
│ │ │ │ │ │          │  가격: $129                                   ││││ │
│ │ │ │ │ │  [Img]   │  ────────────────────────                    ││││ │
│ │ │ │ │ │          │  💰 Save: $2,721 (95%)                       ││││ │
│ │ │ │ │ └──────────┘                                               ││││ │
│ │ │ │ │               [▲ 12]  [▼ 2]   ← VibeVoting.tsx            ││││ │
│ │ │ │ │               [Buy Vibe →]                                 ││││ │
│ │ │ │ └────────────────────────────────────────────────────────────┘│││ │
│ │ │ │                                                                │││ │
│ │ │ │ ┌────────────────────────────────────────────────────────────┐│││ │
│ │ │ │ │ VibeItemCard.tsx                                           ││││ │
│ │ │ │ │ H&M Premium Jacket - $89                                   ││││ │
│ │ │ │ │ [▲ 8]  [▼ 1]                                              ││││ │
│ │ │ │ └────────────────────────────────────────────────────────────┘│││ │
│ │ │ │                                                                │││ │
│ │ │ │ [Show 2 more vibes ▼]                                         │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 데이터 흐름:                                                               │
│ useNormalizedItems(imageId) → items[]                                     │
│       ↓                                                                    │
│ groupItemsByOriginal(items) → ItemGroup[]                                 │
│       ↓                                                                    │
│ {                                                                          │
│   original: Item,                                                          │
│   vibes: Item[] (sorted by voteScore)                                     │
│ }                                                                          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### V-05 Purchase Link - 컴포넌트 매핑

#### 구매 버튼 이벤트 흐름

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    PURCHASE LINK EVENT FLOW                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  BuyButton.tsx onClick                                                   │
│       │                                                                  │
│       ▼                                                                  │
│  [1. 로딩 상태 표시]                                                     │
│       │                                                                  │
│       ├─── setIsLoading(true)                                           │
│       │    └─── 버튼: "Opening..." + Spinner                            │
│       │                                                                  │
│       ▼                                                                  │
│  [2. Affiliate 링크 생성]                                                │
│       │                                                                  │
│       ├─── generateAffiliateLink(item, userId)                          │
│       │         │                                                       │
│       │         ▼                                                       │
│       │    baseUrl = item.purchaseUrl                                   │
│       │         │                                                       │
│       │         ▼                                                       │
│       │    trackingParams = {                                           │
│       │      utm_source: 'decoded',                                     │
│       │      utm_medium: 'affiliate',                                   │
│       │      utm_campaign: 'item_click',                                │
│       │      item_id: item.id,                                          │
│       │      user_id: userId,                                           │
│       │      timestamp: Date.now()                                      │
│       │    }                                                            │
│       │                                                                 │
│       ▼                                                                  │
│  [3. 클릭 이벤트 로깅]                                                   │
│       │                                                                  │
│       ├─── POST /api/track/click                                        │
│       │         │                                                       │
│       │         ▼                                                       │
│       │    {                                                            │
│       │      item_id: item.id,                                          │
│       │      user_id: userId,                                           │
│       │      original_url: baseUrl,                                     │
│       │      affiliate_url: generatedUrl,                               │
│       │      clicked_at: new Date()                                     │
│       │    }                                                            │
│       │         │                                                       │
│       │         ▼                                                       │
│       │    INSERT INTO click_event                                      │
│       │                                                                 │
│       ▼                                                                  │
│  [4. 새 탭에서 열기]                                                     │
│       │                                                                  │
│       ├─── window.open(affiliateUrl, '_blank', 'noopener')              │
│       │                                                                 │
│       ▼                                                                  │
│  [5. 로딩 상태 해제]                                                     │
│       │                                                                  │
│       └─── setIsLoading(false)                                          │
│                                                                          │
│                                                                          │
│  에러 처리:                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ try/catch                                                        │    │
│  │   ├─── 링크 생성 실패 → fallback to original URL                │    │
│  │   ├─── 로깅 실패 → 무시하고 진행 (fire-and-forget)              │    │
│  │   └─── 팝업 차단 → Toast: "Please allow popups"                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### V-06 Voting & Comments - 컴포넌트 매핑

#### 투표 시스템 상세

```
┌────────────────────────────────────────────────────────────────────────────┐
│ VOTING SYSTEM COMPONENT                                                    │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ VotingSection.tsx                                                      │ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ Is this identification accurate?                                   ││ │
│ │ │                                                                    ││ │
│ │ │ ┌─────────────────────────┐  ┌─────────────────────────┐          ││ │
│ │ │ │ VoteButton.tsx          │  │ VoteButton.tsx          │          ││ │
│ │ │ │                         │  │                         │          ││ │
│ │ │ │ [👍 Accurate (47)]     │  │ [👎 Inaccurate (3)]    │          ││ │
│ │ │ │                         │  │                         │          ││ │
│ │ │ │ type="accurate"         │  │ type="inaccurate"       │          ││ │
│ │ │ │ isActive={userVote ===  │  │ isActive={userVote ===  │          ││ │
│ │ │ │          'accurate'}    │  │          'inaccurate'}  │          ││ │
│ │ │ │ count={accurateCount}   │  │ count={inaccurateCount} │          ││ │
│ │ │ │                         │  │                         │          ││ │
│ │ │ └─────────────────────────┘  └─────────────────────────┘          ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ AccuracyBar.tsx                                                │││ │
│ │ │ │ ████████████████████░░ 94% accuracy                           │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 상태 관리:                                                                 │
│ useVote(itemId) → {                                                       │
│   userVote: 'accurate' | 'inaccurate' | null,                             │
│   accurateCount: number,                                                   │
│   inaccurateCount: number,                                                 │
│   vote: (type) => void,                                                    │
│   removeVote: () => void,                                                  │
│   isLoading: boolean                                                       │
│ }                                                                          │
│                                                                            │
│ Optimistic Update:                                                         │
│ 1. 버튼 클릭 즉시 UI 업데이트 (optimistic)                                │
│ 2. API 호출 (POST /api/items/:id/vote)                                    │
│ 3. 성공 → 유지, 실패 → 롤백                                               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 댓글 시스템 상세

```
┌────────────────────────────────────────────────────────────────────────────┐
│ COMMENT SYSTEM COMPONENTS                                                  │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ CommentSection.tsx                                                     │ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ 💬 Comments (12)                                          [Sort ▼]││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ CommentList.tsx                                                    ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ CommentItem.tsx (depth: 0)                                     │││ │
│ │ │ │                                                                │││ │
│ │ │ │ ┌──────┐  user123 • 2 hours ago                               │││ │
│ │ │ │ │Avatar│  I think this is actually from the 2023 collection   │││ │
│ │ │ │ └──────┘                                                       │││ │
│ │ │ │           [Reply] [Report]                                     │││ │
│ │ │ │                                                                │││ │
│ │ │ │  ┌──────────────────────────────────────────────────────────┐ │││ │
│ │ │ │  │ CommentItem.tsx (depth: 1, reply)                        │ │││ │
│ │ │ │  │                                                          │ │││ │
│ │ │ │  │ ↳ ┌──────┐  op_user • 1 hour ago                        │ │││ │
│ │ │ │  │   │Avatar│  Thanks for the correction! Updated.         │ │││ │
│ │ │ │  │   └──────┘                                               │ │││ │
│ │ │ │  │             [Reply] [Report]                             │ │││ │
│ │ │ │  │                                                          │ │││ │
│ │ │ │  └──────────────────────────────────────────────────────────┘ │││ │
│ │ │ │                                                                │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ CommentItem.tsx (depth: 0)                                     │││ │
│ │ │ │                                                                │││ │
│ │ │ │ ┌──────┐  fashionista • 5 hours ago                           │││ │
│ │ │ │ │Avatar│  Great find!                                         │││ │
│ │ │ │ └──────┘                                                       │││ │
│ │ │ │           [Reply] [Report]                                     │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │                                                                    ││ │
│ │ │ [Load more comments...]                                           ││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ │                                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐│ │
│ │ │ CommentForm.tsx                                                    ││ │
│ │ │                                                                    ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ [Add a comment...]                                   [Post]   │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ │                                                                    ││ │
│ │ │ 로그인 필요 시:                                                   ││ │
│ │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│ │ │ │ [Login to comment]                                             │││ │
│ │ │ └────────────────────────────────────────────────────────────────┘││ │
│ │ └────────────────────────────────────────────────────────────────────┘│ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ 상태 관리:                                                                 │
│ useComments(targetId, targetType) → {                                     │
│   comments: Comment[],                                                     │
│   isLoading: boolean,                                                      │
│   hasNextPage: boolean,                                                    │
│   fetchNextPage: () => void,                                               │
│   addComment: (content, parentId?) => void,                                │
│   editComment: (id, content) => void,                                      │
│   deleteComment: (id) => void,                                             │
│   reportComment: (id, reason) => void                                      │
│ }                                                                          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 에지 케이스 및 에러 처리

### V-01 Detail View

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 이미지 로드 실패 | placeholder + 재시도 버튼 | ImageDetailContent.tsx |
| 아이템 0개 | "No items detected" 메시지 | ItemSection.tsx |
| 모달 외부 클릭 | 모달 닫기 (router.back()) | ImageDetailModal.tsx |
| 브라우저 뒤로가기 | FLIP 역방향 애니메이션 | transitionStore |
| 데이터 로딩 중 | Skeleton UI | ImageDetailSkeleton.tsx |

### V-02 Pin System

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 좌표 없는 아이템 | 기본 위치 (0.5, 0.5) | PinOverlay.tsx |
| 핀 10개 초과 | 화면에 최대 10개만 표시, 나머지는 리스트에만 | PinOverlay.tsx |
| 이미지 크기 변경 | ResizeObserver로 재계산 | InteractiveShowcase.tsx |
| 핀 겹침 | z-index 조정 (선택된 핀 최상위) | PinMarker.tsx |

### V-05 Purchase Link

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| URL 없음 | "View Item" 버튼 비활성화 | BuyButton.tsx |
| 팝업 차단됨 | Toast 알림 + fallback 링크 | BuyButton.tsx |
| 트래킹 실패 | fire-and-forget (무시) | useTrackClick.ts |
| 네트워크 오류 | 원본 URL로 fallback | affiliateLink.ts |

### V-06 Voting & Comments

| 상황 | 처리 방법 | 구현 위치 |
|------|----------|----------|
| 비로그인 투표 | 로그인 모달 표시 | VoteButton.tsx |
| 투표 중복 | 기존 투표 변경 (토글) | useVote.ts |
| 댓글 빈 내용 | 제출 버튼 비활성화 | CommentForm.tsx |
| 댓글 삭제 후 | "[삭제된 댓글]" 표시 | CommentItem.tsx |
| 신고된 댓글 | 관리자 검토 후 숨김 처리 | CommentItem.tsx |

---

## 구현 상태 체크리스트

### V-01 Responsive Detail View
- [x] 모달 라우팅 (intercepting route)
- [x] 풀페이지 라우팅
- [x] 공유 컨텐츠 컴포넌트
- [x] GSAP FLIP 전환 애니메이션
- [ ] 키보드 네비게이션 (←/→)
- [ ] 모바일 스와이프 제스처
- [ ] 인접 이미지 프리로드

### V-02 Pin Interaction
- [x] 기본 핀 렌더링
- [x] 좌표 기반 위치 지정
- [x] 연결선 (ConnectorLayer)
- [ ] 핀 클릭 → 카드 스크롤
- [ ] 카드 클릭 → 핀 하이라이트
- [ ] 호버 애니메이션
- [ ] 모바일 터치 지원

### V-03 Dual Match List
- [ ] Original/Vibe 그룹핑
- [ ] OriginalItemCard 컴포넌트
- [ ] VibeItemCard 컴포넌트
- [ ] Vibe 추가 기능
- [ ] Vibe 투표 시스템
- [ ] 가격 비교 표시

### V-04 Smart Tags
- [ ] SmartTags 컴포넌트
- [ ] Media 태그 연결
- [ ] Cast 태그 연결
- [ ] Context 태그 연결

### V-05 Purchase Link
- [ ] BuyButton 컴포넌트
- [ ] Affiliate 링크 생성
- [ ] 클릭 트래킹 API
- [ ] 에러 핸들링

### V-06 Voting & Comments
- [ ] VotingSection 컴포넌트
- [ ] VoteButton 컴포넌트
- [ ] CommentSection 컴포넌트
- [ ] CommentItem 컴포넌트
- [ ] CommentForm 컴포넌트
- [ ] 투표 API
- [ ] 댓글 API
- [ ] 신고 기능
