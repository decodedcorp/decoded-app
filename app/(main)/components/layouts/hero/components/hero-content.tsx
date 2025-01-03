'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { networkManager } from '@/lib/network/network';

interface FeaturedImage {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
}

export function HeroContent() {
  const [featuredImage, setFeaturedImage] = useState<FeaturedImage | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedImage() {
      try {
        const response = await networkManager.request(
          'images/featured/main',
          'GET',
          null
        );
        setFeaturedImage({
          id: response.data.id,
          imageUrl: response.data.imageUrl,
          title: response.data.title,
          description: response.data.description,
        });
      } catch (error) {
        console.error('Failed to fetch featured image:', error);
        // 폴백 이미지 사용
        setFeaturedImage({
          id: 'default',
          imageUrl: '/images/fallback-featured.webp',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedImage();
  }, []);

  const detailsUrl = featuredImage
    ? `/details?imageId=${featuredImage.id}&imageUrl=${encodeURIComponent(
        featuredImage.imageUrl
      )}&isFeatured=yes`
    : '#';

  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center justify-center space-x-4 font-mono text-xl text-primary">
        <span>Decoding</span>
        <span>&</span>
        <span>Request</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground whitespace-pre-line text-center max-w-3xl">
        {'찾고싶은 제품을\n지금 바로 요청해보세요'}
      </h1>
      <Link
        href="/request"
        className="inline-flex h-11 items-center justify-center rounded-none px-8 py-3 bg-primary font-mono font-bold text-black hover:bg-primary/90 transition-colors"
      >
        요청하기
      </Link>
    </div>
  );
}
