export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ItemMetadata {
  name: string | null;
  description: string | null;
  brand: string | null;
  designed_by: string | null;
  material: string | null;
  color: string | null;
  item_class: string;
  item_sub_class: string;
  category: string;
  sub_category: string;
  product_type: string;
}

export interface LinkInfo {
  url: string;
  label: string | null;
  date: string;
  provider: string;
  og_metadata: any | null;
  link_metadata: any | null;
}

export interface TrendingItemResponse {
  item_doc_id: string;
  name: string | null;
  brand: string | null;
  img_url: string | null;
  like: number;
  num_links: number;
  trending_score: number;
  views: number;
  exposure_rate: number;
  relative_exposure: number;
  image_doc_id: string;
}

export interface ApiResponse {
  status_code: number;
  description: string;
  data: TrendingItemResponse[];
}

export interface TrendingItem {
  id: string;
  image: string | null;
  title: string;
  brand: string | null;
  views: number;
  requestCount: number;
  exposureRate: number;
  trendingScore: number;
  featured: boolean;
  imageDocId: string;
  itemDocId: string;
}

export interface PeriodSelectorProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
  availablePeriods: Period[];
}

export interface PremiumSpotClientProps {
  period: Period;
}

export interface ItemSpotCardProps {
  image: string | null;
  title: string;
  brand: string | null;
  views: number;
  requestCount: number;
  exposureRate: string;
  trendingScore: number;
  featured: boolean;
  imageDocId: string;
  itemDocId: string;
}
