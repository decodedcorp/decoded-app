import { useCallback, useRef, useState } from 'react';
import { AnalysisProgress, AnalysisResult, AnalysisStage } from '../types/analysis';
import { ContentTab } from '../utils/contentHelpers';

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => resolve(), ms);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(id);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });

export const useMockAnalysis = () => {
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (tabs: ContentTab[]) => {
      if (isRunning) return Promise.reject(new Error('Already running'));
      const controller = new AbortController();
      abortRef.current = controller;
      setIsRunning(true);

      const url = tabs.find((t) => t.type === 'url')?.content || '';
      const prompts = tabs.filter((t) => t.type === 'prompt').map((t) => t.content);

      const update = (stage: AnalysisStage, message: string, percent: number) =>
        setProgress({ stage, message, percent });

      try {
        setProgress({ stage: 'parsing', message: 'Queued…', percent: 5, phase: 'queueing' });
        await delay(200, controller.signal);

        update('parsing', 'Parsing URL and metadata…', 10);
        setProgress({
          stage: 'parsing',
          message: 'Parsing URL and metadata…',
          percent: 20,
          phase: 'fetching',
        });
        await delay(600, controller.signal);

        update('reading-prompts', 'Reading prompt(s)…', 35);
        setProgress({
          stage: 'reading-prompts',
          message: 'Reading prompt(s)…',
          percent: 45,
          phase: 'generating',
        });
        await delay(600, controller.signal);

        update('generating-insights', 'Generating insights…', 70);
        setProgress({
          stage: 'generating-insights',
          message: 'Generating insights…',
          percent: 70,
          phase: 'generating',
        });
        await delay(900, controller.signal);

        update('finalizing', 'Finalizing result…', 90);
        setProgress({
          stage: 'finalizing',
          message: 'Finalizing result…',
          percent: 90,
          phase: 'summarizing',
        });
        await delay(500, controller.signal);

        const result: AnalysisResult = {
          summary:
            prompts.length > 0
              ? `AI analyzed the content at ${url || 'the provided source'} with ${
                  prompts.length
                } prompt(s).`
              : `AI analyzed the content at ${url || 'the provided source'}.`,
          keyPoints: [
            'Identified main theme and relevant context',
            'Extracted core facts and relationships',
            'Outlined follow-up questions for deeper understanding',
          ],
          keywords: ['analysis', 'context', 'summary', 'insights'],
          estimatedReadingTime: '~2 min',
        };

        setProgress({ stage: 'finalizing', message: 'Done', percent: 100, phase: 'done' });
        return result;
      } finally {
        setTimeout(() => {
          setIsRunning(false);
        }, 0);
      }
    },
    [isRunning],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsRunning(false);
  }, []);

  return { run, cancel, progress, isRunning };
};
