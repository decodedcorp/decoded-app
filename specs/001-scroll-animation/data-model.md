# Phase 1: Data Model - Scroll Animation & Lazy Loading System

**Feature**: 001-scroll-animation
**Date**: 2025-11-20
**Status**: Complete

## Overview

This feature is primarily a UI animation system with minimal data modeling requirements. The data model focuses on TypeScript interfaces for hook configuration, element state, and callback signatures rather than persistent data structures.

## Type Definitions

### 1. Animation Configuration

**Interface**: `UseScrollAnimationOptions`

**Purpose**: Configuration options for the `useScrollAnimation` hook

```typescript
interface UseScrollAnimationOptions {
  /**
   * Threshold at which observer callback fires (0.0 to 1.0)
   * @default 0.15 (15% visibility)
   */
  threshold?: number | number[]

  /**
   * Margin around root element for early/late triggering
   * @default "0px 0px -10% 0px"
   */
  rootMargin?: string

  /**
   * Root element for intersection observation
   * @default null (viewport)
   */
  root?: Element | null

  /**
   * Callback fired when element enters viewport
   */
  onEnter?: (element: Element, entry: IntersectionObserverEntry) => void

  /**
   * Callback fired when element exits viewport
   */
  onExit?: (element: Element, entry: IntersectionObserverEntry) => void

  /**
   * Enable/disable lazy image loading
   * @default true
   */
  enableLazyLoad?: boolean

  /**
   * Enable/disable animation classes
   * @default true
   */
  enableAnimation?: boolean
}
```

**Validation Rules**:
- `threshold`: Must be between 0.0 and 1.0 (inclusive), or array of such values
- `rootMargin`: Must be valid CSS margin string (e.g., "0px 0px -10% 0px")
- `root`: Must be a valid DOM Element or null
- Callbacks must not throw uncaught errors

**Default Values**:
- `threshold: 0.15`
- `rootMargin: "0px 0px -10% 0px"`
- `root: null` (viewport)
- `enableLazyLoad: true`
- `enableAnimation: true`

---

### 2. Hook Return Value

**Interface**: `UseScrollAnimationReturn`

**Purpose**: Return value from `useScrollAnimation` hook

```typescript
interface UseScrollAnimationReturn {
  /**
   * Ref callback to attach to observable elements
   */
  observeRef: (element: Element | null) => void

  /**
   * Manually trigger observation of an element
   */
  observe: (element: Element) => void

  /**
   * Manually stop observing an element
   */
  unobserve: (element: Element) => void

  /**
   * Disconnect all observations
   */
  disconnect: () => void

  /**
   * Check if an element is currently being observed
   */
  isObserving: (element: Element) => boolean
}
```

**Usage Pattern**:
```typescript
const { observeRef, disconnect } = useScrollAnimation({
  threshold: 0.15,
  onEnter: (el) => console.log('Element entered:', el)
})

// Attach via ref
<div ref={observeRef} className="js-observe">...</div>

// Manual cleanup (optional - auto cleanup on unmount)
useEffect(() => {
  return () => disconnect()
}, [disconnect])
```

---

### 3. Element State

**Interface**: `AnimationState` (internal)

**Purpose**: Track animation state for each observed element

```typescript
interface AnimationState {
  /**
   * DOM element being observed
   */
  element: Element

  /**
   * Current visibility state
   */
  isVisible: boolean

  /**
   * Whether image has been loaded (if element contains lazy image)
   */
  imageLoaded: boolean

  /**
   * Stagger delay extracted from data-delay attribute
   */
  staggerDelay: number

  /**
   * IntersectionObserver entry for this element
   */
  entry: IntersectionObserverEntry | null
}
```

**State Transitions**:
- Initial: `isVisible: false, imageLoaded: false`
- On enter: `isVisible: true`, trigger image load if needed
- On exit: `isVisible: false`
- Image loaded: `imageLoaded: true` (permanent)

