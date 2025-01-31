'use client';

import { ProductGrid } from './components/product-grid';
import { TrendingHeader } from './server/header';

export function TrendingSection() {
  return (
    <section className="container mx-auto px-4">
      <div className="space-y-8">
        {/* 헤더 */}
        <TrendingHeader />
        
        {/* 상품 그리드 */}
        <ProductGrid />
      </div>
    </section>
  );
}
