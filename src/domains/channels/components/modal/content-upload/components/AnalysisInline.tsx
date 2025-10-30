import React from 'react';
import { AnalysisProgress } from '../types/analysis';
import { AnalysisHeader } from './AnalysisHeader';
import { PhaseItem } from './PhaseItem';

interface AnalysisInlineProps {
  progress: AnalysisProgress | null;
  url?: string;
  prompts: string[];
  onCancel: () => void;
}

export function AnalysisInline({ progress, url, prompts, onCancel }: AnalysisInlineProps) {
  const stages = [
    { key: 'queueing', label: 'Queued' },
    { key: 'fetching', label: 'Exploring sources' },
    { key: 'generating', label: 'Synthesizing' },
    { key: 'summarizing', label: 'Composing preview' },
  ] as const;

  const currentPhase = (progress?.phase as any) ?? 'queueing';

  return (
    <div className="flex flex-col p-4">
      <div className="w-full max-w-4xl space-y-6">
        <AnalysisHeader phase={currentPhase} onCancel={onCancel} />

        {/* Inputs used */}
        <div className="bg-zinc-800 rounded-2xl p-4 space-y-3 border border-zinc-700">
          <div className="text-sm text-zinc-400">Inputs</div>
          {url && (
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-700 rounded-lg">
              <svg
                className="w-4 h-4 text-zinc-300"
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
              <span className="text-sm text-zinc-200 truncate" title={url}>
                {url}
              </span>
            </div>
          )}
          {prompts?.length > 0 && (
            <div className="flex flex-col gap-2">
              {prompts.map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-zinc-700 rounded-lg">
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
                  <span className="text-sm text-zinc-200 truncate" title={p}>
                    {p}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stages */}
        <div className="bg-zinc-800 rounded-2xl p-4 space-y-3 border border-zinc-700">
          <div className="text-sm text-zinc-400">Progress</div>
          <div className="space-y-3">
            {stages.map((s) => (
              <PhaseItem key={s.key} label={s.label} active={s.key === currentPhase} />
            ))}
          </div>
          <div className="mt-3 h-2 bg-zinc-900 rounded">
            <div
              className="h-2 rounded bg-purple-500 transition-all"
              style={{ width: `${Math.min(progress?.percent ?? 0, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
