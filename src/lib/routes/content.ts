/**
 * Content routing utilities for intercept routing pattern
 */

export const toContentHref = ({
  channelId,
  contentId
}: {
  channelId: string;
  contentId: string;
}) => `/channels/${channelId}/contents/${contentId}`;

/**
 * Check if content is external (should open in new tab)
 */
export const isExternalContent = (content: { linkUrl?: string | null }): boolean => {
  if (typeof window === 'undefined' || !content.linkUrl) return false;

  try {
    const url = new URL(content.linkUrl);
    return url.hostname !== window.location.hostname;
  } catch {
    return false;
  }
};