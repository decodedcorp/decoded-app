import {
  MainHero,
  MasonryGrid,
  PersonalizeBanner,
} from "@/lib/components/main-renewal";
import type {
  MainHeroData,
  GridItemData,
  PersonalizeBannerData,
} from "@/lib/components/main-renewal";
import {
  fetchFeaturedPostServer,
  fetchWeeklyBestPostsServer,
} from "@/lib/supabase/queries/main-page.server";
import bannerData from "@/lib/components/main-renewal/mock/personalize-banner.json";

export default async function Home() {
  const [featuredPost, weeklyBestPosts] = await Promise.all([
    fetchFeaturedPostServer(),
    fetchWeeklyBestPostsServer(8),
  ]);

  const heroData: MainHeroData =
    featuredPost && featuredPost.imageUrl
      ? {
          celebrityName: (
            featuredPost.artistName ||
            featuredPost.groupName ||
            "DECODED"
          ).toUpperCase(),
          editorialTitle:
            featuredPost.context ||
            featuredPost.mediaTitle ||
            "Today's Featured Look",
          editorialSubtitle: featuredPost.groupName
            ? `${featuredPost.groupName} — Curated by AI`
            : "AI가 큐레이션한 오늘의 에디토리얼",
          heroImageUrl: featuredPost.imageUrl,
          ctaLink: `/posts/${featuredPost.id}`,
          ctaLabel: "VIEW EDITORIAL",
        }
      : ((
          await import("@/lib/components/main-renewal/mock/main-hero.json")
        ).default as MainHeroData);

  const gridItems: GridItemData[] =
    weeklyBestPosts.length > 0
      ? weeklyBestPosts
          .filter((p) => p.imageUrl)
          .map((post, i) => ({
            id: post.id,
            imageUrl: post.imageUrl!,
            title: post.artistName || post.groupName || "Unknown",
            subtitle: post.context || post.mediaTitle || undefined,
            category: post.mediaType || "Style",
            link: `/posts/${post.id}`,
            aspectRatio: [1.25, 1.0, 1.4, 0.8, 1.2, 1.0, 1.5, 0.9][i % 8],
          }))
      : ((
          await import(
            "@/lib/components/main-renewal/mock/main-grid-items.json"
          )
        ).default as GridItemData[]);

  return (
    <div className="min-h-screen bg-[#050505]">
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
