'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { GlobalSearchBar } from '@/shared/components/GlobalSearchBar';
import { useCommonTranslation } from '@/lib/i18n/hooks';

interface SearchHeaderProps {
  query: string;
}

export function SearchHeader({ query }: SearchHeaderProps) {
  const router = useRouter();
  const t = useCommonTranslation();

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="mb-8">
      <div className="max-w-2xl">
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
          {t.search.searchResultsFor(query)}
        </h1>
        <p className="text-zinc-400 mb-6">{t.search.foundResultsInChannelsAndContent()}</p>
      </div>
    </div>
  );
}
