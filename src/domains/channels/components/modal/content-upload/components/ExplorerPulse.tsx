import React from 'react';

export function ExplorerPulse({ active = true }: { active?: boolean }) {
  if (!active) {
    return <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" aria-hidden />;
  }
  return (
    <div className="relative w-3.5 h-3.5" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping motion-reduce:animate-none" />
      <div className="absolute inset-1 rounded-full bg-purple-400/80" />
    </div>
  );
}
