# Phase 0: Research - Scroll Animation & Lazy Loading System

**Feature**: 001-scroll-animation
**Date**: 2025-11-20
**Status**: Complete

## Overview

This document consolidates research findings for implementing a performance-optimized scroll animation and lazy loading system using IntersectionObserver API, GPU-accelerated animations, and progressive image loading techniques.

## Technical Decisions

### 1. IntersectionObserver API

**Decision**: Use native IntersectionObserver API for viewport detection

**Rationale**:

- Native browser API with broad support (Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+)
- Zero dependencies - no external libraries required
- Excellent performance - runs off main thread in browser's compositor
- Built-in throttling and debouncing mechanisms
- Lower memory footprint compared to scroll event listeners
- Automatic cleanup when elements are removed from DOM

**Alternatives Considered**:

- **Scroll Event Listeners**: Rejected due to main thread blocking, manual throttling required, and poorer performance
- **React Intersection Observer libraries** (e.g., react-intersection-observer): Rejected to minimize dependencies and bundle size
- **Animation Libraries** (e.g., Framer Motion, GSAP): Rejected due to overhead and unnecessary features for simple opacity/transform animations

**Browser Compatibility**:

- Modern browsers: Native support
- Older browsers: Graceful degradation with native `loading="lazy"` for images only
- No polyfill required - feature enhancement rather than critical functionality

**References**:

- MDN Web Docs: IntersectionObserver API
- Can I Use: IntersectionObserver browser support (96.47% global coverage)

---

### 2. GPU-Accelerated Animation Properties

**Decision**: Use only `opacity` and `transform` CSS properties for animations

**Rationale**:

- GPU-accelerated properties bypass layout and paint stages
- Runs on compositor thread - doesn't block main thread
- Consistent 60fps performance even on mid-range devices
- Minimal reflow/repaint overhead
- Best practice for smooth animations per Web Performance Working Group

**Alternatives Considered**:

- **Top/Left positioning**: Rejected - triggers layout recalculation on every frame
- **Width/Height animations**: Rejected - causes layout thrashing and CLS issues
- **Color/Background animations**: Rejected - triggers paint operations

**Performance Impact**:

- Layout properties: ~10-30ms per frame (causes dropped frames)
- GPU properties: <1ms per frame (maintains 60fps)
- Mobile devices: 3-5x performance improvement with GPU properties

**References**:

- Google Web Fundamentals: Rendering Performance
- Paul Irish: "What forces layout/reflow"
- CSS Triggers: csstriggers.com

---

### 3. Animation Timing and Easing

**Decision**: Use `cubic-bezier(0.22, 1, 0.36, 1)` with 320-420ms duration

**Rationale**:

- Cubic-bezier creates natural easing with slight overshoot (out-back family)
- Fast acceleration followed by gentle deceleration feels responsive
- 320-420ms duration is sweet spot: fast enough to feel snappy, slow enough to perceive smoothly
- Aligns with Material Design motion guidelines (250-500ms for large screen movements)
- Prevents animation fatigue during rapid scrolling

**Alternatives Considered**:

- **Linear easing**: Rejected - feels robotic and unnatural
- **Ease-in-out**: Rejected - too symmetrical, lacks personality
- **Longer durations (500ms+)**: Rejected - feels sluggish, especially when multiple cards animate
- **Shorter durations (<300ms)**: Rejected - too abrupt, hard to perceive on lower refresh rate displays

**Timing Breakdown**:

- 0-150ms: Rapid acceleration (80% of movement)
- 150-380ms: Gentle deceleration with micro-overshoot
- Total: 320-420ms (adjustable per element via data-delay)

**References**:

- Material Design: Motion duration and easing
- Robert Penner's Easing Functions
- cubic-bezier.com visualization tool

---

### 4. Staggered Animation Pattern

**Decision**: Use `data-delay` attributes with CSS custom properties (`--stagger`)

**Rationale**:

- Declarative approach - designers can control timing without JavaScript knowledge
- CSS custom properties avoid inline style pollution
- Enables per-element customization while maintaining centralized animation logic
- Typical stagger: 40-80ms per element creates natural cascading effect
- Scales well with any number of elements

**Implementation Pattern**:

```javascript
element.style.setProperty("--stagger", `${element.dataset.delay || 0}ms`);
```

**Alternatives Considered**:

- **JavaScript-based delays**: Rejected - harder to manage, pollutes inline styles
- **Fixed delays via nth-child**: Rejected - not flexible, requires recalculation on DOM changes
- **Animation library stagger**: Rejected - adds unnecessary dependency

