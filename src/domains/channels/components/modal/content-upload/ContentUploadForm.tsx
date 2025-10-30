'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

import {
  useContentUploadStore,
  selectContentUploadFormData,
  selectContentUploadError,
} from '@/store/contentUploadStore';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { useCreateLinkContent } from '@/domains/channels/hooks/useContents';

// Custom hooks
import { useContentTabs } from './hooks/useContentTabs';
import { useDropdowns } from './hooks/useDropdowns';
import { usePromptActions } from './hooks/usePromptActions';
import { useFormSteps } from './hooks/useFormSteps';

// Components
import { InputStep } from './components/InputStep';
import { PreviewStep } from './components/PreviewStep';
import { DetailsStep } from './components/DetailsStep';
import { EditDropdown } from './components/EditDropdown';
import { AddPromptModal } from './components/AddPromptModal';
import { EditPromptModal } from './components/EditPromptModal';
import { AnalysisInline } from './components/AnalysisInline';
import { useMockAnalysis } from './hooks/useMockAnalysis';
import { AnalysisResult } from './types/analysis';

// Utils
import { validateForm } from './utils/contentValidation';

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

  // Custom hooks
  const {
    contentTabs,
    currentInput,
    setCurrentInput,
    inputType,
    setInputType,
    isInputTypeManuallySet,
    setIsInputTypeManuallySet,
    handleAddContentToTabs,
    handleRemoveContentTab,
    getSuggestedInputType,
  } = useContentTabs();

  const {
    isEditDropdownOpen,
    setIsEditDropdownOpen,
    editDropdownRef,
    editDropdownStyle,
    toggleEditDropdown,
    isInputTypeDropdownOpen,
    setIsInputTypeDropdownOpen,
    inputTypeDropdownRef,
    inputTypeDropdownPanelRef,
    dropdownStyle,
    toggleInputTypeDropdown,
  } = useDropdowns();

  const {
    actionTexts,
    isAddPromptModalOpen,
    setIsAddPromptModalOpen,
    newPromptAction,
    setNewPromptAction,
    handleAddPromptAction,
    handleCloseAddPromptModal,
    openAddPromptModal,
  } = usePromptActions();

  const { currentStep, setCurrentStep, selectedTemplate, setSelectedTemplate } = useFormSteps();

  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    file?: string;
    url?: string;
  }>({});

  const isEnterSubmittingRef = useRef(false);

  // Analysis overlay state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisInputs, setAnalysisInputs] = useState<{ url?: string; prompts: string[] }>({
    prompts: [],
  });
  const {
    run: runMockAnalysis,
    cancel: cancelMockAnalysis,
    progress: analysisProgress,
    isRunning: isAnalysisRunning,
  } = useMockAnalysis();

  // Embedded modal portal target inside the content upload container
  const modalLayerRef = useRef<HTMLDivElement | null>(null);

  // Edit prompt modal state
  const [isEditPromptModalOpen, setIsEditPromptModalOpen] = useState(false);
  const [editPromptText, setEditPromptText] = useState('');

  // Update input type when contentTabs change (only if not manually set)
  useEffect(() => {
    if (!isInputTypeManuallySet) {
      const nextType = getSuggestedInputType();
      // Only change if the suggested type is different from current
      if (nextType !== inputType) {
        setInputType(nextType);
      }
    }
  }, [contentTabs, isInputTypeManuallySet, inputType, getSuggestedInputType, setInputType]);

  // Input type dropdown handlers
  const handleInputTypeSelect = (type: 'url' | 'prompt') => {
    setInputType(type);
    setIsInputTypeManuallySet(true);
    setIsInputTypeDropdownOpen(false);
  };

  // Action button handlers
  const handleActionClick = async (actionType: string) => {
    console.log('=== Action button clicked ===');
    console.log('Action type:', actionType);
    const actionText = actionTexts[actionType as keyof typeof actionTexts];
    console.log('Action text:', actionText);
    if (actionText) {
      // Set current input to the action text
      setCurrentInput(actionText);
      console.log('Set current input to:', actionText);

      // Automatically add to tabs as prompt type
      try {
        await handleAddContentToTabs(actionText, 'prompt');
      } catch (error) {
        console.error('Failed to add content to tabs:', error);
        setValidationErrors((prev) => ({
          ...prev,
          url: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    }
  };

  // Load link preview when analyze button is clicked
  const handleAnalyzeClick = useCallback(async () => {
    console.log('=== handleAnalyzeClick called ===');
    console.log('Current input:', currentInput);
    console.log('Input type:', inputType);

    // Add current content to tabs if it exists
    if (currentInput.trim()) {
      console.log('Adding current input to tabs');
      try {
        await handleAddContentToTabs(currentInput, inputType);
      } catch (error) {
        console.error('Failed to add content to tabs:', error);
        setValidationErrors((prev) => ({
          ...prev,
          url: error instanceof Error ? error.message : 'Unknown error',
        }));
        return;
      }
    } else {
      console.log('No current input to add');
    }

    // Prepare inputs snapshot for inline panel
    const url = contentTabs.find((t) => t.type === 'url')?.content;
    const prompts = contentTabs.filter((t) => t.type === 'prompt').map((t) => t.content);
    setAnalysisInputs({ url, prompts });

    // Jump to preview immediately; render skeleton while analyzing
    setAnalysisResult(null);
    setCurrentStep('preview');
    try {
      const result = await runMockAnalysis(contentTabs);
      setAnalysisResult(result);
      console.log('Mock analysis completed:', result);
    } catch (err) {
      console.error('Analysis error or cancelled:', err);
    }
  }, [currentInput, inputType, handleAddContentToTabs, setCurrentStep]);

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field as keyof typeof formData]: value });

    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTemplateSelect = useCallback(
    (template: any) => {
      setSelectedTemplate(template.id);
      updateFormData({ prompt: template.prompt });
    },
    [updateFormData, setSelectedTemplate],
  );

  const validateFormData = () => {
    const errors = validateForm(contentTabs, formData.description, t as any);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      console.log('=== handleSubmit called ===');
      e.preventDefault();
      if (isEnterSubmittingRef.current) {
        console.log('Submit ignored due to Enter handling lock');
        return;
      }
      // Form submit now triggers analysis instead of content creation
      await handleAnalyzeClick();
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

  // Handle key down for input
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Avoid submitting while composing (IME) or key repeat
      if ((e as any).nativeEvent?.isComposing) return;
      if ((e as any).repeat) return;
      console.log('=== Enter key pressed ===');
      console.log('Current input:', currentInput);
      console.log('Input type:', inputType);
      e.preventDefault();
      isEnterSubmittingRef.current = true;
      try {
        await handleAddContentToTabs(currentInput, inputType);
      } catch (error) {
        console.error('Failed to add content to tabs:', error);
        setValidationErrors((prev) => ({
          ...prev,
          url: error instanceof Error ? error.message : 'Unknown error',
        }));
      } finally {
        // Release the lock on the next tick to avoid form submit racing
        setTimeout(() => {
          isEnterSubmittingRef.current = false;
        }, 0);
      }
    }
  };

  // Handle paste for URL input type
  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (inputType !== 'url') return;
    const pasted = e.clipboardData?.getData('text') || '';
    if (!pasted.trim()) return;
    e.preventDefault();
    try {
      await handleAddContentToTabs(pasted, 'url');
    } catch (error) {
      console.error('Failed to add pasted url to tabs:', error);
      setValidationErrors((prev) => ({
        ...prev,
        url: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  // Paste button action: reads from clipboard and adds based on current input type
  const handlePasteButtonClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text?.trim()) return;
      const typeToUse = inputType;
      await handleAddContentToTabs(text, typeToUse);
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
      setValidationErrors((prev) => ({
        ...prev,
        url: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  // Handle edit dropdown actions
  const handleEditAction = (action: 'edit' | 'delete' | 'add-prompt') => {
    console.log('Edit action:', action);
    if (action === 'add-prompt') {
      setIsAddPromptModalOpen(true);
    } else if (action === 'edit') {
      if (inputType !== 'prompt') {
        setInputType('prompt');
        setIsInputTypeManuallySet(true);
      }
      setEditPromptText(currentInput || '');
      setIsEditPromptModalOpen(true);
    } else if (action === 'delete') {
      // TODO: Implement delete functionality
      console.log('Delete functionality not implemented yet');
    }
    setIsEditDropdownOpen(false);
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'input':
        return (
          <InputStep
            contentTabs={contentTabs}
            currentInput={currentInput}
            inputType={inputType}
            actionTexts={actionTexts}
            validationErrors={validationErrors}
            isLoading={isLoading || createLinkContent.isPending}
            onInputChange={setCurrentInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onPasteClick={handlePasteButtonClick}
            onActionClick={handleActionClick}
            onEditClick={toggleEditDropdown}
            onRemoveTab={handleRemoveContentTab}
            onInputTypeSelect={handleInputTypeSelect}
            onSkip={() => setCurrentStep('preview')}
            onSubmit={handleSubmit}
            isInputTypeDropdownOpen={isInputTypeDropdownOpen}
            inputTypeDropdownRef={inputTypeDropdownRef}
            inputTypeDropdownPanelRef={inputTypeDropdownPanelRef}
            dropdownStyle={dropdownStyle}
            onToggleInputTypeDropdown={toggleInputTypeDropdown}
            editDropdownAnchorRef={editDropdownRef}
          />
        );
      case 'preview':
        return (
          <PreviewStep
            contentTabs={contentTabs}
            onBackToInput={() => setCurrentStep('input')}
            analysisResult={analysisResult}
            analysisProgress={analysisProgress}
            analysisInputs={analysisInputs}
          />
        );
      case 'analyzing':
        return (
          <AnalysisInline
            progress={analysisProgress}
            url={analysisInputs.url}
            prompts={analysisInputs.prompts}
            onCancel={() => {
              cancelMockAnalysis();
              setCurrentStep('input');
            }}
          />
        );
      case 'details':
        return (
          <DetailsStep
            contentTabs={contentTabs}
            formData={formData}
            selectedTemplate={selectedTemplate}
            validationErrors={validationErrors}
            isLoading={isLoading || createLinkContent.isPending}
            onRemoveTab={handleRemoveContentTab}
            onInputChange={handleInputChange}
            onTemplateSelect={handleTemplateSelect}
            onSubmit={() => onSubmit(formData)}
          />
        );
      default:
        return (
          <InputStep
            contentTabs={contentTabs}
            currentInput={currentInput}
            inputType={inputType}
            actionTexts={actionTexts}
            validationErrors={validationErrors}
            isLoading={isLoading || createLinkContent.isPending}
            onInputChange={setCurrentInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onPasteClick={handlePasteButtonClick}
            onActionClick={handleActionClick}
            onEditClick={toggleEditDropdown}
            onRemoveTab={handleRemoveContentTab}
            onInputTypeSelect={handleInputTypeSelect}
            onSkip={() => setCurrentStep('preview')}
            onSubmit={handleSubmit}
            isInputTypeDropdownOpen={isInputTypeDropdownOpen}
            inputTypeDropdownRef={inputTypeDropdownRef}
            inputTypeDropdownPanelRef={inputTypeDropdownPanelRef}
            dropdownStyle={dropdownStyle}
            onToggleInputTypeDropdown={toggleInputTypeDropdown}
            editDropdownAnchorRef={editDropdownRef}
          />
        );
    }
  };

  return (
    <>
      <div ref={modalLayerRef} className="relative">
        {renderCurrentStep()}
      </div>

      {/* API Error */}
      {(error || storeError) && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error || storeError || 'An error occurred'}</p>
        </div>
      )}

      {/* Edit Dropdown Portal */}
      <EditDropdown
        isOpen={isEditDropdownOpen}
        dropdownStyle={editDropdownStyle}
        onEditAction={handleEditAction}
      />

      {/* Add Prompt Action Modal Portal */}
      <AddPromptModal
        isOpen={isAddPromptModalOpen}
        newPromptAction={newPromptAction}
        onUpdateAction={(updates) => setNewPromptAction((prev) => ({ ...prev, ...updates }))}
        onAddAction={handleAddPromptAction}
        onClose={handleCloseAddPromptModal}
        variant="fullscreen"
      />

      {/* Edit current prompt modal */}
      <EditPromptModal
        isOpen={isEditPromptModalOpen}
        value={editPromptText}
        onChange={setEditPromptText}
        onSave={() => {
          setCurrentInput(editPromptText);
          setIsEditPromptModalOpen(false);
        }}
        onClose={() => setIsEditPromptModalOpen(false)}
        variant="fullscreen"
      />

      {/* Inline analysis is rendered via analyzing step */}
    </>
  );
}
