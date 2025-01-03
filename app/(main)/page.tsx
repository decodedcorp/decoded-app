"use client";

import { DirectorPicks } from "./components/sections/director-pick";
import { DiscoverSection } from "./components/sections/discover";
import { TrendingKeywords } from "./components/sections/trending";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <DirectorPicks />
      <DiscoverSection />
      <TrendingKeywords />
    </div>
  );
}
