import { LAYOUT_CONSTANTS } from '../constants/layoutConstants';

/**
 * Animation utilities for channel page transitions
 */

export const ANIMATION_DURATION = LAYOUT_CONSTANTS.animation.duration;
export const ANIMATION_EASING = LAYOUT_CONSTANTS.animation.easing;

export const expandAnimationClasses = {
  expanded: 'opacity-0 scale-95 pointer-events-none max-h-0 overflow-hidden',
  collapsed: 'opacity-100 scale-100 max-h-none',
  transition: `transition-all duration-${ANIMATION_DURATION} ${ANIMATION_EASING}`,
} as const;

export const spacerAnimationClasses = {
  expanded: `${LAYOUT_CONSTANTS.spacing.spacer} opacity-0 scale-95 pointer-events-none`,
  collapsed: `${LAYOUT_CONSTANTS.spacing.spacer} opacity-100 scale-100`,
  transition: `transition-all duration-${ANIMATION_DURATION} ${ANIMATION_EASING}`,
} as const;

/**
 * Get animation classes based on expanded state
 */
export function getExpandAnimationClasses(isExpanded: boolean) {
  return `${expandAnimationClasses.transition} ${
    isExpanded ? expandAnimationClasses.expanded : expandAnimationClasses.collapsed
  }`;
}

/**
 * Get spacer animation classes based on expanded state
 */
export function getSpacerAnimationClasses(isExpanded: boolean) {
  return `${spacerAnimationClasses.transition} ${
    isExpanded ? spacerAnimationClasses.expanded : spacerAnimationClasses.collapsed
  }`;
}
