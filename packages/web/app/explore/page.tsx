import { Header } from "@/lib/components/Header";
import { fetchPostsServer } from "@/lib/api/posts";
import { ExploreClient } from "./ExploreClient";

export default async function ExplorePage() {
  // Fetch initial posts server-side via REST API
  const postsResponse = await fetchPostsServer({
    per_page: 40,
    sort: "recent",
  });

  return (
    <>
      <Header />
      <main className="relative w-full h-screen overflow-hidden">
        <ExploreClient initialPosts={postsResponse.data} />
      </main>
    </>
  );
}