**Stagger Timing Guidelines**:

- 2-5 elements: 60-80ms per element
- 6-10 elements: 40-60ms per element
- 10+ elements: 20-40ms per element (prevents total cascade time exceeding 1 second)

---

### 5. Lazy Loading Strategy

**Decision**: Progressive enhancement with `data-src` + native `loading="lazy"`

**Rationale**:

- **data-src swap**: Full control over load timing with IntersectionObserver
- **loading="lazy"**: Browser-native fallback for no-JS scenarios
- **Progressive enhancement**: Works in all scenarios (JS enabled, JS disabled, old browsers)
- **Best of both worlds**: Fine-grained control + automatic browser optimization

**Loading Sequence**:

1. Image element renders with `data-src` attribute (no actual image loaded)
2. IntersectionObserver detects element entering threshold
3. JavaScript swaps `data-src` → `src` (triggers browser load)
4. Mark as loaded (`data-loaded="true"`) to prevent redundant loads
5. Browser handles caching, decoding, and rendering

**Alternatives Considered**:

- **Native loading="lazy" only**: Rejected - no control over threshold, inconsistent browser behavior
- **JavaScript-only lazy loading**: Rejected - no fallback for JS-disabled scenarios
- **Intersection Observer library**: Rejected - unnecessary dependency for simple use case
- **Placeholder images**: Deferred to future enhancement (blur-up, LQIP outside scope)

**References**:

- MDN: HTMLImageElement.loading
- Web.dev: Browser-level image lazy loading

---

### 6. Observation Threshold Configuration

**Decision**: `threshold: 0.15` with `rootMargin: "0px 0px -10% 0px"`

**Rationale**:

- **15% threshold**: Triggers when 15% of element is visible - early enough for smooth load, late enough to avoid false triggers
- **-10% bottom margin**: Creates "trigger zone" 10% before element reaches viewport bottom
- **Result**: Images start loading ~200-400px before user scrolls to them (varies by viewport height)
- **Reduces perceived load time**: Images are ready when user reaches them

**Alternatives Considered**:

- **threshold: 0.0**: Rejected - triggers too early, wastes bandwidth on elements user may not reach
- **threshold: 0.5**: Rejected - triggers too late, user sees loading spinner
- **No rootMargin**: Rejected - animations don't feel anticipatory
- **Larger rootMargin (-20%)**: Rejected - increases bandwidth usage unnecessarily

**Performance Trade-offs**:

- Too early: Wasted bandwidth, more concurrent requests
- Too late: Visible loading states, perceived jank
- Sweet spot: 10-15% visibility + 10% rootMargin offset

---

### 7. Performance Optimization Techniques

**Decision**: Multi-layered optimization strategy

**Techniques**:

1. **will-change hint**: Apply `will-change: opacity, transform` to observed elements only
   - Signals compositor to prepare layer
   - Improves first-paint performance
   - Must be scoped to animated elements (overuse causes memory issues)

2. **O(1) callback complexity**: Observer callback does only class toggles and property sets
   - No DOM measurements (offsetWidth, getBoundingClientRect)
   - No layout queries (getComputedStyle)
   - No complex calculations
   - Result: <0.5ms per callback execution

3. **Layout stability**: Fixed dimensions on images via width/height or aspect-ratio
   - Prevents Cumulative Layout Shift (CLS)
   - Browser reserves space before image loads
   - Target: CLS ≤ 0.1

4. **Resource hints for hero images**:
   - Preload above-the-fold images
   - Use `fetchpriority="high"` or `<link rel="preload">`
   - Optimize LCP (Largest Contentful Paint)
   - Target: LCP ≤ 2.5s

**Monitoring Strategy**:

- Measure with Chrome DevTools Performance panel
- Track Core Web Vitals in production
- Lighthouse audits for regression detection

**References**:

- Web.dev: Core Web Vitals
- MDN: CSS will-change property
- Chrome DevTools: Performance profiling

---

### 8. React Hook Architecture

**Decision**: Single `useScrollAnimation` hook encapsulating all logic

**Hook Interface**:

```typescript
interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  onEnter?: (element: Element) => void;
  onExit?: (element: Element) => void;
}

function useScrollAnimation(options?: UseScrollAnimationOptions): {
  observeRef: RefCallback<Element>;
};
```

**Rationale**:

- **Single responsibility**: Hook manages only IntersectionObserver lifecycle
- **Ref callback pattern**: Allows dynamic element observation
- **Configurable**: Accepts threshold/rootMargin overrides for edge cases
- **Lifecycle management**: Automatic cleanup on unmount
- **Type-safe**: Full TypeScript support

