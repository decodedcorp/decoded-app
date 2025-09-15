'use client';

import React from 'react';

import { useCombinedSearch } from '@/domains/search/hooks/useSearch';
import { useCommonTranslation } from '@/lib/i18n/hooks';

import { SearchResults } from './SearchResults';
import { SearchHeader } from './SearchHeader';

interface SearchPageContentProps {
  query: string;
}

export function SearchPageContent({ query }: SearchPageContentProps) {
  const t = useCommonTranslation();

  if (!query) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-zinc-400">
          <h2 className="text-2xl font-semibold mb-2">{t.search.enterSearchTerm()}</h2>
          <p>{t.search.searchForChannelsAndContent()}</p>
        </div>
      </div>
    );
  }

  // 검색어가 너무 짧은 경우
  if (query.trim().length < 2) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-zinc-400">
          <h2 className="text-2xl font-semibold mb-2">{t.search.searchTermTooShort()}</h2>
          <p>{t.search.enterAtLeast2Characters()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      {/* Search header */}
      <SearchHeader query={query} />

      {/* Search results */}
      <SearchResults query={query} />
    </div>
  );
}
