import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions<T> {
  // 데이터를 가져오는 함수 (next_id를 인자로 받음)
  fetchFunction: (options: { limit?: number; next_id?: string }) => Promise<{
    data: {
      docs: T[];
      next_id: string | null;
    };
  }>;
  initialLimit?: number; // 처음 불러올 아이템 수
  threshold?: number; // Intersection Observer 감지 임계값
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  loadingRef: React.RefObject<HTMLDivElement>;
}

export function useInfiniteScroll<T>({
  fetchFunction,
  initialLimit = 10,
  threshold = 0.1,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [nextId, setNextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // 데이터 가져오기 함수
  const fetchData = useCallback(async (next_id?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFunction({
        limit: initialLimit,
        next_id: next_id || undefined,
      });

      const newItems = response.data.docs;
      const newNextId = response.data.next_id;

      setItems((prev) => (next_id ? [...prev, ...newItems] : newItems));
      setNextId(newNextId);
      setHasMore(!!newNextId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('데이터를 불러오는 중 오류가 발생했습니다'));
      console.error('Infinite scroll error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, initialLimit]);

  // 더 불러오기 함수
  const loadMore = useCallback(async (overrideNextId?: string | null) => {
    if (isLoading || (!hasMore && !overrideNextId)) return;
    // 외부에서 전달받은 nextId 우선 사용
    await fetchData(overrideNextId !== undefined ? overrideNextId || undefined : nextId || undefined);
  }, [fetchData, isLoading, hasMore, nextId]);

  // Intersection Observer 설정
  useEffect(() => {
    if (!loadingRef.current) return;

    // 이전 옵저버 정리
    if (observer.current) {
      observer.current.disconnect();
    }

    // 새 옵저버 생성
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold }
    );

    observer.current.observe(loadingRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore, threshold]);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchData();
  }, []);

  return {
    items,
    isLoading,
    error,
    hasMore,
    loadMore,
    loadingRef,
  };
}