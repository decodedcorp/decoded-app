import { useEffect, useRef, useState } from 'react';

export function useStreamingText(full: string, opts?: { cps?: number; chunk?: number }) {
  const cps = Math.max(1, opts?.cps ?? 60);
  const chunk = Math.max(1, opts?.chunk ?? 4);
  const [text, setText] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    setText('');
    let i = 0;
    const intervalMs = 1000 / (cps / chunk);
    let last = performance.now();

    const tick = (now: number) => {
      if (signal.aborted) return;
      const elapsed = now - last;
      if (elapsed >= intervalMs) {
        last = now;
        i = Math.min(full.length, i + chunk);
        setText(full.slice(0, i));
        if (i >= full.length) return; // done
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      abortRef.current?.abort();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [full, cps, chunk]);

  return text;
}
