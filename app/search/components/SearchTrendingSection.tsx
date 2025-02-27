'use client';

import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageCard } from './searchResults'; // ImageCard 컴포넌트를 export 해야 함
import { useState } from 'react';

interface TrendingImage {
  image: {
    _id: string;
    img_url: string;
    title: string | null;
    upload_by: string;
    requested_items: Record<
      string,
      Array<{
        item_doc_id: string;
        position: {
          top: string;
          left: string;
        };
      }>
    >;
    like: number;
  };
}

interface SearchTrendingSectionProps {
  trending_images: TrendingImage[];
}

export function SearchTrendingSection({ trending_images }: SearchTrendingSectionProps) {
  const [hoveredTrendingId, setHoveredTrendingId] = useState<string | null>(null);

  if (!trending_images || trending_images.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-zinc-900/30">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#EAFD66]" />
          <h2 className="text-lg font-medium text-white">트렌딩 나우</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
          {trending_images.map((image) => (
            <ImageCard
              key={image.image._id}
              image={image.image}
              onHover={setHoveredTrendingId}
              hoveredId={hoveredTrendingId}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 