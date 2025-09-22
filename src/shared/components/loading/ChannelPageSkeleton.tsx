import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ChannelPageSkeletonProps {
  className?: string;
}

/**
 * 채널 페이지 전용 스켈레톤
 * 실제 레이아웃과 동일한 구조로 구성
 */
export function ChannelPageSkeleton({ className = '' }: ChannelPageSkeletonProps) {
  return (
    <div className={cn('space-y-16 px-4', className)}>
      {/* Trending Contents Section Skeleton */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-700">
            <div className="w-16 h-8 bg-zinc-800 rounded animate-pulse" />
            <div className="w-16 h-8 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Horizontal scroll cards */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 pb-4" style={{ width: 'max-content' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-64 flex-shrink-0">
                <div className="aspect-video bg-zinc-800 rounded-lg animate-pulse mb-3" />
                <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse mb-2" />
                <div className="h-3 w-1/2 bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Channels Section Skeleton */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-40 bg-zinc-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-56 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-700">
            <div className="w-16 h-8 bg-zinc-800 rounded animate-pulse" />
            <div className="w-16 h-8 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Horizontal scroll channel cards */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 pb-4" style={{ width: 'max-content' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-64 flex-shrink-0">
                <div className="aspect-square bg-zinc-800 rounded-lg animate-pulse mb-3" />
                <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse mb-2" />
                <div className="h-3 w-1/2 bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Section Skeleton */}
      <section>
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="h-8 w-32 bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
            </div>

            {/* Filter dropdowns skeleton */}
            <div className="hidden sm:flex flex-row gap-3 lg:gap-4">
              <div className="w-32 h-10 bg-zinc-800 rounded-lg animate-pulse" />
              <div className="w-32 h-10 bg-zinc-800 rounded-lg animate-pulse" />
            </div>

            {/* Mobile filter button */}
            <div className="sm:hidden">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Magazine style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-full">
              <div className="aspect-square bg-zinc-800 rounded-lg animate-pulse mb-4" />
              <div className="h-5 w-3/4 bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse mb-3" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
