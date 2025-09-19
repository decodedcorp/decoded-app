'use client';

import React, { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { SearchPageContent } from './components/SearchPageContent';

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return <SearchPageContent query={query} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div />}>
      <SearchPageInner />
    </Suspense>
  );
}
