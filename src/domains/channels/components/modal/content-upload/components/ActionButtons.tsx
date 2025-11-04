import React from 'react';
import { ActionTexts, actionConfigs } from '../utils/contentHelpers';

interface ActionButtonsProps {
  actionTexts: ActionTexts;
  onActionClick: (actionType: string) => void;
  onEditClick: () => void;
  onSkillsClick?: () => void;
  disabled?: boolean;
  editDropdownAnchorRef?: React.RefObject<HTMLDivElement | null>;
  skillsSelectorRef?: React.RefObject<HTMLDivElement | null>;
}

export function ActionButtons({
  actionTexts,
  onActionClick,
  onEditClick,
  onSkillsClick,
  disabled,
  editDropdownAnchorRef,
  skillsSelectorRef,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      {/* Skills Button */}
      {onSkillsClick && (
        <div className="relative" ref={skillsSelectorRef}>
          <button
            type="button"
            onClick={onSkillsClick}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-purple-600/20 text-purple-300 hover:text-purple-200 hover:bg-purple-600/30 rounded-lg font-medium transition-colors border border-purple-600/30 hover:border-purple-600/50 disabled:bg-purple-600/10 disabled:cursor-not-allowed disabled:text-purple-400/50 disabled:border-purple-600/20"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Skills
          </button>
        </div>
      )}
      {Object.entries(actionTexts).map(([key, prompt]) => {
        const config = actionConfigs[key as keyof typeof actionConfigs];
        const displayName = config?.displayName || key;
        const iconPath = config?.icon || '';

        return (
          <button
            key={key}
            type="button"
            onClick={() => onActionClick(key)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-600 rounded-lg font-medium transition-colors border border-zinc-600 hover:border-zinc-500 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:border-zinc-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
            </svg>
            {displayName}
          </button>
        );
      })}

      {/* Edit Dropdown Button */}
      <div className="relative" ref={editDropdownAnchorRef}>
        <button
          type="button"
          onClick={onEditClick}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 hover:text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
