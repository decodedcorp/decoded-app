import React from 'react';
import { ContentTab } from '../utils/contentHelpers';

interface ContentTabsProps {
  contentTabs: ContentTab[];
  onRemoveTab: (tabId: string) => void;
}

export function ContentTabs({ contentTabs, onRemoveTab }: ContentTabsProps) {
  if (contentTabs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {contentTabs.map((tab) => (
        <div
          key={tab.id}
          className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors group"
        >
          {/* Icon based on type */}
          {tab.type === 'url' && tab.preview && (
            <img
              src={tab.preview.favicon}
              alt={`${tab.preview.domain} favicon`}
              className="w-4 h-4 rounded"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {/* Only 'url' and 'prompt' types are supported */}
          {tab.type === 'prompt' && (
            <svg
              className="w-4 h-4 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          )}

          {/* Content */}
          <span
            className={`text-sm text-zinc-300 font-medium truncate ${
              tab.type === 'prompt' ? 'max-w-48' : 'max-w-32'
            }`}
            title={tab.content}
          >
            {tab.content}
          </span>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemoveTab(tab.id)}
            className="opacity-100 p-0.5 hover:bg-zinc-700 rounded transition-colors"
          >
            <svg
              className="w-3 h-3 text-zinc-400 hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
