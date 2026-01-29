import { DesktopHeader, MobileHeader } from "@/lib/design-system";
import { fetchPostsServer } from "@/lib/api/posts";
import { ExploreClient } from "./ExploreClient";

export default async function ExplorePage() {
  // Fetch initial posts server-side via REST API
  const postsResponse = await fetchPostsServer({
    per_page: 40,
    sort: "recent",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Headers */}
      <DesktopHeader />
      <MobileHeader />

      {/* Main content with header padding */}
      <main className="flex-1 pt-14 pb-14 md:pt-16 md:pb-0">
        <ExploreClient initialPosts={postsResponse.data} />
      </main>
    </div>
  );
}
