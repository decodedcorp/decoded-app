'use client';

import React, { useState } from 'react';

interface ChannelSearchBarProps {
  channelName: string;
  onSearch?: (query: string) => void;
  onClearChannel?: () => void;
  className?: string;
}

export function ChannelSearchBar({
  channelName,
  onSearch,
  onClearChannel,
  className = '',
}: ChannelSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onClearChannel?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative flex items-center bg-zinc-800/70 hover:bg-zinc-800/90 rounded-full border border-zinc-600/50 hover:border-zinc-500/50 focus-within:border-[#eafd66]/50 transition-all duration-200">
        {/* 큰 검색 아이콘 - Reddit 스타일 */}
        <div className="flex items-center justify-center w-12 h-12 text-zinc-400">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-center bg-zinc-700/60 rounded-full px-3 py-1.5 mx-2">
          <div className="flex items-center space-x-1.5">
            {/* 채널 아이콘 */}
            <div className="w-3 h-3 rounded-full bg-[#eafd66]"></div>
            <span className="text-[#eafd66] text-sm font-medium">{channelName}</span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 text-zinc-400 hover:text-white transition-colors p-0.5"
            aria-label="Clear channel filter"
          >
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 검색 입력 */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search in ${channelName}`}
          className="flex-1 py-3 pr-4 bg-transparent text-white placeholder-zinc-400 focus:outline-none rounded-full"
        />

        {/* 숨겨진 검색 버튼 (접근성을 위해 유지) */}
        <button type="submit" className="sr-only" aria-label="Search">
          Search
        </button>
      </div>
    </form>
  );
}
