import React from 'react';

/**
 * 댓글 섹션 로딩 스켈레톤
 */
export function CommentsSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* 댓글 입력 스켈레톤 */}
      <div className="space-y-3">
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/4"></div>
        <div className="h-20 bg-zinc-800 rounded-lg animate-pulse"></div>
        <div className="h-10 bg-zinc-800 rounded animate-pulse w-20"></div>
      </div>

      {/* 댓글 목록 스켈레톤 */}
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            {/* 댓글 헤더 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/3"></div>
                <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/4"></div>
              </div>
            </div>

            {/* 댓글 내용 */}
            <div className="pl-13 space-y-2">
              <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-4 bg-zinc-800 rounded animate-pulse w-4/5"></div>
              <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/5"></div>
            </div>

            {/* 댓글 액션 */}
            <div className="pl-13 flex space-x-4">
              <div className="h-3 bg-zinc-800 rounded animate-pulse w-8"></div>
              <div className="h-3 bg-zinc-800 rounded animate-pulse w-8"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}