import React from 'react';
import { AnalysisProgress } from '../types/analysis';

interface AnalysisOverlayProps {
  open: boolean;
  progress: AnalysisProgress | null;
  onCancel: () => void;
}

export function AnalysisOverlay({ open, progress, onCancel }: AnalysisOverlayProps) {
  if (!open) return null;

  const stages = [
    { key: 'parsing', label: 'Parsing URL and metadata' },
    { key: 'reading-prompts', label: 'Reading prompt(s)' },
    { key: 'generating-insights', label: 'Generating insights' },
    { key: 'finalizing', label: 'Finalizing result' },
  ];

  const currentKey = progress?.stage;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-xl mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Analyzing content…</h3>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg border border-zinc-700"
          >
            Cancel
          </button>
        </div>

        <div className="space-y-3">
          {stages.map((s, idx) => {
            const isActive = s.key === currentKey;
            const isDone = stages.findIndex((x) => x.key === currentKey) > idx;
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isDone
                      ? 'bg-green-400'
                      : isActive
                      ? 'bg-purple-400 animate-pulse'
                      : 'bg-zinc-600'
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm text-zinc-200">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 h-2 bg-zinc-800 rounded">
          <div
            className="h-2 rounded bg-purple-500 transition-all"
            style={{ width: `${Math.min(progress?.percent ?? 0, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
