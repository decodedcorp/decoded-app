'use client';

import { Hero } from './components/layouts/hero';
import { DirectorPicks } from './components/sections/director-pick';
import { DiscoverSection } from './components/sections/discover';
import { TrendingKeywords } from './components/sections/trending';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <DirectorPicks />
      <DiscoverSection />
      <TrendingKeywords />
    </div>
  );
}