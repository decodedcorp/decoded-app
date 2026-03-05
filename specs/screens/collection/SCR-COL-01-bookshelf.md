# [SCR-COL-01] My Collection Bookshelf
> Route: `/collection` | Status: proposed | Updated: 2026-03-05
> Milestone: M7 (AI Magazine & Archive Expansion)
> Flow: FLW-06 (Magazine Rendering Flow — save destination from SCR-MAG-02)

## Purpose

User browses their archived personal magazine issues in a 3D bookshelf interface. Each issue is a collectible volume with cover art, creating a "digital library" that rewards continued engagement and triggers re-reading.

## Design Direction

- **3D Bookshelf:** GSAP `perspective` + `rotateY` renders issues as spines on a shelf. Hover/tap pulls an issue forward on Z-axis with cover half-reveal.
- **Volume Numbering:** Issues displayed as Vol.01, Vol.02... — evoking periodical collecting behavior.
- **Ownership Feel:** Dark wood/matte shelf texture background. Accent lighting (#eafd67) on active issue. Subtle dust particle ambient effect.
- **Theme:** Deep Black (#050505) / Neon Chartreuse (#eafd67) — consistent with magazine screens.

## Component Map

| Region | Component | File | Props/Notes |
|--------|-----------|------|-------------|
| Page | CollectionPage (server) | `packages/web/app/collection/page.tsx` | async; auth-gated, fetches issue list |
| Client wrapper | CollectionClient | `packages/web/lib/components/collection/CollectionClient.tsx` | "use client"; 3D bookshelf orchestration |
| Bookshelf | BookshelfView | `packages/web/lib/components/collection/BookshelfView.tsx` | GSAP perspective container, shelf rows |
| Shelf row | ShelfRow | `packages/web/lib/components/collection/ShelfRow.tsx` | Single shelf with 4-6 issue spines |
| Issue spine | IssueSpine | `packages/web/lib/components/collection/IssueSpine.tsx` | 3D rotated spine, hover pop-out, cover peek |
| Issue preview | IssuePreviewCard | `packages/web/lib/components/collection/IssuePreviewCard.tsx` | Expanded cover with metadata overlay |
| Filter bar | CollectionFilterBar | `packages/web/lib/components/collection/CollectionFilterBar.tsx` | Date range, mood/theme filter |
| Empty state | EmptyBookshelf | `packages/web/lib/components/collection/EmptyBookshelf.tsx` | Empty shelf with "Generate your first issue" CTA |
| Share sheet | CollectionShareSheet | `packages/web/lib/components/collection/CollectionShareSheet.tsx` | DS BottomSheet; share/export options |
| Bottom nav | NavBar | DS: component-registry | mobile-only; active="profile" or "magazine" |

> All file paths are proposed (components not yet created). Verify against filesystem before implementation.

## Layout

### Mobile (default)

**Bookshelf view (issues exist)**
```
+-------------------------------+
| [< Back]  My Collection  [?] |  <- Minimal header with issue count
+-------------------------------+
| [All] [By Date] [By Mood]    |  <- CollectionFilterBar
+-------------------------------+
|                               |
| ===== SHELF ROW 1 =====      |  <- ShelfRow with wood/matte texture
| [Vol.05][Vol.04][Vol.03]      |     IssueSpine: 3D perspective spines
|  ______ ______ ______         |     rotateY(-15deg), visible spine label
| ========================      |     shelf edge with shadow
|                               |
| ===== SHELF ROW 2 =====      |
| [Vol.02][Vol.01]              |     Older issues, same 3D treatment
|  ______ ______                |
| ========================      |
|                               |
+-------------------------------+
| [NavBar]                      |
+-------------------------------+
```

**Issue pop-out (tap/hover on spine)**
```
+-------------------------------+
|                               |
| ===== SHELF ROW =====        |
|        [Vol.03]               |  <- Selected spine pops forward
|        /       \              |     translateZ(60px), rotateY(-5deg)
|       | COVER   |             |     Cover image half-revealed
|       | ART     |             |
|       | Vol.03  |             |
|       | 2026.03 |             |
|        \_______/              |
|                               |
| [Open] [Share] [Delete]       |  <- Action buttons below pop-out
|                               |
+-------------------------------+
```

**Empty state**
```
+-------------------------------+
| [< Back]  My Collection       |
+-------------------------------+
|                               |
|    ===== EMPTY SHELF =====    |  <- EmptyBookshelf
|    |                     |    |     Empty wood shelf with subtle shadow
|    |   (bookshelf icon)  |    |
|    |                     |    |
|    =======================    |
|                               |
|  "Your bookshelf is empty"    |
|  Start collecting your        |
|  personal editions            |
|                               |
|  [Generate First Issue]       |  <- Routes to SCR-MAG-02
|                               |
+-------------------------------+
```

### Desktop (>=768px)

Bookshelf expands to wider shelves (5-6 spines per row). Hover reveals cover without tap. DesktopHeader visible; NavBar hidden. Content centered max-w-[1400px].

| Element | Mobile | Desktop |
|---------|--------|---------|
| Header | Minimal back bar | DesktopHeader |
| Spines per row | 3-4 | 5-6 |
| Pop-out trigger | Tap | Mouse hover (200ms delay) |
| Cover reveal | Half cover on tap | Full cover peek on hover |
| Share sheet | DS BottomSheet | Dropdown menu |
| Bottom nav | NavBar | Hidden |
| Perspective depth | 800px | 1200px |

## Requirements

### Data Loading

- When the page mounts, the system shall check `authStore.selectIsLoggedIn`. If not logged in, redirect to `/login` with return URL.
- When authenticated, the system shall fetch `GET /api/v1/magazine/collection` to retrieve the user's saved issues list.
- While fetching, the system shall display shelf skeleton placeholders (empty shelf rows with pulsing spine outlines).
- When fetch succeeds with issues, the system shall render `BookshelfView` with issues sorted by `issue_number` descending (newest first, top shelf).
- When fetch succeeds with empty array, the system shall render `EmptyBookshelf` with "Generate First Issue" CTA.
- When fetch fails, the system shall display error state with retry button.

### 3D Bookshelf Rendering

- When issues are loaded, the system shall create a GSAP context with `perspective: 800px` (mobile) or `1200px` (desktop) on the bookshelf container.
- When rendering spines, the system shall apply `rotateY(-15deg)` and `translateZ(0)` as default pose, with `theme_palette.primary` as spine background color.
- When rendering shelf rows, the system shall distribute 3-4 spines per row (mobile) or 5-6 (desktop), wrapping overflow to next shelf.
- When the bookshelf first renders, the system shall animate spines appearing with staggered fade-in (0.1s interval per spine, bottom shelf first).

### Issue Pop-out Interaction

- When the user taps (mobile) or hovers for 200ms (desktop) on an `IssueSpine`, the system shall animate: `translateZ(60px)`, `rotateY(-5deg)`, duration 0.4s, ease "back.out(1.7)".
- When an issue is popped out, the system shall reveal `IssuePreviewCard` showing: cover image, volume number, generation date, theme keywords.
- When the user taps away or hovers off, the system shall reverse the pop-out animation to default spine pose.
- When only one issue can be popped out at a time: selecting a new spine shall retract the previous one first.

### Issue Actions

- When an issue is popped out, the system shall display action buttons: "Open", "Share", "Delete".
- When the user taps "Open", the system shall navigate to the rendered magazine view (reuse `MagazineRenderer` with stored `layout_json`).
- When the user taps "Share", the system shall open `CollectionShareSheet` with options: Copy Link, Instagram Story (image export), Web Share API.
- When the user long-presses (mobile) a spine, the system shall open the share sheet directly (shortcut).
- When the user taps "Delete", the system shall show a confirmation dialog, then call `DELETE /api/v1/magazine/collection/[issueId]` and remove the spine with a GSAP fall-off animation.

### Filtering

- When the user selects "By Date", the system shall group issues by month with month divider labels between shelf rows.
- When the user selects "By Mood", the system shall group issues by `theme_palette` similarity (clustering by dominant color).
- When the user selects "All", the system shall return to default volume-number ordering.

### ScrollTrigger Shelf Animation

- When the user scrolls down to reveal lower shelves, the system shall animate each shelf row entry with GSAP ScrollTrigger (translateY 30->0, opacity 0->1, 0.5s).
- When scrolling back up, shelves remain visible (once: true).

## State

| Store | Usage |
|-------|-------|
| collectionStore (proposed) | `issues: MagazineIssue[]`, `isLoading`, `activeIssueId`, `filterMode` |
| authStore | `selectIsLoggedIn` for auth gate |
| magazineStore | Read `personalIssue` for "just generated" badge indicator |

> `collectionStore` is lightweight — may be merged into `magazineStore` if scope stays small.

## Navigation

| Trigger | Destination | Data Passed |
|---------|-------------|-------------|
| "Open" action | `/magazine/issue/[id]` (rendered view) | issueId, layout_json from cache |
| "Generate First Issue" CTA | `/magazine/personal` (SCR-MAG-02) | - |
| Back button | Previous screen | - |
| Share -> Instagram | External (Instagram app) | Exported cover image |

## Error & Empty States

| State | Condition | UI |
|-------|-----------|-----|
| Loading | Initial fetch | Shelf skeleton (empty rows with pulsing outlines) |
| Empty | No saved issues | EmptyBookshelf with CTA to SCR-MAG-02 |
| Error | API failure | Error card with retry button |
| Delete confirm | User taps delete | Confirmation dialog with issue cover preview |
| Delete animation | Confirmed | Spine falls off shelf (rotateX 90deg, opacity 0, 0.6s) |

## Animations

| Trigger | Type | Library | Details |
|---------|------|---------|---------|
| Page mount | Staggered spine entry | GSAP | opacity 0->1, 0.1s stagger, bottom shelf first |
| Spine hover/tap | Pop-out | GSAP | translateZ 0->60px, rotateY -15->-5deg, 0.4s, back.out(1.7) |
| Spine deselect | Retract | GSAP | Reverse pop-out, 0.3s |
| Scroll to shelf | Shelf reveal | GSAP ScrollTrigger | translateY 30->0, opacity 0->1, 0.5s, once |
| Delete | Fall off shelf | GSAP | rotateX 0->90deg, opacity 1->0, 0.6s, ease "power2.in" |
| Page exit | Context revert | GSAP | gsapContext.revert() on unmount |

---

See: [SCR-MAG-01](../magazine/SCR-MAG-01-daily-editorial.md) -- Daily editorial (discovery entry)
See: [SCR-MAG-02](../magazine/SCR-MAG-02-personal-issue.md) -- Personal issue generation (collection source)
See: [FLW-06](../../flows/FLW-06-magazine-rendering.md) -- Magazine rendering flow
