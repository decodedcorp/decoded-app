import React from 'react';

export function ChannelModalSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-start justify-between p-6 border-b border-zinc-700/50">
      <div className="flex items-start space-x-6 flex-1">
        {/* 썸네일 스켈레톤 */}
        <div className="w-20 h-20 rounded-full bg-zinc-800 animate-pulse border-2 border-zinc-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {/* 타이틀 스켈레톤 */}
          <div className="h-8 w-40 bg-zinc-700 rounded mb-3 animate-pulse" />
          {/* 설명 스켈레톤 */}
          <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors flex-shrink-0 ml-4"
        aria-label="Close modal"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
