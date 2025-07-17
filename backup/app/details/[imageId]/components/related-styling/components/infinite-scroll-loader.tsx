'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface InfiniteScrollLoaderProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function InfiniteScrollLoader({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollLoaderProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!hasNextPage) return null;

  return (
    <div ref={ref} className="py-6 flex justify-center">
      {isFetchingNextPage ? (
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
      ) : (
        <div className="h-8" />
      )}
    </div>
  );
} 