"use client";

import { useState, useMemo } from "react";

type Category = "FASHION" | "INTERIOR";

interface ListHeaderProps {
  onCategoryChange?: (category: Category) => void;
  availableCategories?: Category[];
  itemList?: Array<{
    info?: { item?: { item?: { metadata?: { item_class?: string } } } };
  }>;
}

export function ListHeader({
  onCategoryChange,
  availableCategories = [],
  itemList = [],
}: ListHeaderProps) {
  const [activeCategory, setActiveCategory] = useState<Category>(
    availableCategories[0] || "FASHION"
  );

  const categories = useMemo(() => {
    return availableCategories;
  }, [availableCategories]);

  const getCategoryCount = (category: Category) => {
    return itemList.filter(
      (item) =>
        item.info?.item?.item?.metadata?.item_class?.toUpperCase() === category
    ).length;
  };

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    onCategoryChange?.(category);
  };

  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center h-[40px] border-b border-white/10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-3 h-full text-xs font-medium transition-colors relative flex items-center gap-1.5
              ${
                activeCategory === category
                  ? "text-white after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[1px] after:bg-white"
                  : "text-white/40 hover:text-white/60"
              }`}
          >
            {category}
            <span
              className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] ${
                activeCategory === category
                  ? "bg-primary text-black"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {getCategoryCount(category)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
