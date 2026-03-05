# [SCR-COL-02] R3F 3D Interaction Layer
> Route: overlay within `/collection` | Status: redesign | Updated: 2026-03-05
> Milestone: M7 (AI Magazine & Archive Expansion) — Phase m7-03
> Parent: SCR-COL-01 — page structure, 3D scene setup

## Purpose

Defines the React Three Fiber interaction mechanics for the Decoded Studio: camera rig behavior, magazine object interactions (hover glow, click-to-focus, cover flip), mouse parallax, and performance adaptation.

See: SCR-COL-01 — scene setup, room environment, data loading
See: SCR-COL-03 — issue detail panel and action workflows

## Component Map

| Region | Component | File | Props/Notes |
|--------|-----------|------|-------------|
| Camera rig | CameraRig | `lib/components/collection/studio/CameraRig.tsx` | `useFrame` for parallax; GSAP for entry/focus/exit |
| Magazine object | MagazineBook | `lib/components/collection/studio/MagazineBook.tsx` | Hover glow, click handler, cover flip animation |
| Magazine layout | MagazineRack | `lib/components/collection/studio/MagazineRack.tsx` | Arc/grid positioning algorithm for N issues |
| Postprocessing | StudioEffects | `lib/components/collection/studio/StudioEffects.tsx` | Bloom, vignette, optional chromatic aberration |
| Raycaster | Built-in R3F | — | `onPointerOver`, `onPointerOut`, `onClick` on meshes |

## Camera States & Transitions

### State Machine

```
[entry] ---(animation complete)---> [browse] ---(click book)---> [focused]
                                       ^                              |
                                       |-----(click away / ESC)-------|
[any] ---(back button)---> [exit] ---> navigate away
```

### Entry Camera Path

```
Camera starts at: (0, 1.5, -8)  — behind corridor
Camera ends at:   (0, 3.0,  6)  — elevated isometric view
LookAt target:    (0, 0.5,  0)  — center of room, slightly below eye

Timeline:
  0.0s — Black screen, camera at start
  0.5s — Corridor ambient light fades in
  1.0s — Camera begins dolly forward
  1.8s — Neon lights flicker on (3 quick on/off then steady)
  2.0s — Camera reaches final browse position
  2.5s — Magazine float-in stagger begins
```

### Browse Camera (Parallax)

```
useFrame callback:
  target.x = mouse.x * parallaxIntensity  (0.3 default)
  target.y = base.y + mouse.y * 0.15
  camera.position.lerp(target, dampFactor)  (0.05)
  camera.lookAt(roomCenter)
```

- Desktop: mouse-driven parallax
- Mobile: optional gyroscope via `DeviceOrientationEvent` (with permission prompt), else static

### Focus Camera (Zoom to Book)

```
On click MagazineBook:
  1. Store current browse camera position
  2. Calculate focus position: book.position + normal * 1.2m
  3. GSAP tween camera.position to focus position (0.6s, power2.inOut)
  4. GSAP tween lookAt to book.position (0.6s)
  5. After camera arrives: trigger cover flip animation on book
  6. Fade non-focused books to opacity 0.3
```

### Exit Camera

```
On back button or page leave:
  1. If focused: reverse focus first (0.3s)
  2. Reverse entry path: camera retreats to corridor
  3. Neon lights dim (intensity 1 -> 0, 1.0s)
  4. After 1.5s: trigger Next.js page navigation
```

## Requirements

### Mouse Parallax (Browse State)

- When in browse state on desktop, the system shall track normalized mouse position (-1 to 1) and apply it as camera position offset with lerp damping (factor 0.05).
- When parallax intensity exceeds 5 degrees from center, the system shall clamp the offset.
- When on mobile without gyroscope, the system shall keep the camera static at the browse position.
- When on mobile with gyroscope permission granted, the system shall map device orientation beta/gamma to camera parallax with reduced intensity (0.15).

### Magazine Hover Interaction

- When the pointer enters a `MagazineBook` mesh (R3F `onPointerOver`), the system shall:
  1. Scale the book to 1.08x over 0.2s
  2. Increase the spine's #eafd67 emissive intensity from 1.0 to 2.5
  3. Change cursor to pointer (`document.body.style.cursor = 'pointer'`)
- When the pointer leaves (`onPointerOut`), the system shall reverse all hover effects over 0.2s.
- When hovering on mobile (touch), the system shall skip hover effects (tap-to-focus only).

### Click-to-Focus Interaction

- When the user clicks a `MagazineBook` in browse state, the system shall transition camera to focus state targeting that book.
- When the camera focus animation completes, the system shall:
  1. Animate the book cover mesh (front face) to `rotateY(-30deg)` over 0.5s, revealing inner pages texture
  2. Display `IssueDetailPanel` (HTML overlay) with issue metadata and action buttons
  3. Set `studioStore.focusedIssueId` to the clicked issue's id
- When another book is clicked while already focused, the system shall first close the current book (0.3s), then transition to the new book.

### Deselect / Unfocus

