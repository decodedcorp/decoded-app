import { Header } from "@/lib/components/Header";
import { fetchLatestImagesServer } from "@/lib/supabase/queries/images.server";
import { FeedClient } from "./FeedClient";

export default async function FeedPage() {
  // Fetch initial images server-side (fewer for vertical feed)
  const initialImages = await fetchLatestImagesServer(20);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-14 pb-14 md:pt-16 md:pb-0">
        <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)]">
          <FeedClient initialImages={initialImages} />
        </div>
      </main>
    </>
  );
}
