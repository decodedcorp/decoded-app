'use client';

import { useSearchParams, notFound } from 'next/navigation';
import { MultiImageView } from './components/multi-image-view';

export default function DetailPage() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');
  const imageUrl = searchParams.get('imageUrl');

  if (!imageId || !imageUrl) {
    notFound();
  }

  return <MultiImageView imageId={imageId} />;
}
