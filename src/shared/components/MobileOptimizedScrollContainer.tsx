import React, { useEffect, useRef } from 'react';
import { useMobileOptimization } from '@/lib/hooks/useMobileOptimization';

interface MobileOptimizedScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  enableScrollSnap?: boolean;
  enablePassiveScroll?: boolean;
  onScroll?: (event: Event) => void;
  scrollSnapType?: 'none' | 'x' | 'y' | 'both';
  scrollSnapAlign?: 'start' | 'end' | 'center';
}

/**
 * Mobile-optimized scroll container with passive scroll listeners and scroll snap support
 */
export const MobileOptimizedScrollContainer: React.FC<MobileOptimizedScrollContainerProps> = ({
  children,
  className = '',
  enableScrollSnap = false,
  enablePassiveScroll = true,
  onScroll,
  scrollSnapType = 'y',
  scrollSnapAlign = 'start',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobileOptimization();

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !onScroll) return;

    const handleScroll = (event: Event) => {
      onScroll(event);
    };

    // Use passive listeners for better performance on mobile
    const options = enablePassiveScroll ? { passive: true } : false;
    scrollElement.addEventListener('scroll', handleScroll, options);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll, enablePassiveScroll]);

  const scrollSnapClass = enableScrollSnap
    ? `scroll-snap-${scrollSnapType} scroll-snap-${scrollSnapAlign}`
    : '';

  return (
    <div
      ref={scrollRef}
      className={`
        overflow-auto
        ${isMobile ? 'mobile-scroll-smooth' : 'scroll-smooth'}
        ${scrollSnapClass}
        ${className}
      `}
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        ...(enableScrollSnap && {
          scrollSnapType:
            scrollSnapType === 'both' ? 'both mandatory' : `${scrollSnapType} mandatory`,
        }),
      }}
    >
      {children}
    </div>
  );
};
