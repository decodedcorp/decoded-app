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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-zinc-900 rounded-lg p-4 animate-pulse"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-full h-48 bg-zinc-800 rounded mb-3" />
              <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});