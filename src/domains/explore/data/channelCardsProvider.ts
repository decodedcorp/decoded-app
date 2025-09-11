/**
 * Channel Cards Provider
 *
 * 채널 API 기반 카드 데이터 제공자
 * 기존 CardsProvider와 호환되면서 실제 API 데이터 사용
 */

import { ContentsService } from '@/api/generated';
import type { ContentListResponse } from '@/api/generated';
import { getOptimizedChannelImageUrl, getThumbnailImageUrl } from '@/lib/utils/imageProxy';

import type { Card, CardsRequest, CardsResponse } from '../types/card';
import {
  determineCardType,
  detectContentSource,
  determineLoadPriority,
  normalizeCategory,
  calculateContentMaturity,
  calculateGridSpan,
} from '../utils/contentDetection';

// Default channel ID for main page
export const DEFAULT_CHANNEL_ID = '687a63508fb53a246d5706ea';

// API Content interface (matches API response structure)
interface APIContent {
  id: string;
  channel_id: string;
  url: string;
  status: 'active' | 'pending';
  category: string | null;
  link_preview_metadata: {
    title: string;
    description: string;
    img_url: string;
    site_name: string;
  } | null;
  ai_gen_metadata: {
    summary: string;
    qa_list: Array<{
      question: string;
      answer: string;
    }>;
  } | null;
  created_at: string;
  updated_at: string | null;
}

// Content detection functions are now imported from utils/contentDetection.ts

/**
 * Extract dominant color from image URL
 * Uses consistent hash-based generation for better performance
 */
