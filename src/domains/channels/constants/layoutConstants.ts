/**
 * Layout constants for channel page
 * Following design system tokens and spacing guidelines
 */

export const LAYOUT_CONSTANTS = {
  // Container spacing
  container: {
    padding: {
      mobile: 'px-2',
      tablet: 'md:px-4',
      desktop: 'lg:px-6',
    },
    verticalPadding: 'py-6',
  },

  // Animation settings
  animation: {
    duration: 700,
    easing: 'ease-in-out',
  },

  // Spacing tokens
  spacing: {
    spacer: 'h-8',
    sectionGap: 'gap-4',
  },

  // Responsive breakpoints
  breakpoints: {
    mobile: 'sm',
    tablet: 'md',
    desktop: 'lg',
  },
} as const;

export const PAGE_LAYOUT_CLASSES = {
  container: `min-h-screen w-full ${LAYOUT_CONSTANTS.container.padding.mobile} ${LAYOUT_CONSTANTS.container.padding.tablet} ${LAYOUT_CONSTANTS.container.verticalPadding}`,
} as const;
