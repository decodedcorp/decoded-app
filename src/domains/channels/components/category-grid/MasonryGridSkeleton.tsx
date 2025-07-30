import { cn } from '@/lib/utils/styles';
import { cardVariants } from '../../constants/masonryConstants';

export function MasonryGridSkeleton() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 w-full pt-4">
      {Array.from({ length: 20 }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            'mb-4 break-inside-avoid transition-transform duration-200',
            cardVariants[idx % cardVariants.length],
          )}
        >
          <div>
            {/* 카테고리 + 배지 스켈레톤 */}
            <div className="flex items-start justify-between px-3 pt-3 pb-1 min-h-[28px]">
              <div className="w-16 h-3 bg-zinc-700 rounded animate-pulse"></div>
              <div className="flex gap-1">
                <div className="w-8 h-4 bg-zinc-700 rounded-full animate-pulse"></div>
                <div className="w-8 h-4 bg-zinc-700 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* 이미지 스켈레톤 */}
            <div className="relative w-full aspect-[4/5] bg-zinc-800 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-zinc-700 animate-pulse"></div>
            </div>

            {/* 텍스트 정보 스켈레톤 */}
            <div className="flex flex-col gap-2 px-3 py-2 flex-1">
              <div className="h-8 bg-zinc-700 rounded animate-pulse"></div>

              {/* Editors 아바타 스택 스켈레톤 */}
              <div className="flex items-center mt-1 gap-1">
                <div className="w-7 h-7 rounded-full bg-zinc-700 animate-pulse"></div>
                <div className="w-7 h-7 rounded-full bg-zinc-700 -ml-2 animate-pulse"></div>
                <div className="w-7 h-7 rounded-full bg-zinc-700 -ml-2 animate-pulse"></div>
              </div>

              <div className="w-20 h-3 bg-zinc-700 rounded animate-pulse mt-1"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
