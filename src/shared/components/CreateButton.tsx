'use client';

import { useState } from 'react';
import { useGlobalContentUploadStore } from '@/store/globalContentUploadStore';

export function CreateButton() {
  const openModal = useGlobalContentUploadStore((state) => state.openModal);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    // 글로벌 콘텐츠 업로드 모달 열기
    openModal();
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="
          flex items-center gap-2 px-4 py-1.5
          border border-zinc-600 rounded-full
          text-sm font-medium text-zinc-300
          hover:bg-zinc-800 hover:border-zinc-500 hover:text-white
          transition-all duration-200
          group
        "
        aria-label="Create new content"
      >
        <svg
          className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="hidden md:inline">Create</span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-800 text-xs text-zinc-300 rounded whitespace-nowrap z-50 pointer-events-none">
          Create new content
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45" />
        </div>
      )}
    </div>
  );
}
