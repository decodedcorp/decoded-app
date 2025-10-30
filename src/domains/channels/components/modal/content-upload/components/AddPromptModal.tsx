import React from 'react';
import { createPortal } from 'react-dom';

interface NewPromptAction {
  emoji: string;
  title: string;
  prompt: string;
}

interface AddPromptModalProps {
  isOpen: boolean;
  newPromptAction: NewPromptAction;
  onUpdateAction: (action: Partial<NewPromptAction>) => void;
  onAddAction: () => void;
  onClose: () => void;
  // When provided, the modal will portal into this element and use embedded styling
  portalTarget?: Element | null;
  variant?: 'embedded' | 'fullscreen';
}

export function AddPromptModal({
  isOpen,
  newPromptAction,
  onUpdateAction,
  onAddAction,
  onClose,
  portalTarget,
  variant = 'fullscreen',
}: AddPromptModalProps) {
  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const containerClasses =
    variant === 'embedded'
      ? 'absolute inset-0 bg-black/40 flex items-center justify-center z-[1000]'
      : 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[11000]';

  const cardClasses =
    variant === 'embedded'
      ? 'bg-zinc-800 rounded-2xl p-6 w-full max-w-md mx-4 border border-zinc-700 shadow-xl'
      : 'bg-zinc-800 rounded-2xl p-6 w-full max-w-md mx-4 border border-zinc-700';

  return createPortal(
    <div className={containerClasses}>
      <div className={cardClasses}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Add Prompt Action</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Emoji Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Emoji</label>
            <input
              type="text"
              value={newPromptAction.emoji}
              onChange={(e) => onUpdateAction({ emoji: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="🤖"
              maxLength={2}
            />
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
            <input
              type="text"
              value={newPromptAction.title}
              onChange={(e) => onUpdateAction({ title: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., Creative Writing"
            />
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Prompt Text</label>
            <textarea
              value={newPromptAction.prompt}
              onChange={(e) => onUpdateAction({ prompt: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              placeholder="e.g., Write a creative story based on this content..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm bg-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAddAction}
            disabled={!newPromptAction.title || !newPromptAction.prompt}
            className="flex-1 px-4 py-2 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-400"
          >
            Add Action
          </button>
        </div>
      </div>
    </div>,
    portalTarget || document.body,
  );
}
