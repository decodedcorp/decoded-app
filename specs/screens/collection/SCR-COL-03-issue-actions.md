# [SCR-COL-03] Issue Preview Card and Action Workflows
> Route: overlay within `/collection` | Status: proposed | Updated: 2026-03-05
> Milestone: M7 (AI Magazine & Archive Expansion)
> Parent: SCR-COL-01 — page structure and data loading

## Purpose

Defines the content shown in `IssuePreviewCard` when a spine is popped out, and the full workflows for Open, Share, and Delete issue actions, plus the filter bar grouping behavior.

See: SCR-COL-01 — page layout, data loading, auth gate
See: SCR-COL-02 — 3D pop-out animation mechanics

## Component Map

| Region | Component | File | Props/Notes |
|--------|-----------|------|-------------|
| Preview card | IssuePreviewCard | `packages/web/lib/components/collection/IssuePreviewCard.tsx` | `issue: MagazineIssue`; visible when spine is active |
| Share sheet | CollectionShareSheet | `packages/web/lib/components/collection/CollectionShareSheet.tsx` | DS BottomSheet; share and export options |
| Filter bar | CollectionFilterBar | `packages/web/lib/components/collection/CollectionFilterBar.tsx` | `activeFilter`, `onFilterChange`; tabs: All / By Date / By Mood |
| Delete dialog | Inline or DS Dialog | within `IssuePreviewCard` | Confirmation with issue cover preview |

> All file paths are proposed. Verify against filesystem before implementation.

## Layout

### IssuePreviewCard (mobile, spine active)

```
+-------------------------------+
|  [Cover image thumbnail]      |  <- issue.cover_image_url, aspect 2:3
|  Vol.03  |  2026.03.01        |  <- volume number + generation date
|  #minimalist #neutral #denim  |  <- theme keywords (up to 3)
+-------------------------------+
|  [Open]  [Share]  [Delete]    |  <- action row below card
+-------------------------------+
```

### CollectionFilterBar

```
+-------------------------------+
| [All]  [By Date]  [By Mood]   |
+-------------------------------+

Active tab: underline accent (#eafd67), text color primary
Inactive tab: muted text
```

### CollectionShareSheet (DS BottomSheet)

```
+-------------------------------+
|  Share "Vol.03"               |
|-------------------------------|
|  [Copy Link]                  |
|  [Instagram Story]            |
|  [More options...]            |  <- Web Share API trigger
+-------------------------------+
```

### Delete Confirmation Dialog

```
+-------------------------------+
|  Delete Vol.03?               |
|  [Cover thumbnail]            |
|  "This issue will be removed  |
|  from your collection."       |
|  Credit impact: none          |
|-------------------------------|
|  [Cancel]     [Delete]        |
+-------------------------------+
```

## Requirements

### IssuePreviewCard Content

- When a spine is popped out, the system shall render `IssuePreviewCard` showing: cover image (`issue.cover_image_url`), volume label (`Vol.{issue_number}`), generation date formatted as `YYYY.MM.DD`, and up to three theme keywords from `issue.theme_keywords`.
- When the cover image fails to load, the system shall display a fallback block in `issue.theme_palette.primary` color.
- When the preview card appears, the system shall animate it with `opacity 0->1` over 0.2s (Motion) synchronized with the spine pop-out.

### Open Action

- When the user taps "Open", the system shall navigate to `/magazine/issue/[issue.id]` using the `MagazineRenderer` with `issue.layout_json` read from client cache.
- When `issue.layout_json` is not cached locally, the system shall show a brief loading indicator while fetching from `GET /api/v1/magazine/collection/[issueId]` before navigating.

### Share Action

- When the user taps "Share", the system shall open `CollectionShareSheet` as a DS BottomSheet with three options: "Copy Link", "Instagram Story", and "More options".
- When the user selects "Copy Link", the system shall write `https://decoded.kr/magazine/issue/[issue.id]` to the clipboard and display a Sonner toast "Link copied".
- When the user selects "Instagram Story", the system shall generate a 9:16 canvas from the issue cover image and `Vol.{issue_number}` text overlay, then trigger a browser download of the PNG and display a toast "Saved for Instagram Story".
- When the user selects "More options" and the browser supports the Web Share API (`navigator.share`), the system shall call `navigator.share({ title, url })` with the issue share URL.
- When the browser does not support the Web Share API, the system shall hide the "More options" row.
- When the user long-presses (pointerdown held >500ms) an `IssueSpine` on mobile, the system shall open `CollectionShareSheet` directly without requiring the spine to pop out first.

