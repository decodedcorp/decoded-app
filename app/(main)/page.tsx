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
          {/* 모든 섹션이 동일한 스타일의 헤더를 사용 */}
          <Explore position="left-main" of="identity" />
          <TrendingSection slideCount={0} />
          <DetailsImagesSection
            imageId={['67c17e50b354be5440d43c95', '67c18108c7937762aa70a9c6']}
          />
          {/* dev
          <DetailsImagesSection
            imageId={['677ba9a162743947bb167e1a', '67b5ac792e8764aebffe0ffc']}
          /> */}
          <Explore position="right-main" of="identity" />
          <DetailsImagesSection
            imageId={['67c1913585e28126df021377', '67c197aa3c682a3df3d2eeb0']}
          />
          {/* dev
          <DetailsImagesSection
            imageId={['677ba9a162743947bb167e1a', '67b5ac792e8764aebffe0ffc']}
          /> */}
          <TrendingSection slideCount={5} />
          <TrendingKeywordsSection />
        </div>
      </div>
    </>
  );
}
