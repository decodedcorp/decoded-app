import { DiscoverSection } from "./sections/discover";
import { TrendingSection } from "./sections/trending";
import { HeroSection } from "./sections/hero";
import { generateWebsiteSchema } from "@/lib/structured-data/geneartors/website";
import { TrendingKeywordsSection } from "./sections/trending-keywords";
import Explore from "./sections/explore";
import DetailsImagesSection from "./sections/details-images";
import { CurationSection } from "./sections/curation";

// 동적 렌더링 설정
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteSchema()),
        }}
      />
      <div className="flex flex-col min-h-[100vh] bg-black text-white/80 overflow-x-hidden">
        <HeroSection />
        <div className="space-y-24 py-16 px-2 max-w-[95%] mx-auto">
          {/* 모든 섹션이 동일한 스타일의 헤더를 사용 */}
          <Explore position="left-main" of="identity" />
          <TrendingSection slideCount={0} />
          <CurationSection type="identity" variant="card" />
          <DetailsImagesSection />
          <CurationSection type="brand" variant="banner" />
          <CurationSection type="context" variant="story" isRow={true} />
          <TrendingKeywordsSection />
        </div>
      </div>
    </>
  );
}
