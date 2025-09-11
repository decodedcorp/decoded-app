'use client';

import React, { useState } from 'react';

import { MessageCircle } from 'lucide-react';
import { Button } from '@decoded/ui';
import {
  useContentModalStore,
  selectIsContentModalOpen,
  selectSelectedContent,
} from '@/store/contentModalStore';

import { BaseModal } from '../base/BaseModal';
import { ContentModalContainer } from '../base/ContentModalContainer';

import { ContentModalBody } from './ContentModalBody';
import { ContentSidebar } from './ContentSidebar';
import { MobileCommentsModal } from './MobileCommentsModal';

export function ContentModal() {
  const isOpen = useContentModalStore(selectIsContentModalOpen);
  const content = useContentModalStore(selectSelectedContent);
  const closeModal = useContentModalStore((state) => state.closeModal);
  const [showMobileComments, setShowMobileComments] = useState(false);

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
                onClick={() => setShowMobileComments(true)}
                variant="primary"
                className="rounded-full shadow-lg flex items-center space-x-2 px-4 py-3 min-h-[48px] touch-manipulation"
                aria-label="Open comments"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Comments</span>
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

      {/* Mobile Comments Modal */}
      <MobileCommentsModal
        isOpen={showMobileComments}
        onClose={() => setShowMobileComments(false)}
        content={content}
      />
    </>
  );
}
