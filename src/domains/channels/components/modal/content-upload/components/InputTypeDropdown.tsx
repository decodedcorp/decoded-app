import React from 'react';
import { createPortal } from 'react-dom';

interface InputTypeDropdownProps {
  isOpen: boolean;
  dropdownStyle: React.CSSProperties;
  currentType: 'url' | 'prompt';
  onTypeSelect: (type: 'url' | 'prompt') => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function InputTypeDropdown({
  isOpen,
  dropdownStyle,
  currentType,
  onTypeSelect,
  containerRef,
}: InputTypeDropdownProps) {
  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      ref={containerRef}
      style={dropdownStyle}
      className="bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg"
    >
      <div className="py-1">
        {/* URL Option */}
        <button
          type="button"
          onClick={() => onTypeSelect('url')}
          className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
            currentType === 'url'
              ? 'text-white bg-zinc-700'
              : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
          }`}
        >
          <svg
            className="w-4 h-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <span>URL</span>
        </button>

        {/* Prompt Option */}
        <button
          type="button"
          onClick={() => onTypeSelect('prompt')}
          className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
            currentType === 'prompt'
              ? 'text-white bg-zinc-700'
              : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
          }`}
        >
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
          <span>AI Prompt</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
