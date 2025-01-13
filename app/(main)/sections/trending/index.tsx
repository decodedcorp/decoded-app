'use client';

import { CategoryFilter } from './components/category-filter';
import { ProductGrid } from './components/product-grid';
import { TrendingHeader } from './server/header';

export function TrendingSection() {
  return (
    <section className="container mx-auto px-4">
      <div className="space-y-8">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <TrendingHeader />
          <CategoryFilter
            onCategoryChange={(category) => {
              // TODO: 서버 액션으로 카테고리 필터링 구현
              console.log('Category changed:', category);
            }}
          />
        </div>

        <ProductGrid category="전체" />
      </div>
    </section>
  );
}
