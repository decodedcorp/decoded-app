import { MetricsSection } from './sections/metric';
import { DiscoverSection } from './sections/discover';
import { PremiumSpotSection } from './sections/premium-spot';
import { TrendingSection } from './sections/trending';

import { HeroSection } from './sections/hero';

// 동적 렌더링 설정
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100vh] bg-black text-white">
      <HeroSection />
      <div className="space-y-24 pt-16">
        <MetricsSection />
        <DiscoverSection />
        <PremiumSpotSection />
        {/* <TrendingSection /> */}
      </div>
    </div>
  );
}
