'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchPageContent } from './components/SearchPageContent';

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-black pt-[60px] md:pt-[72px]">
      <SearchPageContent query={query} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black pt-[60px] md:pt-[72px]" />}>
      <SearchPageInner />
    </Suspense>
  );
}
