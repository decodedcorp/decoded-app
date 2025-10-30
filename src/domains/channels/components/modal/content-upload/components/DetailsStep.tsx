import React from 'react';
import { ContentTab } from '../utils/contentHelpers';
import { ContentTabs } from './ContentTabs';
import { PromptTemplates, type PromptTemplate } from './PromptTemplates';

interface DetailsStepProps {
  contentTabs: ContentTab[];
  formData: {
    description?: string;
    prompt?: string;
  };
  selectedTemplate: string;
  validationErrors: { [key: string]: string | undefined };
  isLoading: boolean;
  onRemoveTab: (tabId: string) => void;
  onInputChange: (field: string, value: string) => void;
  onTemplateSelect: (template: PromptTemplate) => void;
  onSubmit: () => void;
}

export function DetailsStep({
  contentTabs,
  formData,
  selectedTemplate,
  validationErrors,
  isLoading,
  onRemoveTab,
  onInputChange,
  onTemplateSelect,
  onSubmit,
}: DetailsStepProps) {
  // If no content in tabs, go back to input step
  if (contentTabs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">추가 설정</h3>
          </div>
        </div>

        {/* Content Tabs Display */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span>Added Content ({contentTabs.length})</span>
          </div>
          <ContentTabs contentTabs={contentTabs} onRemoveTab={onRemoveTab} />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">설명 (선택사항)</label>
          <textarea
            id="content-description"
            value={formData.description || ''}
            onChange={(e) => onInputChange('description', e.target.value)}
            className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors resize-none ${
              validationErrors.description ? 'border-red-500' : 'border-zinc-700'
            }`}
            placeholder="링크에 대한 설명을 입력하세요..."
            rows={2}
            maxLength={500}
            disabled={isLoading}
          />
          <div className="flex justify-between items-center">
            {validationErrors.description && (
              <p className="text-sm text-red-400">{validationErrors.description}</p>
            )}
            <p className="text-xs text-zinc-500 ml-auto">
              {(formData.description || '').length}/500
            </p>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">AI 분석 설정 (선택사항)</label>

          {/* Prompt Templates */}
          <PromptTemplates
            selectedId={selectedTemplate}
            onSelect={onTemplateSelect}
            disabled={isLoading}
          />

          {/* Custom Prompt Input */}
          <textarea
            id="content-prompt"
            value={formData.prompt || ''}
            onChange={(e) => {
              onInputChange('prompt', e.target.value);
              if (e.target.value !== '') {
                // This should be handled by parent component
              }
            }}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors resize-vertical min-h-[100px]"
            placeholder="AI에게 요청할 내용을 입력하세요..."
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-zinc-400">
            예: 주요 논점 3개로 요약, 기술적 내용 중심 분석, 비즈니스 인사이트 추출
          </p>
        </div>

        {/* Final Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-medium transition-colors hover:bg-primary-hover disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-400 border border-primary hover:border-primary-hover disabled:border-zinc-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            콘텐츠 추가 완료
          </button>
        </div>
      </div>
    </div>
  );
}
