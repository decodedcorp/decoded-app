'use client';

import React, { useState } from 'react';

interface DataTypesFilterProps {
  selectedDataTypes: string[];
  onDataTypesChange: (dataTypes: string[]) => void;
}

const DATA_TYPES = [
  { id: 'link', label: 'Link', icon: '🔗', description: 'Web links and URLs' },
  { id: 'image', label: 'Image', icon: '🖼️', description: 'Photos and graphics' },
  { id: 'pdf', label: 'PDF', icon: '📄', description: 'PDF documents' },
  { id: 'video', label: 'Video', icon: '🎥', description: 'Video content' },
  { id: 'audio', label: 'Audio', icon: '🎵', description: 'Audio files' },
  { id: 'text', label: 'Text', icon: '📝', description: 'Text documents' },
];

export function DataTypesFilter({ selectedDataTypes, onDataTypesChange }: DataTypesFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDataTypeToggle = (dataTypeId: string) => {
    const newSelected = selectedDataTypes.includes(dataTypeId)
      ? selectedDataTypes.filter((id) => id !== dataTypeId)
      : [...selectedDataTypes, dataTypeId];

    onDataTypesChange(newSelected);
  };

  const handleSelectAll = () => {
    const allIds = DATA_TYPES.map((type) => type.id);
    onDataTypesChange(allIds);
  };

  const handleClearAll = () => {
    onDataTypesChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-left hover:bg-neutral-800 p-2 rounded-lg transition-colors duration-200 group"
        >
          <h3 className="font-medium text-base text-white group-hover:text-gray-200">Data Types</h3>
          <svg
            className={`w-4 h-4 transition-transform duration-200 text-gray-400 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
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
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 gap-2">
          {DATA_TYPES.map((dataType) => {
            const isSelected = selectedDataTypes.includes(dataType.id);
            return (
              <button
                key={dataType.id}
                onClick={() => handleDataTypeToggle(dataType.id)}
                className={`
                  group relative flex flex-col items-center gap-1 p-2.5 rounded-lg text-xs transition-all duration-200
                                                  ${
                                                    isSelected
                                                      ? 'bg-white text-black shadow-lg scale-105'
                                                      : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:scale-102'
                                                  }
                `}
                title={dataType.description}
              >
                <span className="text-lg">{dataType.icon}</span>
                <span className="font-medium text-center leading-tight">{dataType.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
