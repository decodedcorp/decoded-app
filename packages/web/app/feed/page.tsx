import { Header } from "@/lib/components/Header";
import { fetchLatestImagesServer } from "@/lib/supabase/queries/images.server";
import { FeedClient } from "./FeedClient";

export default async function FeedPage() {
  // Fetch initial images server-side (fewer for vertical feed)
  const initialImages = await fetchLatestImagesServer(20);

  return (
    <>
      <Header />
      <main className="relative w-full h-screen overflow-hidden">
        <FeedClient initialImages={initialImages} />
      </main>
    </>
  );
}
