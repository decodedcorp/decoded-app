import { Header } from "@/lib/components";
import { MainFooter, HomeAnimatedContent } from "@/lib/components/main";
import { fetchPostsServer } from "@/lib/api/posts";
import {
  apiPostToHeroData,
  apiPostToHeroSlide,
  apiPostToWeeklyBestStyle,
  apiPostToStyleCardData,
  formatArtistSpotlightSubtitle,
} from "@/lib/utils/main-page-mapper";

export default async function Home() {
  const [
    heroRes,
    artistSpotlightRes,
    decodedStylesRes,
    needDecodingRes,
    weeklyBestRes,
  ] = await Promise.all([
    fetchPostsServer({ sort: "popular", per_page: 5 }),
    fetchPostsServer({ sort: "popular", per_page: 4 }),
    fetchPostsServer({
      has_solutions: true,
      sort: "recent",
      per_page: 6,
    }),
    fetchPostsServer({
      has_solutions: false,
      sort: "recent",
      per_page: 6,
    }),
    fetchPostsServer({ sort: "popular", per_page: 8 }),
  ]);

  const heroData =
    heroRes.data.length > 0 ? apiPostToHeroData(heroRes.data[0]) : undefined;
  const heroSlides = heroRes.data.slice(0, 5).map(apiPostToHeroSlide);
  const artistSpotlightStyles = artistSpotlightRes.data.map(
    apiPostToStyleCardData
  );
  const artistSpotlightSubtitle = formatArtistSpotlightSubtitle(
    artistSpotlightStyles
  );
  const solvedPostStyles = decodedStylesRes.data.map((p) => ({
    ...apiPostToStyleCardData(p),
    hasSolutions: true,
  }));
  const curiousItemsStyles = needDecodingRes.data.map((p) => ({
    ...apiPostToStyleCardData(p),
    hasSolutions: false,
  }));
  const whatsNewStyles = solvedPostStyles;
  const weeklyBestStyles = weeklyBestRes.data.map(apiPostToWeeklyBestStyle);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HomeAnimatedContent
        heroData={heroData}
        heroSlides={heroSlides}
        artistSpotlightStyles={artistSpotlightStyles}
        artistSpotlightSubtitle={artistSpotlightSubtitle}
        solvedPostStyles={solvedPostStyles}
        curiousItemsStyles={curiousItemsStyles}
        whatsNewStyles={whatsNewStyles}
        weeklyBestStyles={weeklyBestStyles}
      />

      <MainFooter />
    </div>
  );
}
