import React from 'react';

interface MobileSummaryBulletPointProps {
  children: React.ReactNode;
}

function MobileSummaryBulletPoint({ children }: MobileSummaryBulletPointProps) {
  return (
    <div className="p-4 bg-zinc-800/20 border border-zinc-700/30 rounded-lg">
      <p className="text-gray-300 leading-relaxed text-sm">{children}</p>
    </div>
  );
}

interface MobileSummarySectionProps {
  summary?: string;
  className?: string;
}

// AI Summary를 파싱해서 포인트로 분리하는 함수
function parseSummaryToPoints(summary: string): string[] {
  // 문장을 분리
  const sentences = summary.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  return sentences
    .map((sentence) => {
      const trimmed = sentence.trim();
      return trimmed;
    })
    .filter((text) => text.length > 0);
}

export function MobileSummarySection({ summary, className = '' }: MobileSummarySectionProps) {
  if (!summary) {
    return null;
  }

  const points = parseSummaryToPoints(summary);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary title */}
      <h3 className="text-lg font-semibold text-white">요약</h3>

      {/* Summary points - 카드 형태로 모든 포인트 표시 */}
      <div className="space-y-3">
        {points.map((point, index) => (
          <MobileSummaryBulletPoint key={index}>{point}</MobileSummaryBulletPoint>
        ))}
      </div>
    </div>
  );
}
