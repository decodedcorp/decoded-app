'use client';

import React, { useState, useRef, useEffect } from 'react';

import { MdSend, MdClose } from 'react-icons/md';
import { Button } from '@decoded/ui';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { useCommentTranslation } from '@/lib/i18n/hooks';
import { LoginButton } from '@/shared/components/LoginButton';

import { useCreateComment } from '../hooks/useComments';

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
  placeholder,
  compact = false,
  autoFocus = false,
}: CommentInputProps) {
  const { user } = useUser();
  const tc = useCommentTranslation();
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submittingRef = useRef(false);

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
    if (!trimmedText || createCommentMutation.isPending || submittingRef.current) return;

    try {
      submittingRef.current = true;
      await createCommentMutation.mutateAsync({
        contentId,
        text: trimmedText,
        parentCommentId,
      });

      setText('');
      setIsFocused(false);
      onCommentCreated?.();
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      submittingRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Enter로 제출 시에는 form submit만 트리거하여 onSubmit 한 경로로만 처리
      e.currentTarget.form?.requestSubmit();
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
        <p className="text-sm text-zinc-400 mb-3">{tc.input.signInPrompt()}</p>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'p-3' : 'p-4'} bg-zinc-900/50`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* User avatar and input */}
        <div className="flex space-x-3">
          {/* User avatar */}
          <div
            className={`${
              compact ? 'w-6 h-6' : 'w-8 h-8'
            } bg-gradient-to-r from-primary to-gray-600 rounded-full flex items-center justify-center flex-shrink-0`}
          >
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
              placeholder={placeholder || tc.input.placeholder()}
              rows={1}
              maxLength={1000}
              className={`w-full resize-none bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
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
              {tc.input.charCount(text.length)}
              {!compact && ` • ${tc.input.shortcut()}`}
            </span>

            <div className="flex space-x-2">
              {(isFocused || text.trim()) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                  aria-label={tc.input.cancel()}
                >
                  <MdClose className="w-4 h-4 text-zinc-400 hover:text-white" />
                </button>
              )}

              <button
                type="submit"
                disabled={!text.trim() || createCommentMutation.isPending}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eafd66] hover:bg-[#eafd66]/80 disabled:bg-zinc-600 disabled:cursor-not-allowed text-black transition-colors"
                aria-label={
                  createCommentMutation.isPending
                    ? tc.input.posting()
                    : parentCommentId
                    ? tc.input.reply()
                    : tc.input.comment()
                }
              >
                {createCommentMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <MdSend className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
