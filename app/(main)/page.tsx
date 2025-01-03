'use client';

import { DirectorPicks } from './components/sections/director-pick';
import { DiscoverSection } from './components/sections/discover';
import { TrendingKeywords } from './components/sections/trending';
import { Hero } from './components/layouts/hero';
import { ProvideTest } from './components/sections/provide-test';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <Hero />
      <ProvideTest />
      <DirectorPicks />
      <DiscoverSection />
      <TrendingKeywords />
    </div>
  );
}
