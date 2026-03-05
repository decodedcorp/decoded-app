# Phase m7-03: The Decoded Studio — 3D Collection Room - Research

**Researched:** 2026-03-05
**Domain:** React Three Fiber 3D scene, postprocessing, camera animation, WebGL fallback
**Confidence:** HIGH

## Summary

This phase transforms the `/collection` bookshelf page into a 3D studio room using React Three Fiber (R3F). The project uses React 18.3.1, which means R3F **v8** (not v9) must be used -- v9 requires React 19. The compatible ecosystem is `@react-three/fiber@^8.18.0`, `@react-three/drei@^9.122.0`, and `@react-three/postprocessing@^2.19.1`, all of which have `react@^18` and `three@>=0.133` as peer dependencies, fully compatible with the project's `three@0.167.1`.

The existing codebase already has `three`, `gsap`, `@gsap/react`, `motion`, and `zustand` installed. The existing `CollectionClient.tsx` and `BookshelfView.tsx` serve as the CSS fallback target. The `MagazineIssue` type provides `cover_image_url`, `issue_number`, `title`, `theme_keywords`, and `theme_palette` -- all needed for 3D book rendering. Mock data is loaded from JSON fixtures via `magazineStore`.

**Primary recommendation:** Install R3F v8 ecosystem, build the 3D scene as a client-only dynamic import with `ssr: false`, preserve existing BookshelfView as WebGL fallback, and use GSAP (already installed) for all camera/object animations via `useGSAP` + `useThree`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@react-three/fiber` | ^8.18.0 | Declarative Three.js renderer for React 18 | Official R3F for React 18; v9 requires React 19 |
| `@react-three/drei` | ^9.122.0 | Helpers: Float, Reflector, Text, Html, useTexture | Blessed companion to R3F v8; peer dep `@react-three/fiber@^8` |
| `@react-three/postprocessing` | ^2.19.1 | EffectComposer, Bloom, Vignette | Official R3F postprocessing; peer dep `@react-three/fiber@^8` |
| `three` | 0.167.1 (existing) | 3D engine | Already in project |
| `gsap` | 3.13.0 (existing) | Camera path, entry/exit transitions | Already in project; used throughout codebase |
| `@gsap/react` | ^2.1.2 (existing) | `useGSAP` hook for lifecycle cleanup | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `leva` | ^0.10.x | Dev-only debug panel for tuning lighting/camera | Development only; conditionally loaded |
| `zustand` | 4.5.7 (existing) | `studioStore` state machine | Already in project |
| `motion` | 12.23.12 (existing) | 2D overlay panel animations | Already in project; use for IssueDetailPanel slide |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| R3F v8 | R3F v9 | v9 requires React 19; project is React 18 -- NOT compatible |
| GSAP for camera | react-spring/R3F springs | GSAP already in project, simpler timeline sequencing for entry animation |
| Bloom postprocessing | UnrealBloomPass manual | R3F postprocessing auto-merges effects for fewer render passes |
| Drei `<Reflector>` | Custom mirror shader | Reflector is well-tested, configurable, handles resolution scaling |

**Installation:**
```bash
cd packages/web && yarn add @react-three/fiber@^8.18.0 @react-three/drei@^9.122.0 @react-three/postprocessing@^2.19.1
cd packages/web && yarn add -D leva@^0.10
```

## Architecture Patterns

### Recommended Project Structure
```
lib/components/collection/
├── CollectionClient.tsx           # Orchestrator: WebGL check -> 3D or fallback
├── IssueDetailPanel.tsx           # 2D HTML overlay (focused state)
├── CollectionShareSheet.tsx       # DS BottomSheet share options
├── EmptyStudio.tsx                # Empty room + holographic CTA
├── BookshelfView.tsx              # (EXISTING) CSS fallback
├── studio/
│   ├── StudioScene.tsx            # R3F <Canvas> root + Suspense
│   ├── StudioRoom.tsx             # Floor (Reflector), walls, ceiling
│   ├── StudioLighting.tsx         # Neon #eafd67 lights
│   ├── StudioEffects.tsx          # EffectComposer + Bloom + Vignette
│   ├── CameraRig.tsx              # Entry/browse/focus/exit camera states
│   ├── MagazineRack.tsx           # Layout algorithm for N books
│   ├── MagazineBook.tsx           # Single 3D book object
│   └── StudioLoader.tsx           # Suspense fallback
└── index.ts                       # Barrel exports
```

### Pattern 1: Client-Only Dynamic Import for R3F Canvas
**What:** R3F `<Canvas>` cannot render on server. Must use `next/dynamic` with `ssr: false`.
**When to use:** Always, for any component that contains `<Canvas>`.
**Example:**
```typescript
// CollectionClient.tsx
"use client";
import dynamic from "next/dynamic";

