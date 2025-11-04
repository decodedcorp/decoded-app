'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  useContentUploadStore,
  selectContentUploadFormData,
  selectContentUploadError,
} from '@/store/contentUploadStore';
import { useCreateLinkContent } from '@/domains/channels/hooks/useContents';
import { useMockAnalysis } from './hooks/useMockAnalysis';
import { AnalysisResult } from './types/analysis';
import { validateUrl } from './utils/contentHelpers';
import { getMockLinkPreviewAsync, LinkPreview } from '@/lib/services/mockLinkPreview';
import { Skill } from '@/domains/profile/types/skills';
import Stepper, { Step, StepperIndicator } from './components/Stepper';
import { Step1LinkInput } from './components/stepper/Step1LinkInput';
import { Step2Description } from './components/stepper/Step2Description';
import { Step3AIEdit } from './components/stepper/Step3AIEdit';

interface ContentUploadFormStepperProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string | null;
  onIndicatorRender?: (indicator: React.ReactNode) => void;
}

export function ContentUploadFormStepper({ onSubmit, isLoading, error, onIndicatorRender }: ContentUploadFormStepperProps) {
  const formData = useContentUploadStore(selectContentUploadFormData);
  const storeError = useContentUploadStore(selectContentUploadError);
  const updateFormData = useContentUploadStore((state) => state.updateFormData);

  const createLinkContent = useCreateLinkContent();

  // Step 1: Link input state
  const [url, setUrl] = useState(formData.url || '');
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Step 2: Description and prompts state
  const [description, setDescription] = useState(formData.description || '');
  const [prompts, setPrompts] = useState<string[]>([]);

  // Step 3: AI analysis state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [editedResult, setEditedResult] = useState<{
    summary: string;
    keyPoints: string[];
    keywords: string[];
  }>({
    summary: '',
    keyPoints: [],
    keywords: [],
  });

  const {
    run: runMockAnalysis,
    cancel: cancelMockAnalysis,
    progress: analysisProgress,
    isRunning: isAnalysisRunning,
  } = useMockAnalysis();

  // Fetch preview when URL changes and is valid
  useEffect(() => {
    if (url && validateUrl(url)) {
      setIsLoadingPreview(true);
      setPreviewError(null);
      getMockLinkPreviewAsync(url)
        .then((previewData) => {
          setPreview(previewData);
          setIsLoadingPreview(false);
        })
        .catch((err) => {
          setPreviewError(err.message || 'Failed to load preview');
          setIsLoadingPreview(false);
        });
    } else {
      setPreview(null);
    }
  }, [url]);

  // Trigger AI analysis when entering step 3
  const handleStepChange = useCallback(
    async (step: number) => {
      if (step === 3 && !analysisResult && !isAnalysisRunning) {
        // Prepare content tabs for analysis
        const contentTabs = [
          { id: '1', type: 'url' as const, content: url, preview: preview || undefined },
          ...prompts.map((prompt, idx) => ({
            id: `prompt-${idx}`,
            type: 'prompt' as const,
            content: prompt,
          })),
        ];

        try {
          const result = await runMockAnalysis(contentTabs);
          setAnalysisResult(result);
        } catch (err) {
          console.error('Analysis error:', err);
        }
      }
    },
    [url, preview, prompts, analysisResult, isAnalysisRunning, runMockAnalysis],
  );

  // Handle skill selection
  const handleSkillSelect = useCallback(
    (skill: Skill) => {
      if (skill.prompt && !prompts.includes(skill.prompt)) {
        setPrompts([...prompts, skill.prompt]);
      }
    },
    [prompts],
  );

  // Handle regeneration with new skills
  const handleRegenerate = useCallback(async () => {
    if (!url) return;

    const contentTabs = [
      { id: '1', type: 'url' as const, content: url, preview: preview || undefined },
      ...prompts.map((prompt, idx) => ({
        id: `prompt-${idx}`,
        type: 'prompt' as const,
        content: prompt,
      })),
    ];

    setAnalysisResult(null);
    setEditedResult({ summary: '', keyPoints: [], keywords: [] });

    try {
      const result = await runMockAnalysis(contentTabs);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Regeneration error:', err);
    }
  }, [url, preview, prompts, runMockAnalysis]);

  // Handle final submission
  const handleFinalStepCompleted = useCallback(async () => {
    if (!formData.channel_id) {
      console.error('Channel ID is required');
      return;
    }

    // Update form data with all collected information
    updateFormData({
      url: url,
      description: description,
      prompt: prompts.join('\n'),
    });

    // Prepare submission data
    const submitData = {
      channel_id: formData.channel_id,
      url: url,
      description: description || null,
      // Include edited AI results if available (may not be used by API yet)
      ...(editedResult.summary && {
        aiSummary: editedResult.summary,
        aiKeyPoints: editedResult.keyPoints,
        aiKeywords: editedResult.keywords,
      }),
    };

    try {
      // Call the API to create link content
      await createLinkContent.mutateAsync(submitData);
      // On success, call parent onSubmit for cache invalidation and modal closing
      onSubmit(submitData);
    } catch (error) {
      console.error('Failed to create link content:', error);
      // Error is handled by useToastMutation in useCreateLinkContent
    }
  }, [url, description, prompts, editedResult, formData, updateFormData, createLinkContent, onSubmit]);

  // Validation function for step progression
  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1:
        return url.trim() !== '' && validateUrl(url);
      case 2:
        return true; // Step 2 is optional
      case 3:
        return !isAnalysisRunning && !!analysisResult;
      default:
        return true;
    }
  };

  // Track step changes
  const handleStepChangeWithTracking = useCallback(
    async (step: number) => {
      await handleStepChange(step);
    },
    [handleStepChange],
  );

  // Handle indicator ready callback from Stepper
  const handleIndicatorReady = useCallback(
    (indicator: React.ReactNode) => {
      if (onIndicatorRender) {
        // Use setTimeout to defer state update until after render
        setTimeout(() => {
          onIndicatorRender(indicator);
        }, 0);
      }
    },
    [onIndicatorRender],
  );

  return (
    <div className="relative flex flex-col h-full">
      <Stepper
        initialStep={1}
        onStepChange={handleStepChangeWithTracking}
        onFinalStepCompleted={handleFinalStepCompleted}
        backButtonText="이전"
        nextButtonText="다음"
        canProceed={canProceed}
        contentClassName="px-4 py-8 min-h-[400px]"
        footerClassName="px-4 py-6"
        hideBuiltInIndicator={!!onIndicatorRender}
        onIndicatorReady={handleIndicatorReady}
      >
        <Step>
          <Step1LinkInput
            url={url}
            onUrlChange={setUrl}
            preview={preview}
            isLoadingPreview={isLoadingPreview}
            previewError={previewError}
          />
        </Step>

        <Step>
          <Step2Description
            description={description}
            prompts={prompts}
            onDescriptionChange={setDescription}
            onPromptsChange={setPrompts}
            onSkillSelect={handleSkillSelect}
          />
        </Step>

        <Step>
          <Step3AIEdit
            analysisResult={analysisResult}
            analysisProgress={analysisProgress}
            isAnalyzing={isAnalysisRunning}
            editedResult={editedResult}
            onResultChange={setEditedResult}
            onRegenerate={handleRegenerate}
            onSkillSelect={handleSkillSelect}
            onSubmit={handleFinalStepCompleted}
            isLoading={isLoading || createLinkContent.isPending}
          />
        </Step>
      </Stepper>

      {/* Error Display */}
      {(error || storeError) && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error || storeError || 'An error occurred'}</p>
        </div>
      )}
    </div>
  );
}

