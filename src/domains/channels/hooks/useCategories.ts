import { useQuery } from '@tanstack/react-query';

import { CategoriesService, CategoryType } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';
import { refreshOpenAPIToken } from '../../../api/hooks/useApi';

/**
 * Hook for fetching simple categories (대분류 + 서브카테고리) for channel creation
 */
export const useSimpleCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.simple(CategoryType.CHANNEL),
    queryFn: async () => {
      // OpenAPI 토큰 업데이트
      refreshOpenAPIToken();

      return CategoriesService.getSimpleCategoriesCategoriesSimpleGet(CategoryType.CHANNEL);
    },
    staleTime: 10 * 60 * 1000, // 10분 - 카테고리는 자주 변경되지 않음
    gcTime: 30 * 60 * 1000, // 30분
    refetchOnWindowFocus: false,
    retry: 2,
  });
};