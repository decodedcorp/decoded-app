import React from 'react';

import { getExpandAnimationClasses } from '../../utils/animationUtils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  isExpanded: boolean;
  className?: string;
}

/**
 * Reusable animated section component for expand/collapse transitions
 */
export function AnimatedSection({ children, isExpanded, className = '' }: AnimatedSectionProps) {
  return <div className={`${getExpandAnimationClasses(isExpanded)} ${className}`}>{children}</div>;
}
