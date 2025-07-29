'use client';

import React, { useState, memo } from 'react';

interface TagsFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagsFilter = memo(function TagsFilter({
  selectedTags,
  onTagsChange,
}: TagsFilterProps) {
  const [newTag, setNewTag] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const newTags = [...selectedTags, newTag.trim()];
      onTagsChange(newTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    onTagsChange(newTags);
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag(e as any);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-base text-white">Tags</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Add Tag Form */}
      <form onSubmit={handleAddTag} className="space-y-2">
        <div className="space-y-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Add a tag..."
            className={`
              w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-all duration-200
              ${
                isInputFocused
                  ? 'border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-zinc-600 focus:ring-emerald-500/20'
              }
            `}
          />
          <button
            type="submit"
            disabled={!newTag.trim()}
            className={`
              w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                newTag.trim()
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Add Tag
          </button>
        </div>

        {newTag.trim() && selectedTags.includes(newTag.trim()) && (
          <p className="text-xs text-amber-400">This tag already exists</p>
        )}
      </form>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Selected Tags ({selectedTags.length})</div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <span
                key={tag}
                className="group flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="text-xs opacity-75">#</span>
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/20 rounded-full p-0.5 transition-all duration-200"
                  title="Remove tag"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedTags.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <div className="text-2xl mb-2">🏷️</div>
          <p className="text-sm">No tags selected</p>
          <p className="text-xs mt-1">Add tags to filter content</p>
        </div>
      )}
    </div>
  );
});