**State Management**:
- Stored in WeakMap for automatic garbage collection
- No manual cleanup required when elements removed from DOM

---

### 4. Lazy Image Configuration

**Interface**: `LazyImageConfig` (internal)

**Purpose**: Configuration for lazy image loading behavior

```typescript
interface LazyImageConfig {
  /**
   * Attribute name for image source
   * @default "data-src"
   */
  sourceAttribute: string

  /**
   * Attribute name to mark loaded state
   * @default "data-loaded"
   */
  loadedAttribute: string

  /**
   * CSS selector for lazy images within observed element
   * @default ".lazy, img[data-src]"
   */
  imageSelector: string

  /**
   * Whether to use native loading="lazy" as fallback
   * @default true
   */
  useNativeLazy: boolean
}
```

**Default Configuration**:
```typescript
const DEFAULT_LAZY_CONFIG: LazyImageConfig = {
  sourceAttribute: 'data-src',
  loadedAttribute: 'data-loaded',
  imageSelector: '.lazy, img[data-src]',
  useNativeLazy: true
}
```

---

### 5. Animation Timing

**Interface**: `AnimationTimingConfig` (internal)

**Purpose**: CSS animation timing configuration

```typescript
interface AnimationTimingConfig {
  /**
   * Animation duration in milliseconds
   * @default 380
   */
  duration: number

  /**
   * CSS cubic-bezier easing function
   * @default "cubic-bezier(0.22, 1, 0.36, 1)"
   */
  easing: string

  /**
   * Base stagger delay in milliseconds
   * @default 0
   */
  baseStagger: number

  /**
   * Maximum stagger delay to prevent excessively long cascades
   * @default 1000
   */
  maxStagger: number

  /**
   * Initial transform offset
   * @default "translateY(12px) scale(0.98)"
   */
  initialTransform: string

  /**
   * Initial opacity
   * @default 0
   */
  initialOpacity: number
}
```

**Default Configuration**:
```typescript
const DEFAULT_TIMING: AnimationTimingConfig = {
  duration: 380,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  baseStagger: 0,
  maxStagger: 1000,
  initialTransform: 'translateY(12px) scale(0.98)',
  initialOpacity: 0
}
```

---

## HTML Attributes

### Observable Element Attributes

**Element**: Any element to be observed for scroll animation

```html
<div
  class="js-observe"
  data-delay="80"
  role="listitem"
  aria-label="Card title"
>
  <!-- content -->
</div>
```

**Attributes**:
- `class="js-observe"`: Marker class for IntersectionObserver target
- `data-delay="80"`: Stagger delay in milliseconds (optional, default: 0)
- Standard accessibility attributes (`role`, `aria-label`, etc.)

---

### Lazy Image Attributes

**Element**: Image element with lazy loading

```html
<img
  class="lazy"
  data-src="/path/to/image.jpg"
  data-loaded="false"
  loading="lazy"
  width="400"
  height="300"
  alt="Descriptive text"
  decoding="async"
/>
```

**Attributes**:
- `class="lazy"`: Marker class for lazy images
- `data-src`: Actual image URL (loaded on intersection)
- `data-loaded`: Loading state ("true" after load, prevents reload)
- `loading="lazy"`: Native browser lazy loading (fallback)
- `width` & `height`: Required for layout stability (CLS prevention)
- `alt`: Required for accessibility
- `decoding="async"`: Improve initial page load performance

---

## CSS Custom Properties

### Animation Variables

**Element**: Observable elements with animation

```css
.js-observe {
  --stagger: 0ms; /* Set dynamically via JavaScript */
}
```

**Custom Properties**:
- `--stagger`: Transition delay in milliseconds (set from `data-delay` attribute)

**Usage**:
```javascript
element.style.setProperty('--stagger', `${element.dataset.delay || 0}ms`)
```

---

## State Management

### Element State Storage

**Storage**: WeakMap for automatic memory management

