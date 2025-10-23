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

  // Content tabs state (URL, description, prompt)
  const [contentTabs, setContentTabs] = useState<
    Array<{
      id: string;
      type: 'url' | 'description' | 'prompt';
      content: string;
      preview?: LinkPreview;
    }>
  >([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [inputType, setInputType] = useState<'url' | 'description' | 'prompt'>('url');

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

  // Add content to tabs when Enter is pressed
  const handleAddContentToTabs = async (
    content: string,
    type: 'url' | 'description' | 'prompt',
  ) => {
    if (!content.trim()) return;

    // For URL type, check if URL already exists and validate format
    if (type === 'url') {
      const existingUrlTab = contentTabs.find((tab) => tab.type === 'url');
      if (existingUrlTab) {
        // Replace existing URL tab
        setContentTabs((prev) => {
          const filtered = prev.filter((tab) => tab.type !== 'url');
          return [...filtered, { ...existingUrlTab, content: content.trim() }];
        });
        setCurrentInput('');
        return;
      }

      // Basic URL validation
      try {
        new URL(content.trim().startsWith('http') ? content.trim() : `https://${content.trim()}`);
      } catch {
        setValidationErrors((prev) => ({ ...prev, url: '유효한 URL을 입력해주세요.' }));
        return;
      }
    }

    try {
      let preview: LinkPreview | undefined;
      if (type === 'url') {
        preview = await getMockLinkPreviewAsync(content.trim());
      }

      const newTab = {
        id: Date.now().toString(),
        type,
        content: content.trim(),
        preview,
      };

      setContentTabs((prev) => {
        const updatedTabs = type === 'url' 
          ? prev.filter((tab) => tab.type !== 'url').concat(newTab)
          : [...prev, newTab];
        
        // Update input type based on the new tabs
        setInputType(getNextInputType(updatedTabs));
        
        return updatedTabs;
      });

      setCurrentInput('');
      setValidationErrors((prev) => ({ ...prev, url: undefined }));
    } catch (error) {
      console.error('Failed to add content to tabs:', error);
      if (type === 'url') {
        setValidationErrors((prev) => ({ ...prev, url: '링크 미리보기를 가져오지 못했습니다.' }));
      }
    }
  };

  // Determine next input type based on existing tabs
  const getNextInputType = (tabs: typeof contentTabs): 'url' | 'description' | 'prompt' => {
    const hasUrl = tabs.some((tab) => tab.type === 'url');
    const hasDescription = tabs.some((tab) => tab.type === 'description');
    const hasPrompt = tabs.some((tab) => tab.type === 'prompt');


    // Only move to next type if current type is completed
    if (!hasUrl) return 'url';
    if (hasUrl && !hasDescription) return 'description';
    if (hasUrl && hasDescription && !hasPrompt) return 'prompt';
    return 'prompt'; // All exist, stay at prompt
  };

  // Remove content tab
  const handleRemoveContentTab = (tabId: string) => {
    setContentTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== tabId);
      setInputType(getNextInputType(filtered));
      return filtered;
    });
  };

  // Load link preview when analyze button is clicked
  const handleAnalyzeClick = async () => {
    // Add current content to tabs if it exists
    if (currentInput.trim()) {
      await handleAddContentToTabs(currentInput, inputType);
    }

    // Move to preview step
    setCurrentStep('preview');
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

    // Check if at least one content tab exists
    if (contentTabs.length === 0) {
      errors.url = '최소 하나의 콘텐츠를 추가해주세요.';
    }

    // Validate description length if exists
    const descriptionTab = contentTabs.find((tab) => tab.type === 'description');
    if (descriptionTab && descriptionTab.content.length > 500) {
      errors.description = t.globalContentUpload.contentUpload.validation.descriptionTooLong();
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
        {/* Content Tabs */}
        {contentTabs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {contentTabs.map((tab) => (
              <div
                key={tab.id}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors group"
              >
                {/* Icon based on type */}
                {tab.type === 'url' && tab.preview && (
                  <img
                    src={tab.preview.favicon}
                    alt={`${tab.preview.domain} favicon`}
                    className="w-4 h-4 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                {tab.type === 'description' && (
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
                {tab.type === 'prompt' && (
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                )}

                {/* Content */}
                <span
                  className="text-sm text-zinc-300 font-medium max-w-32 truncate"
                  title={tab.content}
                >
                  {tab.content}
                </span>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveContentTab(tab.id)}
                  className="opacity-100 p-0.5 hover:bg-zinc-700 rounded transition-colors"
                >
                  <svg
                    className="w-3 h-3 text-zinc-400 hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Content Input Area */}
        <div className="bg-zinc-800 rounded-2xl p-4 space-y-3">
          {/* Content Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              {inputType === 'url' && (
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
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              )}
              {inputType === 'description' && (
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              )}
              {inputType === 'prompt' && (
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              )}
            </div>
            <input
              id="content-input"
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  await handleAddContentToTabs(currentInput, inputType);
                }
              }}
              className={`w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-zinc-400 focus:outline-none text-lg ${
                validationErrors.url ? 'text-red-400' : ''
              }`}
              placeholder={
                inputType === 'url'
                  ? 'Add content URL and press Enter to add tab...'
                  : inputType === 'description'
                  ? 'Add description and press Enter to add tab...'
                  : 'Add AI prompt and press Enter to add tab...'
              }
              disabled={isLoading || createLinkContent.isPending}
            />
          </div>

          {/* Action Buttons and Submit */}
          <div className="flex justify-between items-center">
            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Analyze Button */}
              <button
                type="button"
                onClick={async () => await handleAnalyzeClick()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs bg-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-600 rounded-lg font-medium transition-colors border border-zinc-600 hover:border-zinc-500"
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
              </button>

              {/* Explain Button */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs bg-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-600 rounded-lg font-medium transition-colors border border-zinc-600 hover:border-zinc-500"
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

              {/* Summarize Button */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs bg-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-600 rounded-lg font-medium transition-colors border border-zinc-600 hover:border-zinc-500"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Summarize
              </button>

              {/* New Generate Button */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs bg-[#eafd66] text-black hover:bg-[#d4e85a] rounded-lg font-medium transition-colors border border-[#eafd66] hover:border-[#d4e85a]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate
              </button>

              {/* New Translate Button */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs bg-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-600 rounded-lg font-medium transition-colors border border-zinc-600 hover:border-zinc-500"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                Translate
              </button>
            </div>

            {/* Submit and Skip Buttons */}
            <div className="flex gap-2">
              {/* Skip Button */}
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  // Skip to preview step without adding current input
                  setCurrentStep('preview');
                }}
                disabled={isLoading || createLinkContent.isPending}
                className="flex items-center gap-1.5 px-4 py-2 text-xs bg-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-600 rounded-lg font-medium transition-colors border border-zinc-600 hover:border-zinc-500 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:border-zinc-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
                Skip
              </button>

              {/* Submit Button */}
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
                Submit
              </button>
            </div>
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
  const renderPreviewStep = () => {
    // If no content in tabs, go back to input step
    if (contentTabs.length === 0) {
      setCurrentStep('input');
      return null;
    }

    const urlTab = contentTabs.find((tab) => tab.type === 'url');
    const descriptionTab = contentTabs.find((tab) => tab.type === 'description');
    const promptTab = contentTabs.find((tab) => tab.type === 'prompt');

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
              <h3 className="text-lg font-semibold text-white">링크 미리보기</h3>
            </div>
          </div>

          {/* Link Preview Card */}
          {urlTab && urlTab.preview && (
            <div className="flex justify-center">
              <LinkPreviewCard preview={urlTab.preview} isLoading={false} error={null} />
            </div>
          )}

          {/* Content Summary */}
          <div className="bg-zinc-800 rounded-2xl p-4 space-y-4">
            <h4 className="text-md font-semibold text-white">추가된 콘텐츠</h4>

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

            {/* Description Tab */}
            {descriptionTab && (
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-700 rounded-lg">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span
                  className="text-sm text-zinc-300 font-medium max-w-48 truncate"
                  title={descriptionTab.content}
                >
                  {descriptionTab.content}
                </span>
              </div>
            )}

            {/* Prompt Tab */}
            {promptTab && (
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span
                  className="text-sm text-zinc-300 font-medium max-w-48 truncate"
                  title={promptTab.content}
                >
                  {promptTab.content}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep('input')}
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
              수정하기
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Additional Details
  const renderDetailsStep = () => {
    // If no content in tabs, go back to input step
    if (contentTabs.length === 0) {
      setCurrentStep('input');
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
            <div className="flex flex-wrap gap-2">
              {contentTabs.map((tab) => (
                <div
                  key={tab.id}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors group"
                >
                  {/* Icon based on type */}
                  {tab.type === 'url' && tab.preview && (
                    <img
                      src={tab.preview.favicon}
                      alt={`${tab.preview.domain} favicon`}
                      className="w-4 h-4 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {tab.type === 'description' && (
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                  {tab.type === 'prompt' && (
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  )}

                  {/* Content */}
                  <span
                    className="text-sm text-zinc-300 font-medium max-w-32 truncate"
                    title={tab.content}
                  >
                    {tab.content}
                  </span>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveContentTab(tab.id)}
                    className="opacity-100 p-0.5 hover:bg-zinc-700 rounded transition-colors"
                  >
                    <svg
                      className="w-3 h-3 text-zinc-400 hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
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
            <label className="block text-sm font-medium text-zinc-300">
              AI 분석 설정 (선택사항)
            </label>

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
  };

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
