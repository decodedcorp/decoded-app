'use client';

import { cn } from '@/lib/utils/style';

interface ProvideButtonProps {
  imageDocId: string;
}

export function ProvideButton({ imageDocId }: ProvideButtonProps) {
  return (
    <button
      className={cn(
        'px-3 py-1.5 rounded-lg text-sm font-medium',
        'border border-[#EAFD66]/20',
        'bg-[#EAFD66]/10 text-[#EAFD66]',
        'hover:bg-[#EAFD66]/20 transition-all duration-200',
        'flex items-center gap-1.5',
        'group'
      )}
      onClick={() => {
        // TODO: 제공 기능 구현
        console.log('Provide items for:', imageDocId);
      }}
    >
      <span>제공하기</span>
      <svg
        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </button>
  );
} 