# Design System v3 Migration Guide

🎯 **Goal**: Replace hardcoded `#EAFD66` with role-based design tokens for better maintainability and theme support.

## 🔍 Step 1: Search & Identify

### Find Hardcoded Colors
```bash
# Main search command
rg -n "(#EAFD66|bg-\[#EAFD66\]|text-\[#EAFD66\]|border-\[#EAFD66\])" packages src

# Alternative patterns
rg -n "EAFD66" packages src
rg -n "bg-\[#" packages src --type tsx
rg -n "text-\[#" packages src --type tsx
```

### Search Results Pattern
```
packages/ui/src/components/Button/Button.tsx:15:          'bg-gray-900 text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black'
src/shared/components/Header.tsx:25:          className="text-2xl font-bold text-[#EAFD66]"
```

## 🔄 Step 2: Replacement Rules

### Background Colors
```css
/* OLD */
bg-[#EAFD66]
bg-[#EAFD66]/90

/* NEW */
bg-primary
bg-primary/90

/* With text considerations */
bg-[#EAFD66] text-black → bg-primary text-primary-on
```

### Text Colors
```css
/* OLD */
text-[#EAFD66]
text-[#d9ec55]  /* lighter variant */

/* NEW */
text-primary
text-primary-hover
```

### Border Colors
```css
/* OLD */
border-[#EAFD66]
border-[#EAFD66]/20

/* NEW */
border-primary-bd
border-primary/20
```

### Subtle Variations
```css
/* OLD */
bg-[#EAFD66]/10  /* subtle background */
bg-[#EAFD66]/20  /* active background */

/* NEW */
bg-primary-bg    /* use CSS variable for subtle backgrounds */
bg-primary/20    /* for hover states */
```

## 📝 Step 3: Component-by-Component Migration

### 1. Button Component (Priority 1)
**File**: `packages/ui/src/components/Button/Button.tsx`

```typescript
// BEFORE
primary: 'bg-gray-900 text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black'
accent: 'bg-[#EAFD66] text-black hover:bg-[#EAFD66]/90'
'accent-outline': 'border border-[#EAFD66] bg-transparent text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black'

// AFTER
primary: 'bg-surface text-primary hover:bg-primary hover:text-primary-on'
accent: 'bg-primary text-primary-on hover:bg-primary/90'
'accent-outline': 'border border-primary-bd bg-transparent text-primary hover:bg-primary hover:text-primary-on'
```

### 2. Header Component
**File**: `src/shared/components/Header.tsx`

```typescript
// BEFORE
className="text-2xl font-bold text-[#EAFD66] tracking-tight drop-shadow ml-2 lg:ml-0"

// AFTER
className="text-2xl font-bold text-primary tracking-tight drop-shadow ml-2 lg:ml-0"
```

### 3. Notification Components
**File**: `src/shared/components/NotificationButton.tsx`

```typescript
// BEFORE
text-[#EAFD66] hover:text-[#d9ec55]
bg-[#EAFD66]/10 hover:bg-[#EAFD66]/20
bg-[#EAFD66]

// AFTER
text-primary hover:text-primary-hover
bg-primary-bg hover:bg-primary/20
bg-primary
```

### 4. Search Components
**File**: `src/domains/search/components/SearchAutocomplete.tsx`

```typescript
// BEFORE
bg-[#EAFD66]
bg-[#EAFD66]/20 text-[#EAFD66]

// AFTER
bg-primary
bg-primary-bg text-primary
```

## 🧪 Step 4: Testing & Validation

### Visual Regression Check
```bash
# Take screenshots before migration
npm run storybook
# Capture Button, Badge, Header components in both themes

# After migration - compare
npm run storybook
# Verify visual consistency
```

### Contrast Validation
```bash
# Check accessibility compliance
# Primary text on dark background: #EAFD66 on #101010 = 8.9:1 ✅
# Primary text on primary background: #111111 on #EAFD66 = 12.6:1 ✅
```

### Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (latest) - color-mix() support
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)

## 🚨 Step 5: Common Pitfalls & Solutions

### Issue: Gradient Fill Animation
```css
/* PROBLEMATIC */
'50%': { fill: 'rgb(234 179 8)', stroke: 'rgb(234 179 8)' }

/* SOLUTION */
'50%': { fill: 'var(--color-primary)', stroke: 'var(--color-primary)' }
```

### Issue: Focus Ring Colors
```css
/* BEFORE */
focus:ring-[#EAFD66]/50

/* AFTER */
focus:ring-primary-focus/50
```

### Issue: Text Shadow Effects
```css
/* BEFORE */
'text-shadow': '0 0 5px #EAFD66, 0 0 10px #EAFD66'

/* AFTER */
'text-shadow': '0 0 5px var(--color-primary), 0 0 10px var(--color-primary)'
```

## 📋 Step 6: Quality Checklist

### Pre-Migration
- [ ] Take visual snapshots of key components
- [ ] Document current color usage patterns
- [ ] Test theme switching (if implemented)

### During Migration
- [ ] Replace colors systematically by component
- [ ] Test each component in isolation
- [ ] Verify contrast ratios remain compliant
- [ ] Check hover/focus states

### Post-Migration
- [ ] No hardcoded `#EAFD66` remains (`rg "EAFD66" src packages`)
- [ ] All components work in both light/dark themes
- [ ] FOUC testing on theme switch
- [ ] Performance impact assessment
- [ ] Visual regression testing passed

## 🎯 Priority Order

1. **Button Component** (highest usage)
2. **Header Component** (always visible)
3. **Notification Components** (user interaction)
4. **Search Components** (frequently used)
5. **Badge Components** (visual indicators)
6. **Modal Components** (complex interactions)
7. **Page-specific components** (bookmarks, etc.)

## 🔧 Useful Commands

### Batch Replace (VS Code)
```regex
# Find
text-\[#EAFD66\]

# Replace
text-primary
```

### Verification
```bash
# After replacement - should return no results
rg "EAFD66" src packages

# Check for remaining arbitrary values with brand color
rg "bg-\[#[A-F0-9]{6}\]" src packages
rg "text-\[#[A-F0-9]{6}\]" src packages
```

## 📱 Mobile-Specific Considerations

### Touch Target Colors
```css
/* Ensure primary buttons remain accessible */
.touch-target {
  @apply bg-primary text-primary-on min-h-[44px] min-w-[44px];
}
```

### Safe Area Integration
```css
/* Keep existing safe area with new colors */
.mobile-safe-area {
  background: var(--color-background);
  color: var(--color-text);
}
```

---

**Next**: After completing the replacement, update the [PR Template](./pr-template.md) with this checklist.