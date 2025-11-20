"use client";

import { memo } from "react";
import { Header } from "@/lib/components/Header";
import ThiingsGrid, { type ItemConfig } from "@/lib/components/ThiingsGrid";
import { useFilterStore } from "@/lib/stores/filterStore";
import { useSearchStore } from "@/lib/stores/searchStore";

// Card cell component with position display and lazy-loaded image
const CardCell = memo(({ gridIndex, position, isMoving }: ItemConfig) => {
  // Top 6 images get high priority for faster initial load
  const isTopImage = gridIndex < 6;
  const imageUrl = `https://picsum.photos/seed/${gridIndex}/400/300`;

  return (
    <div
      className={`absolute inset-1 border border-gray-200 rounded-xl overflow-hidden transition-shadow ${
        isMoving ? "shadow-xl" : "shadow-md"
      }`}
    >
      {/* Optimized image loading */}
      <img
        src={imageUrl}
        loading={isTopImage ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={isTopImage ? "high" : "auto"}
        width={400}
        height={300}
        alt={`Card ${gridIndex} image`}
        className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover z-0"
      />
      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs z-10 pointer-events-none">
        <div className="text-base font-bold mb-1 drop-shadow-lg">
          #{gridIndex}
        </div>
        <div className="text-[10px] text-white/90 drop-shadow-md">
          {position.x}, {position.y}
        </div>
      </div>
    </div>
  );
});

CardCell.displayName = "CardCell";

export default function Home() {
  const activeFilter = useFilterStore((state) => state.activeFilter);
  const debouncedQuery = useSearchStore((state) => state.debouncedQuery);

  return (
    <>
      <Header />
      <main className="relative w-screen h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 pt-14 md:pt-16">
          <ThiingsGrid
            gridSize={{ width: 400, height: 500 }}
            renderItem={(config) => <CardCell {...config} />}
            initialPosition={{ x: 0, y: 0 }}
            filter={activeFilter}
            searchQuery={debouncedQuery}
          />
        </div>
      </main>
    </>
  );
}