const StudioScene = dynamic(
  () => import("./studio/StudioScene").then((m) => m.StudioScene),
  { ssr: false, loading: () => <StudioLoader /> }
);

export function CollectionClient() {
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setSupportsWebGL(!!gl);
    } catch {
      setSupportsWebGL(false);
    }
  }, []);

  if (supportsWebGL === null) return <StudioLoader />;
  if (!supportsWebGL) return <BookshelfViewFallback />;
  return <StudioScene />;
}
```

### Pattern 2: GSAP Camera Animation via useGSAP + useThree
**What:** Animate R3F camera using GSAP timelines. Access camera from `useThree()`, animate with `useGSAP` for automatic cleanup.
**When to use:** Entry dolly, focus zoom, exit retreat.
**Example:**
```typescript
// CameraRig.tsx
import { useThree, useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function CameraRig() {
  const { camera } = useThree();
  const targetRef = useRef(new Vector3(0, 0.5, 0));

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(camera.position,
      { x: 0, y: 1.5, z: -8 },  // corridor start
      { x: 0, y: 3.0, z: 6, duration: 2.0, ease: "power2.inOut",
        onUpdate: () => camera.lookAt(targetRef.current) }
    );
  }, { dependencies: [] });

  // Mouse parallax in browse state
  useFrame(({ pointer }) => {
    if (studioStore.cameraState !== "browse") return;
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      pointer.x * 0.3,
      0.05
    );
  });

  return null;
}
```

### Pattern 3: Multi-Material BoxGeometry for Magazine Book
**What:** Apply different textures to each face of a box using material array indices.
**When to use:** MagazineBook component: cover on front, spine text, solid color on other faces.
**Example:**
```typescript
// MagazineBook.tsx
function MagazineBook({ issue }: { issue: MagazineIssue }) {
  const coverTexture = useTexture(issue.cover_image_url);

  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1.5, 0.15]} />
        {/* right, left, top, bottom, front (cover), back */}
        <meshStandardMaterial attach="material-0" color="#1a1a1a" />
        <meshStandardMaterial attach="material-1" color="#1a1a1a" />
        <meshStandardMaterial attach="material-2" color="#1a1a1a" />
        <meshStandardMaterial attach="material-3" color="#1a1a1a" />
        <meshStandardMaterial attach="material-4" map={coverTexture} />
        <meshStandardMaterial attach="material-5" color="#0a0a0a" />
      </mesh>
    </group>
  );
}
```

### Pattern 4: Bloom with Emissive Threshold
**What:** Bloom is selective by default via luminanceThreshold. Materials with color/emissive intensity > threshold glow; others don't.
**When to use:** Neon #eafd67 lights glow, book surfaces don't.
**Example:**
```typescript
// StudioEffects.tsx
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

function StudioEffects({ quality }: { quality: "high" | "medium" | "low" }) {
  if (quality === "low") return null;

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.025}
        intensity={1.5}
      />
      {quality === "high" && <Vignette darkness={0.5} offset={0.3} />}
    </EffectComposer>
  );
}
```

For neon light meshes, set emissive intensity above threshold:
```typescript
<meshStandardMaterial
  color="#eafd67"
  emissive="#eafd67"
  emissiveIntensity={3.0}  // well above luminanceThreshold 0.6
/>
```

### Pattern 5: Zustand Store for Camera State Machine
**What:** A dedicated `studioStore` manages camera state transitions and quality level.
**When to use:** Coordinating 3D camera behavior with 2D UI overlays.
**Example:**
```typescript
// stores/studioStore.ts
import { create } from "zustand";

type CameraState = "entry" | "browse" | "focused" | "exit";
type QualityLevel = "high" | "medium" | "low";

