'use client';

import React, { useState } from 'react';

interface CategoriesFilterProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CATEGORIES = [
  { id: 'articles', label: 'Articles', icon: '📰', count: 12, color: 'bg-red-500/20 text-red-300' },
  {
    id: 'books',
    label: 'Books',
    icon: '📚',
    count: 8,
    color: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 'education',
    label: 'Education',
    icon: '🎓',
    count: 15,
    color: 'bg-amber-500/20 text-amber-300',
  },
  { id: 'fashion', label: 'Fashion', icon: '👠', count: 6, color: 'bg-pink-500/20 text-pink-300' },
  {
    id: 'finance',
    label: 'Finance',
    icon: '💰',
    count: 9,
    color: 'bg-violet-500/20 text-violet-300',
  },
  { id: 'games', label: 'Games', icon: '🎮', count: 11, color: 'bg-cyan-500/20 text-cyan-300' },
];

export function CategoriesFilter({
  selectedCategories,
  onCategoriesChange,
}: CategoriesFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    onCategoriesChange(newSelected);
  };

  const handleSelectAll = () => {
    const allIds = CATEGORIES.map((category) => category.id);
    onCategoriesChange(allIds);
  };

  const handleClearAll = () => {
    onCategoriesChange([]);
  };

  const displayedCategories = showAll ? CATEGORIES : CATEGORIES.slice(0, 4);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-base text-white">Categories</h3>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            All
          </button>
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {displayedCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`
                group relative flex items-center justify-between p-2.5 rounded-lg text-sm transition-all duration-200
                ${
                  isSelected
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:scale-102'
                }
              `}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-base flex-shrink-0">{category.icon}</span>
                <span className="font-medium truncate">{category.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs ${category.color}`}>
                  {category.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {CATEGORIES.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-white hover:text-gray-300 text-sm font-medium transition-colors duration-200"
        >
          {showAll ? 'Show Less' : `Show All (${CATEGORIES.length})`}
        </button>
      )}
    </div>
  );
}
