/**
 * Recent Content Manager
 * Manages recently viewed content IDs in session storage
 */

export interface RecentContentItem {
  id: string;
  channelId: string;
  viewedAt: number; // timestamp
  title?: string;
  thumbnailUrl?: string;
}

const STORAGE_KEY = 'recent_content';
const MAX_RECENT_ITEMS = 3;

/**
 * Get recent content items from session storage
 */
export function getRecentContent(): RecentContentItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const items = JSON.parse(stored) as RecentContentItem[];
    // Sort by viewedAt (most recent first)
    return items.sort((a, b) => b.viewedAt - a.viewedAt);
  } catch (error) {
    console.error('[RecentContentManager] Failed to get recent content:', error);
    return [];
  }
}

/**
 * Add a content item to recent content
 */
export function addRecentContent(content: Omit<RecentContentItem, 'viewedAt'>): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getRecentContent();

    // Remove if already exists (to update position)
    const filtered = existing.filter((item) => item.id !== content.id);

    // Add new item at the beginning
    const newItem: RecentContentItem = {
      ...content,
      viewedAt: Date.now(),
    };

    const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    console.log('[RecentContentManager] Added recent content:', {
      id: content.id,
      totalItems: updated.length,
    });
  } catch (error) {
    console.error('[RecentContentManager] Failed to add recent content:', error);
  }
}

/**
 * Remove a content item from recent content
 */
export function removeRecentContent(contentId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getRecentContent();
    const filtered = existing.filter((item) => item.id !== contentId);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    console.log('[RecentContentManager] Removed recent content:', {
      contentId,
      remainingItems: filtered.length,
    });
  } catch (error) {
    console.error('[RecentContentManager] Failed to remove recent content:', error);
  }
}

/**
 * Clear all recent content
 */
export function clearRecentContent(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log('[RecentContentManager] Cleared all recent content');
  } catch (error) {
    console.error('[RecentContentManager] Failed to clear recent content:', error);
  }
}

/**
 * Get recent content count
 */
export function getRecentContentCount(): number {
  return getRecentContent().length;
}