interface StudioState {
  cameraState: CameraState;
  focusedIssueId: string | null;
  entryComplete: boolean;
  qualityLevel: QualityLevel;
  setCameraState: (s: CameraState) => void;
  focusIssue: (id: string) => void;
  unfocus: () => void;
  setQualityLevel: (q: QualityLevel) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  cameraState: "entry",
  focusedIssueId: null,
  entryComplete: false,
  qualityLevel: typeof window !== "undefined" && window.innerWidth < 768 ? "medium" : "high",
  setCameraState: (cameraState) => set({ cameraState, entryComplete: cameraState !== "entry" }),
  focusIssue: (id) => set({ focusedIssueId: id, cameraState: "focused" }),
  unfocus: () => set({ focusedIssueId: null, cameraState: "browse" }),
  setQualityLevel: (qualityLevel) => set({ qualityLevel }),
}));
```

### Pattern 6: Cover Flip with Pivot Offset
**What:** Front cover rotates on its left edge (like a real book), not center. Use a Group to shift pivot point.
**When to use:** Focus animation cover open/close.
**Example:**
```typescript
// Inside MagazineBook - cover flip
function FrontCover({ texture, isOpen }: { texture: Texture; isOpen: boolean }) {
  const coverRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!coverRef.current) return;
    gsap.to(coverRef.current.rotation, {
      y: isOpen ? -Math.PI / 6 : 0,  // -30deg open
      duration: isOpen ? 0.5 : 0.3,
      ease: "power2.out",
    });
  }, { dependencies: [isOpen] });

  return (
    // Group at left edge acts as pivot
    <group ref={coverRef} position={[-0.5, 0, 0.075]}>
      <mesh position={[0.5, 0, 0]}>
        <planeGeometry args={[1, 1.5]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
```

### Anti-Patterns to Avoid
- **OrbitControls for this scene:** The spec requires parallax-only camera, not user-controlled orbit. OrbitControls would break the curated view.
- **useFrame for all animations:** Use GSAP for one-shot transitions (entry, focus, exit). Reserve useFrame only for per-frame continuous effects (parallax, floating).
- **Server-rendering Canvas:** R3F Canvas will crash on SSR. Always use `dynamic(() => ..., { ssr: false })`.
- **Loading all drei helpers:** Import only what you use. Drei is large; named imports tree-shake.
- **Inline materials in loops:** Create material instances outside the map loop or use `useMemo` to avoid recreating materials every frame.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reflective floor | Custom mirror shader | Drei `<Reflector>` | Handles resolution, blur, mix strength; well-tested |
| Bloom glow | Manual UnrealBloomPass | `@react-three/postprocessing` `<Bloom>` | Auto-merges into EffectComposer, fewer render passes |
| Text on 3D objects | Canvas texture with manual text | Drei `<Text>` (troika-three-text) | SDF text rendering, sharp at any zoom, GPU-efficient |
| Floating animation | Manual sine wave in useFrame | Drei `<Float>` | Configurable speed/intensity/range, handled automatically |
| Texture loading | Manual THREE.TextureLoader | Drei `useTexture` | Auto-suspends for React Suspense, handles CORS, returns typed |
| FPS monitoring | Manual performance.now delta | Drei `<PerformanceMonitor>` | Built-in regress callback, configurable thresholds |
| HTML overlay in 3D | Manual screen projection | Drei `<Html>` | Auto-projects HTML into 3D space, handles occlusion |

**Key insight:** The drei library provides production-tested abstractions for nearly every helper needed in this scene. Using them avoids edge cases in resize handling, context loss recovery, and mobile compatibility that custom solutions invariably miss.

## Common Pitfalls

### Pitfall 1: R3F v9 vs v8 Version Mismatch
**What goes wrong:** Installing R3F v9 with React 18 causes silent rendering failures or type errors.
**Why it happens:** v9's peer dependency is `react@>=19`; v8's is `react@>=18 <19`.
**How to avoid:** Pin `@react-three/fiber@^8.18.0`, `@react-three/drei@^9`, `@react-three/postprocessing@^2`.
**Warning signs:** Runtime errors about reconciler mismatch, empty Canvas renders.

### Pitfall 2: SSR Crash from Canvas Import
**What goes wrong:** Next.js SSR tries to evaluate Three.js code on server, crashes with `window is not defined`.
**Why it happens:** Three.js accesses `window`, `document`, `WebGLRenderingContext` at import time.
**How to avoid:** ALL components using R3F hooks/Canvas MUST be loaded via `dynamic(() => import(...), { ssr: false })`. The dynamic import boundary must be above ANY Three.js import.
**Warning signs:** Build-time or SSR errors mentioning `window`, `document`, or `WebGLRenderingContext`.

### Pitfall 3: Bloom Bleeding to All Materials
**What goes wrong:** Everything in the scene glows, not just neon lights.
**Why it happens:** `luminanceThreshold` too low, or all materials have nonzero emissive.
**How to avoid:** Set `luminanceThreshold: 0.6` or higher. Only neon light meshes should have `emissiveIntensity > 1.0`. Book surfaces should have `emissiveIntensity: 0`.
**Warning signs:** Entire scene has washed-out glow effect.

### Pitfall 4: Reflector Killing Mobile Performance
**What goes wrong:** Frame rate drops to <15fps on mobile with Reflector.
**Why it happens:** Reflector renders the scene twice (once for reflection). High resolution compounds the cost.
**How to avoid:** Set `resolution` to 256 on mobile (1024 on desktop). Consider disabling Reflector entirely in `qualityLevel: 'low'`.
**Warning signs:** FPS drops specifically when floor is visible.

### Pitfall 5: GSAP + useFrame Race Condition
**What goes wrong:** GSAP timeline animates camera position, but useFrame callback overwrites it in the same frame.
**Why it happens:** Both systems try to set `camera.position` simultaneously.
**How to avoid:** Gate useFrame parallax behind `cameraState === 'browse'`. During entry/focus/exit, GSAP owns the camera exclusively. Use `studioStore.cameraState` as the arbiter.
**Warning signs:** Camera jitters or teleports during transition animations.

### Pitfall 6: Texture CORS Errors
**What goes wrong:** Cover textures fail to load with CORS errors in console.
**Why it happens:** Texture URLs from external domains (CDN) without proper CORS headers.
**How to avoid:** Either serve images from same domain, configure CDN CORS, or use `crossOrigin="anonymous"` on the texture loader. Drei's `useTexture` handles this when URL is same-origin. For external URLs, may need a proxy.
**Warning signs:** Black faces on magazine books, console CORS errors.

### Pitfall 7: Memory Leak from Undisposed Textures
**What goes wrong:** Navigating away from collection page doesn't free GPU memory; re-visiting accumulates textures.
**Why it happens:** Three.js textures must be manually `.dispose()`d. React unmount doesn't auto-dispose.
**How to avoid:** Use `useEffect` cleanup to dispose textures. Drei's `useTexture` handles this if the component unmounts. For manual textures, call `texture.dispose()` in cleanup.
**Warning signs:** Increasing GPU memory on repeated navigation, eventual context loss.

## Code Examples

### WebGL2 Detection Before R3F Load
```typescript
// Source: MDN WebGL best practices
function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("webgl2");
    canvas.remove();
    return !!ctx;
  } catch {
    return false;
  }
}
```

### Drei Reflector Floor Setup
```typescript
// Source: @react-three/drei docs
import { Reflector } from "@react-three/drei";

