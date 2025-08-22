'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchPageContent } from './components/SearchPageContent';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-black pt-[60px] md:pt-[72px]">
      <SearchPageContent query={query} />
    </div>
  );
}
