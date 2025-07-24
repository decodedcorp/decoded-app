'use client';

import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface ChannelSidebarProps {
  onFilterChange: (filters: SidebarFilters) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  className?: string;
}

export interface SidebarFilters {
  dataTypes: string[];
  categories: string[];
  tags: string[];
}

const DATA_TYPES = [
  { id: 'link', label: 'Link', icon: '🔗' },
  { id: 'image', label: 'Image', icon: '🖼️' },
  { id: 'pdf', label: 'PDF', icon: '📄' },
  { id: 'video', label: 'Video', icon: '🎥' },
  { id: 'audio', label: 'Audio', icon: '🎵' },
  { id: 'text', label: 'Text', icon: '📝' },
];

const CATEGORIES = [
  { id: 'articles', label: 'Articles', icon: '📰', count: 0 },
  { id: 'books', label: 'Books', icon: '📚', count: 0 },
  { id: 'education', label: 'Education', icon: '🎓', count: 0 },
  { id: 'fashion', label: 'Fashion', icon: '👠', count: 0 },
  { id: 'finance', label: 'Finance', icon: '💰', count: 0 },
  { id: 'games', label: 'Games', icon: '🎮', count: 0 },
];

export function ChannelSidebar({
  onFilterChange,
  onCollapseChange,
  className = '',
}: ChannelSidebarProps) {
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isDataTypesExpanded, setIsDataTypesExpanded] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleDataTypeToggle = (dataTypeId: string) => {
    const newSelected = selectedDataTypes.includes(dataTypeId)
      ? selectedDataTypes.filter((id) => id !== dataTypeId)
      : [...selectedDataTypes, dataTypeId];

    setSelectedDataTypes(newSelected);
    updateFilters({ dataTypes: newSelected, categories: selectedCategories, tags: [] });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newSelected);
    updateFilters({ dataTypes: selectedDataTypes, categories: newSelected, tags: [] });
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      // TODO: Implement tag addition logic
      console.log('Adding tag:', newTag);
      setNewTag('');
    }
  };

  const updateFilters = (filters: SidebarFilters) => {
    onFilterChange?.(filters);
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  if (isSidebarCollapsed) {
    return (
      <aside
        className={`bg-black text-white h-full flex flex-col border-r border-gray-800 ${className}`}
      >
        {/* 접힌 상태 아이콘들 */}
        <div className="flex flex-col items-center space-y-3 p-3 pt-4">
          {/* 접기/펼치기 토글 버튼 - 상단에 배치 */}
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors duration-200 w-12 h-12 flex items-center justify-center mb-2"
            title="사이드바 펼치기"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>

          {/* Library 아이콘 */}
          <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors duration-200 w-12 h-12 flex items-center justify-center">
            <span className="text-lg">📚</span>
          </button>

          {/* Data Types 아이콘 */}
          <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors duration-200 w-12 h-12 flex items-center justify-center">
            <span className="text-lg">📊</span>
          </button>

          {/* Categories 아이콘 */}
          <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors duration-200 w-12 h-12 flex items-center justify-center">
            <span className="text-lg">🏷️</span>
          </button>

          {/* Tags 아이콘 */}
          <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors duration-200 w-12 h-12 flex items-center justify-center">
            <span className="text-lg">#</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`bg-black text-white h-full flex flex-col border-r border-gray-800 ${className}`}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Filters</h2>
          {/* 접기/펼치기 토글 버튼 - 헤더 우측에 배치 */}
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors duration-200"
            title="사이드바 접기"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Data Types Section */}
        <div>
          <button
            onClick={() => setIsDataTypesExpanded(!isDataTypesExpanded)}
            className="flex items-center justify-between w-full text-left mb-4 hover:bg-gray-900 p-3 rounded-lg transition-colors duration-200"
          >
            <h3 className="font-medium text-lg">Data Types</h3>
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform duration-200 ${
                isDataTypesExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isDataTypesExpanded && (
            <div className="grid grid-cols-2 gap-3">
              {DATA_TYPES.map((dataType) => (
                <button
                  key={dataType.id}
                  onClick={() => handleDataTypeToggle(dataType.id)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg text-sm transition-colors duration-200
                    ${
                      selectedDataTypes.includes(dataType.id)
                        ? 'bg-white text-black'
                        : 'bg-gray-900 hover:bg-gray-800 text-gray-300'
                    }
                  `}
                >
                  <span className="text-base">{dataType.icon}</span>
                  <span>{dataType.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg">Categories</h3>
            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`
                  flex items-center justify-between p-3 rounded-lg text-sm transition-colors duration-200
                  ${
                    selectedCategories.includes(category.id)
                      ? 'bg-white text-black'
                      : 'bg-gray-900 hover:bg-gray-800 text-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{category.icon}</span>
                  <span>{category.label}</span>
                </div>
                <span className="text-xs opacity-75">{category.count}</span>
              </button>
            ))}
          </div>

          <button className="text-white hover:text-gray-300 text-sm font-medium transition-colors duration-200">
            Show All
          </button>
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg">Tags</h3>
            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />
          </div>

          <form onSubmit={handleAddTag} className="relative">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New Tag..."
              className="w-full bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors duration-200"
            />
            <PlusIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </form>
        </div>
      </div>
    </aside>
  );
}
