'use client';

import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search channels, content...',
  onSearch,
  className = '',
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Default behavior - console log
      console.log('Search query:', searchQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex-1 max-w-md mx-4 md:mx-8 ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="
            w-full
            px-4 py-2 pl-10
            bg-white/10 backdrop-blur-sm
            border border-white/20
            rounded-full
            text-white placeholder-white/60
            focus:outline-none focus:ring-2 focus:ring-[#EAFD66]/50 focus:border-[#EAFD66]/50
            transition-all duration-200
          "
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </form>
  );
}
