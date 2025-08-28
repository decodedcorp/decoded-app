'use client';

import React from 'react';

interface PostCardSkeletonProps {
  count?: number;
}

// 개별 스켈레톤 카드 컴포넌트 - 메모화로 성능 최적화
const SkeletonCard = React.memo(() => (
  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 animate-pulse">
    <div className="flex gap-3">
      {/* 썸네일 스켈레톤 */}
      <div className="w-16 h-16 bg-zinc-800 rounded flex-shrink-0 animate-pulse" />
      
      <div className="flex-1 space-y-3">
        {/* 제목 스켈레톤 */}
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
        </div>
        
        {/* 설명 스켈레톤 */}
        <div className="space-y-1">
          <div className="h-3 bg-zinc-800 rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-zinc-800 rounded w-2/3 animate-pulse" />
        </div>
        
        {/* 메타 정보 스켈레톤 */}
        <div className="flex items-center space-x-4 pt-2">
          <div className="h-3 bg-zinc-800 rounded w-20 animate-pulse" />
          <div className="h-3 bg-zinc-800 rounded w-16 animate-pulse" />
          <div className="h-3 bg-zinc-800 rounded w-14 animate-pulse" />
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

// 인라인 로딩 스켈레톤 (무한스크롤 중 사용)
export const InlinePostSkeleton = React.memo(() => (
  <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 animate-pulse">
    <div className="flex gap-3">
      <div className="w-14 h-14 bg-zinc-800/50 rounded flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-zinc-800/50 rounded w-full" />
        <div className="h-3 bg-zinc-800/50 rounded w-4/5" />
        <div className="flex space-x-3 pt-1">
          <div className="h-2 bg-zinc-800/50 rounded w-16" />
          <div className="h-2 bg-zinc-800/50 rounded w-12" />
        </div>
      </div>
    </div>
  </div>
));

InlinePostSkeleton.displayName = 'InlinePostSkeleton';