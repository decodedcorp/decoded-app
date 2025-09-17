import React from 'react';

/**
 * 콘텐츠 페이지 로딩 상태
 */
export default function ContentPageLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_400px]">
        {/* 메인 콘텐츠 스켈레톤 */}
        <main className="space-y-6">
          {/* 헤더 스켈레톤 */}
          <div className="space-y-4">
            <div className="h-8 bg-zinc-800 rounded-lg animate-pulse w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/2"></div>
          </div>

          {/* 이미지 스켈레톤 */}
          <div className="aspect-video bg-zinc-800 rounded-lg animate-pulse"></div>

          {/* 본문 스켈레톤 */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-zinc-800 rounded animate-pulse"></div>
            ))}
          </div>
        </main>

        {/* 사이드바 스켈레톤 */}
        <aside className="w-full md:w-[400px]">
          <div className="bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="h-6 bg-zinc-800 rounded animate-pulse w-1/2"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-zinc-800 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}