'use client';

import React, { useState } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { MasonryGrid } from './MasonryGrid';

// Fuse.kiwi 스타일 카테고리
const categories = [
  { id: 'all', name: 'all' },
  { id: 'graphic', name: 'graphic' },
  { id: 'illustration', name: 'illustration' },
  { id: 'photo', name: 'photo' },
  { id: 'art', name: 'art' },
  { id: '3d', name: '3d' },
  { id: 'video', name: 'video' },
  { id: 'website', name: 'website' },
  { id: 'music', name: 'music' },
  { id: 'type', name: 'type' },
];

export function CategoryGrid() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <section className="px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Category Filter - Fuse.kiwi 스타일 */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Content Grid Placeholder */}
        <div className="mt-16">
          <MasonryGrid />
        </div>
      </div>
    </section>
  );
}
