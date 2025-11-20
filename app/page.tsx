"use client";

import { memo } from "react";
import ThiingsGrid, { type ItemConfig } from "@/lib/components/ThiingsGrid";

// Card cell component with position display and lazy-loaded image
const CardCell = memo(({ gridIndex, position, isMoving }: ItemConfig) => {
  // Top 1-2 images get high priority for LCP optimization
  const isTopImage = gridIndex < 2;

  return (
    <div
      className={`absolute inset-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-800 transition-shadow overflow-hidden ${
        isMoving ? "shadow-xl" : "shadow-md"
      }`}
    >
      {/* Lazy-loaded image */}
      <img
        data-src={`https://picsum.photos/seed/${gridIndex}/300/200`}
        loading={isTopImage ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={isTopImage ? "high" : "low"}
        width={300}
        height={200}
        alt={`Card ${gridIndex} image`}
        className="w-full h-auto rounded-lg mb-2 object-cover"
        style={{ aspectRatio: "3/2" }}
      />
      <div className="text-base font-bold mb-1">#{gridIndex}</div>
      <div className="text-[10px] text-gray-500">
        {position.x}, {position.y}
      </div>
    </div>
  );
});

CardCell.displayName = "CardCell";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ThiingsGrid
          gridSize={{ width: 400, height: 500 }}
          renderItem={(config) => <CardCell {...config} />}
          initialPosition={{ x: 0, y: 0 }}
        />
      </div>
    </main>
  );
}
