'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

import { MdPushPin, MdClose } from 'react-icons/md';
import { Button } from '@decoded/ui';

interface PinNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPin: (note?: string) => void;
  isLoading?: boolean;
  contentTitle?: string;
}

const PinNoteModal = ({
  isOpen,
  onClose,
  onPin,
  isLoading = false,
  contentTitle = 'this content'
}: PinNoteModalProps) => {
  const [note, setNote] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus textarea when modal opens
      setTimeout(() => textareaRef.current?.focus(), 100);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handlePin = useCallback(() => {
    onPin(note.trim() || undefined);
    setNote(''); // Clear note after pinning
  }, [note, onPin]);

  const handleClose = useCallback(() => {
    setNote(''); // Clear note when closing
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-zinc-800 border border-zinc-600 rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MdPushPin className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Pin Content
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-zinc-700 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <MdClose className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-sm text-zinc-300 mb-4">
            Pin <span className="font-medium text-white">{contentTitle}</span> to the top of this channel
          </p>
          
          {/* Note Input */}
          <div className="space-y-2">
            <label htmlFor="pin-note" className="text-sm font-medium text-zinc-300">
              Add a note (optional)
            </label>
            <textarea
              ref={textareaRef}
              id="pin-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why is this content important? Add context for other members..."
              className="w-full h-20 px-3 py-2 bg-zinc-900/50 border border-zinc-600 rounded-lg 
                       text-white placeholder-zinc-400 resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={500}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Optional note to help others understand why this is pinned</span>
              <span>{note.length}/500</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={handleClose}
            variant="secondary"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePin}
            variant="primary"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                <span>Pinning...</span>
              </>
            ) : (
              <>
                <MdPushPin className="w-4 h-4" />
                <span>Pin Content</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PinNoteModal;