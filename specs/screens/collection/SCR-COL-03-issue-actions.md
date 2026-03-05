# [SCR-COL-03] Issue Detail Panel and Action Workflows
> Route: overlay within `/collection` | Status: redesign | Updated: 2026-03-05
> Milestone: M7 (AI Magazine & Archive Expansion) — Phase m7-03
> Parent: SCR-COL-01 — page structure, 3D scene setup

## Purpose

Defines the 2D HTML overlay panel shown when a magazine book is focused in the 3D studio, and the full workflows for Open, Share, and Remove issue actions. Also covers the empty studio state and loading experience.

See: SCR-COL-01 — scene setup, room environment, user journey
See: SCR-COL-02 — 3D camera zoom-in and cover flip mechanics

## Component Map

| Region | Component | File | Props/Notes |
|--------|-----------|------|-------------|
| Detail panel | IssueDetailPanel | `lib/components/collection/IssueDetailPanel.tsx` | HTML overlay; visible when camera is focused |
| Share sheet | CollectionShareSheet | `lib/components/collection/CollectionShareSheet.tsx` | DS BottomSheet; share and export options |
| Empty studio | EmptyStudio | `lib/components/collection/EmptyStudio.tsx` | Empty 3D room with holographic CTA |
| Loading | StudioLoader | `lib/components/collection/studio/StudioLoader.tsx` | Suspense fallback with neon progress animation |
| Remove dialog | Inline in IssueDetailPanel | — | Confirmation with 3D book preview still visible |

## Layout

### IssueDetailPanel (focused state, HTML overlay)

```
+--------------------------------------------------+
|                                                    |
|                 (3D book with open cover           |
|                  visible behind panel)             |
|                                                    |
|  +----------------------------------------------+ |
|  |                                                | |
|  |  Vol.03 — The Denim Issue                      | |
|  |  February 7, 2026                              | |
|  |                                                | |
|  |  #Denim  #Workwear  #Indigo                    | |
|  |                                                | |
|  |  [Open Magazine]  [Share]  [Remove]            | |
|  |                                                | |
|  +----------------------------------------------+ |
+--------------------------------------------------+
```

- Panel positioned at bottom of viewport (mobile) or bottom-right (desktop)
- Semi-transparent dark backdrop (bg-black/60 backdrop-blur-md)
- Entry animation: slide up from bottom, 0.3s
- #eafd67 accent on volume label and primary action button

### IssueDetailPanel (desktop, right-aligned)

```
+--------------------------------------------------+
|                                            +-----+|
|     (3D book open)                         |Vol. ||
|                                            |03   ||
|                                            |     ||
|                                            |Denim||
|                                            |Issue||
|                                            |     ||
|                                            |2026 ||
|                                            |02.07||
|                                            |     ||
|                                            |tags ||
|                                            |     ||
|                                            |[Opn]||
|                                            |[Shr]||
|                                            |[Rmv]||
|                                            +-----+|
+--------------------------------------------------+
```

### EmptyStudio

```
+--------------------------------------------------+
|  [<]                The Decoded Studio         [0]|
|                                                    |
|                                                    |
|                  ╔══════════════╗                  |
|                 ║  HOLOGRAPHIC  ║                  |  <- Emissive wireframe
|                ║   MAGAZINE    ║                   |     book outline
|               ║   OUTLINE     ║                    |     pulsing #eafd67
|              ╚══════════════╝                      |
|                                                    |
|          "Your studio is waiting"                  |
|          "Generate your first issue"               |
|                                                    |
|              [Generate First Issue]                |  <- #eafd67 button
|                                                    |
|  ═══════════════════════════════════════════════   |
+--------------------------------------------------+
```

- Empty room still has neon lighting and reflective floor
- Wireframe book outline pulses with #eafd67 emissive glow
- CTA routes to SCR-MAG-02

### StudioLoader

```
+--------------------------------------------------+
|                                                    |
|                                                    |
|                                                    |
|              ████████████░░░░░░░░                  |  <- Neon #eafd67 progress bar
|                                                    |
|              Loading your studio...                |
|                                                    |
|                                                    |
+--------------------------------------------------+
```

- Dark void background, no room geometry yet
- Thin neon progress bar (actual Suspense progress or indeterminate)
- "Loading your studio..." text in mag-text/50

## Requirements

### IssueDetailPanel Content

