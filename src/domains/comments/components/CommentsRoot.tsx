'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCommentsModal } from '@/hooks/useCommentsModal';
import { CommentsModal } from './CommentsModal';
import { CommentsSheet } from './CommentsSheet';

export function CommentsRoot() {
  const { isOpen, isMobile } = useCommentsModal();

  if (!isOpen) return null;

  const content = isMobile ? <CommentsSheet /> : <CommentsModal />;

  // Portal을 사용하여 document.body에 렌더링
  return createPortal(content, document.body);
}
