import { Header } from '@/lib/components/Header';
import { fetchLatestImagesServer } from '@/lib/supabase/queries/images.server';
import { HomeClient } from './HomeClient';

export default async function Home() {
  // Fetch initial images server-side
  const initialImages = await fetchLatestImagesServer(50);

  return (
    <>
      <Header />
      <main className="relative w-screen h-screen overflow-hidden">
        <HomeClient initialImages={initialImages} />
      </main>
    </>
  );
}
