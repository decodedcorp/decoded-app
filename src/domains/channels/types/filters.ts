export interface ExploreFilters {
  search: string;
  category: string;
  subcategory: string;
  sortBy: 'recent' | 'popular' | 'content' | 'subscribers';
  sortOrder: 'asc' | 'desc';
}