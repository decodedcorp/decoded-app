'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GlobalSearchBar } from '@/shared/components/GlobalSearchBar';

interface SearchHeaderProps {
  query: string;
}

export function SearchHeader({ query }: SearchHeaderProps) {
  const router = useRouter();

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="mb-8">
      <div className="max-w-2xl">
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
          Search results for "{query}"
        </h1>
        <p className="text-zinc-400 mb-6">Found search results in channels and content</p>
      </div>
    </div>
  );
}
