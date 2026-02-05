import { Header } from "@/lib/components/Header";
import { FeedClient } from "./FeedClient";

export default function FeedPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-14 pb-14 md:pt-16 md:pb-0">
        <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)]">
          <FeedClient />
        </div>
      </main>
    </>
  );
}
