'use client';

import React from 'react';

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalClose } from '@/lib/components/ui/modal';
import { ContentItem } from '@/lib/types/content';
import { CommentSection } from '@/domains/comments/components/CommentSection';

interface MobileCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem;
}

export function MobileCommentsModal({ isOpen, onClose, content }: MobileCommentsModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      variant="sheet-bottom"
      size="auto"
      dismissible={true}
      ariaLabel="Comments"
    >
      <ModalOverlay className="modal-overlay--heavy">
        <ModalContent className="bg-zinc-900 border-t border-zinc-700/50 shadow-2xl">
          <ModalHeader className="bg-zinc-900/95 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white">Comments</h2>
            <ModalClose />
          </ModalHeader>

          <ModalBody className="min-h-0">
            <CommentSection contentId={String(content.id)} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
