# 📱 Mobile Optimization Guide

This guide provides comprehensive mobile optimization practices for the Decoded App project, ensuring excellent user experience across all mobile devices.

## 🎯 Core Principles

- **Performance First**: Meet Core Web Vitals targets (LCP ≤ 2.5s, INP ≤ 200ms, CLS < 0.1)
- **Touch-Friendly**: Minimum 44px touch targets with adequate spacing
- **Accessible**: WCAG AA compliance with proper contrast ratios
- **Responsive**: Dynamic viewport units and container queries
- **Native-Like**: Smooth gestures and system integration

## 🛠️ Implementation

### 1. Viewport Configuration

```tsx
// src/app/layout.tsx
export const metadata: Metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover', // iOS notch support
  },
  themeColor: '#000000',
  colorScheme: 'light dark',
};
```

### 2. Dynamic Viewport Units

```css
/* Use dynamic viewport units for mobile */
.mobile-fullscreen {
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height */
}
```

### 3. Safe Area Support

```css
/* iOS notch and Android edge handling */
.mobile-safe-area {
  padding-left: max(env(safe-area-inset-left), 16px);
  padding-right: max(env(safe-area-inset-right), 16px);
  padding-top: max(env(safe-area-inset-top), 16px);
  padding-bottom: max(env(safe-area-inset-bottom), 16px);
}
```

### 4. Touch Target Optimization

```tsx
// Use MobileTouchTarget component
<MobileTouchTarget
  size="md" // 44px minimum
  variant="button"
  onClick={handleClick}
>
  Click me
</MobileTouchTarget>
```

### 5. Image Optimization

```tsx
// Use MobileOptimizedImage component
<MobileOptimizedImage
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority={true} // For LCP images
  sizes="(max-width: 430px) 100vw, 50vw"
/>
```

### 6. Form Optimization

```tsx
// Use MobileOptimizedInput component
<MobileOptimizedInput
  type="email"
  inputMode="email"
  enterKeyHint="next"
  autoComplete="email"
  label="Email address"
/>
```

### 7. Scroll Performance

```tsx
// Use MobileOptimizedScrollContainer
<MobileOptimizedScrollContainer
  enablePassiveScroll={true}
  enableScrollSnap={true}
  scrollSnapType="y"
  onScroll={handleScroll}
>
  {content}
</MobileOptimizedScrollContainer>
```

## 📊 Performance Targets

### Core Web Vitals (Mobile)

| Metric | Target  | Current | Status      |
| ------ | ------- | ------- | ----------- |
| LCP    | ≤ 2.5s  | 43.7s   | ❌ Critical |
| INP    | ≤ 200ms | -       | ⚠️ Monitor  |
| CLS    | < 0.1   | -       | ⚠️ Monitor  |
| FCP    | ≤ 1.8s  | 1.9s    | ⚠️ Close    |

### Touch Target Standards

| Platform   | Minimum Size | Recommended |
| ---------- | ------------ | ----------- |
| iOS        | 44pt         | 44pt        |
| Android    | 48dp         | 48dp        |
| Web (WCAG) | 24px         | 44px+       |

### Contrast Ratios

| Element Type  | Minimum Ratio | Target |
| ------------- | ------------- | ------ |
| Normal Text   | 4.5:1         | 7:1    |
| Large Text    | 3:1           | 4.5:1  |
| UI Components | 3:1           | 4.5:1  |

## 🔧 Available Components

### Hooks

- `useMobileOptimization()` - Device detection, network status, performance hints
- `useMobileViewport()` - Viewport height changes, address bar handling
- `useTouchGestures()` - Touch gesture handling, swipe detection

### Components

- `MobileOptimizedImage` - Responsive images with srcset, lazy loading
- `MobileOptimizedInput` - Form inputs with inputMode, enterKeyHint
- `MobileOptimizedScrollContainer` - Performance-optimized scrolling
- `MobileTouchTarget` - Touch-friendly interactive elements

### CSS Utilities

- `.mobile-fullscreen` - Dynamic viewport height
- `.mobile-safe-area` - Safe area insets
- `.mobile-touch-target` - Minimum touch target size
- `.mobile-text-base` - iOS zoom prevention
- `.mobile-scroll-smooth` - Smooth scrolling

## 📋 Checklist

Before deploying mobile features, verify:

### Viewport & Layout

- [ ] Viewport meta tag includes `viewport-fit=cover`
- [ ] Safe area insets are applied with `env(safe-area-inset-*)`
- [ ] Dynamic viewport units (`dvh`, `svh`, `lvh`) are used
- [ ] Container queries for responsive cards

### Touch & Interaction

- [ ] Touch targets are minimum 44px (iOS) or 48dp (Android)
- [ ] Adequate spacing between interactive elements
- [ ] Custom gestures don't conflict with system back gesture
- [ ] Touch feedback is provided for all interactions

### Images & Media

- [ ] Images have `width`, `height`, `srcset`, and `sizes` attributes
- [ ] LCP images use `fetchpriority="high"`
- [ ] Below-fold images use `loading="lazy"`
- [ ] Aspect ratios prevent CLS

### Forms & Input

- [ ] Forms use `inputmode`, `enterkeyhint`, and `autocomplete`
- [ ] Input font size is 16px to prevent iOS zoom
- [ ] Proper keyboard types for different input types

### Performance

- [ ] Scroll listeners use `{ passive: true }`
- [ ] Long lists use `content-visibility: auto`
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Core Web Vitals targets are met

### Accessibility

- [ ] Contrast ratios meet WCAG AA standards
- [ ] Screen reader support with proper ARIA labels
- [ ] Keyboard navigation works properly
- [ ] Focus indicators are visible

## 🚀 Best Practices

### 1. Progressive Enhancement

Start with basic functionality and enhance for mobile capabilities.

### 2. Network Awareness

Adapt UI based on connection speed and data usage.

### 3. Gesture Harmony

Work with system gestures, don't fight them.

### 4. Performance Budget

Set and maintain performance budgets for mobile.

### 5. Real Device Testing

Test on actual devices, not just browser dev tools.

## 🔍 Monitoring

### Tools

- Lighthouse (mobile audit)
- WebPageTest (mobile performance)
- Chrome DevTools (mobile simulation)
- Real device testing

### Metrics to Track

- Core Web Vitals
- Touch target compliance
- Accessibility scores
- User engagement metrics

## 📚 Resources

- [Web.dev Mobile UX](https://web.dev/mobile-ux/)
- [MDN Mobile Web Development](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Guidelines](https://material.io/design)

---

Follow this guide to ensure excellent mobile user experience across all devices and platforms.
