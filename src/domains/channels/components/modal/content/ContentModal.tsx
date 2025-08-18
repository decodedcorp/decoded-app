'use client';

import React from 'react';

import {
  useContentModalStore,
  selectIsContentModalOpen,
  selectSelectedContent,
} from '@/store/contentModalStore';

import { BaseModal } from '../base/BaseModal';
import { ContentModalContainer } from '../base/ContentModalContainer';

import { ContentModalHeader } from './ContentModalHeader';
import { ContentModalBody } from './ContentModalBody';
import { ContentModalFooter } from './ContentModalFooter';

export function ContentModal() {
  const isOpen = useContentModalStore(selectIsContentModalOpen);
  const content = useContentModalStore(selectSelectedContent);
  const closeModal = useContentModalStore((state) => state.closeModal);

  if (!content) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={closeModal}>
      <ContentModalContainer>
        {/* <ContentModalHeader content={content} onClose={closeModal} /> */}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <ContentModalBody content={content} />
        </div>

        {/* <ContentModalFooter content={content} /> */}
      </ContentModalContainer>
    </BaseModal>
  );
}
