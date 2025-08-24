/**
 * Channel Highlights Hook - API Abstraction Layer
 *
 * This hook provides an abstraction layer for channel highlights.
 * Currently uses ContentItem conversion, but can be easily switched
 * to dedicated highlights API in the future.
 */

import { useMemo } from 'react';
import { useChannelContentsSinglePage } from './useChannelContents';
import { convertContentToHighlights } from '@/lib/utils/highlightConverters';
import {
  HighlightItem,
  HighlightConfig,
  DEFAULT_HIGHLIGHT_CONFIG,
} from '@/lib/types/highlightTypes';

// Feature flag for future API migration
const USE_HIGHLIGHTS_API = false;

interface UseChannelHighlightsOptions {
  enabled?: boolean;
  config?: Partial<HighlightConfig>;
}

interface UseChannelHighlightsReturn {
  highlights: HighlightItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  hasHighlights: boolean;
}

/**
 * Future: Dedicated highlights API hook
 * This will be implemented when the backend provides highlights endpoint
 */
function useChannelHighlightsAPI(channelId: string): UseChannelHighlightsReturn {
  // TODO: Implement when API is available
  // const { data, isLoading, error, refetch } = useQuery({
  //   queryKey: ['channel-highlights', channelId],
  //   queryFn: () => api.getChannelHighlights(channelId),
  //   enabled: !!channelId
  // });

  return {
    highlights: [],
    isLoading: false,
    error: null,
    refetch: () => {},
    hasHighlights: false,
  };
}

/**
 * Current: Convert ContentItems to highlights
 */
function useChannelHighlightsFromContent(
  channelId: string,
  options: UseChannelHighlightsOptions = {},
): UseChannelHighlightsReturn {
  const { enabled = true, config: configOverrides = {} } = options;

  const finalConfig: HighlightConfig = {
    ...DEFAULT_HIGHLIGHT_CONFIG,
    ...configOverrides,
  };

  // Get channel content data
  const {
    data: contentItems,
    isLoading,
    error,
    refetch,
  } = useChannelContentsSinglePage({
    channelId,
    limit: 25, // Get more items to have better highlight selection
    enabled: enabled && !!channelId,
    enableSmartPolling: false,
  });

  // Convert content to highlights
  const highlights = useMemo(() => {
    if (!contentItems?.length) return [];

    const converted = convertContentToHighlights(contentItems, finalConfig);

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[useChannelHighlights] Generated highlights:', {
        channelId,
        totalContent: contentItems.length,
        totalHighlights: converted.length,
        highlights: converted.map((h) => ({
          title: h.title,
          type: h.type,
          priority: h.priority,
          badge: h.badge,
        })),
      });
    }

    return converted;
  }, [contentItems, finalConfig, channelId]);

  return {
    highlights,
    isLoading,
    error,
    refetch,
    hasHighlights: highlights.length > 0,
  };
}

/**
 * Main hook - switches between content conversion and API based on feature flag
 */
export function useChannelHighlights(
  channelId: string,
  options: UseChannelHighlightsOptions = {},
): UseChannelHighlightsReturn {
  // Switch between implementations based on feature flag
  return useChannelHighlightsAPI(channelId);
}

/**
 * Helper hook for checking if channel has highlights without loading them
 */
export function useHasChannelHighlights(channelId: string): boolean {
  const { hasHighlights } = useChannelHighlights(channelId, {
    config: { maxItems: 1 }, // Only check for one highlight
  });

  return hasHighlights;
}

/**
 * Export for future API migration
 * When ready to switch to API:
 * 1. Implement useChannelHighlightsAPI
 * 2. Change USE_HIGHLIGHTS_API to true
 * 3. All components continue working without changes
 */
export { USE_HIGHLIGHTS_API };
