// Hook for accessing the new layout scroll container
'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to get the main layout scroll container (.content-wrapper)
 * Useful for IntersectionObserver, scroll position tracking, etc.
 */
export function useLayoutScrollContainer() {
  const [scrollContainer, setScrollContainer] = useState<Element | null>(null);

  useEffect(() => {
    // Find the content wrapper element
    const container = document.querySelector('.content-wrapper');
    setScrollContainer(container);

    // Optional: Listen for layout changes
    const observer = new MutationObserver(() => {
      const newContainer = document.querySelector('.content-wrapper');
      if (newContainer !== container) {
        setScrollContainer(newContainer);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return scrollContainer;
}

/**
 * Hook to track scroll position of the layout container
 */
export function useLayoutScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const scrollContainer = useLayoutScrollContainer();

  const updateScrollPosition = useCallback(() => {
    if (scrollContainer) {
      setScrollTop(scrollContainer.scrollTop);
      setScrollHeight(scrollContainer.scrollHeight);
      setClientHeight(scrollContainer.clientHeight);
    }
  }, [scrollContainer]);

  useEffect(() => {
    if (!scrollContainer) return;

    const handleScroll = () => {
      updateScrollPosition();
    };

    // Initial position
    updateScrollPosition();

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainer, updateScrollPosition]);

  // Calculate scroll percentage
  const scrollPercentage = scrollHeight > clientHeight
    ? (scrollTop / (scrollHeight - clientHeight)) * 100
    : 0;

  return {
    scrollTop,
    scrollHeight,
    clientHeight,
    scrollPercentage,
    isAtTop: scrollTop === 0,
    isAtBottom: scrollTop + clientHeight >= scrollHeight - 1,
  };
}

/**
 * Hook for smooth scrolling within the layout container
 */
export function useLayoutScrollTo() {
  const scrollContainer = useLayoutScrollContainer();

  const scrollTo = useCallback((options: {
    top?: number;
    left?: number;
    behavior?: ScrollBehavior;
  }) => {
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: options.top ?? scrollContainer.scrollTop,
        left: options.left ?? scrollContainer.scrollLeft,
        behavior: options.behavior ?? 'smooth',
      });
    }
  }, [scrollContainer]);

  const scrollToTop = useCallback(() => {
    scrollTo({ top: 0 });
  }, [scrollTo]);

  const scrollToBottom = useCallback(() => {
    if (scrollContainer) {
      scrollTo({ top: scrollContainer.scrollHeight });
    }
  }, [scrollTo, scrollContainer]);

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
}

/**
 * Hook for observing element intersection within the layout container
 */
export function useLayoutIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: Omit<IntersectionObserverInit, 'root'>
) {
  const scrollContainer = useLayoutScrollContainer();

  useEffect(() => {
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(callback, {
      root: scrollContainer,
      ...options,
    });

    return () => {
      observer.disconnect();
    };
  }, [scrollContainer, callback, options]);

  return scrollContainer;
}