- When camera enters focused state, the system shall render `IssueDetailPanel` with: volume label (`Vol.{issue_number}` in #eafd67), issue title (bold, large), generation date formatted as `MMMM D, YYYY`, and up to four theme keywords as pills.
- When the panel mounts, the system shall animate it sliding up from bottom (translateY 100% -> 0, opacity 0->1, 0.3s, power2.out).
- When the panel unmounts (deselect), the system shall animate it sliding down (reverse, 0.2s).

### Open Action

- When the user clicks "Open Magazine", the system shall trigger the exit camera animation, then navigate to `/magazine/issue/[issue.id]` using cached `layout_json`.
- When `layout_json` is not cached, the system shall show a loading state within the button while fetching.

### Share Action

- When the user clicks "Share", the system shall open `CollectionShareSheet` as a DS BottomSheet with options: "Copy Link", "Instagram Story", "More options".
- When "Copy Link" is selected, the system shall copy `https://decoded.kr/magazine/issue/[id]` to clipboard and show Sonner toast "Link copied".
- When "Instagram Story" is selected, the system shall generate a 9:16 canvas from the 3D book screenshot (via `renderer.domElement.toDataURL()`) with branding overlay, then trigger download. Toast: "Saved for Instagram Story".
- When "More options" is selected and browser supports Web Share API, the system shall call `navigator.share()`.
- When Web Share is not supported, the system shall hide "More options".

### Remove Action

- When the user clicks "Remove", the system shall show an inline confirmation within the panel: issue title, "This issue will be removed from your collection.", [Cancel] [Remove] buttons.
- When confirmed, the system shall:
  1. Call `DELETE /api/v1/magazine/collection/[issue.id]`
  2. If success: trigger the 3D dissolve animation (SCR-COL-02), hide panel, remove from store
  3. If failure: show Sonner toast "Could not remove. Please try again.", keep panel open
- When cancelled, the system shall return to the normal panel state.

### Empty Studio

- When no issues exist in collection, the system shall render the 3D room with neon lighting but no magazine objects.
- When empty, the system shall display a wireframe book outline (EdgesGeometry) with pulsing #eafd67 emissive material.
- When the user clicks "Generate First Issue", the system shall navigate to `/magazine/personal` (SCR-MAG-02).

### Studio Loader

- When 3D assets are loading (React Suspense boundary), the system shall show `StudioLoader` with a neon progress bar and "Loading your studio..." text.
- When loading completes, the system shall fade out the loader and begin the entry camera animation.

### WebGL Fallback

- When WebGL 2 is not available (checked via `document.createElement('canvas').getContext('webgl2')`), the system shall render `BookshelfViewFallback` — the previous CSS/GSAP bookshelf implementation preserved as a fallback component.
- When fallback is active, the system shall show a subtle banner: "3D studio requires a modern browser. Showing classic view."

## State

| Store | Field | Usage |
|-------|-------|-------|
| magazineStore | `collectionIssues` | Source data for 3D book instances |
| magazineStore | `activeIssueId` | Synced with focused book |
| studioStore (new) | `focusedIssueId` | Which book has camera focus |
| studioStore (new) | `cameraState` | Drives panel visibility |
| studioStore (new) | `isDetailPanelOpen` | Explicit panel visibility flag |

## Navigation

| Trigger | Destination | Data Passed |
|---------|-------------|-------------|
| "Open Magazine" | `/magazine/issue/[id]` | `issueId`, `layout_json` from cache |
| "Generate First Issue" | `/magazine/personal` (SCR-MAG-02) | — |
| Back button | Previous screen (with exit animation) | — |
| "Instagram Story" | Browser download (PNG) | 3D scene screenshot with branding |
| "Web Share" | OS share sheet | `{ title, url }` |

## Error & Empty States

| State | Condition | UI |
|-------|-----------|-----|
| Loading | Suspense boundary | StudioLoader with neon progress bar |
| Empty collection | No issues | EmptyStudio with holographic CTA |
| Cover texture fail | `cover_image_url` 404 | Solid color face with `theme_palette.accent` |
| Share clipboard blocked | Browser blocks write | Toast "Could not copy link" |
| Web Share unsupported | `!navigator.share` | "More options" hidden |
| Remove API failure | DELETE 4xx/5xx | Toast + panel stays open |
| WebGL unsupported | No WebGL2 context | CSS fallback bookshelf + banner |

## Animations

| Trigger | Type | Library | Details |
|---------|------|---------|---------|
| Focus arrive | Panel slide up | CSS/Motion | translateY 100%->0, 0.3s |
| Deselect | Panel slide down | CSS/Motion | translateY 0->100%, 0.2s |
| Remove confirmed | Book dissolve | R3F/GSAP (SCR-COL-02) | Float up + dissolve, 0.7s |
| Share sheet | Slide up | DS BottomSheet | Standard snap-point |
| Empty wireframe | Pulse glow | R3F useFrame | Emissive intensity oscillation |
| Loader | Progress bar | CSS | Indeterminate neon bar animation |

---

See: [SCR-COL-01](./SCR-COL-01-bookshelf.md) -- Scene setup, room environment, user journey
See: [SCR-COL-02](./SCR-COL-02-3d-interaction.md) -- R3F 3D interaction mechanics
See: [SCR-MAG-02](../magazine/SCR-MAG-02-personal-issue.md) -- Personal issue generation
