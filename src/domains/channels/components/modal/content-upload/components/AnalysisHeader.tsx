import React from 'react';
import { TypingDots } from './TypingDots';

export type Phase = 'queueing' | 'fetching' | 'generating' | 'summarizing' | 'done';

const PHASE_LABEL: Record<Phase, string> = {
  queueing: 'Queued',
  fetching: 'Exploring sources',
  generating: 'Synthesizing',
  summarizing: 'Composing preview',
  done: 'Ready',
};

export function AnalysisHeader({ phase, onCancel }: { phase: Phase; onCancel?: () => void }) {
  const label = PHASE_LABEL[phase];
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-white">{label}</h3>
        {phase !== 'done' && <TypingDots aria-live="polite" label="" />}
      </div>
      {phase !== 'done' && (
        <button
          type="button"
          onClick={onCancel}
          className="px-2 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 border border-zinc-700"
          aria-label="Cancel analysis"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
