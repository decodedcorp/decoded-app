import { useQuery } from '@tanstack/react-query';
import { CategoriesService } from '@/api/generated/services/CategoriesService';
import { CategoryType } from '@/api/generated/models/CategoryType';
import { CategorySimpleListResponse } from '@/api/generated/models/CategorySimpleListResponse';

export function useCategories(categoryType: CategoryType = CategoryType.CHANNEL) {
  return useQuery<CategorySimpleListResponse>({
    queryKey: ['categories', 'simple', categoryType],
    queryFn: () => CategoriesService.getSimpleCategoriesCategoriesSimpleGet(categoryType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Alias for backward compatibility
export const useSimpleCategories = useCategories;

// Helper function to extract dropdown options from API response
export function formatCategoriesForDropdown(data?: CategorySimpleListResponse) {
  if (!data?.categories) return { categories: [], subcategories: {} };

  const categories = [
    { id: 'all', label: 'All Categories', count: 0 }
  ];

  const subcategoriesMap: { [categoryId: string]: Array<{ id: string; label: string }> } = {
    all: [{ id: 'all', label: 'All Subcategories' }]
  };

  data.categories.forEach((item) => {
    const categoryId = item.category.toLowerCase().replace(/\s+/g, '-');
    categories.push({
      id: categoryId,
      label: item.category,
      count: 0, // Count will be calculated from actual channel data
    });

    if (item.subcategories && item.subcategories.length > 0) {
      subcategoriesMap[categoryId] = [
        { id: 'all', label: 'All Subcategories' },
        ...item.subcategories.map(sub => ({
          id: sub.toLowerCase().replace(/\s+/g, '-'),
          label: sub
        }))
      ];
    } else {
      subcategoriesMap[categoryId] = [{ id: 'all', label: 'All Subcategories' }];
    }
  });

  return {
    categories,
    subcategories: subcategoriesMap
  };
}