```typescript
// Internal storage (not exported)
const elementStates = new WeakMap<Element, AnimationState>()
```

**Operations**:
```typescript
// Set state
elementStates.set(element, {
  element,
  isVisible: false,
  imageLoaded: false,
  staggerDelay: 0,
  entry: null
})

// Get state
const state = elementStates.get(element)

// Delete state (automatic when element removed from DOM)
// No manual cleanup needed
```

---

## CSS Class States

### Animation States

**Classes**: State classes toggled by IntersectionObserver

```css
/* Initial state - applied via CSS */
.js-observe {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

/* Visible state - added by JavaScript */
.js-observe.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Hidden state - added by JavaScript */
.js-observe.is-hidden {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
```

**State Transitions**:
1. Initial: `.js-observe` only
2. Enter viewport: Add `.is-visible`, remove `.is-hidden`
3. Exit viewport: Add `.is-hidden`, remove `.is-visible`

---

## Validation Rules

### Input Validation

**Hook Options**:
- `threshold`: 0.0 ≤ value ≤ 1.0
- `rootMargin`: Valid CSS margin string (px, %, em units)
- `root`: Must be Element or null
- Callbacks: Must be functions (optional)

**HTML Attributes**:
- `data-delay`: Must be non-negative integer (milliseconds)
- `data-src`: Must be valid URL string
- `width`/`height`: Must be positive integers

**Runtime Checks**:
```typescript
function validateOptions(options: UseScrollAnimationOptions): void {
  if (options.threshold !== undefined) {
    const thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold]

    for (const t of thresholds) {
      if (t < 0 || t > 1) {
        throw new Error(`Invalid threshold: ${t}. Must be between 0 and 1.`)
      }
    }
  }

  if (options.root !== undefined && options.root !== null) {
    if (!(options.root instanceof Element)) {
      throw new Error('Invalid root: must be Element or null.')
    }
  }
}
```

---

## Performance Considerations

### Memory Management

**Strategy**: Use WeakMap for element state storage
- Automatic garbage collection when elements removed
- No memory leaks from orphaned references
- O(1) lookup performance

**Cleanup**:
- IntersectionObserver.disconnect() on component unmount
- WeakMap entries automatically freed
- No manual cleanup required

### Animation Performance

**Optimization Strategies**:
1. **GPU Acceleration**: Only animate opacity and transform
2. **Layer Promotion**: Use `will-change: opacity, transform` on observed elements
3. **Minimal Callbacks**: O(1) complexity in IntersectionObserver callback
4. **No Layout Queries**: Avoid getBoundingClientRect, offsetWidth in callbacks
5. **CSS-Driven**: Animations run on compositor thread

**Performance Targets**:
- Observer callback: <0.5ms per execution
- Animation frame time: <16.67ms (60fps)
- Total memory overhead: <100KB for 100 observed elements

---

## Type Exports

**Public API** (exported from `lib/hooks/useScrollAnimation.ts`):
```typescript
export type {
  UseScrollAnimationOptions,
  UseScrollAnimationReturn
}

export { useScrollAnimation }
```

**Internal Types** (not exported):
```typescript
// AnimationState, LazyImageConfig, AnimationTimingConfig
// Kept internal to allow implementation changes
```

---

## Browser API Integration

### IntersectionObserver Configuration

**Creation**:
```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Handle intersection
    })
  },
  {
    threshold: options.threshold ?? 0.15,
    rootMargin: options.rootMargin ?? '0px 0px -10% 0px',
    root: options.root ?? null
  }
)
```

**Lifecycle**:
- Created once per hook instance
- Observes multiple elements
- Disconnected on component unmount

---

## No Persistent Data

**Note**: This feature does not require:
- Database storage
- Server-side state
- localStorage/sessionStorage
- Cookies
- IndexedDB

All state is transient and exists only during component lifecycle. No data persists across page reloads or sessions.