- When the user clicks on empty space (no mesh hit) while focused, the system shall:
  1. Close the book cover (reverse rotateY, 0.3s)
  2. Hide `IssueDetailPanel`
  3. Return camera to browse position (0.5s)
  4. Restore all books to full opacity
- When the user presses Escape while focused, the system shall trigger the same deselect sequence.

### Cover Flip Animation

```
Book mesh structure:
  Group
  ├── SpineMesh (box, narrow)  — always visible
  ├── BackCover (plane)         — always visible
  ├── FrontCover (plane)        — rotates on Y axis (hinge on left edge)
  │   └── UV mapped to cover_image_url
  └── PagesMesh (box, thin)     — visible when cover opens

Focus animation:
  FrontCover.rotation.y: 0 -> -PI/6 (30deg open)
  duration: 0.5s
  ease: power2.out

Unfocus:
  FrontCover.rotation.y: -PI/6 -> 0
  duration: 0.3s
```

### Delete Animation (from SCR-COL-03)

- When a delete is confirmed, the system shall animate the `MagazineBook`:
  1. Float upward 0.5m (0.3s)
  2. Dissolve with opacity 1->0 and scale 1->0.5 (0.4s)
  3. Small particle burst in #eafd67 (optional, GPU budget permitting)
  4. Remove from scene after animation

### Performance Adaptation

- When `StudioEffects` mounts, the system shall measure initial frame rate over 60 frames.
- When average FPS drops below 30 for 2 consecutive seconds:
  1. Disable Bloom postprocessing
  2. Reduce Reflector resolution from 1024 to 256
  3. Disable chromatic aberration and vignette
  4. Set `studioStore.qualityLevel = 'low'`
- When on mobile, the system shall default to `qualityLevel: 'medium'` (Bloom only, no vignette/chromatic).
- When WebGL 2 is not available, the system shall fall back to the CSS/GSAP bookshelf (previous implementation preserved as `BookshelfViewFallback`).

## State

| Store | Field | Usage |
|-------|-------|-------|
| studioStore (new) | `cameraState: 'entry' \| 'browse' \| 'focused' \| 'exit'` | Drives camera rig behavior |
| studioStore (new) | `focusedIssueId: string \| null` | Which book is focused |
| studioStore (new) | `entryComplete: boolean` | Blocks interaction until entry animation done |
| studioStore (new) | `qualityLevel: 'high' \| 'medium' \| 'low'` | Performance adaptation level |
| magazineStore | `activeIssueId` | Synced with `focusedIssueId` for consistency |

## Interaction States

| State | Camera | Books | UI Overlay |
|-------|--------|-------|------------|
| Entry | Dolly along spline | Not visible -> stagger in | StudioLoader -> HUD |
| Browse | Parallax on mouse | Float animation, full opacity | HUD (header + count) |
| Hover (browse) | No change | Hovered: scale 1.08, glow up | Cursor: pointer |
| Focused | Zoomed to book | Selected: cover open; others: 30% opacity | IssueDetailPanel |
| Exit | Retreat through corridor | Float away, fade out | HUD fades |

## Error States

| State | Condition | Handling |
|-------|-----------|---------|
| WebGL not supported | `!renderer.capabilities.isWebGL2` | Render CSS fallback bookshelf |
| Texture load failure | `cover_image_url` 404 | Use solid color plane with `theme_palette.accent` |
| Camera animation interrupted | User clicks during transition | Queue action, execute after current tween completes |
| Frame drop | Sustained <30fps | Auto-reduce quality level |
| R3F context lost | GPU memory pressure | Attempt context restore; show error overlay if fails |

## Animations Summary

| Trigger | Type | Library | Details |
|---------|------|---------|---------|
| Mount | Entry camera dolly | GSAP Timeline | 2.5s spline path, skippable |
| Entry done | Magazine float-in | GSAP stagger | translateY below->position, 0.8s each, 0.15s stagger |
| Mouse move | Camera parallax | R3F useFrame | Damped lerp, 0.05 factor |
| Hover book | Scale + glow | R3F/GSAP | Scale 1->1.08, emissive up, 0.2s |
| Click book | Camera zoom | GSAP | 0.6s to book, power2.inOut |
| Focus arrive | Cover flip | GSAP | rotateY 0 -> -30deg, 0.5s |
| Click away | Unfocus reverse | GSAP | Close cover 0.3s, camera back 0.5s |
| Delete | Dissolve up | GSAP | Float up + scale down + fade, 0.7s total |
| Back button | Exit retreat | GSAP Timeline | Reverse entry, 1.5s |
| Neon entry | Flicker on | GSAP | 3 flickers then steady, 0.8s |
| Idle | Book bobbing | Drei Float | Continuous, speed 1.5 |

---

See: [SCR-COL-01](./SCR-COL-01-bookshelf.md) -- Scene setup, room environment, data loading
See: [SCR-COL-03](./SCR-COL-03-issue-actions.md) -- Issue detail panel and action workflows
