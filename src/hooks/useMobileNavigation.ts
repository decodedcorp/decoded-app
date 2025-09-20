// Hook for mobile navigation state management
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function useMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close navigation when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when nav is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

/**
 * Hook to detect mobile/tablet breakpoints using container queries
 */
export function useLayoutBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Initial check
    updateBreakpoint();

    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    showLeftSidebar: breakpoint !== 'mobile',
    showRightSidebar: breakpoint === 'desktop',
  };
}

/**
 * Hook for managing mobile-specific scroll behavior
 */
export function useMobileScrollBehavior() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector('.content-wrapper');
    if (!scrollContainer) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollTop = scrollContainer.scrollTop;

          if (currentScrollTop > lastScrollTop) {
            setScrollDirection('down');
          } else if (currentScrollTop < lastScrollTop) {
            setScrollDirection('up');
          }

          setLastScrollTop(currentScrollTop);
          setIsScrolling(true);

          // Reset scrolling state after scroll ends
          clearTimeout(window.scrollTimer);
          window.scrollTimer = window.setTimeout(() => {
            setIsScrolling(false);
          }, 150);

          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(window.scrollTimer);
    };
  }, [lastScrollTop]);

  return {
    isScrolling,
    scrollDirection,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up',
  };
}

// Extend window interface for scroll timer
declare global {
  interface Window {
    scrollTimer: number;
  }
}