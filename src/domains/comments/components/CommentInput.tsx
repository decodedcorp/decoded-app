'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdSend, MdClose } from 'react-icons/md';
import { Button } from '@decoded/ui';
import { useCreateComment } from '../hooks/useComments';
import { useUser } from '@/domains/auth/hooks/useAuth';

interface CommentInputProps {
  contentId: string;
  parentCommentId?: string;
  onCommentCreated?: () => void;
  placeholder?: string;
  compact?: boolean;
  autoFocus?: boolean;
}

export function CommentInput({
  contentId,
  parentCommentId,
  onCommentCreated,
  placeholder = 'Write a comment...',
  compact = false,
  autoFocus = false
}: CommentInputProps) {
  const { user } = useUser();
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const createCommentMutation = useCreateComment();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const trimmedText = text.trim();
    if (!trimmedText || createCommentMutation.isPending) return;

    try {
      await createCommentMutation.mutateAsync({
        contentId,
        text: trimmedText,
        parentCommentId
      });
      
      setText('');
      setIsFocused(false);
      onCommentCreated?.();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCancel = () => {
    setText('');
    setIsFocused(false);
    textareaRef.current?.blur();
  };

  if (!user) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} text-center`}>
        <p className="text-sm text-zinc-400 mb-2">Sign in to join the conversation</p>
        <Button variant="primary" size="sm">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'p-3' : 'p-4'} bg-zinc-900/50`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* User avatar and input */}
        <div className="flex space-x-3">
          {/* User avatar */}
          <div className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-semibold text-xs">
              {(user.nickname || user.email || 'U').charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Text input */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              maxLength={1000}
              className={`w-full resize-none bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'
              }`}
              style={{ maxHeight: '120px' }}
            />
          </div>
        </div>

        {/* Actions row */}
        {(isFocused || text.trim()) && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 ml-11">
              {text.length}/1000 {!compact && '• Press Enter to post, Shift+Enter for new line'}
            </span>
            
            <div className="flex space-x-2">
              {(isFocused || text.trim()) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <MdClose className="w-4 h-4" />
                  {!compact && <span>Cancel</span>}
                </button>
              )}
              
              <button
                type="submit"
                disabled={!text.trim() || createCommentMutation.isPending}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-[#eafd66] hover:bg-[#eafd66]/80 disabled:bg-zinc-600 disabled:cursor-not-allowed text-black rounded-lg transition-colors"
              >
                {createCommentMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <MdSend className="w-4 h-4" />
                )}
                {!compact && (
                  <span>
                    {createCommentMutation.isPending 
                      ? 'Posting...' 
                      : parentCommentId 
                        ? 'Reply' 
                        : 'Comment'
                    }
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}