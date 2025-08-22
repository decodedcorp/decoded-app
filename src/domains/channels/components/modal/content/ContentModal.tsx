'use client';

import React from 'react';

import {
  useContentModalStore,
  selectIsContentModalOpen,
  selectSelectedContent,
} from '@/store/contentModalStore';

import { Z_INDEX_CLASSES } from '@/lib/constants/zIndex';

import { BaseModal } from '../base/BaseModal';
import { ContentModalContainer } from '../base/ContentModalContainer';

import { ContentModalBody } from './ContentModalBody';

export function ContentModal() {
  const isOpen = useContentModalStore(selectIsContentModalOpen);
  const content = useContentModalStore(selectSelectedContent);
  const closeModal = useContentModalStore((state) => state.closeModal);
  const closeModalOnEscape = useContentModalStore((state) => state.closeModalOnEscape);
  const closeModalOnOverlay = useContentModalStore((state) => state.closeModalOnOverlay);

  if (!content) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      onEscape={closeModalOnEscape}
      onOverlayClick={closeModalOnOverlay}
      overlayClassName={`fixed inset-0 bg-black/50 backdrop-blur-sm ${Z_INDEX_CLASSES.CONTENT_MODAL_OVERLAY}`}
      contentClassName={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${Z_INDEX_CLASSES.CONTENT_MODAL_CONTENT}`}
    >
      <ContentModalContainer>
        {/* Content */}
        <div className="overflow-y-auto max-h-[85vh]">
          <ContentModalBody content={content} onClose={closeModal} />
        </div>
      </ContentModalContainer>
    </BaseModal>
  );
}
