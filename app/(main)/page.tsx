import { DiscoverSection } from './sections/discover';
import { PremiumSpot } from './sections/premium-spot';
import { TrendingSection } from './sections/trending';
import { HeroSection } from './sections/hero';
import { generateWebsiteSchema } from '@/lib/structured-data/geneartors/website';
import { TrendingKeywordsSection } from './sections/trending-keywords';
import Explore from './sections/explore';
// import DetailImagesSection from './sections/detail-images';

// 동적 렌더링 설정
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteSchema()),
        }}
      />
      <div className="flex flex-col min-h-[100vh] bg-black text-white">
        <HeroSection />
        <div className="space-y-24 py-16">
          {/* Web Socket Action Feed <DiscoverSection /> */}
          <Explore />
          <TrendingSection />
          {/* Trending Items <PremiumSpot /> */}
          {/* <DetailImagesSection /> */}
          <TrendingKeywordsSection />
        </div>
      </div>
    </>
  );
}
