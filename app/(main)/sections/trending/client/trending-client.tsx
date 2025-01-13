"use client";

import { cn } from "@/lib/utils/style";
import { useState } from "react";

const CATEGORIES = ["전체", "패션", "뷰티", "테크", "라이프"] as const;

export type Category = (typeof CATEGORIES)[number];

interface TrendingClientProps {
  onCategoryChange: (category: Category) => void;
}

export function TrendingClient({ onCategoryChange }: TrendingClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm whitespace-nowrap",
            "transition-all duration-200",
            activeCategory === category
              ? "bg-[#EAFD66] text-black font-medium"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
} 