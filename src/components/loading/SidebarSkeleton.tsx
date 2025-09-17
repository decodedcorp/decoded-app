import React from 'react';

/**
 * 콘텐츠 사이드바 로딩 스켈레톤
 */
export function SidebarSkeleton() {
  return (
    <div className="h-full p-6 space-y-6">
      {/* 헤더 스켈레톤 */}
      <div className="space-y-3">
        <div className="h-6 bg-zinc-800 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/2"></div>
      </div>

      {/* 통계 스켈레톤 */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-6 bg-zinc-800 rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-zinc-800 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* 댓글 섹션 스켈레톤 */}
      <div className="space-y-4">
        <div className="h-5 bg-zinc-800 rounded animate-pulse w-1/3"></div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/4"></div>
                <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}