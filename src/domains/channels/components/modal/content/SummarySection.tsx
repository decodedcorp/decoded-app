import React from 'react';

interface SummaryBulletPointProps {
  children: React.ReactNode;
}

function SummaryBulletPoint({ children }: SummaryBulletPointProps) {
  return (
    <div className="p-4 bg-zinc-800/20 border border-zinc-700/30 rounded-lg">
      <p className="text-gray-400 leading-relaxed">{children}</p>
    </div>
  );
}

interface SummarySectionProps {
  title: string;
  summary?: string;
  keyPoints?: string[];
  className?: string;
  onClose?: () => void;
}

export function SummarySection({
  title,
  summary,
  keyPoints = [],
  className = '',
  onClose,
}: SummarySectionProps) {
  if (!summary && keyPoints.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Title with Close Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/30 hover:bg-zinc-700/50 transition-all duration-200 group"
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
                className="text-gray-400 group-hover:text-white transition-colors duration-200"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Main Summary */}
      {summary && (
        <div className="p-6 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
          <p className="text-gray-400 leading-relaxed text-lg">{summary}</p>
        </div>
      )}

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <div className="space-y-3">
          {keyPoints.map((point, index) => (
            <SummaryBulletPoint key={index}>{point}</SummaryBulletPoint>
          ))}
        </div>
      )}
    </div>
  );
}
