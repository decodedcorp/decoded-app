'use client';

import React from 'react';
import { MdClose } from 'react-icons/md';
import { ContentItem } from '@/lib/types/content';
import { CommentSection } from '@/domains/comments/components/CommentSection';
import { BaseModal } from '../base/BaseModal';

interface MobileCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem;
}

export function MobileCommentsModal({ isOpen, onClose, content }: MobileCommentsModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={true}
      closeOnEscape={true}
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      contentClassName="fixed inset-x-0 bottom-0 top-[10vh] z-50"
    >
      <div className="w-full h-full bg-zinc-900 rounded-t-2xl shadow-2xl border-t border-zinc-700/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700/50 bg-zinc-900/95 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-white">Comments</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
          >
            <MdClose className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Comments Section */}
        <div className="flex-1 min-h-0">
          <CommentSection contentId={content.id} />
        </div>
      </div>
    </BaseModal>
  );
}