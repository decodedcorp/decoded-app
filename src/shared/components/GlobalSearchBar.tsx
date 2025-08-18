'use client';

import React, { useState } from 'react';

interface GlobalSearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function GlobalSearchBar({ onSearch, className = '' }: GlobalSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative flex items-center bg-zinc-800/70 hover:bg-zinc-800/90 rounded-full border border-zinc-600/50 hover:border-zinc-500/50 transition-all duration-200">
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
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search channels and content..."
          className="flex-1 py-3 pr-4 bg-transparent text-white placeholder-zinc-400 focus:outline-none rounded-full"
        />
        
        {/* 숨겨진 검색 버튼 (접근성을 위해 유지) */}
        <button
          type="submit"
          className="sr-only"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
}