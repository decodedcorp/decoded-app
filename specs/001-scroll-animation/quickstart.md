# Quickstart Guide: Scroll Animation & Lazy Loading System

**Feature**: 001-scroll-animation
**Last Updated**: 2025-11-20

## Overview

This guide provides step-by-step instructions for implementing and using the scroll animation and lazy loading system in your Next.js application.

## Prerequisites

- Next.js 14.2.0+
- React 18.3.0+
- TypeScript 5.3.3+
- Tailwind CSS 3.4.1+
- Modern browser with IntersectionObserver support

## 5-Minute Quick Start

### Step 1: Install (No Dependencies Required)

This feature uses native browser APIs - no npm packages needed! Just create the hook file.

### Step 2: Create the Hook

Create `lib/hooks/useScrollAnimation.ts`:

```typescript
import { useEffect, useRef, useCallback } from 'react'

export interface UseScrollAnimationOptions {
  threshold?: number | number[]
  rootMargin?: string
  onEnter?: (element: Element) => void
  onExit?: (element: Element) => void
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -10% 0px',
    onEnter,
    onExit
  } = options

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target

          // Set stagger delay from data attribute
          const delay = element.getAttribute('data-delay') || '0'
          element.style.setProperty('--stagger', `${delay}ms`)

          if (entry.isIntersecting) {
            // Handle image lazy loading
            const img = element.querySelector('img[data-src]')
            if (img && !img.getAttribute('data-loaded')) {
              const src = img.getAttribute('data-src')
              if (src) {
                img.setAttribute('src', src)
                img.setAttribute('data-loaded', 'true')
              }
            }

            // Toggle animation classes
            element.classList.add('is-visible')
            element.classList.remove('is-hidden')
            onEnter?.(element)
          } else {
            element.classList.add('is-hidden')
            element.classList.remove('is-visible')
            onExit?.(element)
          }
        })
      },
      { threshold, rootMargin }
    )

    return () => {
      observerRef.current?.disconnect()
    }
  }, [threshold, rootMargin, onEnter, onExit])

  const observeRef = useCallback((element: Element | null) => {
    if (element) {
      observerRef.current?.observe(element)
    }
  }, [])

  return { observeRef }
}
```

### Step 3: Add CSS Classes

Add to your global CSS or Tailwind config:

```css
/* Initial state */
.js-observe {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  transition: opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--stagger, 0ms);
  will-change: opacity, transform;
}

/* Visible state */
.js-observe.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Hidden state */
.js-observe.is-hidden {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
```

### Step 4: Use in Your Component

```tsx
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation'

export default function MyPage() {
  const { observeRef } = useScrollAnimation()

  return (
    <div>
      <h1>My Content</h1>

      {/* Animated card with stagger */}
      <div
        ref={observeRef}
        className="js-observe"
        data-delay="0"
      >
        <h2>Card 1</h2>
        <p>This card will fade in when scrolled into view</p>
      </div>

      <div
        ref={observeRef}
        className="js-observe"
        data-delay="80"
      >
        <h2>Card 2</h2>
        <p>This card will fade in 80ms after Card 1</p>
      </div>

      {/* Card with lazy-loaded image */}
      <div
        ref={observeRef}
        className="js-observe"
        data-delay="160"
      >
        <img
          data-src="/images/photo.jpg"
          loading="lazy"
          width="400"
          height="300"
          alt="Descriptive text"
          className="w-full h-auto"
        />
      </div>
    </div>
  )
}
```

### Step 5: Test It!

```bash
yarn dev
```

Open your browser and scroll down - watch the cards animate in! 🎉

---

## Common Use Cases

### Basic Card Animation

```tsx
function AnimatedCard({ title, children, delay = 0 }) {
  const { observeRef } = useScrollAnimation()

  return (
    <div
      ref={observeRef}
      className="js-observe rounded-lg shadow-lg p-6"
      data-delay={delay}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      {children}
    </div>
  )
}
```

### Grid of Cards with Stagger

```tsx
function CardGrid({ items }) {
  const { observeRef } = useScrollAnimation()

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={observeRef}
          className="js-observe"
          data-delay={index * 40} // 40ms stagger per card
        >
          <img
            data-src={item.imageUrl}
            loading="lazy"
            width="300"
            height="200"
            alt={item.title}
          />
          <h3>{item.title}</h3>
        </div>
      ))}
    </div>
  )
}
```

### With Callbacks

```tsx
function TrackedAnimation() {
  const { observeRef } = useScrollAnimation({
    onEnter: (el) => {
      console.log('Element entered:', el)
      // Track analytics
    },
    onExit: (el) => {
      console.log('Element exited:', el)
    }
  })

  return (
    <div ref={observeRef} className="js-observe">
      Content with tracking
    </div>
  )
}
```

### Custom Threshold

```tsx
function EarlyAnimation() {
  const { observeRef } = useScrollAnimation({
    threshold: 0.25, // Trigger at 25% visibility
    rootMargin: '0px 0px -20% 0px' // Earlier trigger
  })

  return (
    <div ref={observeRef} className="js-observe">
      Animates earlier
    </div>
  )
}
```

