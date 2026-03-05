# [SCR-COL-02] 3D Bookshelf Interaction Layer
> Route: overlay within `/collection` | Status: proposed | Updated: 2026-03-05
> Milestone: M7 (AI Magazine & Archive Expansion)
> Parent: SCR-COL-01 — page structure and data loading

## Purpose

Defines the GSAP 3D perspective mechanics that animate `IssueSpine` components on each `ShelfRow`, including pop-out, retract, delete fall-off, staggered entrance, and ScrollTrigger shelf reveals.

See: SCR-COL-01 — page layout, data fetching, auth gate
See: SCR-COL-03 — issue preview card and action workflows

## Component Map

| Region | Component | File | Props/Notes |
|--------|-----------|------|-------------|
| 3D container | BookshelfView | `packages/web/lib/components/collection/BookshelfView.tsx` | GSAP context root; sets `perspective` CSS on wrapper ref |
| Shelf unit | ShelfRow | `packages/web/lib/components/collection/ShelfRow.tsx` | ScrollTrigger target; receives `issues: MagazineIssue[]` slice |
| Spine element | IssueSpine | `packages/web/lib/components/collection/IssueSpine.tsx` | `issue`, `isActive`, `onSelect`, `onDeselect`; owns hover delay timer |

> All file paths are proposed. Verify against filesystem before implementation.

## Layout

### Perspective Setup

```
BookshelfView wrapper
  perspective: 800px  (mobile <768px)
  perspective: 1200px (desktop >=768px)
  transform-style: preserve-3d

  ShelfRow (each)
    IssueSpine — default pose:
      rotateY(-15deg)  translateZ(0)  opacity: 1

    IssueSpine — active (pop-out):
      rotateY(-5deg)   translateZ(60px)
      (cover half-revealed behind spine)
```

### Staggered Entrance Sequence

```
Page mount ->

  ShelfRow (bottom / oldest, last in DOM)
    IssueSpine[0] -> opacity 0->1  (t=0)
    IssueSpine[1] -> opacity 0->1  (t=0.1s)
    ...
  ShelfRow (top / newest, first in DOM)
    IssueSpine[0] -> opacity 0->1  (t=Ns)
    ...

Each spine: duration 0.4s, stagger 0.1s, bottom shelf first (reversed DOM order)
```

## Requirements

### Perspective Initialization

- When `BookshelfView` mounts, the system shall create a GSAP context scoped to the bookshelf container ref.
- When viewport width is below 768px, the system shall apply `perspective: 800px` to the container.
- When viewport width is 768px or above, the system shall apply `perspective: 1200px` to the container.
- When `BookshelfView` unmounts, the system shall call `gsapContext.revert()` to clean up all GSAP tweens and ScrollTriggers.

### Default Spine Pose

- When an `IssueSpine` renders without `isActive`, the system shall set `rotateY(-15deg)` and `translateZ(0)` as the resting transform using `gsap.set`.
- When the spine background color is set, the system shall use `issue.theme_palette.primary` as the spine surface color.

### Pop-out Animation (Active State)

- When the user taps an `IssueSpine` on mobile, the system shall animate that spine to `translateZ(60px)` and `rotateY(-5deg)` over 0.4s with ease `back.out(1.7)`.
- When the user hovers over an `IssueSpine` on desktop for 200ms without leaving, the system shall trigger the same pop-out animation (0.4s, `back.out(1.7)`).
- When a hover intent timer is active and the pointer leaves before 200ms, the system shall cancel the timer and not trigger pop-out.
- When a spine is popped out, the system shall set `collectionStore.activeIssueId` to that issue's id.

### Single-Active Constraint

- When a spine is selected while another spine is already active, the system shall first animate the previously active spine back to default pose (0.3s reverse) before starting the new pop-out.
- When `collectionStore.activeIssueId` changes to a different id, `BookshelfView` shall trigger the retract tween on the previously active spine ref.

### Retract Animation

