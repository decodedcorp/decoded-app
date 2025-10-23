'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { ContentType } from '@/lib/types/ContentType';
import {
  useContentUploadStore,
  selectContentUploadFormData,
  selectContentUploadError,
} from '@/store/contentUploadStore';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { useCreateLinkContent } from '@/domains/channels/hooks/useContents';
import { getMockLinkPreviewAsync, type LinkPreview } from '@/lib/services/mockLinkPreview';
import { LinkPreviewCard } from './LinkPreviewCard';
import { PromptTemplates, type PromptTemplate } from './PromptTemplates';

interface ContentUploadFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ContentUploadForm({ onSubmit, isLoading, error }: ContentUploadFormProps) {
  const t = useCommonTranslation();
  const formData = useContentUploadStore(selectContentUploadFormData);
  const storeError = useContentUploadStore(selectContentUploadError);
  const updateFormData = useContentUploadStore((state) => state.updateFormData);

  const createLinkContent = useCreateLinkContent();

  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    file?: string;
    url?: string;
  }>({});

  // Link preview state
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // URL tabs state
  const [urlTabs, setUrlTabs] = useState<Array<{ id: string; url: string; preview: LinkPreview }>>([]);
  const [currentUrlInput, setCurrentUrlInput] = useState<string>('');

  // Step management
  const [currentStep, setCurrentStep] = useState<'input' | 'preview' | 'details'>('input');

  // Selected prompt template
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');

  // Set default type to LINK
  useEffect(() => {
    if (!formData.type) {
      updateFormData({ type: ContentType.LINK });
    }
  }, [formData.type, updateFormData]);

  // Add URL to tabs when spacebar is pressed
  const handleAddUrlToTabs = async (url: string) => {
    if (!url.trim()) return;

    // Check if URL already exists in tabs
    const existingTab = urlTabs.find(tab => tab.url === url.trim());
    if (existingTab) return;

    try {
      const preview = await getMockLinkPreviewAsync(url.trim());
      const newTab = {
        id: Date.now().toString(),
        url: url.trim(),
        preview
      };
      setUrlTabs(prev => [...prev, newTab]);
      setCurrentUrlInput(''); // Clear input
    } catch (err) {
      console.error('Failed to add URL to tabs:', err);
    }
  };

  // Remove URL from tabs
  const handleRemoveUrlTab = (tabId: string) => {
    setUrlTabs(prev => prev.filter(tab => tab.id !== tabId));
  };

  // Load link preview when analyze button is clicked
  const handleAnalyzeClick = async () => {
    // Add current URL to tabs if it exists
    if (currentUrlInput.trim()) {
      await handleAddUrlToTabs(currentUrlInput);
    }

    // For demo purposes, allow empty URL or any text
    const url = currentUrlInput.trim() || 'demo-link';

    setPreviewLoading(true);
    setPreviewError(null);

    try {
      // For demo, always show mock preview regardless of URL validity
      const preview = await getMockLinkPreviewAsync(url);
      setLinkPreview(preview);
      setCurrentStep('preview'); // Move to preview step
    } catch (err) {
      // Even if there's an error, show a demo preview
      const demoPreview = await getMockLinkPreviewAsync('demo-link');
      setLinkPreview(demoPreview);
      setCurrentStep('preview'); // Move to preview step
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    updateFormData({ [field]: value });

    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTemplateSelect = useCallback(
    (template: PromptTemplate) => {
      setSelectedTemplate(template.id);
      updateFormData({ prompt: template.prompt });
    },
    [updateFormData],
  );

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (formData.description && formData.description.trim().length > 500) {
      errors.description = t.globalContentUpload.contentUpload.validation.descriptionTooLong();
    }

    // For demo purposes, URL validation is optional
    // Only validate URL format if provided
    if (formData.url?.trim()) {
      try {
        new URL(formData.url.trim());
      } catch {
        // For demo, don't show error for invalid URLs
        // errors.url = t.globalContentUpload.contentUpload.validation.invalidUrl();
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // Form submit now triggers analysis instead of content creation
      handleAnalyzeClick();
    },
    [handleAnalyzeClick],
  );

  // Expose global submit function
  useEffect(() => {
    (window as any).triggerContentFormSubmit = () => {
      console.log('=== Global submit triggered ===');
      handleSubmit(new Event('submit') as any);
    };

    return () => {
      delete (window as any).triggerContentFormSubmit;
    };
  }, [handleSubmit]);

  // Step 1: Content Input
  const renderInputStep = () => (
    <div className="flex flex-col p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6">
        {/* URL Tabs */}
        {urlTabs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Added URLs ({urlTabs.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {urlTabs.map((tab) => (
                <div
                  key={tab.id}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors group"
                >
                  {/* Favicon */}
                  <img
                    src={tab.preview.favicon}
                    alt={`${tab.preview.domain} favicon`}
                    className="w-4 h-4 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Domain */}
                  <span className="text-sm text-zinc-300 font-medium">
                    {tab.preview.domain}
                  </span>
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveUrlTab(tab.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-zinc-700 rounded"
                  >
                    <svg className="w-3 h-3 text-zinc-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons - Analyze, Explain, Summarize */}
        <div className="flex gap-3">
          {/* Analyze Button - Inactive */}
          <button
            type="button"
            onClick={async () => await handleAnalyzeClick()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg font-medium transition-colors border border-zinc-700 hover:border-zinc-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Analyze
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          {/* Explain Button - Inactive */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg font-medium transition-colors border border-zinc-700 hover:border-zinc-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Explain
          </button>

          {/* Summarize Button - Inactive */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg font-medium transition-colors border border-zinc-700 hover:border-zinc-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Summarize
          </button>
        </div>

        {/* Main Content Input Area */}
        <div className="bg-zinc-800 rounded-2xl p-4 space-y-3">
          {/* Content URL Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <input
              id="content-url"
              type="text"
              value={currentUrlInput}
              onChange={(e) => setCurrentUrlInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  await handleAnalyzeClick();
                } else if (e.key === ' ') {
                  e.preventDefault();
                  await handleAddUrlToTabs(currentUrlInput);
                }
              }}
              className={`w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-zinc-400 focus:outline-none text-lg ${
                validationErrors.url ? 'text-red-400' : ''
              }`}
              placeholder="Add content URL and press Space to add tab, Enter to analyze..."
              disabled={isLoading || createLinkContent.isPending}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                await handleAnalyzeClick();
              }}
              disabled={isLoading || createLinkContent.isPending}
              className="flex items-center gap-1.5 px-4 py-2 text-xs bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg font-medium transition-colors border border-zinc-700 hover:border-zinc-600 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:border-zinc-600"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analyze
            </button>
          </div>
        </div>

        {/* API Error */}
        {(error || storeError) && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error || storeError || 'An error occurred'}</p>
          </div>
        )}
      </form>
    </div>
  );

  // Step 2: Link Preview
  const renderPreviewStep = () => (
    <div className="flex flex-col p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            </div>
            <h3 className="text-lg font-semibold text-white">링크 미리보기</h3>
          </div>
          <button
            type="button"
            onClick={() => setCurrentStep('input')}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            다시 입력
          </button>
        </div>

        {/* Link Preview Card */}
        <LinkPreviewCard preview={linkPreview} isLoading={previewLoading} error={previewError} />

        {/* Continue Button */}
        {!previewLoading && !previewError && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep('details')}
              className="flex items-center gap-2 px-8 py-4 bg-zinc-800 text-white rounded-xl font-medium transition-all duration-200 hover:bg-zinc-700 border border-zinc-600 hover:border-zinc-500 hover:shadow-lg"
            >
              <span>계속하기</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Step 3: Additional Details
  const renderDetailsStep = () => (
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
          <button
            type="button"
            onClick={() => setCurrentStep('preview')}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            미리보기로
          </button>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">설명 (선택사항)</label>
          <textarea
            id="content-description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors resize-none ${
              validationErrors.description ? 'border-red-500' : 'border-zinc-700'
            }`}
            placeholder="링크에 대한 설명을 입력하세요..."
            rows={2}
            maxLength={500}
            disabled={isLoading || createLinkContent.isPending}
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
            onSelect={handleTemplateSelect}
            disabled={isLoading || createLinkContent.isPending}
          />

          {/* Custom Prompt Input */}
          <textarea
            id="content-prompt"
            value={formData.prompt || ''}
            onChange={(e) => {
              handleInputChange('prompt', e.target.value);
              if (e.target.value !== '') {
                setSelectedTemplate('custom');
              }
            }}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors resize-vertical min-h-[100px]"
            placeholder="AI에게 요청할 내용을 입력하세요..."
            disabled={isLoading || createLinkContent.isPending}
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
            onClick={() => onSubmit(formData)}
            disabled={isLoading || createLinkContent.isPending}
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

  // Render current step
  switch (currentStep) {
    case 'input':
      return renderInputStep();
    case 'preview':
      return renderPreviewStep();
    case 'details':
      return renderDetailsStep();
    default:
      return renderInputStep();
  }
}
