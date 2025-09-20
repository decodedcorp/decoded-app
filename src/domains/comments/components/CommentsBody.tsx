'use client';

import React from 'react';
import { CommentSection } from './CommentSection';

interface CommentsBodyProps {
  contentId: string;
  showHeader?: boolean;
  className?: string;
}

export function CommentsBody({ contentId, showHeader = true, className = '' }: CommentsBodyProps) {
  return (
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
      <CommentSection contentId={contentId} showHeader={showHeader} />
    </div>
  );
}
