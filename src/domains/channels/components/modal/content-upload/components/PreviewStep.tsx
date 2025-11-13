import React, { useEffect, useState } from 'react';
import { ContentTab } from '../utils/contentHelpers';
import { LinkPreviewCard } from '../LinkPreviewCard';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { AnalysisProgress, AnalysisResult } from '../types/analysis';
import { useStreamingText } from './useStreamingText';
import TextType from './TextType';

interface PreviewStepProps {
  contentTabs: ContentTab[];
  onBackToInput: () => void;
  analysisResult?: AnalysisResult | null;
  analysisProgress?: AnalysisProgress | null;
  analysisInputs?: { url?: string; prompts: string[] };
}

export function PreviewStep({
  contentTabs,
  onBackToInput,
  analysisResult,
  analysisProgress,
  analysisInputs,
}: PreviewStepProps) {
  const t = useCommonTranslation();
  const streamedSummary = useStreamingText(analysisResult?.summary || '', { cps: 80, chunk: 6 });
  const [showSummary, setShowSummary] = useState(false);
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [showLinkPreview, setShowLinkPreview] = useState(false);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout> | undefined;
    let t2: ReturnType<typeof setTimeout> | undefined;
    let t3: ReturnType<typeof setTimeout> | undefined;
    let t4: ReturnType<typeof setTimeout> | undefined;
    if (analysisResult) {
      setShowSummary(false);
      setShowKeyPoints(false);
      setShowKeywords(false);
      setShowLinkPreview(false);
      t1 = setTimeout(() => setShowSummary(true), 0);
      t2 = setTimeout(() => setShowKeyPoints(true), 250);
      t3 = setTimeout(() => setShowKeywords(true), 500);
      t4 = setTimeout(() => setShowLinkPreview(true), 750);
    } else {
      setShowSummary(false);
      setShowKeyPoints(false);
      setShowKeywords(false);
      setShowLinkPreview(false);
    }
    return () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
      if (t3) clearTimeout(t3);
      if (t4) clearTimeout(t4);
    };
  }, [analysisResult]);

  // If no content in tabs, go back to input step
  if (contentTabs.length === 0) {
    return null;
  }

  const urlTab = contentTabs.find((tab) => tab.type === 'url');
  // Show only one prompt in preview: pick the most recently added
  const promptTab = [...contentTabs].reverse().find((tab) => tab.type === 'prompt');

  return (
    <div className="relative flex flex-col p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              {t.globalContentUpload.contentUpload.previewStep.title()}
            </h3>
          </div>
        </div>

        {/* Link preview moved below to prioritize user-added content first */}

        {/* Content Summary */}
        <div className="bg-zinc-800 rounded-2xl p-4 space-y-4 transition-all duration-300">
          <h4 className="text-md font-semibold text-white">
            {t.globalContentUpload.contentUpload.previewStep.contentSummary()}
          </h4>

          {!analysisResult && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2">
              <div className="text-sm text-zinc-300 animate-pulse">
                AI is generating based on URL and prompt(s) you submitted...
              </div>
            </div>
          )}

          {/* URL Tab */}
          {urlTab && (
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-700 rounded-lg">
              <img
                src={urlTab.preview?.favicon}
                alt={`${urlTab.preview?.domain} favicon`}
                className="w-4 h-4 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span
                className="text-sm text-zinc-300 font-medium max-w-48 truncate"
                title={urlTab.content}
              >
                {urlTab.content}
              </span>
            </div>
          )}

          {/* Description removed: input types limited to url and prompt */}

          {/* Prompt Tab (or Skeleton) */}
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-700 rounded-lg">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548-.547z"
              />
            </svg>
            {promptTab ? (
              <span
                className="text-sm text-zinc-300 font-medium max-w-48 truncate"
                title={promptTab.content}
              >
                {promptTab.content}
              </span>
            ) : (
              <div className="h-3 w-40 bg-zinc-600/60 rounded animate-pulse" />
            )}
          </div>

          {/* Analysis Result (staggered reveal) */}
          <div className="mt-2 space-y-3">
            <div className="transition-all duration-300">
              {analysisResult && showSummary ? (
                <div className="mb-1">
                  <TextType text="AI Summary" typingSpeed={35} showCursor={false} loop={false} />
                </div>
              ) : (
                <div className="text-sm text-zinc-400 mb-1">&nbsp;</div>
              )}
              {analysisResult && showSummary ? (
                <div className="text-sm text-zinc-200 whitespace-pre-wrap" aria-live="polite">
                  <TextType
                    text={analysisResult.summary}
                    typingSpeed={25}
                    showCursor={true}
                    loop={false}
                  />
                </div>
              ) : null}
            </div>

            <div className="transition-all duration-300">
              {analysisResult && showKeyPoints ? (
                <div className="mb-1">
                  <TextType text="Key Points" typingSpeed={35} showCursor={false} loop={false} />
                </div>
              ) : (
                <div className="text-sm text-zinc-400 mb-1">&nbsp;</div>
              )}
              {analysisResult && showKeyPoints ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-zinc-200">
                  {analysisResult.keyPoints.map((p, i) => (
                    <li key={i} className="whitespace-pre-wrap">
                      <TextType text={p} typingSpeed={20} showCursor={false} loop={false} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="transition-all duration-300">
              {analysisResult && showKeywords ? (
                <div className="mb-1">
                  <TextType text="Keywords" typingSpeed={35} showCursor={false} loop={false} />
                </div>
              ) : (
                <div className="text-sm text-zinc-400 mb-1">&nbsp;</div>
              )}
              {analysisResult && showKeywords ? (
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords.map((k, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-700 text-xs text-zinc-200 border border-zinc-600"
                    >
                      <TextType text={k} typingSpeed={20} showCursor={false} loop={false} />
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {!analysisResult && (
              <div className="text-xs text-zinc-500">
                Analyzing… {Math.min(analysisProgress?.percent ?? 0, 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Link Preview Card (after generated content, staged) */}
        {analysisResult && showLinkPreview && (
          <div className="flex justify-center">
            {urlTab && urlTab.preview ? (
              <LinkPreviewCard preview={urlTab.preview} isLoading={false} error={null} />
            ) : null}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onBackToInput}
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t.globalContentUpload.contentUpload.previewStep.editButton()}
          </button>
        </div>
      </div>
    </div>
  );
}
