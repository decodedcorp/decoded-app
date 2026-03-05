import {
  MainHero,
  MasonryGrid,
  PersonalizeBanner,
  SmartNav,
} from "@/lib/components/main-renewal";
import type {
  MainHeroData,
  GridItemData,
  PersonalizeBannerData,
} from "@/lib/components/main-renewal";
import heroData from "@/lib/components/main-renewal/mock/main-hero.json";
import gridItems from "@/lib/components/main-renewal/mock/main-grid-items.json";
import bannerData from "@/lib/components/main-renewal/mock/personalize-banner.json";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <SmartNav />
      <MainHero data={heroData as MainHeroData} />

      {/* Dynamic Grid Section */}
      <section className="relative">
        <MasonryGrid items={gridItems as GridItemData[]} />
      </section>

      {/* Personalize Banner - Soft Wall */}
      <PersonalizeBanner data={bannerData as PersonalizeBannerData} />

      {/* Minimal footer */}
      <footer className="py-16 text-center bg-[#050505]">
        <p className="text-[#f5f5f5]/30 text-xs tracking-[0.3em] uppercase">
          Decoded Magazine &copy; 2026
        </p>
      </footer>
    </div>
  );
}
