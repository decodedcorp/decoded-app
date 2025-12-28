import { fetchLatestImagesServer } from "@/lib/supabase/queries/images.server";
import { ImagesClient } from "./ImagesClient";

export default async function ImagesPage() {
  const initialImages = await fetchLatestImagesServer(20);

  return (
    <main className="px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Images</h1>
      <ImagesClient initialImages={initialImages} />
    </main>
  );
}
