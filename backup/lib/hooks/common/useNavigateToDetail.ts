'use client';

import { useRouter } from 'next/navigation';

interface NavigateToDetailOptions {
  imageId?: string;
  preserveQuery?: boolean;
}

export function useNavigateToDetail() {
  const router = useRouter();

  return function navigateToDetail(
    itemId: string,
    options: NavigateToDetailOptions = {}
  ) {
    const { imageId } = options;

    // imageId를 경로에 사용하고, itemId를 쿼리 파라미터로 사용
    const basePath = `/details/${imageId}`;
    const url = `${basePath}?selectedItem=${itemId}`;
    router.push(url);
  };
}
