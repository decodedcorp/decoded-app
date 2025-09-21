import React from 'react';

interface MobileCardLayoutProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
}

// 모바일 전용 카드 레이아웃 - 이미지 참고 디자인
export function MobileCardLayout({ children, title, onClose }: MobileCardLayoutProps) {
  return (
    <div className="bg-zinc-800/60 rounded-2xl border border-zinc-700/50 shadow-2xl h-full flex flex-col">
      {/* Header with title and close button */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-700/30">
        <div>
          <h1 className="text-lg font-semibold text-white">{title || 'Content'}</h1>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/40 hover:bg-zinc-700/60 transition-all duration-300 group touch-manipulation"
            aria-label="Close modal"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              className="group-hover:scale-110 transition-transform duration-200"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300 group-hover:text-white transition-colors duration-200"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-y-auto">{children}</div>
    </div>
  );
}
