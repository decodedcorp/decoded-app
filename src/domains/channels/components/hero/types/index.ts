// Hero Design Mode Types
export type HeroDesignMode = 'complex' | 'simple';

// Question Types
export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
}

export type QuestionCategory =
  | 'lifestyle'
  | 'entertainment'
  | 'wellness'
  | 'culture'
  | 'general'
  | 'specific'
  | 'emotional';

// Trending Tag Types
export interface TrendingTag {
  id: string;
  text: string;
  category: TrendingTagCategory;
  popularity: 'high' | 'medium' | 'low';
}

export type TrendingTagCategory =
  | 'lifestyle'
  | 'entertainment'
  | 'wellness'
  | 'culture'
  | 'tech'
  | 'food';

// Animation Speed Types
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

// Component Props Interfaces
export interface BaseHeroProps {
  className?: string;
  onToggleDesign?: () => void;
}

export interface SearchHeroProps extends BaseHeroProps {
  placeholderQuestions?: Question[];
  searchSource?: string;
}

export interface SimpleHeroProps extends BaseHeroProps {
  trendingQuestions?: Question[];
  searchSource?: string;
}

export interface FlowingQuestionsProps extends BaseHeroProps {
  maxRows?: number;
  animationSpeed?: AnimationSpeed;
  questions?: Question[];
}

export interface TrendingTagsProps extends BaseHeroProps {
  maxTags?: number;
  showCategories?: boolean;
  tags?: TrendingTag[];
}

export interface BackgroundLayersProps {
  layers: BackgroundLayer[];
  className?: string;
}

export interface BackgroundLayer {
  id: string;
  className: string;
}

// Animation Configuration Types
export interface AnimationConfig {
  baseDuration: number;
  randomRange: number;
}

export interface SpeedConfig {
  slow: AnimationConfig;
  normal: AnimationConfig;
  fast: AnimationConfig;
}

// Search Parameters
export interface SearchParams {
  q: string;
  type: 'search' | 'trending';
  category?: string;
  popularity?: string;
  source?: string;
}

// Accessibility Types
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
}
