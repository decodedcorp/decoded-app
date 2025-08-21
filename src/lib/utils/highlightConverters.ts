/**
 * Highlight Converters
 * Convert ContentItem data to HighlightItem for API-independent usage
 */

import { ContentItem } from '@/lib/types/content';
import { 
  HighlightItem, 
  HighlightType, 
  HighlightConfig, 
  DEFAULT_HIGHLIGHT_CONFIG 
} from '@/lib/types/highlightTypes';

/**
 * Check if content is within recent timeframe
 */
function isWithinDays(dateString: string | undefined, days: number): boolean {
  if (!dateString) return false;
  
  const contentDate = new Date(dateString);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return contentDate >= cutoffDate;
}

/**
 * Determine highlight type based on content
 */
function determineHighlightType(item: ContentItem): HighlightType {
  // Check for AI summary content
  if (item.aiSummary) {
    return 'ai_summary';
  }
  
  // Check category patterns for weekly threads
  if (item.category?.toLowerCase().includes('weekly') || 
      item.title.toLowerCase().includes('weekly thread')) {
    return 'weekly_thread';
  }
  
  // Check for announcements
  if (item.category?.toLowerCase().includes('announcement') ||
      item.category?.toLowerCase().includes('news') ||
      item.type === 'link' && item.linkPreview?.siteName?.toLowerCase().includes('foundation')) {
    return 'announcement';
  }
  
  // High engagement content
  const likes = item.likes || 0;
  const views = item.views || 0;
  if (likes >= DEFAULT_HIGHLIGHT_CONFIG.minLikes || views >= DEFAULT_HIGHLIGHT_CONFIG.minViews) {
    return 'popular';
  }
  
  return 'recent';
}

/**
 * Generate appropriate badge text
 */
function determineBadge(item: ContentItem): string {
  const type = determineHighlightType(item);
  
  switch (type) {
    case 'weekly_thread':
      return 'Weekly Thread';
    case 'announcement':
      return item.linkPreview?.siteName || 'Announcement';
    case 'popular':
      return 'Popular';
    case 'ai_summary':
      return 'AI Summary';
    case 'recent':
      return 'Recent';
    default:
      return item.category || 'General';
  }
}

/**
 * Calculate priority score for sorting
 */
function calculatePriority(item: ContentItem): number {
  let priority = 0;
  
  // AI summary gets highest priority
  if (item.aiSummary) priority += 1000;
  
  // Engagement score
  const likes = item.likes || 0;
  const views = item.views || 0;
  priority += likes * 10 + views * 0.1;
  
  // Recent content gets bonus
  if (item.date && isWithinDays(item.date, 3)) {
    priority += 100;
  }
  
  // Weekly threads get moderate priority
  if (item.title.toLowerCase().includes('weekly')) {
    priority += 50;
  }
  
  return Math.round(priority);
}

/**
 * Format date for display
 */
function formatHighlightDate(dateString: string | undefined): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Check if content item qualifies as highlight
 */
function isValidHighlight(item: ContentItem, config: HighlightConfig): boolean {
  // Must be active status
  if (item.status !== 'active') return false;
  
  // Must have title
  if (!item.title?.trim()) return false;
  
  const likes = item.likes || 0;
  const views = item.views || 0;
  
  // Qualify if:
  // 1. Has AI summary (always include)
  // 2. Is recent
  // 3. Has good engagement
  // 4. Is a weekly thread or announcement
  
  if (item.aiSummary && config.prioritizeAISummary) return true;
  
  if (isWithinDays(item.date, config.recentDays)) return true;
  
  if (likes >= config.minLikes || views >= config.minViews) return true;
  
  if (item.category?.toLowerCase().includes('weekly') || 
      item.category?.toLowerCase().includes('announcement')) {
    return true;
  }
  
  return false;
}

/**
 * Convert ContentItem to HighlightItem
 */
export function convertContentToHighlight(item: ContentItem): HighlightItem {
  const type = determineHighlightType(item);
  const badge = determineBadge(item);
  const priority = calculatePriority(item);
  
  return {
    id: item.id.toString(),
    title: item.title,
    description: item.aiSummary || item.description,
    imageUrl: item.linkPreview?.imageUrl || item.imageUrl,
    badge,
    type,
    date: formatHighlightDate(item.date),
    priority,
    clickAction: {
      type: 'content_modal',
      data: item
    }
  };
}

/**
 * Convert array of ContentItems to HighlightItems with filtering and sorting
 */
export function convertContentToHighlights(
  contentItems: ContentItem[],
  config: HighlightConfig = DEFAULT_HIGHLIGHT_CONFIG
): HighlightItem[] {
  if (!contentItems?.length) return [];
  
  return contentItems
    .filter(item => isValidHighlight(item, config))
    .map(convertContentToHighlight)
    .sort((a, b) => b.priority - a.priority) // Higher priority first
    .slice(0, config.maxItems);
}

/**
 * Get highlight statistics for debugging
 */
export function getHighlightStats(contentItems: ContentItem[]) {
  if (!contentItems?.length) return null;
  
  const highlights = convertContentToHighlights(contentItems);
  const typeCounts = highlights.reduce((acc, h) => {
    acc[h.type] = (acc[h.type] || 0) + 1;
    return acc;
  }, {} as Record<HighlightType, number>);
  
  return {
    totalContent: contentItems.length,
    totalHighlights: highlights.length,
    typeCounts,
    avgPriority: highlights.reduce((sum, h) => sum + h.priority, 0) / highlights.length || 0
  };
}