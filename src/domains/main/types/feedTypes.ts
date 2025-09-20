/**
 * Unified FeedItem type for infinite scroll feed
 * Normalizes data from TrendingService and ContentsService APIs
 */
export interface FeedItem {
  /** Unique identifier */
  id: string;

  /** Content title */
  title?: string;

  /** Content description */
  description?: string;

  /** Thumbnail/image URL */
  imageUrl?: string;

  /** Content URL for links */
  linkUrl?: string;

  /** ISO timestamp for created date */
  createdAt: string;

  /** Popularity/trending score (optional, for trending items) */
  score?: number;

  /** Channel information */
  channelId?: string;
  channelName?: string;

  /** Provider/author information */
  providerId?: string;
  providerName?: string;

  /** Content type */
  type: 'link' | 'image' | 'video' | 'text';

  /** Content status */
  status?: string;

  /** Additional metadata */
  metadata?: {
    /** Media dimensions for layout optimization */
    mediaWidth?: number;
    mediaHeight?: number;

    /** Badge information (trending, new, etc.) */
    badge?: string;

    /** Engagement metrics */
    pins?: number;
    comments?: number;
    views?: number;
    shares?: number;
  };
}

/**
 * Infinite query page structure
 */
export interface FeedPage {
  /** Items in this page */
  items: FeedItem[];

  /** Page index (0-based) */
  pageIndex: number;

  /** Whether more pages are available */
  hasMore: boolean;

  /** Page type for UX labeling */
  pageType: 'trending' | 'content';

  /** Sort mode used for this page */
  sortMode: SortOption;
}

/**
 * Sort options for feed
 */
export type SortOption = 'hot' | 'new' | 'top';

/**
 * Feed query parameters
 */
export interface FeedQueryParams {
  sort?: SortOption;
  channelId?: string;
  providerId?: string;
  status?: string;
  hours?: number;
  limit?: number;
}

/**
 * Feed hook result interface
 */
export interface FeedContentsResult {
  /** Infinite query data with pages */
  data: { pages: FeedPage[] } | undefined;

  /** Whether more pages are available */
  hasNextPage: boolean;

  /** Whether currently fetching next page */
  isFetchingNextPage: boolean;

  /** Function to fetch next page */
  fetchNextPage: () => void;

  /** Initial loading state */
  isLoading: boolean;

  /** Error state */
  isError: boolean;

  /** Error object */
  error: Error | null;

  /** Refetch function */
  refetch: () => void;

  /** All items flattened from all pages */
  allItems: FeedItem[];

  /** Total items count */
  totalItems: number;
}
