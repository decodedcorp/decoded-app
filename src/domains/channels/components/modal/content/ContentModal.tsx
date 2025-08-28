'use client';

import React, { useState } from 'react';

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
        <div className="flex relative">
          {/* Left: Original Content Modal */}
          <ContentModalContainer>
            <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
              <ContentModalBody content={content} onClose={closeModal} />
            </div>

            {/* Mobile Comments Button (Floating) */}
            <button
              onClick={() => setShowMobileComments(true)}
              className="lg:hidden fixed bottom-6 right-6 z-10 flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">Comments</span>
            </button>
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
