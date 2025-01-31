'use client';

import { useTrendingImages } from '../hooks/use-trending-images';
import { RelatedSection } from './related-section';

export function TrendingImagesWrapper() {
  const { data, isLoading, error } = useTrendingImages();
  
  return (
    <RelatedSection
      images={data || []}
      isLoading={isLoading}
    />
  );
} 