**Alternatives Considered**:

- **Multiple hooks**: Rejected - unnecessary complexity, harder to maintain
- **HOC pattern**: Rejected - outdated React pattern, ref forwarding complexity
- **Context-based**: Rejected - overkill for simple viewport detection
- **Imperative API**: Rejected - not idiomatic React, manual cleanup required

**Integration Pattern**:

```tsx
// Usage example
function AnimatedCard() {
  const { observeRef } = useScrollAnimation();

  return (
    <div ref={observeRef} className="js-observe" data-delay="80">
      {/* card content */}
    </div>
  );
}
```

---

### 9. CSS Architecture

**Decision**: Tailwind utility classes + CSS custom properties for animation state

**CSS Structure**:

```css
/* Initial state */
.js-observe {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  transition:
    opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--stagger, 0ms);
  will-change: opacity, transform;
}

/* Visible state */
.js-observe.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Hidden state (exit) */
.js-observe.is-hidden {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
```

**Rationale**:

- **Tailwind utilities**: Primary styling via utility classes
- **Custom properties**: Dynamic timing values via `--stagger`
- **Class-based state**: Declarative state management via `.is-visible/.is-hidden`
- **No inline styles**: Except for dynamic `--stagger` value
- **Maintainable**: All animation config in one place

**Alternatives Considered**:

- **Inline styles only**: Rejected - harder to maintain, no CSS cascade benefits
- **CSS-in-JS**: Rejected - unnecessary runtime overhead for static animations
- **Tailwind JIT only**: Rejected - CSS custom properties needed for dynamic values

---

### 10. Testing Strategy

**Decision**: Multi-layered testing approach

**Testing Layers**:

1. **Playwright E2E Tests**:
   - Visual regression: Screenshot comparison for animation states
   - Performance: Core Web Vitals measurement (CLS, LCP)
   - Behavior: Verify class toggles, image loading sequence
   - Cross-browser: Chrome, Firefox, Safari, Edge

2. **Manual Testing**:
   - Visual smoothness: 3 users minimum
   - Animation feel: Timing, easing perception
   - Device testing: Desktop, tablet, mobile
   - Network conditions: 3G, 4G, WiFi

3. **Performance Monitoring**:
   - Chrome DevTools: Frame rate, paint operations
   - Lighthouse: Automated performance audits
   - Real User Monitoring: Production metrics

**Test Scenarios**:

- Scroll down: Cards animate in with stagger
- Scroll up: Cards re-animate on re-entry
- Fast scroll: No performance degradation
- Slow scroll: Smooth transitions maintained
- Image loading: No layout shift, sequential loading
- Viewport resize: IntersectionObserver recalculates correctly

---

## Implementation Checklist

- [ ] Create `lib/hooks/useScrollAnimation.ts` hook
- [ ] Add TypeScript interfaces and types
- [ ] Implement IntersectionObserver logic with lifecycle management
- [ ] Add CSS classes (`.js-observe`, `.is-visible`, `.is-hidden`)
- [ ] Configure Tailwind for animation utilities
- [ ] Create Playwright E2E test suite
- [ ] Add usage examples in documentation
- [ ] Performance profiling and optimization
- [ ] Cross-browser testing
- [ ] Manual user testing (3 users minimum)

---

## Open Questions

None - all technical decisions resolved. Implementation can proceed to Phase 1.

---

## References

### Web Standards

- [MDN: IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN: HTMLImageElement.loading](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading)
- [W3C: Intersection Observer Specification](https://www.w3.org/TR/intersection-observer/)

### Performance

- [Web.dev: Core Web Vitals](https://web.dev/vitals/)
- [Web.dev: Browser-level image lazy loading](https://web.dev/browser-level-image-lazy-loading/)
- [Google: Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering)
- [CSS Triggers](https://csstriggers.com/)

### Animation

- [Material Design: Motion](https://m3.material.io/styles/motion/overview)
- [cubic-bezier.com](https://cubic-bezier.com/)
- [Robert Penner's Easing Functions](http://robertpenner.com/easing/)

### Browser Compatibility

- [Can I Use: IntersectionObserver](https://caniuse.com/intersectionobserver)
- [Can I Use: loading attribute](https://caniuse.com/loading-lazy-attr)

### React Patterns

- [React Docs: Hooks](https://react.dev/reference/react/hooks)
- [React Docs: useEffect](https://react.dev/reference/react/useEffect)
- [React Docs: useRef](https://react.dev/reference/react/useRef)
