/**
 * Content routing utilities for intercepting routes
 * Provides standardized URL generation for content navigation
 */

export interface ContentRouteParams {
  channelId: string;
  contentId: string;
}

/**
 * Generate canonical content URL for intercepting routes
 * This URL will be intercepted by @modal routes when navigated from feeds
 * and will render as full page when accessed directly or refreshed
 */
export const toContentHref = ({ channelId, contentId }: ContentRouteParams): string => {
  return `/channels/${channelId}/contents/${contentId}`;
};

/**
 * Generate channel URL for fallback navigation
 * Used when modal needs to close but there's no history to go back to
 */
export const toChannelHref = (channelId: string): string => {
  return `/channels/${channelId}`;
};

/**
 * Check if current navigation is from internal feed (for modal behavior)
 * This can be used to determine if we should show modal or full page
 */
export const isInternalNavigation = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check if we have history to go back to
  return window.history.length > 1;
};

/**
 * Content link props for Next.js Link component
 * Standardized props for content navigation with intercepting routes
 */
export const getContentLinkProps = ({ channelId, contentId }: ContentRouteParams) => ({
  href: toContentHref({ channelId, contentId }),
  scroll: false, // Preserve background scroll position
  prefetch: true, // Prefetch for better UX
});
