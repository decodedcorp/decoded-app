/**
 * Universal Prefetching System
 *
 * Intelligent prefetching for major application routes to eliminate page transition delays.
 * Uses React Query cache strategy and intersection observers for optimal performance.
 */

'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { cardsQueryKeys } from '@/domains/main/hooks/useCards';

// Route prefetching priorities
export const PREFETCH_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

type PrefetchPriority = typeof PREFETCH_PRIORITIES[keyof typeof PREFETCH_PRIORITIES];

interface PrefetchConfig {
  priority: PrefetchPriority;
  delay?: number;
  checkCache?: boolean;
}

interface UsePrefetchOptions {
  enabled?: boolean;
  delay?: number;
  onHover?: boolean;
  onVisible?: boolean;
  threshold?: number;
}

/**
 * Universal prefetching hook for application routes
 * Supports hover-based, visibility-based, and manual prefetching
 */
export function usePrefetch(options: UsePrefetchOptions = {}) {
  const {
    enabled = true,
    delay = 200,
    onHover = true,
    onVisible = false,
    threshold = 0.1,
  } = options;

  const router = useRouter();
  const queryClient = useQueryClient();
  const prefetchTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  // Clear timeout for a specific route
  const clearPrefetchTimeout = useCallback((route: string) => {
    const timeout = prefetchTimeouts.current.get(route);
    if (timeout) {
      clearTimeout(timeout);
      prefetchTimeouts.current.delete(route);
    }
  }, []);

  // Check if route data is already cached
  const isDataCached = useCallback((route: string): boolean => {
    try {
      if (route.startsWith('/channels/')) {
        const channelId = route.split('/channels/')[1]?.split('/')[0];
        if (channelId) {
          const queryKey = queryKeys.channels.detail(channelId);
          const cachedData = queryClient.getQueryData(queryKey);
          return !!cachedData;
        }
      }

      if (route === '/' || route.startsWith('/cards')) {
        const queryKey = cardsQueryKeys.list({});
        const cachedData = queryClient.getQueryData(queryKey);
        return !!cachedData;
      }

      if (route.startsWith('/search')) {
        // Search results are dynamic, don't cache check
        return false;
      }

      return false;
    } catch (error) {
      console.warn('Cache check failed for route:', route, error);
      return false;
    }
  }, [queryClient]);

  // Prefetch route with intelligent data loading
  const prefetchRoute = useCallback(async (
    route: string,
    config: PrefetchConfig = { priority: PREFETCH_PRIORITIES.MEDIUM }
  ) => {
    if (!enabled || prefetchedRoutes.current.has(route)) {
      return;
    }

    // Check cache if enabled
    if (config.checkCache && isDataCached(route)) {
      console.log('🎯 Prefetch skipped (cached):', route);
      return;
    }

    try {
      console.log('🚀 Prefetching route:', route, 'priority:', config.priority);

      // Prefetch the route
      await router.prefetch(route);

      // Prefetch associated data based on route type
      if (route.startsWith('/channels/')) {
        const channelId = route.split('/channels/')[1]?.split('/')[0];
        if (channelId) {
          const { ChannelsService } = await import('@/api/generated');
          const { refreshOpenAPIToken } = await import('@/api/hooks/useApi');

          // Prefetch channel data with retry logic
          try {
            await queryClient.prefetchQuery({
              queryKey: queryKeys.channels.detail(channelId),
              queryFn: async () => {
                refreshOpenAPIToken();
                return ChannelsService.getChannelChannelsChannelIdGet(channelId);
              },
              staleTime: 15 * 60 * 1000, // 15 minutes
              gcTime: 2 * 60 * 60 * 1000, // 2 hours
            });
            console.log('✅ Channel data prefetched:', channelId);
          } catch (error) {
            console.warn('Channel prefetch failed:', channelId, error);
          }
        }
      }

      // Prefetch cards data for home route
      if (route === '/' || route.startsWith('/cards')) {
        try {
          const { CardsProvider } = await import('@/domains/main/data/cardsProvider');

          await queryClient.prefetchQuery({
            queryKey: cardsQueryKeys.list({}),
            queryFn: () => CardsProvider.getCards({}),
            staleTime: 15 * 60 * 1000,
            gcTime: 2 * 60 * 60 * 1000,
          });
          console.log('✅ Cards data prefetched');
        } catch (error) {
          console.warn('Cards prefetch failed:', error);
        }
      }

      prefetchedRoutes.current.add(route);

    } catch (error) {
      console.warn('Route prefetch failed:', route, error);
    }
  }, [enabled, router, queryClient, isDataCached]);

  // Hover-based prefetching
  const createHoverHandlers = useCallback((route: string, config?: PrefetchConfig) => {
    if (!enabled || !onHover) {
      return {};
    }

    return {
      onMouseEnter: () => {
        clearPrefetchTimeout(route);
        const timeout = setTimeout(() => {
          prefetchRoute(route, {
            priority: PREFETCH_PRIORITIES.HIGH,
            checkCache: true,
            ...config
          });
        }, delay);
        prefetchTimeouts.current.set(route, timeout);
      },
      onMouseLeave: () => {
        clearPrefetchTimeout(route);
      },
    };
  }, [enabled, onHover, delay, clearPrefetchTimeout, prefetchRoute]);

  // Visibility-based prefetching using Intersection Observer
  const createVisibilityRef = useCallback((route: string, config?: PrefetchConfig) => {
    if (!enabled || !onVisible) {
      return null;
    }

    return (node: HTMLElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            prefetchRoute(route, {
              priority: PREFETCH_PRIORITIES.MEDIUM,
              checkCache: true,
              ...config,
            });
            observer.disconnect();
          }
        },
        { threshold }
      );

      observer.observe(node);

      return () => observer.disconnect();
    };
  }, [enabled, onVisible, threshold, prefetchRoute]);

  // Manual prefetching
  const prefetch = useCallback((route: string, config?: PrefetchConfig) => {
    return prefetchRoute(route, config);
  }, [prefetchRoute]);

  // Batch prefetch multiple routes
  const prefetchBatch = useCallback(async (
    routes: Array<{ route: string; config?: PrefetchConfig }>
  ) => {
    if (!enabled) return;

    console.log('🚀 Batch prefetching:', routes.length, 'routes');

    // Sort by priority (high first)
    const sortedRoutes = routes.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const aPriority = a.config?.priority || PREFETCH_PRIORITIES.MEDIUM;
      const bPriority = b.config?.priority || PREFETCH_PRIORITIES.MEDIUM;
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    });

    // Prefetch with delays to prevent network congestion
    for (let i = 0; i < sortedRoutes.length; i++) {
      const { route, config } = sortedRoutes[i];

      if (i > 0) {
        // Add increasing delays for subsequent requests
        await new Promise(resolve => setTimeout(resolve, 200 * i));
      }

      await prefetchRoute(route, config);
    }
  }, [enabled, prefetchRoute]);

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      prefetchTimeouts.current.forEach(timeout => clearTimeout(timeout));
      prefetchTimeouts.current.clear();
    };
  }, []);

  return {
    prefetch,
    prefetchBatch,
    createHoverHandlers,
    createVisibilityRef,
    isDataCached,
    clearPrefetchTimeout,
  };
}

