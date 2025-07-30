interface InfiniteScrollLoaderProps {
  observerRef: React.RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function InfiniteScrollLoader({
  observerRef,
  hasNextPage,
  isFetchingNextPage,
}: InfiniteScrollLoaderProps) {
  if (!hasNextPage) return null;

  return (
    <div ref={observerRef} className="col-span-full flex justify-center py-8">
      {isFetchingNextPage ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-zinc-400">Loading more channels...</span>
        </div>
      ) : (
        <div className="h-4" /> // Intersection Observer를 위한 빈 공간
      )}
    </div>
  );
} 