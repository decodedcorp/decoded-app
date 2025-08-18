'use client';

import React, { memo, useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface ContentFiltersBarProps {
  selectedDataTypes: string[];
  selectedCategories: string[];
  onDataTypesChange: (dataTypes: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  dataTypes?: FilterOption[];
  categories?: FilterOption[];
  isLoading?: boolean;
}

// 기본 데이터 타입
const DEFAULT_DATA_TYPES = [
  { id: 'link', label: 'Link' },
  { id: 'image', label: 'Image' },
  { id: 'pdf', label: 'PDF' },
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio' },
  { id: 'text', label: 'Text' },
];

// 기본 카테고리 (예시)
const DEFAULT_CATEGORIES = [
  { id: 'tech', label: 'Technology' },
  { id: 'news', label: 'News' },
  { id: 'research', label: 'Research' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'education', label: 'Education' },
  { id: 'business', label: 'Business' },
];

export const ContentFiltersBar = memo(function ContentFiltersBar({
  selectedDataTypes,
  selectedCategories,
  onDataTypesChange,
  onCategoriesChange,
  dataTypes,
  categories,
  isLoading = false,
}: ContentFiltersBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 실제 데이터가 있으면 사용하고, 없으면 기본 데이터 사용
  const displayDataTypes = dataTypes && dataTypes.length > 0 ? dataTypes : DEFAULT_DATA_TYPES;
  const displayCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const handleDataTypeToggle = (dataTypeId: string) => {
    const newSelected = selectedDataTypes.includes(dataTypeId)
      ? selectedDataTypes.filter((id) => id !== dataTypeId)
      : [...selectedDataTypes, dataTypeId];
    onDataTypesChange(newSelected);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoriesChange(newSelected);
  };

  const handleClearAll = () => {
    onDataTypesChange([]);
    onCategoriesChange([]);
  };

  const hasActiveFilters = selectedDataTypes.length > 0 || selectedCategories.length > 0;
  const activeFilterCount = selectedDataTypes.length + selectedCategories.length;

  return (
    <div className="border-b border-zinc-700/30">
      {/* Collapsed state - Filter toggle button */}
      {!isExpanded && (
        <div className="py-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center space-x-3">
              <svg
                className="w-4 h-4 text-zinc-400 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span className="text-sm font-medium text-white">
                Filters {activeFilterCount > 0 && `(${activeFilterCount} active)`}
              </span>
            </div>

            {/* Active filters preview */}
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                {selectedDataTypes.length > 0 && (
                  <span className="px-2 py-1 bg-[#eafd66]/20 text-[#eafd66] rounded text-xs">
                    {selectedDataTypes.length} type{selectedDataTypes.length > 1 ? 's' : ''}
                  </span>
                )}
                {selectedCategories.length > 0 && (
                  <span className="px-2 py-1 bg-[#eafd66]/20 text-[#eafd66] rounded text-xs">
                    {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'}
                  </span>
                )}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Expanded state - Full filter options */}
      {isExpanded && (
        <div className="bg-zinc-900/30 py-4">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4 transition-transform duration-200 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span>Hide filters</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-1 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Clear all</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* By card type section */}
            <div>
              <h3 className="text-base font-medium text-white mb-3">By card type:</h3>

              <div className="flex flex-wrap gap-2">
                {displayDataTypes.map((dataType) => {
                  const isSelected = selectedDataTypes.includes(dataType.id);
                  return (
                    <button
                      key={dataType.id}
                      onClick={() => handleDataTypeToggle(dataType.id)}
                      disabled={isLoading}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                        ${
                          isSelected
                            ? 'bg-[#eafd66]/10 border-[#eafd66] text-[#eafd66]'
                            : 'bg-transparent border-zinc-600 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{dataType.label}</span>
                        {dataType.count !== undefined && (
                          <span className="text-xs opacity-70">({dataType.count})</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* By category section */}
            <div>
              <h3 className="text-base font-medium text-white mb-3">By category:</h3>

              <div className="flex flex-wrap gap-2">
                {displayCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      disabled={isLoading}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                        ${
                          isSelected
                            ? 'bg-[#eafd66]/10 border-[#eafd66] text-[#eafd66]'
                            : 'bg-transparent border-zinc-600 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{category.label}</span>
                        {category.count !== undefined && (
                          <span className="text-xs opacity-70">({category.count})</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