- When the user taps an active spine again on mobile, the system shall animate it back to `translateZ(0)` and `rotateY(-15deg)` over 0.3s and clear `collectionStore.activeIssueId`.
- When the user moves the pointer off an active spine on desktop (and no action button is hovered), the system shall retract the spine over 0.3s.
- When the user taps outside any spine, the system shall retract the active spine if one exists.

### Delete Fall-off Animation

- When a delete action is confirmed (see SCR-COL-03), the system shall animate the target spine: `rotateX(90deg)`, `opacity(0)`, duration 0.6s, ease `power2.in`.
- When the fall-off animation completes, the system shall remove the spine from the DOM and re-distribute remaining spines within the row.

### Staggered Entrance Animation

- When `BookshelfView` first renders with issues loaded, the system shall animate all spines from `opacity(0)` to `opacity(1)`, duration 0.4s per spine, stagger 0.1s.
- When staggering, the system shall start from the bottom shelf (highest `issue_number` index in DOM order) and work upward so older issues appear first.

### ScrollTrigger Shelf Reveals

- When a `ShelfRow` enters the viewport during downward scroll, the system shall animate it from `translateY(30px), opacity(0)` to `translateY(0), opacity(1)` over 0.5s.
- When `once: true` is set on the ScrollTrigger, the system shall not re-animate a shelf that has already been revealed on scroll-up.
- When the page has fewer than two shelf rows, the system shall skip ScrollTrigger registration (all content visible on mount).

## State

| Store | Field | Usage |
|-------|-------|-------|
| collectionStore (proposed) | `activeIssueId: string \| null` | Tracks which spine is currently popped out; drives single-active constraint |
| collectionStore (proposed) | `issues: MagazineIssue[]` | Source list for spine rendering and row distribution |

> `collectionStore` is proposed and not yet implemented. File: `packages/web/lib/stores/collectionStore.ts`.

## Interaction States

| State | Transform | Duration | Ease |
|-------|-----------|----------|------|
| Default (resting) | `rotateY(-15deg) translateZ(0)` | — | `gsap.set` |
| Pop-out (active) | `rotateY(-5deg) translateZ(60px)` | 0.4s | `back.out(1.7)` |
| Retract | reverse to default | 0.3s | default |
| Delete fall-off | `rotateX(90deg) opacity(0)` | 0.6s | `power2.in` |
| Entrance | `opacity 0->1` | 0.4s | default, stagger 0.1s |
| Shelf reveal | `translateY(30->0) opacity(0->1)` | 0.5s | ScrollTrigger |

## Error States

| State | Condition | Handling |
|-------|-----------|---------|
| GSAP context missing | Ref not mounted before context creation | Guard with `if (!containerRef.current) return` |
| Animation interrupted | User taps new spine mid-retract | Kill previous tween; start new pop-out immediately |
| Single spine in row | Only one issue on a shelf | Normal pop-out; no redistribution needed |

## Animations Summary

| Trigger | Type | Library | Details |
|---------|------|---------|---------|
| Component mount | Perspective set | GSAP `gsap.set` | `perspective` CSS on container |
| Spine render | Default pose | GSAP `gsap.set` | `rotateY(-15deg) translateZ(0)` |
| Tap / hover 200ms | Pop-out | GSAP `gsap.to` | 0.4s, `back.out(1.7)` |
| Tap active / hover-off | Retract | GSAP `gsap.to` | 0.3s |
| Delete confirmed | Fall-off | GSAP `gsap.to` | 0.6s, `power2.in` |
| Issues loaded | Staggered entrance | GSAP `gsap.fromTo` | stagger 0.1s, bottom-first |
| Shelf enters viewport | Shelf reveal | GSAP ScrollTrigger | 0.5s, once |
| Component unmount | Context cleanup | GSAP | `gsapContext.revert()` |

---

See: [SCR-COL-01](./SCR-COL-01-bookshelf.md) -- Page structure, data loading, auth gate
See: [SCR-COL-03](./SCR-COL-03-issue-actions.md) -- Issue preview card and action workflows
