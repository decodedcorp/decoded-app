import React from 'react';
import { ExplorerPulse } from './ExplorerPulse';

export function PhaseItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <ExplorerPulse active={active} />
      <div className="text-sm text-zinc-200" aria-live={active ? 'polite' : 'off'}>
        {label}
      </div>
    </div>
  );
}
