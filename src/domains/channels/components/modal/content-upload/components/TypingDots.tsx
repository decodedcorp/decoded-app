import React from 'react';

type Props = { label?: string; 'aria-live'?: 'off' | 'polite' | 'assertive' };

export function TypingDots({ label = 'Thinking', ...aria }: Props) {
  return (
    <div className="inline-flex items-center gap-1 text-zinc-300" {...aria}>
      <span className="sr-only">{label}…</span>
      <span aria-hidden className="text-xs">
        {label}
      </span>
      <span
        aria-hidden
        className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms] motion-reduce:animate-none"
      />
      <span
        aria-hidden
        className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms] motion-reduce:animate-none"
      />
      <span
        aria-hidden
        className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms] motion-reduce:animate-none"
      />
    </div>
  );
}
