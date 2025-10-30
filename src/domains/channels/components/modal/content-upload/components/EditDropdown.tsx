import React from 'react';
import { createPortal } from 'react-dom';

interface EditDropdownProps {
  isOpen: boolean;
  dropdownStyle: React.CSSProperties;
  onEditAction: (action: 'edit' | 'delete' | 'add-prompt') => void;
}

export function EditDropdown({ isOpen, dropdownStyle, onEditAction }: EditDropdownProps) {
  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div style={dropdownStyle} className="bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg">
      <div className="py-1">
        {/* Edit Tab */}
        <button
          type="button"
          onClick={() => onEditAction('edit')}
          className="flex items-center gap-2 w-full px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>

        {/* Add Prompt Action */}
        <button
          type="button"
          onClick={() => onEditAction('add-prompt')}
          className="flex items-center gap-2 w-full px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Prompt Action
        </button>

        {/* Delete Tab */}
        <button
          type="button"
          onClick={() => onEditAction('delete')}
          className="flex items-center gap-2 w-full px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>,
    document.body,
  );
}
