'use client';

import React from 'react';

interface SearchFiltersType {
  categories: string[];
  dataTypes: string[];
  statuses: string[];
}

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleDataTypeChange = (dataType: string) => {
    const newDataTypes = filters.dataTypes.includes(dataType)
      ? filters.dataTypes.filter((d) => d !== dataType)
      : [...filters.dataTypes, dataType];

    onFilterChange({ ...filters, dataTypes: newDataTypes });
  };

  const handleStatusChange = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];

    onFilterChange({ ...filters, statuses: newStatuses });
  };

  return (
    <div className="mb-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">필터</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 카테고리 필터 */}
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-3">카테고리</h4>
          <div className="space-y-2">
            {['entertainment', 'technology', 'lifestyle', 'news'].map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="rounded border-zinc-600 bg-zinc-700 text-[#eafd66] focus:ring-[#eafd66] focus:ring-offset-0"
                />
                <span className="text-sm text-zinc-400 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 데이터 타입 필터 */}
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-3">콘텐츠 타입</h4>
          <div className="space-y-2">
            {['image', 'video', 'link', 'text'].map((dataType) => (
              <label key={dataType} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.dataTypes.includes(dataType)}
                  onChange={() => handleDataTypeChange(dataType)}
                  className="rounded border-zinc-600 bg-zinc-700 text-[#eafd66] focus:ring-[#eafd66] focus:ring-offset-0"
                />
                <span className="text-sm text-zinc-400 capitalize">{dataType}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 상태 필터 */}
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-3">상태</h4>
          <div className="space-y-2">
            {['active', 'pending', 'archived'].map((status) => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <span className="text-sm text-zinc-400 capitalize">{status}</span>
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="rounded border-zinc-600 bg-zinc-700 text-[#eafd66] focus:ring-[#eafd66] focus:ring-offset-0"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
