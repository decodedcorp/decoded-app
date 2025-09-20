'use client';

import React from 'react';

interface PostCardSkeletonProps {
  count?: number;
}

// 개별 스켈레톤 카드 컴포넌트 - 실제 PostCard와 동일한 레이아웃
const SkeletonCard = React.memo(() => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all duration-200 group max-w-4xl mx-auto relative animate-pulse">
    <div className="p-4">
      {/* 상단: 채널 정보 및 메타데이터 스켈레톤 */}
      <div className="flex items-center gap-3 mb-3">
        {/* 동그란 채널 썸네일 스켈레톤 */}
        <div className="w-9 h-9 bg-zinc-800 rounded-full flex-shrink-0" />

        {/* 채널명, 작성자, 시간 스켈레톤 */}
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 bg-zinc-800 rounded w-20" />
          <div className="w-1 h-1 bg-zinc-700 rounded-full" />
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-zinc-800 rounded-full" />
            <div className="h-4 bg-zinc-800 rounded w-16" />
          </div>
          <div className="w-1 h-1 bg-zinc-700 rounded-full" />
          <div className="h-4 bg-zinc-800 rounded w-12" />
        </div>
      </div>

      {/* 포스트 콘텐츠 영역 스켈레톤 */}
      <div className="p-2 -m-2">
        {/* 제목 스켈레톤 */}
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-zinc-800 rounded w-full" />
          <div className="h-6 bg-zinc-800 rounded w-4/5" />
        </div>

        {/* 설명 스켈레톤 */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-5/6" />
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
        </div>

        {/* 썸네일 이미지 스켈레톤 */}
        <div className="mb-4">
          <div className="w-full h-64 bg-zinc-800 rounded-lg relative">
            {/* 콘텐츠 타입 배지 스켈레톤 */}
            <div className="absolute top-3 right-3 bg-zinc-700 w-8 h-6 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

// 스켈레톤 로더 컴포넌트
export const PostCardSkeleton: React.FC<PostCardSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
  );
};

// 인라인 로딩 스켈레톤 (무한스크롤 중 사용) - 실제 PostCard와 동일한 레이아웃
export const InlinePostSkeleton = React.memo(() => (
  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg overflow-hidden hover:border-zinc-700/50 transition-all duration-200 group max-w-4xl mx-auto relative animate-pulse">
    <div className="p-4">
      {/* 상단: 채널 정보 및 메타데이터 스켈레톤 */}
      <div className="flex items-center gap-3 mb-3">
        {/* 동그란 채널 썸네일 스켈레톤 */}
        <div className="w-9 h-9 bg-zinc-800/50 rounded-full flex-shrink-0" />

        {/* 채널명, 작성자, 시간 스켈레톤 */}
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 bg-zinc-800/50 rounded w-20" />
          <div className="w-1 h-1 bg-zinc-700/50 rounded-full" />
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-zinc-800/50 rounded-full" />
            <div className="h-4 bg-zinc-800/50 rounded w-16" />
          </div>
          <div className="w-1 h-1 bg-zinc-700/50 rounded-full" />
          <div className="h-4 bg-zinc-800/50 rounded w-12" />
        </div>
      </div>

      {/* 포스트 콘텐츠 영역 스켈레톤 */}
      <div className="p-2 -m-2">
        {/* 제목 스켈레톤 */}
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-zinc-800/50 rounded w-full" />
          <div className="h-6 bg-zinc-800/50 rounded w-4/5" />
        </div>

        {/* 설명 스켈레톤 */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-zinc-800/50 rounded w-full" />
          <div className="h-4 bg-zinc-800/50 rounded w-5/6" />
          <div className="h-4 bg-zinc-800/50 rounded w-3/4" />
        </div>

        {/* 썸네일 이미지 스켈레톤 */}
        <div className="mb-4">
          <div className="w-full h-64 bg-zinc-800/50 rounded-lg relative">
            {/* 콘텐츠 타입 배지 스켈레톤 */}
            <div className="absolute top-3 right-3 bg-zinc-700/50 w-8 h-6 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

InlinePostSkeleton.displayName = 'InlinePostSkeleton';
