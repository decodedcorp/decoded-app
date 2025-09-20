'use client';

import { ReactNode } from 'react';

export interface FeedGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: string;
}

/**
 * FeedGrid - CSS Columns based masonry layout
 * Reddit-style: fixed column width, variable height
 * Performance optimized with no JavaScript calculations
 */
export function FeedGrid({
  children,
  className = '',
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
  gap = '1rem',
}: FeedGridProps) {
  const columnClasses = [
    columns.mobile && `columns-${columns.mobile}`,
    columns.tablet && `sm:columns-${columns.tablet}`,
    columns.desktop && `lg:columns-${columns.desktop}`,
    columns.wide && `2xl:columns-${columns.wide}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`${columnClasses} gap-4 ${className}`}
      style={
        {
          '--tile-gap': gap,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

/**
 * FeedGridItem - Wrapper for individual cards
 * Prevents column breaks and ensures proper spacing
 */
export function FeedGridItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mb-4 break-inside-avoid ${className}`}>{children}</div>;
}