const extractDominantColor = (imageUrl: string | null): string => {
  if (!imageUrl) return '#18181b';

  // Create consistent hash from URL
  let hash = 0;
  for (let i = 0; i < imageUrl.length; i++) {
    hash = imageUrl.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate muted, dark colors suitable for the design
  const hue = Math.abs(hash) % 360;
  const saturation = 15 + (Math.abs(hash) % 25); // 15-40%
  const lightness = 12 + (Math.abs(hash) % 8); // 12-20%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Calculate aspect ratio from image URL
 * Returns default 4:5 ratio for consistency
 */
const calculateAspectRatio = (imageUrl: string | null): number => {
  // For now, return consistent 4:5 ratio (0.8)
  // In future, could extract from image metadata
  return 0.8;
};

/**
 * Generate BlurHash placeholder
 * Returns simple hash-based blur for consistency
 */
const generateBlurHash = (imageUrl: string | null, avgColor: string): string => {
  if (!imageUrl) return 'L6PZfSjE.AyE_3t7t7R**0o#DgR4';

  // Simple hash generation - in production, would use actual BlurHash library
  const hashChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&';
  let hash = '';

  for (let i = 0; i < 20; i++) {
    const charIndex = (imageUrl.charCodeAt(i % imageUrl.length) + i) % hashChars.length;
    hash += hashChars[charIndex];
  }

  return `L${hash.slice(0, 19)}`;
};

/**
 * Transform API Content to Card Interface
 */
const transformContentToCard = (content: APIContent): Card => {
  // 콘텐츠 소스 타입 감지
  const sourceType = detectContentSource(content.url);

  // 콘텐츠 성숙도 계산
  const maturityScore = calculateContentMaturity(content);

  const title =
    content.link_preview_metadata?.title ||
    content.ai_gen_metadata?.summary?.slice(0, 60) ||
    `Content ${content.id.slice(-8)}`;

  const authorName =
    content.link_preview_metadata?.site_name ||
    (content.category
      ? `${content.category.charAt(0).toUpperCase()}${content.category.slice(1)}`
      : sourceType.charAt(0).toUpperCase() + sourceType.slice(1));

  const originalImageUrl = content.link_preview_metadata?.img_url || '/placeholder.jpg';
  const thumbnailUrl = getThumbnailImageUrl(originalImageUrl);
  const optimizedUrl = getOptimizedChannelImageUrl(originalImageUrl, 'medium');
  const avgColor = extractDominantColor(originalImageUrl);
  const aspectRatio = calculateAspectRatio(originalImageUrl);

  // 카드 타입 결정 (향상된 감지)
  const cardType = determineCardType(content.category, content.url);

  // 그리드 스팬 계산
  const gridSpan = calculateGridSpan(cardType, aspectRatio);

  return {
    id: content.id,
    createdAt: content.created_at,
    updatedAt: content.updated_at || undefined,

    // Card type and layout - 향상된 감지 적용
    type: cardType,
    priority: 'medium',

    // Layout dimensions (calculated based on aspect ratio and content type)
    width: 320,
    height: Math.round(320 / aspectRatio),
    spanX: gridSpan.spanX,
    spanY: gridSpan.spanY,

    // Image/media properties - 최적화된 URL 사용
    thumbnailUrl,
    originalUrl: optimizedUrl,

    // Visual optimization
    avgColor,
    blurhash: generateBlurHash(thumbnailUrl, avgColor),
    aspectRatio,

    // Content metadata - 향상된 정보 포함
    metadata: {
      title,
      description: content.link_preview_metadata?.description || content.ai_gen_metadata?.summary,
      category: normalizeCategory(content.category, sourceType),
      author: {
        id: content.link_preview_metadata?.site_name || 'unknown',
        name: authorName,
      },

      // API-specific fields
      aiSummary: content.ai_gen_metadata?.summary,
      qaList: content.ai_gen_metadata?.qa_list,
      sourceUrl: content.url,
      siteName: content.link_preview_metadata?.site_name,

      // Enhanced metadata
      tags: [sourceType, content.category].filter(Boolean) as string[],
      keywords:
        content.ai_gen_metadata?.qa_list?.map((qa) =>
          qa.question.split(' ').slice(0, 3).join(' '),
        ) || [],

      // Default interaction data
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
      shareCount: 0,
      isLiked: false,
      isSaved: false,
    },

    // Status and visibility
    status: content.status,
    visibility: 'public',

    // Performance hints - 향상된 우선순위 계산
    loadPriority: determineLoadPriority(content.status, content.category, sourceType),
    preloadHint: maturityScore > 0.7 && (cardType === 'image' || cardType === 'video'),
  };
};

/**
 * Transform API Response to Cards Response
 */
const transformAPIResponse = (apiResponse: ContentListResponse): CardsResponse => {
  const cards =
    apiResponse.contents?.map((content: any) => transformContentToCard(content as APIContent)) ||
    [];

  return {
    items: cards,
    hasMore: !!apiResponse.next_id,
    nextCursor: apiResponse.next_id || undefined,
    totalCount: apiResponse.total_count || cards.length,
    prevCursor: undefined, // API doesn't provide previous cursor
  };
};

/**
 * Channel Cards Provider
 */
export class ChannelCardsProvider {
  private static channelId = DEFAULT_CHANNEL_ID;

  /**
   * Set the channel ID for data fetching
   */
  static setChannelId(channelId: string): void {
    this.channelId = channelId;
  }

  /**
   * Get current channel ID
   */
  static getChannelId(): string {
    return this.channelId;
  }

  /**
   * Get cards from channel API
   */
  static async getCards(request: CardsRequest = {}): Promise<CardsResponse> {
    try {
      const { limit = 20, cursor } = request;

      // Parse cursor to get skip value
      let skip = 0;
      if (cursor) {
        try {
          const parsed = JSON.parse(atob(cursor));
          skip = parsed.skip || 0;
        } catch (e) {
          console.warn('Invalid cursor format, starting from beginning');
          skip = 0;
        }
      }

      // Fetch from API
      const apiResponse = await ContentsService.getContentsByChannelContentsChannelChannelIdGet(
        this.channelId,
        skip,
        limit,
      );

      // Transform and return
      return transformAPIResponse(apiResponse);
    } catch (error) {
      console.error('Failed to fetch channel cards:', error);

      // Return empty response on error
      return {
        items: [],
        hasMore: false,
        totalCount: 0,
      };
    }
  }

  /**
   * Get single card by ID
   */
  static async getCard(id: string): Promise<Card | null> {
    try {
      // For now, fetch from the list and find the card
      // In future, could use a dedicated single-content API
      const response = await this.getCards({ limit: 50 });
      const card = response.items.find((c) => c.id === id);
      return card || null;
    } catch (error) {
      console.error('Failed to fetch card:', error);
      return null;
    }
  }

  /**
   * Get cards statistics
   */
  static async getStats() {
    try {
      const response = await this.getCards({ limit: 1 });

      return {
        totalCards: response.totalCount || 0,
        activeCards: response.totalCount || 0, // Assume all are active for now
        categories: ['news', 'blog', 'photo', 'video'], // Static for now
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        totalCards: 0,
        activeCards: 0,
        categories: [],
        lastUpdated: new Date().toISOString(),
      };
    }
  }
}

// Utility functions for debugging and development
export const ChannelCardsUtils = {
  transformContentToCard,
  transformAPIResponse,
  determineCardType,
  determineLoadPriority,
  extractDominantColor,
  DEFAULT_CHANNEL_ID,
} as const;
