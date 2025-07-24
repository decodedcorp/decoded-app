import React from 'react';
import { getSpacerAnimationClasses } from '../../utils/animationUtils';
import { LAYOUT_CONSTANTS } from '../../constants/layoutConstants';

interface AnimatedSpacerProps {
  isExpanded: boolean;
  height?: string;
}

/**
 * Animated spacer component for smooth transitions
 */
export function AnimatedSpacer({
  isExpanded,
  height = LAYOUT_CONSTANTS.spacing.spacer,
}: AnimatedSpacerProps) {
  return (
    <div className={`${getSpacerAnimationClasses(isExpanded)} ${height}`}>
      <div className={height} />
    </div>
  );
}
