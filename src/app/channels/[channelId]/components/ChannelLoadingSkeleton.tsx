import { memo } from 'react';

export const ChannelLoadingSkeleton = memo(function ChannelLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      {/* 로딩 스켈레톤 */}
      <div className="p-6 animate-in fade-in-50 duration-200">
        {/* 헤더 스켈레톤 */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-6 bg-zinc-800 rounded w-48 mb-2 animate-pulse" />
              <div className="h-4 bg-zinc-800 rounded w-32 animate-pulse" />
            </div>
          </div>
          <div className="h-4 bg-zinc-800 rounded w-64 animate-pulse" />
        </div>

        {/* 콘텐츠 그리드 스켈레톤 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] bg-zinc-800 rounded-xl animate-pulse"
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});