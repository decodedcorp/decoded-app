"use client";

import { memo } from "react";
import ThiingsGrid, { type ItemConfig } from "@/lib/components/ThiingsGrid";

// Card cell component with position display
const CardCell = memo(({ gridIndex, position, isMoving }: ItemConfig) => (
  <div
    className={`absolute inset-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-800 transition-shadow ${
      isMoving ? "shadow-xl" : "shadow-md"
    }`}
  >
    <div className="text-base font-bold mb-1">#{gridIndex}</div>
    <div className="text-[10px] text-gray-500">
      {position.x}, {position.y}
    </div>
  </div>
));

CardCell.displayName = "CardCell";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ThiingsGrid
          gridSize={150}
          renderItem={(config) => <CardCell {...config} />}
          initialPosition={{ x: 0, y: 0 }}
        />
      </div>
    </main>
  );
}

