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
