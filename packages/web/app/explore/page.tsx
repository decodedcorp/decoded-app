import { Header } from "@/lib/components/Header";
import { fetchLatestImagesServer } from "@/lib/supabase/queries/images.server";
import { ExploreClient } from "./ExploreClient";

export default async function ExplorePage() {
  // Fetch initial images server-side for Pinterest-style grid
  const initialImages = await fetchLatestImagesServer(50);

  return (
    <>
      <Header />
      <main className="relative w-full h-screen overflow-hidden">
        <ExploreClient initialImages={initialImages} />
      </main>
    </>
  );
}
