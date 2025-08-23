/**
 * Community Highlights Types
 * API-independent interface for channel highlights
 */

export type HighlightType = 'weekly_thread' | 'announcement' | 'popular' | 'recent' | 'ai_summary';

export type HighlightClickActionType = 'content_modal' | 'external_link' | 'internal_link';

export interface HighlightClickAction {
  type: HighlightClickActionType;
  data: any; // ContentItem | URL | Path
}

export interface HighlightItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  badge?: string; // "Weekly Thread", "News", "Popular" etc.
  type: HighlightType;
  date: string;
  priority: number; // Sort priority (higher = more important)
  clickAction: HighlightClickAction;
  
  // UI states
  isLoading?: boolean;
  hasError?: boolean;
}

export interface HighlightGroup {
  title: string;
  items: HighlightItem[];
  isExpanded: boolean;
}

// Configuration for highlight selection criteria
export interface HighlightConfig {
  maxItems: number;
  recentDays: number; // How many days to consider "recent"
  minLikes: number;
  minViews: number;
  prioritizeAISummary: boolean;
}

export const DEFAULT_HIGHLIGHT_CONFIG: HighlightConfig = {
  maxItems: 6,
  recentDays: 7,
  minLikes: 5,
  minViews: 100,
  prioritizeAISummary: true,
};