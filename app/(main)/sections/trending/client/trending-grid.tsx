"use client";

import { cn } from "@/lib/utils/style";
import { TrendingCard } from "../components/trending-card";
import type { Category } from "./trending-client";

interface TrendingGridProps {
  category: Category;
}

export function TrendingGrid({ category }: TrendingGridProps) {
  return (
    <>
      {/* 트렌딩 아이템 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TrendingCard
            key={i}
            rank={i + 1}
            image="https://placehold.co/400x300"
            title="트렌딩 아이템 이름"
            brand="브랜드명"
            likes={1234}
          />
        ))}
      </div>

      {/* "더보기" 버튼 */}
      <div className="flex justify-center">
        <button
          className={cn(
            "group px-6 py-3 rounded-xl",
            "border border-zinc-800",
            "hover:border-[#EAFD66]/20",
            "transition-colors duration-200"
          )}
        >
          <span
            className={cn(
              "text-zinc-400 group-hover:text-white",
              "transition-colors duration-200"
            )}
          >
            더 많은 트렌딩 아이템 보기
          </span>
        </button>
      </div>
    </>
  );
} 