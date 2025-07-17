import { RelatedSection } from './client/related-section';
import { Suspense } from 'react';
import { TrendingImagesWrapper } from './client/trending-images-wrapper';

export function TrendingRelatedSection() {
  return (
    <Suspense fallback={<RelatedSection 
      images={[]}
      isLoading={true}
    />}>
      <TrendingImagesWrapper />
    </Suspense>
  );
} 