function StudioFloor() {
  const isMobile = window.innerWidth < 768;
  return (
    <Reflector
      resolution={isMobile ? 256 : 1024}
      args={[8, 6]}  // width, height of floor
      mirror={0.5}
      mixBlur={8}
      mixStrength={1}
      blur={[300, 100]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      {(Material, props) => (
        <Material color="#050505" metalness={0.5} roughness={0.8} {...props} />
      )}
    </Reflector>
  );
}
```

### Drei PerformanceMonitor for Adaptive Quality
```typescript
// Source: R3F scaling performance docs
import { PerformanceMonitor } from "@react-three/drei";

function StudioScene() {
  const setQualityLevel = useStudioStore((s) => s.setQualityLevel);

  return (
    <Canvas>
      <PerformanceMonitor
        onDecline={() => setQualityLevel("low")}
        onIncline={() => setQualityLevel("high")}
        flipflops={3}       // allow 3 quality changes before settling
        averages={20}        // sample 20 frames
      />
      {/* ...scene content */}
    </Canvas>
  );
}
```

### Drei Float for Magazine Bobbing
```typescript
// Source: @react-three/drei
import { Float } from "@react-three/drei";

function FloatingBook({ children }: { children: React.ReactNode }) {
  return (
    <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.1}>
      {children}
    </Float>
  );
}
```

### Drei Text for Spine Label
```typescript
// Source: @react-three/drei Text (troika-three-text)
import { Text } from "@react-three/drei";

function SpineLabel({ issueNumber }: { issueNumber: number }) {
  return (
    <Text
      fontSize={0.08}
      color="#eafd67"
      anchorX="center"
      anchorY="middle"
      rotation={[0, Math.PI / 2, Math.PI / 2]}
      position={[-0.575, 0, 0]}
    >
      {`Vol.${String(issueNumber).padStart(2, "0")}`}
      <meshStandardMaterial
        emissive="#eafd67"
        emissiveIntensity={2.0}
        toneMapped={false}
      />
    </Text>
  );
}
```

### Canvas Setup with Error Boundary
```typescript
// StudioScene.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload } from "@react-three/drei";

