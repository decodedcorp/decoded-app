# Design System v3 Migration PR Template

## Summary

Replace hardcoded `#EAFD66` with role-based design tokens for better maintainability and theme support.

**Files Modified**: [List modified files]
**Components Updated**: [List components]
**Hardcoded Colors Removed**: [Number]

## Design System v3 Compliance Checklist

### ✅ Token Replacement
- [ ] No hardcoded `#EAFD66` remains (`rg "EAFD66" src packages`)
- [ ] Used role-based tokens (`text-primary`, `bg-primary`, etc.)
- [ ] Applied proper contrast tokens (`text-primary-on` with `bg-primary`)
- [ ] Maintained semantic meaning in color usage

### ✅ Implementation Quality
- [ ] Follow replacement guide patterns exactly
- [ ] Used CSS variables where Tailwind classes unavailable
- [ ] Preserved existing hover/focus states
- [ ] Maintained accessibility contrast ratios

### ✅ Cross-Theme Compatibility
- [ ] Tested in both dark and light themes
- [ ] No hardcoded background/text color combinations
- [ ] Theme switching works without FOUC
- [ ] All variants (hover, active, disabled) work in both themes

## Testing Checklist

### ✅ Visual Regression
- [ ] Compare screenshots before/after in both themes
- [ ] Test all component states (default, hover, active, disabled)
- [ ] Verify mobile responsiveness maintained
- [ ] Check focus rings and accessibility indicators

### ✅ Browser Compatibility
- [ ] Chrome (latest) - color-mix() support
- [ ] Safari (latest) - iOS compatibility
- [ ] Firefox (latest) - fallback behavior
- [ ] Mobile Safari - viewport and safe area

### ✅ Accessibility Validation
- [ ] Contrast ratios ≥ 4.5:1 for text
- [ ] Contrast ratios ≥ 3:1 for UI elements
- [ ] Focus indicators clearly visible
- [ ] Color not sole means of conveying information

### ✅ Performance Impact
- [ ] No increase in bundle size
- [ ] Theme switching remains fast (<100ms)
- [ ] No layout shifts during theme change
- [ ] CSS specificity not increased unnecessarily

## Component-Specific Testing

### Button Component
- [ ] All variants work in both themes (`primary`, `accent`, `accent-outline`)
- [ ] Hover states maintain proper contrast
- [ ] Focus rings visible and accessible
- [ ] Disabled states appropriate for both themes

### Header Component
- [ ] Logo/title text readable in both themes
- [ ] Navigation items maintain contrast
- [ ] Background properly inherits theme

### Notification Components
- [ ] Alert states clearly distinguishable
- [ ] Background tints work in both themes
- [ ] Icons maintain proper contrast

### Search Components
- [ ] Input fields themed consistently
- [ ] Results highlighting works in both themes
- [ ] Loading states visible

## Quality Assurance

### ✅ Code Review Items
- [ ] No magic numbers or arbitrary color values
- [ ] Consistent token usage patterns
- [ ] Proper fallbacks for older browsers
- [ ] Clean, readable CSS/Tailwind classes

### ✅ Documentation
- [ ] Updated component documentation if needed
- [ ] Design system migration guide followed
- [ ] Breaking changes documented (if any)
- [ ] Future maintenance guidance included

## Risk Assessment

**Risk Level**: Low ✅
**Rollback Plan**: Revert token imports, restore hardcoded values
**Monitoring**: Watch for contrast/accessibility reports

## Definition of Done

- ✅ All hardcoded `#EAFD66` values replaced with semantic tokens
- ✅ No visual regressions in either theme
- ✅ All accessibility standards maintained
- ✅ Performance impact neutral or positive
- ✅ Cross-browser compatibility verified
- ✅ Component library stays consistent

---

**Migration Guide**: See `/docs/design-system-migration-guide.md`
**Design System**: Design System v3 with role-based tokens
**Next Steps**: Continue systematic replacement by component priority