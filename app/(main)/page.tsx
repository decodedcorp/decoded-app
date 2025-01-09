import { MetricsSection } from './sections/metric';
import { DiscoverSection } from './sections/discover';
import { PremiumSpotSection } from './sections/premium-spot';
import { TrendingSection } from './sections/trending';

import { Hero } from './sections/hero';

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