export function StudioScene() {
  return (
    <div className="fixed inset-0 bg-[#050505]">
      <Canvas
        camera={{ position: [0, 1.5, -8], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <StudioRoom />
          <StudioLighting />
          <MagazineRack />
          <CameraRig />
          <StudioEffects />
          <Preload all />
        </Suspense>
      </Canvas>
      <StudioHUD />
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| R3F v8 + React 18 | R3F v9 + React 19 | 2024 | Must use v8 since project is React 18 |
| `attachArray="material"` | `attach="material-0"` through `material-5` | R3F v8 | Material array attachment syntax changed |
| Manual EffectComposer | `@react-three/postprocessing` wrapper | Ongoing | Declarative, auto-merges effects |
| THREE.TextureLoader | Drei `useTexture` | Ongoing | Suspense-compatible, auto-dispose |
| Manual FPS counter | Drei `<PerformanceMonitor>` | 2023+ | Built-in regress/incline callbacks |

**Deprecated/outdated:**
- `attachArray`: Removed in R3F v8. Use indexed `attach="material-N"` instead.
- `useResource`: Removed. Use React refs directly.
- `@react-three/cannon` for physics: Not needed here; scene is purely visual.

## Open Questions

1. **three.js version gap with @types/three**
   - What we know: Project has `three@0.167.1` but `@types/three@0.181.0` -- large version gap
   - What's unclear: Whether type mismatches will cause issues with R3F v8
   - Recommendation: Test first; if type errors occur, align `@types/three` to `@types/three@0.167` or suppress with `// @ts-ignore` for R3F internals

2. **Next.js 16 compatibility with R3F dynamic import**
   - What we know: `next/dynamic` with `{ ssr: false }` is the standard pattern; works in Next.js 13-15
   - What's unclear: Any Next.js 16-specific changes to dynamic imports
   - Recommendation: This is the established pattern; very likely to work. Test early.

3. **Cover image CORS for texture loading**
   - What we know: `cover_image_url` points to mock data currently; production may use external CDN
   - What's unclear: Whether CDN URLs will have CORS headers for WebGL texture use
   - Recommendation: Use same-origin or proxy approach. For mock phase, local images work fine.

4. **Mobile gyroscope permission**
   - What we know: iOS 13+ requires explicit permission for `DeviceOrientationEvent`
   - What's unclear: UX for permission prompt; whether the subtle parallax justifies the friction
   - Recommendation: Make gyroscope optional. Default to static camera on mobile. Add gyroscope only if explicitly requested later.

## Sources

### Primary (HIGH confidence)
- npm registry: `@react-three/fiber@8.18.0` peerDependencies verified (`react@>=18 <19`, `three@>=0.133`)
- npm registry: `@react-three/drei@9.122.0` peerDependencies verified (`react@^18`, `@react-three/fiber@^8`)
- npm registry: `@react-three/postprocessing@2.19.1` peerDependencies verified (`react@^18`, `@react-three/fiber@^8`)
- [R3F Installation Docs](https://r3f.docs.pmnd.rs/getting-started/installation) -- version pairing guidance
- [R3F Scaling Performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) -- PerformanceMonitor, regress pattern
- [React Postprocessing Bloom](https://react-postprocessing.docs.pmnd.rs/effects/bloom) -- luminanceThreshold approach
- [GSAP + R3F Camera Gist](https://gist.github.com/ektogamat/8ba8c0d103fa683e7a836661aada55ed) -- useGSAP + useThree pattern

### Secondary (MEDIUM confidence)
- [Drei GitHub](https://github.com/pmndrs/drei) -- Reflector, Float, Text, Html, PerformanceMonitor usage
- [R3F Multi-Material Discussion](https://github.com/pmndrs/react-three-fiber/discussions/744) -- `attach="material-N"` pattern
- [MDN WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) -- WebGL detection, fallback

### Tertiary (LOW confidence)
- Mobile performance specifics for Reflector + Bloom combination -- based on general guidance, not benchmarked

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- versions verified via npm registry peer dependencies
- Architecture: HIGH -- patterns well-established in R3F ecosystem; project conventions match
- Pitfalls: HIGH -- version mismatch (R3F v8 vs v9) verified; SSR/GSAP/Bloom pitfalls well-documented
- Performance adaptation: MEDIUM -- PerformanceMonitor exists but mobile-specific Reflector+Bloom combo untested

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (30 days -- stable ecosystem, no imminent major releases)
