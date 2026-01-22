import {
  MainPageHeader,
  SearchSection,
  HeroSection,
  DecodedPickSection,
  ArtistSpotlightSection,
  WhatsNewSection,
  DiscoverItemsSection,
  DiscoverProductsSection,
  BestItemSection,
  WeeklyBestSection,
  TrendingNowSection,
  MainFooter,
} from "@/lib/components/main";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <MainPageHeader />

      {/* Search Section */}
      <SearchSection />

      {/* Hero Section */}
      <HeroSection />

      {/* DECODED'S PICK Section */}
      <DecodedPickSection />

      {/* Artist Spotlight Section */}
      <ArtistSpotlightSection />

      {/* What's New Section */}
      <WhatsNewSection />

      {/* Discover Items Section */}
      <DiscoverItemsSection />

      {/* Discover Products Section */}
      <DiscoverProductsSection />

      {/* Best Item Section */}
      <BestItemSection />

      {/* Weekly Best Section */}
      <WeeklyBestSection />

      {/* Trending Now Section */}
      <TrendingNowSection />

      {/* Footer */}
      <MainFooter />
    </div>
  );
}