### Delete Action

- When the user taps "Delete", the system shall open a confirmation dialog showing the issue cover thumbnail, volume label, and the message "This issue will be removed from your collection."
- When credits were consumed to generate the issue, the system shall add "Credit impact: none — credits are not refunded on deletion" to the dialog body.
- When the user confirms deletion, the system shall call `DELETE /api/v1/magazine/collection/[issue.id]`.
- When the DELETE request succeeds, the system shall remove the issue from `collectionStore.issues` and trigger the SCR-COL-02 fall-off animation on the spine.
- When the DELETE request fails, the system shall close the dialog, restore the spine to its active state, and display a Sonner toast "Could not delete. Please try again."
- When the user taps "Cancel" in the dialog, the system shall close the dialog and leave the spine in its active (popped-out) state.

### Filter Bar — All

- When the user selects "All", the system shall display issues sorted by `issue_number` descending with no grouping headers between shelf rows.
- When `filterMode` is `'all'` on mount (default), the system shall render in this order without waiting for a user action.

### Filter Bar — By Date

- When the user selects "By Date", the system shall group issues by calendar month (derived from `issue.generated_at`) and insert a text label (e.g., "March 2026") as a shelf divider between groups.
- When a month has more issues than fit on one shelf row, the system shall wrap the overflow to a second row within that month group.

### Filter Bar — By Mood

- When the user selects "By Mood", the system shall cluster issues by `issue.theme_palette.primary` using hue proximity (hue delta < 30 degrees = same cluster) and display each cluster as a shelf group.
- When a cluster label is shown, the system shall derive a display name from the dominant hue range (e.g., "Warm tones", "Cool tones", "Neutral").
- When fewer than two mood clusters exist, the system shall fall back to "All" ordering and display a toast "Not enough variety to group by mood yet."

## State

| Store | Field | Usage |
|-------|-------|-------|
| collectionStore (proposed) | `issues: MagazineIssue[]` | Source for filter grouping and deletion removal |
| collectionStore (proposed) | `activeIssueId: string \| null` | Drives IssuePreviewCard visibility |
| collectionStore (proposed) | `filterMode: 'all' \| 'by-date' \| 'by-mood'` | Active filter tab; persisted for session |
| creditStore (proposed) | `selectBalance` | Read to determine credit impact messaging in delete dialog |

> `collectionStore` and `creditStore` are proposed. Files: `packages/web/lib/stores/collectionStore.ts`, `packages/web/lib/stores/creditStore.ts`.

## Navigation

| Trigger | Destination | Data Passed |
|---------|-------------|-------------|
| "Open" action | `/magazine/issue/[id]` | `issueId`, `layout_json` from cache |
| "Share" -> Instagram | Browser download (PNG) | Exported 9:16 cover canvas |
| "Share" -> Web Share | OS share sheet | `{ title: "Vol.N — Decoded", url }` |
| Delete confirmed | Stays on `/collection` | Spine removed; `collectionStore.issues` updated |

## Error & Empty States

| State | Condition | UI |
|-------|-----------|-----|
| Cover image load failure | `cover_image_url` 404 or network error | Solid block in `theme_palette.primary` |
| Share clipboard blocked | Browser blocks clipboard write | Sonner toast "Could not copy link" |
| Web Share not supported | `!navigator.share` | "More options" row hidden |
| Delete API failure | 4xx/5xx from DELETE endpoint | Toast "Could not delete. Please try again."; spine restored |
| layout_json not cached | Issue opened without cached data | Loading indicator then navigate after fetch |
| Too few mood clusters | Only one hue cluster | Fall back to "All" ordering + informational toast |

## Animations

| Trigger | Type | Library | Details |
|---------|------|---------|---------|
| Spine active | Preview card appear | Motion | `opacity 0->1`, 0.2s |
| Spine retract / tap away | Preview card disappear | Motion | `opacity 1->0`, 0.15s |
| Share sheet open | Slide up | DS BottomSheet default | standard snap-point animation |
| Delete confirmed | Spine fall-off | GSAP (see SCR-COL-02) | handed off to 3D layer |
| Filter tab change | Re-group layout | Motion | `opacity 0->1` on row container, 0.3s |

---

See: [SCR-COL-01](./SCR-COL-01-bookshelf.md) -- Page structure, data loading, auth gate
See: [SCR-COL-02](./SCR-COL-02-3d-interaction.md) -- 3D spine animation mechanics
See: [SCR-MAG-02](../magazine/SCR-MAG-02-personal-issue.md) -- Personal issue generation (collection source)
