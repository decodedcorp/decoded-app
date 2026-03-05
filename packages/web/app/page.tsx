import { Header } from "@/lib/components";
import { MainFooter, HomeAnimatedContent } from "@/lib/components/main";
import {
  fetchWeeklyBestPostsServer,
  fetchFeaturedPostServer,
  fetchWhatsNewPostsServer,
  fetchArtistSpotlightServer,
} from "@/lib/supabase/queries/main-page.server";
import {
  postToHeroData,
  postToWeeklyBestStyle,
  styleCardServerToStyleCardData,
  formatArtistSpotlightSubtitle,
} from "@/lib/utils/main-page-mapper";
import type { HeroSlide } from "@/lib/data/heroSlides";
import type { PostData } from "@/lib/supabase/queries/main-page.server";

function postToHeroSlide(post: PostData): HeroSlide {
  return {
    id: post.id,
    imageUrl: post.imageUrl ?? "",
    title: post.artistName || post.groupName || "Featured",
    subtitle: post.mediaTitle ?? undefined,
    link: `/posts/${post.id}`,
  };
}

export default async function Home() {
  const [featuredPost, artistSpotlightData, decodedStylesData, weeklyBestPosts] =
    await Promise.all([
      fetchFeaturedPostServer(),
      fetchArtistSpotlightServer(4, 0),
      fetchWhatsNewPostsServer(6),
      fetchWeeklyBestPostsServer(8),
    ]);

  // Hero section
  const heroData = featuredPost ? postToHeroData(featuredPost) : undefined;
  const heroPosts = await fetchWeeklyBestPostsServer(5);
  const heroSlides = heroPosts.map(postToHeroSlide);

  // Artist spotlight
  const artistSpotlightStyles = artistSpotlightData.map(
    styleCardServerToStyleCardData
  );
  const artistSpotlightSubtitle = formatArtistSpotlightSubtitle(
    artistSpotlightStyles
  );

  // Decoded styles & curious items
  const solvedPostStyles = decodedStylesData.map((d) => ({
    ...styleCardServerToStyleCardData(d),
    hasSolutions: true,
  }));
  const curiousItemsStyles = decodedStylesData.map((d) => ({
    ...styleCardServerToStyleCardData(d),
    hasSolutions: false,
  }));
  const whatsNewStyles = solvedPostStyles;

  // Weekly best
  const weeklyBestStyles = weeklyBestPosts.map(postToWeeklyBestStyle);

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
