import type { TrendingContentItem } from '@/api/generated/models/TrendingContentItem';
import type { FeedItem, SortOption } from '../types/feedTypes';
import { getThumbnailImageUrl } from '@/lib/utils/imageProxy';

/**
 * Normalize TrendingContentItem to unified FeedItem
 */
export function normalizeTrendingItem(
  item: TrendingContentItem,
  index?: number,
  sortMode?: SortOption,
): FeedItem {
  // Handle image URL with proxy
  const imageUrl = item.thumbnail_url ? getThumbnailImageUrl(item.thumbnail_url) : undefined;

  // Generate display title from various sources
  const getDisplayTitle = (): string => {
    if (item.title) return item.title;
    if (item.url) {
      try {
        const url = new URL(item.url);
        return url.hostname.replace('www.', '');
      } catch {
        return 'Untitled';
      }
    }
    return 'Untitled';
  };

  // Generate badge for trending items
  const getBadge = (): string | undefined => {
    if (typeof index === 'number') {
      if (index < 3) return 'trending'; // Top 3 trending
      if (index < 6) return 'new'; // 4-6 new items
    }
    return undefined;
  };

  // Map content type
  const mapContentType = (type?: string): 'link' | 'image' | 'video' | 'text' => {
    switch (type?.toLowerCase()) {
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      case 'link':
        return 'link';
      default:
        return 'text';
    }
  };

  const createdAt = (item as any).created_at || new Date().toISOString();

  // 디버깅 로그
  if (process.env.NODE_ENV === 'development') {
    console.log('normalizeTrendingItem:', {
      itemId: item.id,
      title: getDisplayTitle(),
      originalCreatedAt: (item as any).created_at,
      normalizedCreatedAt: createdAt,
      hasCreatedAt: !!(item as any).created_at,
      itemKeys: Object.keys(item),
    });
  }

  return {
    id: item.id,
    title: getDisplayTitle(),
    description: item.description || undefined,
    imageUrl,
    linkUrl: item.url || undefined,
    createdAt, // Use actual timestamp if available
    channelId: item.channel_id,
    channelName: item.channel_name,
    providerId: item.provider_id,
    providerName: item.provider_id, // Using provider_id as name fallback
    type: mapContentType(item.type),
    metadata: {
      badge: getBadge(),
      pins: 0, // Not available in trending data
      comments: 0, // Not available in trending data
    },
  };
}

/**
 * Normalize general ContentItem (from ContentsService) to unified FeedItem
 */
export function normalizeContentItem(item: Record<string, any>): FeedItem {
  // Handle image URL with proxy
  const rawImageUrl =
    item.link_preview_metadata?.img_url ||
    item.link_preview_metadata?.downloaded_img_url ||
    item.thumbnail_url ||
    item.image?.url;

  const imageUrl = rawImageUrl ? getThumbnailImageUrl(rawImageUrl) : undefined;

  // Generate display title
  const getDisplayTitle = (): string => {
    return item.title || item.link_preview_metadata?.title || item.url || 'Untitled';
  };

  // Map content type
  const mapContentType = (type?: string): 'link' | 'image' | 'video' | 'text' => {
    switch (type?.toLowerCase()) {
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      case 'link':
        return 'link';
      default:
        return 'text';
    }
  };

  const createdAt = item.created_at || new Date().toISOString();

  // 디버깅 로그
  if (process.env.NODE_ENV === 'development') {
    console.log('normalizeContentItem:', {
      itemId: item.id,
      title: getDisplayTitle(),
      originalCreatedAt: item.created_at,
      normalizedCreatedAt: createdAt,
      hasCreatedAt: !!item.created_at,
      itemKeys: Object.keys(item),
    });
  }

  const normalized = {
    id: item.id || Date.now().toString(),
    title: getDisplayTitle(),
    description: item.description || item.link_preview_metadata?.description || undefined,
    imageUrl,
    linkUrl: item.url || undefined,
    createdAt,
    channelId: item.channel_id,
    channelName: item.channel_name,
    providerId: item.provider_id,
    providerName: item.provider_name || item.provider_id,
    type: mapContentType(item.type),
    status: item.status,
    metadata: {
      mediaWidth: item.media_width,
      mediaHeight: item.media_height,
      pins: item.pins_count || 0,
      comments: item.comments_count || 0,
      views: item.views_count || 0,
      shares: item.shares_count || 0,
    },
  };

  // 디버깅을 위한 로그
  if (process.env.NODE_ENV === 'development') {
    console.log('normalizeContentItem:', {
      itemId: item.id,
      title: item.title,
      pins_count: item.pins_count,
      comments_count: item.comments_count,
      views_count: item.views_count,
      shares_count: item.shares_count,
      normalizedComments: normalized.metadata.comments,
      normalizedPins: normalized.metadata.pins,
    });
  }

  return normalized;
}

/**
 * Deduplicate items based on ID
 * Maintains order and uses Set for O(1) lookup
 */
export function deduplicateItems(items: FeedItem[], seenIds: Set<string>): FeedItem[] {
  const deduplicated: FeedItem[] = [];

  for (const item of items) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      deduplicated.push(item);
    }
  }

  return deduplicated;
}

/**
 * Merge and deduplicate items from multiple sources
 * Used for 'top' sort mode combining popular and trending
 */
export function mergeAndDeduplicateItems(
  popularItems: TrendingContentItem[],
  trendingItems: TrendingContentItem[],
  seenIds: Set<string>,
): FeedItem[] {
  // Normalize all items
  const normalizedPopular = popularItems.map((item, index) =>
    normalizeTrendingItem(item, index, 'hot'),
  );
  const normalizedTrending = trendingItems.map((item, index) =>
    normalizeTrendingItem(item, index + popularItems.length, 'new'),
  );

  // Merge with interleaving for better distribution
  const merged: FeedItem[] = [];
  const maxLength = Math.max(normalizedPopular.length, normalizedTrending.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < normalizedPopular.length) {
      merged.push(normalizedPopular[i]);
    }
    if (i < normalizedTrending.length) {
      merged.push(normalizedTrending[i]);
    }
  }

  // Deduplicate
  return deduplicateItems(merged, seenIds);
}

/**
 * Sort items by creation date (for consistent ordering)
 */
export function sortItemsByDate(items: FeedItem[], ascending = false): FeedItem[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}
