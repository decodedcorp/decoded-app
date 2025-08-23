'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface ExploreHeaderProps {
  onFilterChange?: (filters: ExploreFilters) => void;
  totalChannels?: number;
  className?: string;
}

export interface ExploreFilters {
  search: string;
  category: string;
  sortBy: 'recent' | 'popular' | 'content' | 'subscribers';
  sortOrder: 'asc' | 'desc';
}

const CATEGORY_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'technology', label: 'Technology' },
  { id: 'design', label: 'Design' },
  { id: 'business', label: 'Business' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'education', label: 'Education' },
  { id: 'entertainment', label: 'Entertainment' },
];


export function ExploreHeader({
  onFilterChange,
  totalChannels = 0,
  className = '',
}: ExploreHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<ExploreFilters>(() => ({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    sortBy: (searchParams.get('sort') as any) || 'popular',
    sortOrder: (searchParams.get('order') as any) || 'desc',
  }));

  const [topicSearch, setTopicSearch] = useState('');

  // Update filters and notify parent
  const updateFilters = useCallback(
    (newFilters: Partial<ExploreFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFilterChange?.(updatedFilters);

      // Update URL params
      const params = new URLSearchParams();
      if (updatedFilters.search) params.set('q', updatedFilters.search);
      if (updatedFilters.category !== 'all') params.set('category', updatedFilters.category);
      if (updatedFilters.sortBy !== 'popular') params.set('sort', updatedFilters.sortBy);
      if (updatedFilters.sortOrder !== 'desc') params.set('order', updatedFilters.sortOrder);

      const queryString = params.toString();
      const newUrl = queryString ? `?${queryString}` : '/';
      router.replace(newUrl, { scroll: false });
    },
    [filters, onFilterChange, router],
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      updateFilters({ category });
    },
    [updateFilters],
  );


  const handleTopicSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTopicSearch(e.target.value);
    updateFilters({ search: e.target.value });
  }, [updateFilters]);

  return (
    <div className={`bg-black/80 backdrop-blur-sm border-b border-zinc-800/50 ${className}`}>
      <div className="px-4 md:px-8 py-6">
        {/* Header Title and Stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-400">Explore Topics</h1>
          </div>
        </div>

        {/* Topic Search */}
        <div className="relative mb-6">
          <input
            type="text"
            value={topicSearch}
            onChange={handleTopicSearch}
            placeholder="토픽을 검색하거나 새로 추가해보세요..."
            className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-400 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all duration-300"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
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
          
          {/* Add Topic CTA - shows when searching and no results */}
          {topicSearch && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-zinc-900 border border-zinc-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    "{topicSearch}" 토픽을 찾을 수 없습니다
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    새로운 토픽을 추가해 큐레이션을 시작해보세요
                  </p>
                </div>
                <button 
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-gray-300 rounded-lg text-sm transition-colors duration-200"
                  onClick={() => {
                    // TODO: Implement add topic functionality
                    console.log('Add topic:', topicSearch);
                  }}
                >
                  토픽 추가
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filters.category === category.id
                    ? 'bg-[#eafd66] text-black font-semibold'
                    : 'bg-zinc-800/80 text-gray-400 hover:bg-zinc-700/80 hover:text-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
