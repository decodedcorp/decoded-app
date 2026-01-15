// Supabase client
export { initSupabase, getSupabaseClient, isSupabaseInitialized } from "./supabase/client";
export type { Database } from "./supabase/types";

// Hooks
export {
  useLatestImages,
  useImageById,
  useFilteredImages,
  useInfiniteFilteredImages,
  useRelatedImagesByAccount,
} from "./hooks/useImages";
export { useDebounce } from "./hooks/useDebounce";

// Stores
export { useFilterStore } from "./stores/filterStore";
export type { FilterKey } from "./stores/filterStore";
export { useSearchStore } from "./stores/searchStore";
export {
  useHierarchicalFilterStore,
  CATEGORY_LABELS,
  CONTEXT_LABELS,
} from "./stores/hierarchicalFilterStore";
export type { HierarchicalFilterState } from "./stores/hierarchicalFilterStore";

// Types
export * from "./types/filter";

// Mock data (for development)
export {
  getMockCategories,
  getMockMediaByCategory,
  getMockCastByMedia,
  getMockContextOptions,
  searchMockMedia,
  searchMockCast,
  MOCK_CATEGORIES,
  MOCK_MEDIA,
  MOCK_CAST,
  CONTEXT_OPTIONS,
} from "./data/mockFilterData";

// Query functions (for direct use)
export {
  fetchLatestImages,
  fetchImageById,
  fetchFilteredImages,
  fetchImagesByPostImage,
  fetchRelatedImagesByAccount,
  fetchUnifiedImages,
  fetchOrphanImages,
  encodeCursor,
  decodeCursor,
} from "./supabase/queries/images";

export type {
  ImageRow,
  ImageDetail,
  ImagePage,
  ImagePageWithPostId,
  ImageWithPostId,
  CategoryFilter,
  FetchFilteredImagesParams,
  PostImageRow,
  PostSource,
} from "./supabase/queries/images";

export { fetchItemsByImageId } from "./supabase/queries/items";
export type { ItemRow } from "./supabase/queries/items";
