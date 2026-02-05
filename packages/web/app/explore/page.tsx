import { fetchLatestImages } from "@decoded/shared/supabase/queries/images";
import { ExploreClient } from "./ExploreClient";

import { initSupabase } from "@decoded/shared/supabase/client";
import { getEnv } from "@/lib/supabase/env";

export default async function ExplorePage() {
  // Initialize shared Supabase client for shared queries
  initSupabase(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );

  // Fetch initial posts server-side via direct Supabase query
  const initialImages = await fetchLatestImages(40);

  return <ExploreClient initialImages={initialImages} />;
}
