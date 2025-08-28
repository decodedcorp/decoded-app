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



  return (
    <div className={`bg-black/80 backdrop-blur-sm ${className}`}>
      <div className="px-4 md:px-8 py-6">
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-400">Explore Topics</h1>
          <p className="text-zinc-500 text-sm mt-1">Browse channels by topic</p>
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
