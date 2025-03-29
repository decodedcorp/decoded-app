'use client';

import { ProductGrid } from './components/product-grid';
import { SectionHeader } from '@/components/ui/section-header';
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function TrendingSection({ slideCount }: { slideCount: number }) {
  const { t } = useLocaleContext();

  return (
    <section className="container mx-auto px-4 sm:px-4 lg:px-6">
      <div className="space-y-8">
        {/* 헤더 */}
        <SectionHeader title={t.home.trending.title} description={t.home.trending.description} />
        
        {/* 상품 그리드 */}
        <ProductGrid slideCount={slideCount} />
      </div>
    </section>
  );
}
