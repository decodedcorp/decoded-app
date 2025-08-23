'use client';

import React, { useState } from 'react';

import { categories } from '../../constants/categoryConstants';

import { CategoryFilter } from './CategoryFilter';
import { MasonryGrid } from './MasonryGrid';

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
