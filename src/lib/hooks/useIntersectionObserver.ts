/**
 * useIntersectionObserver Hook
 *
 * Optimized intersection observer hook for viewport-based operations.
 * Used for lazy loading, infinite scroll, and viewport-based animations.
 */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  enabled?: boolean;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverResult {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
  observer: IntersectionObserver | null;
}

export function useIntersectionObserver<T extends Element>(
  targetRef: React.RefObject<T>,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverResult {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    enabled = true,
    triggerOnce = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  const hasTriggered = useRef(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setEntry(entry);

      const isCurrentlyIntersecting = entry.isIntersecting;

      if (triggerOnce && hasTriggered.current) {
        return;
      }

      if (isCurrentlyIntersecting && triggerOnce) {
        hasTriggered.current = true;
      }

      setIsIntersecting(isCurrentlyIntersecting);
    },
    [triggerOnce]
  );

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !window.IntersectionObserver) {
      return;
    }

    const element = targetRef.current;
    if (!element) {
      return;
    }

    const observerInstance = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root,
    });

    setObserver(observerInstance);
    observerInstance.observe(element);

    return () => {
      observerInstance.disconnect();
      setObserver(null);
    };
  }, [targetRef, threshold, rootMargin, root, enabled, handleIntersection]);

  // Reset triggered state when target changes
  useEffect(() => {
    if (triggerOnce) {
      hasTriggered.current = false;
    }
  }, [targetRef.current, triggerOnce]);

  return {
    isIntersecting,
    entry,
    observer,
  };
}

// Specialized hook for lazy loading
export function useLazyLoad<T extends Element>(
  targetRef: React.RefObject<T>,
  options: Omit<UseIntersectionObserverOptions, 'triggerOnce'> = {}
) {
  return useIntersectionObserver(targetRef, {
    ...options,
    triggerOnce: true,
    rootMargin: options.rootMargin || '100px', // Start loading 100px before entering viewport
  });
}

// Specialized hook for infinite scroll
export function useInfiniteScroll<T extends Element>(
  targetRef: React.RefObject<T>,
  onIntersect: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const { isIntersecting } = useIntersectionObserver(targetRef, {
    ...options,
    rootMargin: options.rootMargin || '200px', // Trigger 200px before reaching the element
  });

  useEffect(() => {
    if (isIntersecting) {
      onIntersect();
    }
  }, [isIntersecting, onIntersect]);

  return { isIntersecting };
}

// Hook for viewport-based animations
export function useViewportAnimation<T extends Element>(
  targetRef: React.RefObject<T>,
  options: UseIntersectionObserverOptions = {}
) {
  const { isIntersecting } = useIntersectionObserver(targetRef, {
    threshold: 0.1,
    ...options,
    triggerOnce: true,
  });

  return {
    isVisible: isIntersecting,
    animationClass: isIntersecting ? 'animate-in' : 'animate-out',
  };
}