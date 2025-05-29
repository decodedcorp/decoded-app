'use client';

import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
  color: string; // Tailwind background color class e.g., bg-orange-500
  textColor: string; // Tailwind text color class e.g., text-white
}

// Initial categories based on user request and provided image
const initialCategories: Category[] = [
  { id: 'all', name: 'all', color: 'bg-orange-500', textColor: 'text-white' },
  { id: 'k-pop', name: 'k-pop', color: 'bg-pink-500', textColor: 'text-white' },
  { id: 'actor', name: 'actor', color: 'bg-teal-500', textColor: 'text-white' },
  { id: 'everyday', name: 'everyday', color: 'bg-yellow-400', textColor: 'text-black' },
  { id: 'nature', name: 'nature', color: 'bg-green-400', textColor: 'text-black' },
  { id: 'technology', name: 'technology', color: 'bg-sky-500', textColor: 'text-white' },
  { id: 'transport', name: 'transport', color: 'bg-purple-500', textColor: 'text-white' },
  // Add more categories as needed
];

interface CategoryFilterProps {
  // onSelectCategory: (categoryId: string) => void; // Placeholder for future implementation
}

export function CategoryFilter({ }: CategoryFilterProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // onSelectCategory(categoryId); // This would be used to actually filter content
    console.log(`Category selected: ${categoryId}`);
  };

  return (
    <div className="flex space-x-2 px-4 py-3 justify-start md:justify-center overflow-x-auto whitespace-nowrap scrollbar-hide">
      {initialCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900
            ${category.id === selectedCategoryId 
              ? `${category.color} ${category.textColor} ring-2 ring-white/70 shadow-md`
              : `${category.color}/60 ${category.textColor}/90 hover:${category.color} hover:${category.textColor}/100 hover:shadow-sm`}
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

// CSS to hide scrollbar (optional, can be in global.css or a style tag)
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }
// .scrollbar-hide {
//   -ms-overflow-style: none;  /* IE and Edge */
//   scrollbar-width: none;  /* Firefox */
// } 