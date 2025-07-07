'use client';

import React from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            text-lg font-medium transition-colors duration-200
            ${selectedCategory === category.id
              ? 'text-black'
              : 'text-gray-500 hover:text-black'
            }
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 