'use client';

import React, { useState } from 'react';
import { CommentSection } from './CommentSection';
import { LoginModal } from '@/domains/auth/components/LoginModal';

interface CommentsBodyProps {
  contentId: string;
  showHeader?: boolean;
  className?: string;
}

export function CommentsBody({ contentId, showHeader = true, className = '' }: CommentsBodyProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <div
        className={`flex flex-col h-full ${className}`}
        onClick={(e) => {
          console.log('CommentsBody clicked:', e.target);
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          console.log('CommentsBody mouse down:', e.target);
          e.stopPropagation();
        }}
      >
        <CommentSection
          contentId={contentId}
          showHeader={showHeader}
          onLoginRequired={() => setIsLoginModalOpen(true)}
        />
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
