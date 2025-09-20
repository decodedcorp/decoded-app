'use client';

import React, { useState } from 'react';

import { useChannelModalStore } from '@/store/channelModalStore';
import { ProxiedImage } from '@/components/ProxiedImage';

import { SidebarFilters } from '../../sidebar/ChannelSidebar';
import { DataTypesFilter } from '../filters/DataTypesFilter';
import { CategoriesFilter } from '../filters/CategoriesFilter';
import { TagsFilter } from '../filters/TagsFilter';
import { useChannelFilters } from '../../../hooks/useChannelFilters';

interface ChannelModalSidebarProps {
  currentFilters: SidebarFilters;
  onFilterChange: (filters: SidebarFilters) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSubscribe?: (channelId: string) => void;
  onUnsubscribe?: (channelId: string) => void;
  isSubscribeLoading?: boolean;
  channel?: any; // 실제 API 채널 데이터
  contentCount?: number; // 실제 콘텐츠 수
  channelId?: string; // 명시적 채널 ID prop
}

export function ChannelModalSidebar({
  currentFilters,
  onFilterChange,
  isCollapsed = false,
  onToggleCollapse,
  onSubscribe,
  onUnsubscribe,
  isSubscribeLoading = false,
  channel,
  contentCount,
  channelId: propChannelId,
}: ChannelModalSidebarProps) {
  // 채널 ID 결정 (props 우선, 새로고침 시 store는 초기화되므로)
  const selectedChannelId = useChannelModalStore((state) => state.selectedChannelId);
  const selectedChannel = useChannelModalStore((state) => state.selectedChannel);
  const channelId = propChannelId || selectedChannelId || selectedChannel?.id || '';

  // 실제 채널 데이터 사용 (API 데이터 우선)
  const displayChannel = channel || selectedChannel;

  // 채널의 실제 필터 데이터 가져오기
  const {
    dataTypes,
    categories,
    isLoading: isFiltersLoading,
    error: filtersError,
  } = useChannelFilters(channelId);

  const handleDataTypesChange = (dataTypes: string[]) => {
    onFilterChange({ ...currentFilters, dataTypes });
  };

  const handleCategoriesChange = (categories: string[]) => {
    onFilterChange({ ...currentFilters, categories });
  };

  const handleTagsChange = (tags: string[]) => {
    onFilterChange({ ...currentFilters, tags });
  };

  const handleRemoveTag = (tag: string) => {
    onFilterChange({ ...currentFilters, tags: currentFilters.tags.filter((t) => t !== tag) });
  };

  // 접힌 상태일 때 간단한 필터 버튼들
  if (isCollapsed) {
    return (
      <div className="w-16 h-full border-r border-zinc-700/50 bg-zinc-900/50 flex flex-col animate-slide-in-left overflow-hidden">
        {/* 토글 버튼 */}
        <div className="p-3 border-b border-zinc-700/50 flex-shrink-0">
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200 flex items-center justify-center group"
            title="사이드바 펼치기"
          >
            <svg
              className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 간단한 필터 버튼들 - 스크롤 가능 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 min-h-0">
          {/* Data Types - 실제 데이터 기반 상위 3개만 표시 */}
          <div className="space-y-2">
            <div className="text-xs text-gray-400 text-center font-medium">DT</div>
            <div className="space-y-2">
              {(dataTypes.length > 0
                ? dataTypes.slice(0, 3)
                : [
                    { id: 'link', icon: '🔗', label: 'Link', count: 0 },
                    { id: 'image', icon: '🖼️', label: 'Image', count: 0 },
                    { id: 'pdf', icon: '📄', label: 'PDF', count: 0 },
                  ]
              ).map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    const newSelected = currentFilters.dataTypes.includes(type.id)
                      ? currentFilters.dataTypes.filter((id) => id !== type.id)
                      : [...currentFilters.dataTypes, type.id];
                    handleDataTypesChange(newSelected);
                  }}
                  className={`w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center text-sm ${
                    currentFilters.dataTypes.includes(type.id)
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
                  }`}
                  title={`${type.label} content`}
                >
                  {type.label.charAt(0)}
                </button>
              ))}
            </div>
          </div>

          {/* Categories - 실제 데이터 기반 상위 4개만 표시 */}
          {(categories.length > 0 || isFiltersLoading) && (
            <div className="space-y-2">
              <div className="text-xs text-gray-400 text-center font-medium">CAT</div>
              <div className="space-y-2">
                {isFiltersLoading
                  ? // 로딩 상태
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="w-10 h-10 bg-zinc-800 rounded-lg animate-pulse" />
                    ))
                  : categories.slice(0, 4).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          const newSelected = currentFilters.categories.includes(category.id)
                            ? currentFilters.categories.filter((id) => id !== category.id)
                            : [...currentFilters.categories, category.id];
                          handleCategoriesChange(newSelected);
                        }}
                        className={`w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center text-sm ${
                          currentFilters.categories.includes(category.id)
                            ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
                        }`}
                        title={category.label}
                      >
                        {category.label.charAt(0)}
                      </button>
                    ))}
              </div>
            </div>
          )}

          {/* Active Filters Count */}
          {(currentFilters.dataTypes.length > 0 ||
            currentFilters.categories.length > 0 ||
            currentFilters.tags.length > 0) && (
            <div className="pt-4 border-t border-zinc-700/50">
              <div className="w-10 h-10 bg-amber-600/20 text-amber-300 border border-amber-500/30 rounded-lg flex items-center justify-center text-xs font-medium">
                {currentFilters.dataTypes.length +
                  currentFilters.categories.length +
                  currentFilters.tags.length}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 펼쳐진 상태
  return (
    <div className="w-80 h-full border-r border-zinc-700/50 bg-zinc-900/50 flex flex-col animate-slide-in-left overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-zinc-700/50 flex justify-end flex-shrink-0">
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200 flex items-center justify-center group"
          title="사이드바 접기"
        >
          <svg
            className="w-4 h-4 text-white group-hover:text-emerald-400 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* 필터 컨텐츠 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 min-h-0">
        <div className="space-y-8">
          <div className="animate-stable-fade-in" style={{ animationDelay: '0.05s' }}>
            <DataTypesFilter
              selectedDataTypes={currentFilters.dataTypes}
              onDataTypesChange={handleDataTypesChange}
              dataTypes={dataTypes}
              isLoading={isFiltersLoading}
            />
          </div>
          <div className="animate-stable-fade-in" style={{ animationDelay: '0.1s' }}>
            <CategoriesFilter
              selectedCategories={currentFilters.categories}
              onCategoriesChange={handleCategoriesChange}
              categories={categories}
              isLoading={isFiltersLoading}
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(currentFilters.dataTypes.length > 0 ||
        currentFilters.categories.length > 0 ||
        currentFilters.tags.length > 0) && (
        <div className="p-4 border-t border-zinc-700/50 bg-zinc-800/30 animate-stable-fade-in flex-shrink-0">
          <div className="text-sm text-gray-300 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-1">
            {currentFilters.dataTypes.length > 0 && (
              <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs animate-bounce-in">
                {currentFilters.dataTypes.length} data type
                {currentFilters.dataTypes.length > 1 ? 's' : ''}
              </span>
            )}
            {currentFilters.categories.length > 0 && (
              <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs animate-bounce-in">
                {currentFilters.categories.length} categor
                {currentFilters.categories.length > 1 ? 'ies' : 'y'}
              </span>
            )}
            {currentFilters.tags.length > 0 && (
              <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs animate-bounce-in">
                {currentFilters.tags.length} tag{currentFilters.tags.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
