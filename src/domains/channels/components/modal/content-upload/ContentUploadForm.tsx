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
import { AnalysisInline } from './components/AnalysisInline';
import { SkillsSelector } from './components/SkillsSelector';
import { SkillEditModal } from '@/domains/profile/components/modals/SkillEditModal';
import { useMockAnalysis } from './hooks/useMockAnalysis';
import { AnalysisResult } from './types/analysis';
import { Skill } from '@/domains/profile/types/skills';
import { useCreateSkill } from '@/domains/profile/hooks/useSkills';

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

  const { actionTexts, setActionTexts } = usePromptActions();

  // Skill edit modal state
  const [isSkillEditModalOpen, setIsSkillEditModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const createSkill = useCreateSkill();

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

  // Skills selector state
  const [isSkillsSelectorOpen, setIsSkillsSelectorOpen] = useState(false);
  const skillsSelectorRef = useRef<HTMLDivElement | null>(null);
  const skillsSelectorPanelRef = useRef<HTMLDivElement | null>(null);
  const [skillsSelectorStyle, setSkillsSelectorStyle] = useState<React.CSSProperties>({});

  // Calculate SkillsSelector position when opening
  useEffect(() => {
    if (isSkillsSelectorOpen && skillsSelectorRef.current) {
      const rect = skillsSelectorRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 384; // w-96 = 24rem = 384px
      const dropdownHeight = 384; // max-h-96 = 24rem = 384px

      const style: React.CSSProperties = {
        position: 'fixed',
        width: dropdownWidth,
        zIndex: 1120,
      };

      // Calculate horizontal position
      if (rect.left + dropdownWidth > viewportWidth - 20) {
        // Not enough space on right, align to right edge
        style.right = viewportWidth - rect.right;
        style.left = 'auto';
      } else {
        style.left = rect.left;
      }

      // Calculate vertical position
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        // Open above
        style.bottom = viewportHeight - rect.top + 4;
        style.top = 'auto';
      } else {
        // Open below
        style.top = rect.bottom + 4;
        style.bottom = 'auto';
      }

      setSkillsSelectorStyle(style);
    }
  }, [isSkillsSelectorOpen]);

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

  // Handle skill selection
  const handleSkillSelect = async (skill: Skill) => {
    console.log('=== Skill selected ===');
    console.log('Skill:', skill);
    try {
      // Add skill prompt to tabs
      await handleAddContentToTabs(skill.prompt, 'prompt');
    } catch (error) {
      console.error('Failed to add skill to tabs:', error);
      setValidationErrors((prev) => ({
        ...prev,
        url: error instanceof Error ? error.message : 'Unknown error',
      }));
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
      // Add Skill (새 스킬 추가)
      setEditingSkill(null);
      setIsSkillEditModalOpen(true);
    } else if (action === 'edit') {
      // 현재 prompt를 Skill로 저장하고 편집
      // 현재 입력된 텍스트를 기반으로 임시 Skill 생성 (편집용)
      if (currentInput.trim()) {
        // 임시 Skill 객체 생성 (편집 시 prompt 기본값으로 사용)
        const tempSkill: Skill = {
          id: 'temp-edit',
          title: '',
          prompt: currentInput,
          userId: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setEditingSkill(tempSkill);
        setIsSkillEditModalOpen(true);
      } else {
        // 빈 상태에서 새 Skill 생성
        setEditingSkill(null);
        setIsSkillEditModalOpen(true);
      }
    } else if (action === 'delete') {
      // TODO: Implement delete functionality
      console.log('Delete functionality not implemented yet');
    }
    setIsEditDropdownOpen(false);
  };

  // Handle skill creation/update
  const handleSkillSaved = async (skill: Skill) => {
    // Skill이 저장되면 해당 prompt를 content tabs에 추가
    try {
      await handleAddContentToTabs(skill.prompt, 'prompt');
    } catch (error) {
      console.error('Failed to add skill prompt to tabs:', error);
    }
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
            onSkillsClick={() => {
              if (!isSkillsSelectorOpen) {
                setIsSkillsSelectorOpen(true);
              }
            }}
            skillsSelectorRef={skillsSelectorRef}
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
            onSkillsClick={() => {
              if (!isSkillsSelectorOpen) {
                setIsSkillsSelectorOpen(true);
              }
            }}
            skillsSelectorRef={skillsSelectorRef}
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

      {/* Skill Edit Modal */}
      <SkillEditModal
        isOpen={isSkillEditModalOpen}
        onClose={() => {
          setIsSkillEditModalOpen(false);
          setEditingSkill(null);
        }}
        skill={editingSkill}
        onSkillSaved={handleSkillSaved}
      />

      {/* Skills Selector - Portal renders outside modal */}
      <div className="relative" ref={skillsSelectorRef}>
        {/* Empty div for positioning reference */}
      </div>
      <SkillsSelector
        isOpen={isSkillsSelectorOpen}
        onClose={() => setIsSkillsSelectorOpen(false)}
        onSelectSkill={handleSkillSelect}
        dropdownStyle={skillsSelectorStyle}
        containerRef={skillsSelectorPanelRef}
      />

      {/* Inline analysis is rendered via analyzing step */}
    </>
  );
}
