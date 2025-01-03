'use client';
import { ChevronDown } from 'lucide-react';

import { MetricsSection } from './components/sections/metric';
import { DiscoverSection } from './components/sections/discover';
import { PremiumSpotSection } from './components/sections/premium-spot';
import { TrendingSection } from './components/trending';
import { GridBackground } from './grid-box';
import { cn } from '@/lib/utils';

import Link from 'next/link';
import { Hero } from './components/layouts/hero';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100vh] bg-black text-white">
      <Hero />
      <div className="space-y-24 py-16">
        <MetricsSection />
        <DiscoverSection />
        <PremiumSpotSection />
        <TrendingSection />
      </div>
    </div>
  );
}
