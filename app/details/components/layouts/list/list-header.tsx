import { useState } from 'react';

type Category = 'ALL' | 'FASHION' | 'INTERIOR';

interface ListHeaderProps {
  onCategoryChange?: (category: Category) => void;
}

export function ListHeader({ onCategoryChange }: ListHeaderProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    onCategoryChange?.(category);
  };

  return (
    <div className="flex flex-col mb-3">
      <div className="flex items-center h-[40px] border-b border-white/10">
        {(['ALL', 'FASHION', 'INTERIOR'] as Category[]).map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 h-full text-xs font-medium transition-colors relative
              ${
                activeCategory === category
                  ? 'text-white after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[1px] after:bg-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-sm font-bold text-white/60 uppercase">FASHION</div>
      </div>
    </div>
  );
}
