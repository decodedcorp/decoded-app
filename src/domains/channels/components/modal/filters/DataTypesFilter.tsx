'use client';

import React, { memo } from 'react';

interface FilterOption {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

interface DataTypesFilterProps {
  selectedDataTypes: string[];
  onDataTypesChange: (dataTypes: string[]) => void;
  dataTypes?: FilterOption[];
  isLoading?: boolean;
}

// 기본 데이터 타입 (API 데이터가 없을 때 사용)
const DEFAULT_DATA_TYPES = [
  { id: 'link', label: 'Link', icon: '🔗' },
  { id: 'image', label: 'Image', icon: '🖼️' },
  { id: 'pdf', label: 'PDF', icon: '📄' },
  { id: 'video', label: 'Video', icon: '🎥' },
  { id: 'audio', label: 'Audio', icon: '🎵' },
  { id: 'text', label: 'Text', icon: '📝' },
];

export const DataTypesFilter = memo(function DataTypesFilter({
  selectedDataTypes,
  onDataTypesChange,
  dataTypes,
  isLoading = false,
}: DataTypesFilterProps) {
  // 실제 데이터가 있으면 사용하고, 없으면 기본 데이터 사용
  const displayDataTypes = dataTypes && dataTypes.length > 0 ? dataTypes : DEFAULT_DATA_TYPES;

  const handleDataTypeToggle = (dataTypeId: string) => {
    const newSelected = selectedDataTypes.includes(dataTypeId)
      ? selectedDataTypes.filter((id) => id !== dataTypeId)
      : [...selectedDataTypes, dataTypeId];

    onDataTypesChange(newSelected);
  };

  const handleSelectAll = () => {
    const allIds = displayDataTypes.map((dataType) => dataType.id);
    onDataTypesChange(allIds);
  };

  const handleClearAll = () => {
    onDataTypesChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-base text-white">Data Types</h3>
          {isLoading && (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          )}
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

      <div className="grid grid-cols-2 gap-2">
        {displayDataTypes.map((dataType) => {
          const isSelected = selectedDataTypes.includes(dataType.id);
          return (
            <button
              key={dataType.id}
              onClick={() => handleDataTypeToggle(dataType.id)}
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
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-base flex-shrink-0">{dataType.icon}</span>
                <span className="font-medium truncate">{dataType.label}</span>
                {dataType.count !== undefined && (
                  <span className="text-xs bg-zinc-600 text-zinc-300 px-1.5 py-0.5 rounded-full ml-auto">
                    {dataType.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});
