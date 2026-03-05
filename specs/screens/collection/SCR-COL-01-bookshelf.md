# [SCR-COL-01] The Decoded Studio — 3D Collection Room
> Route: `/collection` | Status: redesign | Updated: 2026-03-05
> Milestone: M7 (AI Magazine & Archive Expansion) — Phase m7-03
> Flow: FLW-06 (Magazine Rendering Flow — save destination from SCR-MAG-02)

## Purpose

User enters a 3D gallery room ("The Decoded Studio") where their personal magazine issues float in space, illuminated by neon #eafd67 lighting. The experience transforms a flat collection page into an immersive digital showroom that rewards continued engagement and creates a sense of ownership.

## Design Direction

- **3D Studio Room:** React Three Fiber (R3F) + Drei renders a dark gallery space with reflective floor, neon accent lighting, and floating magazine objects. User looks into the room with subtle parallax on mouse movement.
- **Isometric Camera:** Camera positioned at a 30-40deg downward angle, creating an isometric view of the studio. GSAP-driven entry animation simulates "walking into" the space.
- **Neon Lighting:** #eafd67 linear light sources create bloom glow across the room. `@react-three/postprocessing` Bloom pass for emissive materials.
- **Magazine Objects:** Each `MagazineIssue` is a 3D book object with UV-mapped cover texture, spine with neon Vol. numbering, and open/close bone animation.
- **Mannequin Display (Future):** Reserved space for SCR-VTON-01 try-on results displayed on a stylized mannequin prop.
- **Theme:** Deep Black (#050505) / Neon Chartreuse (#eafd67) — consistent with magazine screens.

## Technology Stack

| Library | Version | Purpose |
|---------|---------|---------|
| `@react-three/fiber` | ^9.x | Declarative Three.js in React |
| `@react-three/drei` | ^10.x | Helpers: OrbitControls, Float, Reflector, Text3D, useGLTF |
| `@react-three/postprocessing` | ^3.x | Bloom, vignette, chromatic aberration |
| `three` | 0.167.1 (existing) | 3D engine (already in project) |
| `gsap` | 3.13.0 (existing) | Camera path animation, entry/exit transitions |
| `leva` | ^0.10.x (dev only) | Debug panel for tuning lighting/camera in dev |

## Component Map

| Region | Component | File | Props/Notes |
|--------|-----------|------|-------------|
| Page | CollectionPage (server) | `app/collection/page.tsx` | async; auth-gated |
| Client wrapper | CollectionClient | `lib/components/collection/CollectionClient.tsx` | "use client"; orchestrates 3D scene + 2D overlays |
| 3D Scene | StudioScene | `lib/components/collection/studio/StudioScene.tsx` | R3F Canvas root; camera, lights, postprocessing |
| Room shell | StudioRoom | `lib/components/collection/studio/StudioRoom.tsx` | Floor (Reflector), walls, ceiling geometry |
| Lighting | StudioLighting | `lib/components/collection/studio/StudioLighting.tsx` | Neon #eafd67 linear lights, ambient, spot |
| Magazine rack | MagazineRack | `lib/components/collection/studio/MagazineRack.tsx` | Positions magazine objects in arc/grid layout |
| Magazine object | MagazineBook | `lib/components/collection/studio/MagazineBook.tsx` | Single 3D book with cover texture, spine, open animation |
| Camera rig | CameraRig | `lib/components/collection/studio/CameraRig.tsx` | Entry animation, mouse parallax, zoom-to-issue |
| HUD overlay | StudioHUD | `lib/components/collection/studio/StudioHUD.tsx` | 2D HTML overlay: header, issue count, back button |
| Issue detail | IssueDetailPanel | `lib/components/collection/IssueDetailPanel.tsx` | 2D overlay panel shown on issue focus |
| Empty state | EmptyStudio | `lib/components/collection/EmptyStudio.tsx` | Empty room with "Generate First Issue" hologram CTA |
| Loading | StudioLoader | `lib/components/collection/studio/StudioLoader.tsx` | Suspense fallback with neon loading bar |

## User Journey

### 1. Entry (진입)

```
Dark screen -> camera dolly forward through corridor ->
neon lights flicker on -> studio room revealed ->
magazines float into position with stagger
```

- GSAP Timeline drives camera position along a spline curve
- Duration: 2.5s total (skippable with tap/click)
- Neon lights animate from 0 to full intensity with flicker

### 2. Browse (탐색)

```
+--------------------------------------------------+
|  [<]                The Decoded Studio        [5] |  <- StudioHUD (HTML overlay)
|                                                    |
|          ╔══════╗  ╔══════╗  ╔══════╗             |
|         ║Vol.05║  ║Vol.04║  ║Vol.03║              |  <- MagazineBook objects
|        ║      ║  ║      ║  ║      ║               |     floating with subtle bobbing
|       ╚══════╝  ╚══════╝  ╚══════╝                |
|                                                    |
|              ╔══════╗  ╔══════╗                    |
|             ║Vol.02║  ║Vol.01║                     |
|            ║      ║  ║      ║                      |
|           ╚══════╝  ╚══════╝                       |
|                                                    |
|  ═══════════════════════════════════════════════   |  <- Reflector floor
|  ░░░░░░░ neon glow reflection ░░░░░░░░░░░░░░░░   |
+--------------------------------------------------+
```

- Mouse movement causes subtle camera parallax (not full orbit)
- Magazines use Drei `<Float>` for gentle bobbing animation
- Neon #eafd67 strip lights along walls cast bloom reflections on floor

### 3. Focus (선택)

```
+--------------------------------------------------+
|  [<]                                          [5] |
|                                                    |
|                  ╔════════════╗                    |
|                 ║            ║                     |  <- Camera zooms to selected
|                ║  COVER ART  ║                     |     book, cover flips open
|               ║              ║                     |
|              ║   Vol.03      ║                     |
|             ║   Denim Issue  ║                     |
|            ╚════════════════╝                      |
|                                                    |
|  +------------------------------------------+     |
|  | Vol.03 — The Denim Issue                  |     |  <- IssueDetailPanel (HTML)
|  | 2026.02.07 | #Denim #Workwear #Indigo     |     |
|  | [Open Magazine]  [Share]  [Remove]        |     |
|  +------------------------------------------+     |
+--------------------------------------------------+
```

- Camera lerps to focused book position over 0.6s
- Book cover opens with bone/morph animation (30deg flip)
- Other books fade to 30% opacity
- IssueDetailPanel slides up as HTML overlay

### 4. Mannequin Display (Future — SCR-VTON-01)

```
+--------------------------------------------------+
|                                                    |
|    [Mannequin]         ╔══════╗  ╔══════╗         |
|    with latest         ║Vol.05║  ║Vol.04║         |
|    try-on look         ║      ║  ║      ║         |
|    ▓▓▓▓▓▓▓▓           ╚══════╝  ╚══════╝         |
|    ▓ LOOK ▓                                       |
|    ▓▓▓▓▓▓▓▓           ╔══════╗                    |
|                        ║Vol.03║                    |
|  ═══════════════════════════════════════════════   |
+--------------------------------------------------+
```

- Reserved prop position in room layout
- Texture mapped from VTON result image
- Neon spot light highlighting mannequin
- **Deferred to SCR-VTON-01 implementation**

### 5. Exit (퇴장)

- Back button or browser back triggers reverse camera dolly
- Magazines float away, lights dim, camera retreats through corridor
- Page transition to previous route after 1.5s animation

## Layout

### Mobile (<768px)

- Canvas fills viewport below sticky header
- Touch: tap to select issue, swipe not used (conflicts with scroll)
- Simplified lighting (fewer light sources for performance)
- Magazine objects slightly larger for touch targets
- No mouse parallax; gyroscope tilt if available (`DeviceOrientationEvent`)

### Desktop (>=768px)

- Full viewport Canvas with HUD overlay
- Mouse parallax camera rig
- Full bloom postprocessing
- Richer lighting setup (3+ neon strips)

| Element | Mobile | Desktop |
|---------|--------|---------|
| Camera control | Tap to focus | Mouse parallax + click to focus |
| Postprocessing | Bloom only | Bloom + vignette + chromatic aberration |
| Neon lights | 2 strips | 4+ strips with reflections |
| Magazine size | Larger (touch) | Standard |
| Entry animation | Shorter (1.5s) | Full (2.5s) |
| Mannequin | Hidden | Visible (future) |

## Requirements

### Scene Initialization

- When the page mounts, the system shall render `<Canvas>` with `<Suspense>` wrapping all 3D content, showing `StudioLoader` as fallback.
- When all assets are loaded, the system shall trigger the entry camera animation via GSAP Timeline.
- When the user taps/clicks during entry animation, the system shall skip to the final camera position.

### Data Loading

- When authenticated, the system shall fetch `GET /api/v1/magazine/collection` to retrieve the user's saved issues list.
- When fetch succeeds with issues, the system shall instantiate `MagazineBook` objects positioned by `MagazineRack` layout algorithm.
- When fetch succeeds with empty array, the system shall render `EmptyStudio` with holographic "Generate First Issue" CTA.
- When not authenticated, the system shall redirect to `/login` with return URL.

### 3D Room Environment

- When `StudioRoom` renders, the system shall create a dark gallery room (8m x 6m x 4m) with matte black walls and a `<Reflector>` floor plane.
- When `StudioLighting` renders, the system shall place #eafd67 emissive mesh strip lights along upper walls with `<EffectComposer>` Bloom pass (intensity 1.5, luminanceThreshold 0.6).
- When ambient light renders, the system shall use low intensity (0.15) warm white to maintain dark mood.

### Magazine Object Rendering

- When a `MagazineBook` renders, the system shall create a box geometry (aspect 2:3, depth 0.15) with UV-mapped cover texture from `issue.cover_image_url`.
- When the spine face renders, the system shall display `Vol.{issue_number}` in #eafd67 emissive text with glow, plus the issue title vertically.
- When books are positioned, `MagazineRack` shall arrange them in a gentle arc or staggered grid with 30-40cm spacing.
- When idle, books shall use Drei `<Float>` with `speed={1.5}` and `floatIntensity={0.3}` for gentle bobbing.

### Camera Interactions

- When the mouse moves (desktop), the system shall apply subtle parallax to camera position (max 5deg rotation, damped with lerp factor 0.05).
- When the user clicks a `MagazineBook`, the system shall lerp the camera to a position 1m in front of the book over 0.6s with ease "power2.inOut".
- When focused on a book, the system shall animate the book cover open (rotateY on cover mesh: 0 -> -30deg, 0.5s).
- When the user clicks away or presses Escape, the system shall reverse the focus animation and return camera to browse position.

### Performance

- When on mobile, the system shall reduce: shadow map resolution, number of lights, postprocessing passes.
- When frame rate drops below 30fps for 2 consecutive seconds, the system shall disable Bloom and reduce geometry detail.
- When `MagazineBook` textures load, the system shall use progressive loading (low-res placeholder -> full-res swap).

## State

| Store | Usage |
|-------|-------|
| magazineStore | `collectionIssues: MagazineIssue[]`, `isLoading`, `activeIssueId`, `loadCollection()` |
| authStore | `selectIsLoggedIn` for auth gate |
| studioStore (new) | `cameraState: 'entry' \| 'browse' \| 'focused'`, `focusedIssueId`, `entryComplete` |

## Navigation

| Trigger | Destination | Data Passed |
|---------|-------------|-------------|
| "Open Magazine" action | `/magazine/issue/[id]` | issueId, layout_json from cache |
| "Generate First Issue" CTA | `/magazine/personal` (SCR-MAG-02) | - |
| Back button | Previous screen (with exit animation) | - |
| Share -> Instagram | External (Instagram app) | Exported cover image |

## Error & Empty States

| State | Condition | UI |
|-------|-----------|-----|
| Loading | Assets + data loading | StudioLoader: neon progress bar in dark void |
| Empty | No saved issues | EmptyStudio: empty room with holographic CTA |
| Error | API failure | Error overlay with retry button |
| WebGL not supported | No WebGL context | Fallback to CSS bookshelf (previous implementation) |
| Low performance | <30fps sustained | Auto-disable postprocessing, reduce lights |

## 3D Asset Requirements

| Category | Asset | Spec | Notes |
|----------|-------|------|-------|
| Room | Procedural geometry | R3F box/plane primitives | No GLB needed; programmatic |
| Magazine | Procedural geometry | Box geometry with UV faces | Cover texture from API data |
| Lighting | Emissive mesh strips | BoxGeometry with emissive material | #eafd67 glow |
| Floor | Drei Reflector | Plane with reflection | Neon reflections |
| Text | Drei Text/Text3D | Vol. numbering on spines | #eafd67 emissive |
| Mannequin (future) | `Stylized_Dummy.glb` | Abstract human form | Deferred to VTON |

> Phase 1 uses **procedural geometry only** (no external GLB files). GLB models deferred to future phases when mannequin/props are needed.

## Animations

| Trigger | Type | Library | Details |
|---------|------|---------|---------|
| Page mount | Entry camera dolly | GSAP Timeline | Camera along spline, 2.5s, skippable |
| Entry complete | Magazine float-in | R3F/GSAP | Staggered position from below, 0.8s each |
| Idle | Magazine bobbing | Drei Float | speed=1.5, floatIntensity=0.3 |
| Mouse move | Camera parallax | R3F useFrame | Damped lerp, max 5deg |
| Issue click | Camera zoom-in | GSAP | Lerp to book, 0.6s, power2.inOut |
| Issue focus | Cover flip open | R3F/GSAP | rotateY 0 -> -30deg, 0.5s |
| Deselect | Camera zoom-out | GSAP | Reverse to browse pos, 0.5s |
| Exit | Camera retreat | GSAP Timeline | Reverse entry, 1.5s |
| Neon lights | Flicker on entry | GSAP | Intensity 0->1 with flicker, 0.8s |

---

See: [SCR-COL-02](./SCR-COL-02-3d-interaction.md) -- R3F interaction mechanics
See: [SCR-COL-03](./SCR-COL-03-issue-actions.md) -- Issue actions and detail panel
See: [SCR-MAG-01](../magazine/SCR-MAG-01-daily-editorial.md) -- Daily editorial (discovery entry)
See: [SCR-MAG-02](../magazine/SCR-MAG-02-personal-issue.md) -- Personal issue generation (collection source)