/**
 * Background prefetching for critical application routes
 * Automatically prefetches high-traffic routes after initial page load
 */
export function useBackgroundPrefetch() {
  const { prefetchBatch } = usePrefetch();

  useEffect(() => {
    // Wait for initial page load to complete
    const timer = setTimeout(() => {
      const criticalRoutes = [
        { route: '/', config: { priority: PREFETCH_PRIORITIES.HIGH } },
        { route: '/search', config: { priority: PREFETCH_PRIORITIES.MEDIUM } },
        { route: '/channels', config: { priority: PREFETCH_PRIORITIES.MEDIUM } },
      ];

      prefetchBatch(criticalRoutes);
    }, 1000);

    return () => clearTimeout(timer);
  }, [prefetchBatch]);
}

/**
 * Smart navigation prefetching for sidebar and header links
 * Prefetches based on user interaction patterns
 */
export function useNavigationPrefetch() {
  const { createHoverHandlers, prefetch } = usePrefetch({
    delay: 150, // Faster for navigation elements
    onHover: true,
  });

  // Prefetch high-probability routes on user interaction
  const prefetchNavigation = useCallback(() => {
    const navigationRoutes = [
      { route: '/', config: { priority: PREFETCH_PRIORITIES.HIGH, checkCache: true } },
      { route: '/search', config: { priority: PREFETCH_PRIORITIES.MEDIUM } },
      { route: '/channels', config: { priority: PREFETCH_PRIORITIES.MEDIUM } },
      { route: '/bookmarks', config: { priority: PREFETCH_PRIORITIES.LOW } },
    ];

    navigationRoutes.forEach(({ route, config }) => {
      prefetch(route, config);
    });
  }, [prefetch]);

  return {
    createHoverHandlers,
    prefetchNavigation,
  };
}