---

## Tailwind Integration

### Option 1: Global CSS

Add the CSS classes to `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Scroll animation classes */
.js-observe {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  transition: opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--stagger, 0ms);
  will-change: opacity, transform;
}

.js-observe.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.js-observe.is-hidden {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
```

### Option 2: Tailwind Utilities (Future Enhancement)

Create custom utilities in `tailwind.config.ts`:

```typescript
// Future enhancement - requires Tailwind plugin
export default {
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.animate-scroll': {
          opacity: '0',
          transform: 'translateY(12px) scale(0.98)',
          transition: 'opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1), transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
          transitionDelay: 'var(--stagger, 0ms)',
          willChange: 'opacity, transform'
        }
      })
    }
  ]
}
```

---

## Performance Tips

### ✅ Do

- **Set image dimensions**: Always specify `width` and `height` to prevent CLS
- **Use above-the-fold optimization**: Add `loading="eager"` to hero images
- **Limit stagger**: Keep total cascade time under 1 second
- **Test on mobile**: Verify 60fps on mid-range devices

```tsx
// Good - dimensions specified
<img
  data-src="/image.jpg"
  loading="lazy"
  width="400"
  height="300"
  alt="Description"
/>

// Good - hero image optimized
<img
  src="/hero.jpg"
  loading="eager"
  fetchpriority="high"
  width="1200"
  height="600"
  alt="Hero image"
/>
```

### ❌ Don't

- **Don't animate layout properties**: Only use opacity and transform
- **Don't query DOM in callbacks**: Keep observer callback O(1)
- **Don't overuse will-change**: Only on `.js-observe` elements
- **Don't exceed 1s total stagger**: Prevents perceived slowness

```tsx
// Bad - will cause layout thrashing
<div className="animate-width"> ❌

// Bad - too much stagger
data-delay="2000" ❌

// Good - GPU-accelerated only
<div className="js-observe"> ✅
```

---

## Troubleshooting

### Animations Not Working

**Problem**: Cards aren't animating
**Solution**: Check CSS classes are imported in global CSS

```tsx
// Ensure in app/layout.tsx or app/globals.css
import './globals.css'
```

### Images Not Loading

**Problem**: Images remain with data-src
**Solution**: Verify image selector and attributes

```tsx
// Correct structure
<img
  data-src="/path.jpg"  // ✅ data-src not src
  loading="lazy"         // ✅ fallback
  className="lazy"       // ✅ optional but recommended
/>
```

### Performance Issues

**Problem**: Scroll feels janky
**Solution**: Check for non-GPU properties

```bash
# Open Chrome DevTools > Performance
# Record scroll session
# Look for "Recalculate Style" or "Layout" in timeline
# Should see only "Composite Layers"
```

### TypeScript Errors

**Problem**: Type errors with useScrollAnimation
**Solution**: Ensure types are exported

```typescript
// In lib/hooks/useScrollAnimation.ts
export interface UseScrollAnimationOptions { ... }
export function useScrollAnimation(...) { ... }
```

---

## Testing

### Manual Testing Checklist

- [ ] Cards animate in when scrolled into view
- [ ] Stagger effect visible on multiple cards
- [ ] Images load only when near viewport
- [ ] No layout shift when images load
- [ ] Smooth 60fps animation
- [ ] Works on mobile devices
- [ ] Animations replay on scroll up then down
- [ ] No JavaScript errors in console

### Playwright E2E Test (Coming Soon)

```typescript
// __tests__/e2e/scroll-animation.spec.ts
import { test, expect } from '@playwright/test'

test('cards animate on scroll', async ({ page }) => {
  await page.goto('/')

  // Scroll to trigger animation
  await page.evaluate(() => window.scrollBy(0, 500))

  // Wait for animation
  await page.waitForTimeout(500)

  // Check class was added
  const card = page.locator('.js-observe').first()
  await expect(card).toHaveClass(/is-visible/)
})
```

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 51+ | ✅ Full |
| Firefox | 55+ | ✅ Full |
| Safari | 12.1+ | ✅ Full |
| Edge | 15+ | ✅ Full |
| IE 11 | - | ⚠️ Graceful degradation (no animations, native lazy loading only) |

**Graceful Degradation**: On older browsers without IntersectionObserver:
- Images use native `loading="lazy"` (if supported)
- Content visible immediately (no animations)
- No JavaScript errors

---

## Next Steps

- [ ] Implement the hook in `lib/hooks/useScrollAnimation.ts`
- [ ] Add CSS classes to `app/globals.css`
- [ ] Create example page demonstrating the feature
- [ ] Write Playwright E2E tests
- [ ] Performance profiling with Chrome DevTools
- [ ] Cross-browser testing
- [ ] User testing with 3+ users

---

## Resources

- [IntersectionObserver MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Research Document](./research.md) - Full technical research and decisions
- [Data Model](./data-model.md) - TypeScript interfaces and type definitions

---

## Support

For issues or questions:
1. Check [research.md](./research.md) for technical details
2. Review [data-model.md](./data-model.md) for type definitions
3. Open issue in project repository
4. Tag with `001-scroll-animation` label
