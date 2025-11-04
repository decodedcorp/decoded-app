import React from 'react';
import { ContentTab, ActionTexts } from '../utils/contentHelpers';
import { ContentTabs } from './ContentTabs';
import { ActionButtons } from './ActionButtons';
import { InputTypeDropdown } from './InputTypeDropdown';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';

interface InputStepProps {
  contentTabs: ContentTab[];
  currentInput: string;
  inputType: 'url' | 'prompt';
  actionTexts: ActionTexts;
  validationErrors: { [key: string]: string | undefined };
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onPasteClick?: () => void;
  onActionClick: (actionType: string) => void;
  onEditClick: () => void;
  onRemoveTab: (tabId: string) => void;
  onInputTypeSelect: (type: 'url' | 'prompt') => void;
  onSkip: () => void;
  onSubmit: (e: React.FormEvent) => void;
  // Dropdown props
  isInputTypeDropdownOpen: boolean;
  inputTypeDropdownRef: React.RefObject<HTMLDivElement | null>;
  inputTypeDropdownPanelRef?: React.RefObject<HTMLDivElement | null>;
  dropdownStyle: React.CSSProperties;
  onToggleInputTypeDropdown: () => void;
  editDropdownAnchorRef?: React.RefObject<HTMLDivElement | null>;
  // Skills props
  onSkillsClick?: () => void;
  skillsSelectorRef?: React.RefObject<HTMLDivElement | null>;
}

export function InputStep({
  contentTabs,
  currentInput,
  inputType,
  actionTexts,
  validationErrors,
  isLoading,
  onInputChange,
  onKeyDown,
  onPaste,
  onPasteClick,
  onActionClick,
  onEditClick,
  onRemoveTab,
  onInputTypeSelect,
  onSkip,
  onSubmit,
  isInputTypeDropdownOpen,
  inputTypeDropdownRef,
  inputTypeDropdownPanelRef,
  dropdownStyle,
  onToggleInputTypeDropdown,
  editDropdownAnchorRef,
  onSkillsClick,
  skillsSelectorRef,
}: InputStepProps) {
  const t = useCommonTranslation();

  return (
    <div className="flex flex-col p-4">
      <form onSubmit={onSubmit} className="w-full max-w-4xl space-y-6">
        {/* Content Tabs */}
        <ContentTabs contentTabs={contentTabs} onRemoveTab={onRemoveTab} />

        {/* Main Content Input Area */}
        <div className="bg-zinc-800 rounded-2xl p-4 space-y-3">
          {/* Content Input */}
          <div className="relative">
            {/* Input Type Selector */}
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
              ref={inputTypeDropdownRef}
            >
              <button
                type="button"
                onClick={onToggleInputTypeDropdown}
                className="flex items-center gap-2 p-1 hover:bg-zinc-700 rounded transition-colors"
              >
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
                <svg
                  className="w-3 h-3 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            {/* Paste Button on right end of input */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={onPasteClick}
                className="flex items-center gap-1.5 px-2 py-1 text-xs bg-zinc-700/60 text-zinc-300 hover:text-white hover:bg-zinc-600 rounded-md font-medium transition-colors border border-zinc-600 hover:border-zinc-500"
                title="Paste"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-1 4l-4 4m0 0l-4-4m4 4V3"
                  />
                </svg>
                Paste
              </button>
            </div>
            <input
              id="content-input"
              type="text"
              value={currentInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              className={`w-full pl-16 pr-24 py-3 bg-transparent text-white placeholder-zinc-400 focus:outline-none text-lg ${
                validationErrors.url ? 'text-red-400' : ''
              }`}
              placeholder={
                inputType === 'url'
                  ? t.globalContentUpload.contentUpload.inputStep.urlPlaceholder()
                  : t.globalContentUpload.contentUpload.inputStep.promptPlaceholder()
              }
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons and Submit */}
          <div className="flex justify-between items-center">
            {/* Action Buttons */}
            <ActionButtons
              actionTexts={actionTexts}
              onActionClick={onActionClick}
              onEditClick={onEditClick}
              onSkillsClick={onSkillsClick}
              editDropdownAnchorRef={editDropdownAnchorRef}
              skillsSelectorRef={skillsSelectorRef}
              disabled={isLoading}
            />

            {/* Submit and Skip Buttons */}
            <div className="flex gap-2">
              {/* Skip Button */}
              <button
                type="button"
                onClick={onSkip}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg font-medium transition-colors border border-zinc-700 hover:border-zinc-600 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:border-zinc-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
                {t.globalContentUpload.contentUpload.inputStep.skip()}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs bg-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-600 rounded-lg font-medium transition-colors border border-zinc-600 hover:border-zinc-500 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:border-zinc-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {t.globalContentUpload.contentUpload.inputStep.submit()}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Input Type Dropdown Portal */}
      <InputTypeDropdown
        isOpen={isInputTypeDropdownOpen}
        dropdownStyle={dropdownStyle}
        currentType={inputType}
        onTypeSelect={onInputTypeSelect}
        containerRef={inputTypeDropdownPanelRef}
      />
    </div>
  );
}
