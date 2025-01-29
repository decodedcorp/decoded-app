"use client";

import { cn } from "@/lib/utils/style";
import { useState } from "react";
import { useLocaleContext } from "@/lib/contexts/locale-context";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const { t } = useLocaleContext();
  const [activeCategory, setActiveCategory] = useState<TrendingCategory>(
    t.home.trending.categories[0]
  );
  type TrendingCategory = (typeof t.home.trending.categories)[number];
  const handleCategoryChange = (category: TrendingCategory) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
      {t.home.trending.categories.map((category) => (
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
