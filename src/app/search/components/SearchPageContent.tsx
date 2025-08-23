'use client';

import React from 'react';
import { SearchResults } from './SearchResults';
import { SearchHeader } from './SearchHeader';
import { useCombinedSearch } from '@/domains/search/hooks/useSearch';

interface SearchPageContentProps {
  query: string;
}

export function SearchPageContent({ query }: SearchPageContentProps) {
  if (!query) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-zinc-400">
          <h2 className="text-2xl font-semibold mb-2">Enter a search term</h2>
          <p>Search for channels and content</p>
        </div>
      </div>
    );
  }

  // 검색어가 너무 짧은 경우
  if (query.trim().length < 2) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-zinc-400">
          <h2 className="text-2xl font-semibold mb-2">Search term too short</h2>
          <p>Please enter at least 2 characters to search</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      {/* Search header */}
      <SearchHeader query={query} />

      {/* Search results */}
      <SearchResults query={query} />
    </div>
  );
}
