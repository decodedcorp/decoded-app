import { DiscoverSection } from './sections/discover';
import { TrendingSection } from './sections/trending';
import { HeroSection } from './sections/hero';
import { generateWebsiteSchema } from '@/lib/structured-data/geneartors/website';
import { TrendingKeywordsSection } from './sections/trending-keywords';
import Explore from './sections/explore';
import DetailsImagesSection from './sections/details-images';

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
          <Explore position="left-main" of="identity" />
          <TrendingKeywordsSection />
          <TrendingSection slideCount={0} />
          {/* Trending Items <PremiumSpot /> */}
          <DetailsImagesSection
            imageId={['67766611b44be093e37e3446', '6776777eda015f1e34b31487']}
          />
          <Explore position="right-main" of="brand" />
          <DetailsImagesSection
            imageId={['67a761e0a89f4a060f0ddc35', '6797cfec98846810d2becd8b']}
          />
          <TrendingSection slideCount={5} />
        </div>
      </div>
    </>
  );
}
