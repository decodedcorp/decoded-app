'use client';

import React, { useState } from 'react';

import { MessageCircle } from 'lucide-react';
import { Button } from '@decoded/ui';
import {
  useContentModalStore,
  selectIsContentModalOpen,
  selectSelectedContent,
} from '@/store/contentModalStore';
import { useTranslation } from 'react-i18next';

import { BaseModal } from '../base/BaseModal';
import { ContentModalContainer } from '../base/ContentModalContainer';

import { ContentModalBody } from './ContentModalBody';
import { ContentSidebar } from './ContentSidebar';
import { CommentsRoot } from '@/domains/comments/components/CommentsRoot';
import { useCommentsModal } from '@/hooks/useCommentsModal';

export function ContentModal() {
  const isOpen = useContentModalStore(selectIsContentModalOpen);
  const content = useContentModalStore(selectSelectedContent);
  const closeModal = useContentModalStore((state) => state.closeModal);
  const { open: openComments } = useCommentsModal();
  const { t } = useTranslation('content');

  if (!content) return null;

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={closeModal}
        closeOnOverlayClick={true}
        closeOnEscape={true}
      >
        <div className="flex relative w-full h-full">
          {/* Left: Original Content Modal */}
          <ContentModalContainer>
            <div className="w-full h-full">
              <ContentModalBody content={content} onClose={closeModal} />
            </div>

            {/* Mobile Comments Button (Floating) */}
            <div className="lg:hidden fixed bottom-6 right-6 z-10">
              <Button
                onClick={() => openComments(String(content.id))}
                variant="comments-floating"
                className="rounded-full flex items-center space-x-2 px-5 py-3 min-h-[48px] touch-manipulation font-medium"
                aria-label={t('comments.title')}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{t('comments.title')}</span>
              </Button>
            </div>
          </ContentModalContainer>

          {/* Right: Comment Sidebar (Desktop Only) */}
          <div className="hidden lg:block ml-4">
            <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[400px] h-[80vh] overflow-hidden shadow-2xl">
              <ContentSidebar content={content} onClose={closeModal} />
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Comments System */}
      <CommentsRoot />
    </>
  );
}
