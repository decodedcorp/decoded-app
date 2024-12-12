// app/(main)/page.tsx
'use client';

import { HeroCarousel } from './components/sections/hero-carousel';
import { DirectorPicks } from './components/sections/director-pick';
import { DiscoverSection } from './components/sections/discover';
import { TrendingKeywords } from './components/sections/trending';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <HeroCarousel />
      <DirectorPicks />
      <DiscoverSection />
      <TrendingKeywords />
    </div>
  );
}
