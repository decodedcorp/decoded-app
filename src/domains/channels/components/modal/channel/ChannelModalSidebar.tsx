'use client';

import React, { useEffect, useState } from 'react';
import { SidebarFilters } from '../../sidebar/ChannelSidebar';
import { DataTypesFilter } from '../filters/DataTypesFilter';
import { CategoriesFilter } from '../filters/CategoriesFilter';
import { TagsFilter } from '../filters/TagsFilter';

interface ChannelModalSidebarProps {
  currentFilters: SidebarFilters;
  onFilterChange: (filters: SidebarFilters) => void;
}

export function ChannelModalSidebar({ currentFilters, onFilterChange }: ChannelModalSidebarProps) {
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(currentFilters.dataTypes);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentFilters.categories);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tags);

  // 필터 상태 동기화
  useEffect(() => {
    setSelectedDataTypes(currentFilters.dataTypes);
    setSelectedCategories(currentFilters.categories);
    setSelectedTags(currentFilters.tags);
  }, [currentFilters]);

  const updateFilters = (filters: SidebarFilters) => {
    onFilterChange(filters);
  };

  const handleDataTypesChange = (dataTypes: string[]) => {
    setSelectedDataTypes(dataTypes);
    updateFilters({ dataTypes, categories: selectedCategories, tags: selectedTags });
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
    updateFilters({ dataTypes: selectedDataTypes, categories, tags: selectedTags });
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    updateFilters({ dataTypes: selectedDataTypes, categories: selectedCategories, tags });
  };

  return (
    <div className="w-full h-full border-r border-zinc-700/50 bg-zinc-900/50 flex flex-col animate-slide-in-left">
      <div className="p-6 border-b border-zinc-700/50">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <p className="text-sm text-gray-400 mt-1">Filter content by type, category, and tags</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <DataTypesFilter
              selectedDataTypes={selectedDataTypes}
              onDataTypesChange={handleDataTypesChange}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CategoriesFilter
              selectedCategories={selectedCategories}
              onCategoriesChange={handleCategoriesChange}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <TagsFilter selectedTags={selectedTags} onTagsChange={handleTagsChange} />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedDataTypes.length > 0 ||
        selectedCategories.length > 0 ||
        selectedTags.length > 0) && (
        <div className="p-4 border-t border-zinc-700/50 bg-zinc-800/30 animate-fade-in">
          <div className="text-sm text-gray-300 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-1">
            {selectedDataTypes.length > 0 && (
              <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs animate-bounce-in">
                {selectedDataTypes.length} data type{selectedDataTypes.length > 1 ? 's' : ''}
              </span>
            )}
            {selectedCategories.length > 0 && (
              <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs animate-bounce-in">
                {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'}
              </span>
            )}
            {selectedTags.length > 0 && (
              <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs animate-bounce-in">
                {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
