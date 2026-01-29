import { Header } from "@/lib/components";
import { MainFooter, HomeAnimatedContent } from "@/lib/components/main";
import {
  fetchWeeklyBestImagesServer,
  fetchBestItemsServer,
  fetchFeaturedImageServer,
  fetchWhatsNewStylesServer,
  fetchWhatsNewItemsServer,
  fetchDecodedPickServer,
  fetchArtistSpotlightServer,
  fetchItemsByAccountServer,
  fetchTrendingKeywordsServer,
} from "@/lib/supabase/queries/main-page.server";
import {
  imageWithPostToWeeklyBestStyle,
  itemWithImageToItemCardData,
  imageWithPostToHeroData,
  whatsNewStyleToStyleCardData,
  whatsNewItemToItemCardData,
} from "@/lib/utils/main-page-mapper";

export default async function Home() {
  // Fetch data in parallel for better performance
  const [
    weeklyBestData,
    bestItemsData,
    featuredData,
    whatsNewStylesData,
    whatsNewItemsData,
    decodedPickData,
    artistSpotlightData,
    newjeansItems,
    blackpinkItems,
    trendingKeywords,
  ] = await Promise.all([
    fetchWeeklyBestImagesServer(8),
    fetchBestItemsServer(6),
    fetchFeaturedImageServer(),
    fetchWhatsNewStylesServer(2),
    fetchWhatsNewItemsServer(4),
    fetchDecodedPickServer(),
    fetchArtistSpotlightServer(2, 3),
    fetchItemsByAccountServer("뉴진스", 6),
    fetchItemsByAccountServer("블랙핑크", 6),
    fetchTrendingKeywordsServer(7),
  ]);

  const weeklyBestStyles = weeklyBestData.map(imageWithPostToWeeklyBestStyle);
  const bestItems = bestItemsData.map(itemWithImageToItemCardData);
  const heroData = featuredData
    ? imageWithPostToHeroData(featuredData)
    : undefined;
  const whatsNewStyles = whatsNewStylesData.map(whatsNewStyleToStyleCardData);
  const whatsNewItems = whatsNewItemsData.map((item) =>
    whatsNewItemToItemCardData(item, true)
  );
  const decodedPickStyle = decodedPickData.style
    ? whatsNewStyleToStyleCardData(decodedPickData.style)
    : undefined;
  const decodedPickItems = decodedPickData.items.map(
    itemWithImageToItemCardData
  );
  const artistSpotlightStyles = artistSpotlightData.map(
    whatsNewStyleToStyleCardData
  );
  const discoverItemsByTab = {
    newjeans: newjeansItems.map(itemWithImageToItemCardData),
    blackpink: blackpinkItems.map(itemWithImageToItemCardData),
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Mobile Header - only visible on mobile */}
      <Header />

      <HomeAnimatedContent
        heroData={heroData}
        weeklyBestStyles={weeklyBestStyles}
        bestItems={bestItems}
        whatsNewStyles={whatsNewStyles}
        whatsNewItems={whatsNewItems}
        decodedPickStyle={decodedPickStyle}
        decodedPickItems={decodedPickItems}
        artistSpotlightStyles={artistSpotlightStyles}
        discoverItemsByTab={discoverItemsByTab}
        trendingKeywords={trendingKeywords}
      />

      {/* Footer */}
      <MainFooter />
    </div>
  );
}
