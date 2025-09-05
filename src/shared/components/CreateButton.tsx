'use client';

import { useState } from 'react';
import { useGlobalContentUploadStore } from '@/store/globalContentUploadStore';
import { Button } from '@decoded/ui';

export function CreateButton() {
  const openModal = useGlobalContentUploadStore((state) => state.openModal);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    // 글로벌 콘텐츠 업로드 모달 열기
    openModal();
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        variant="outline"
        size="sm"
        icon="plus"
        className="rounded-full border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500 hover:text-white group"
        aria-label="Create new content"
      >
        <span className="hidden md:inline">Create</span>
      </Button>

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
