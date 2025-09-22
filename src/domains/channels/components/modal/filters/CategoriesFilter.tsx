'use client';

import React, { useState, memo } from 'react';
import { InlineSpinner } from '@/shared/components/loading/InlineSpinner';

interface CategoryOption {
  id: string;
  label: string;
  icon: string;
  count: number;
  color: string;
}

interface CategoriesFilterProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  categories?: CategoryOption[];
  isLoading?: boolean;
}

// 기본 카테고리 (API 데이터가 없을 때 사용)
const DEFAULT_CATEGORIES = [
  { id: 'articles', label: 'Articles', icon: '📰', count: 0, color: 'bg-red-500/20 text-red-300' },
  {
    id: 'books',
    label: 'Books',
    icon: '📚',
    count: 0,
    color: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 'education',
    label: 'Education',
    icon: '🎓',
    count: 0,
    color: 'bg-amber-500/20 text-amber-300',
  },
  { id: 'fashion', label: 'Fashion', icon: '👠', count: 0, color: 'bg-pink-500/20 text-pink-300' },
  {
    id: 'finance',
    label: 'Finance',
    icon: '💰',
    count: 0,
    color: 'bg-violet-500/20 text-violet-300',
  },
  { id: 'games', label: 'Games', icon: '🎮', count: 0, color: 'bg-cyan-500/20 text-cyan-300' },
];

export const CategoriesFilter = memo(function CategoriesFilter({
  selectedCategories,
  onCategoriesChange,
  categories,
  isLoading = false,
}: CategoriesFilterProps) {
  const [showAll, setShowAll] = useState(false);

  // 실제 데이터가 있으면 사용하고, 없으면 기본 데이터 사용
  const availableCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    onCategoriesChange(newSelected);
  };

  const handleSelectAll = () => {
    const allIds = availableCategories.map((category) => category.id);
    onCategoriesChange(allIds);
  };

  const handleClearAll = () => {
    onCategoriesChange([]);
  };

  const displayedCategories = showAll ? availableCategories : availableCategories.slice(0, 4);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-base text-white">Categories</h3>
          {isLoading && <InlineSpinner size="sm" ariaLabel="Loading categories" />}
          {!isLoading && (
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
          )}
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
              disabled={isLoading}
              className={`
                group relative flex items-center justify-between p-2.5 rounded-lg text-sm transition-all duration-200
                ${
                  isSelected
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:scale-102'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium truncate">{category.label}</span>
                <span className="text-xs bg-[#eafd66]/20 text-[#eafd66] px-1.5 py-0.5 rounded-full ml-2">
                  {category.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {availableCategories.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          disabled={isLoading}
          className={`text-white hover:text-gray-300 text-sm font-medium transition-colors duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {showAll ? 'Show Less' : `Show All (${availableCategories.length})`}
        </button>
      )}
    </div>
  );
});
