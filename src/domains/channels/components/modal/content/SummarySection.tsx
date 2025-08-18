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
}

export function SummarySection({ 
  title, 
  summary, 
  keyPoints = [], 
  className = '' 
}: SummarySectionProps) {
  if (!summary && keyPoints.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Title */}
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
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
            <SummaryBulletPoint key={index}>
              {point}
            </SummaryBulletPoint>
          ))}
        </div>
      )}
    </div>
  );
}