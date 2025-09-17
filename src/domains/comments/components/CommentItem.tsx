'use client';

import React, { useState } from 'react';

import { Button } from '@decoded/ui';
import {
  MdFavorite,
  MdFavoriteBorder,
  MdReply,
  MdEdit,
  MdDelete,
  MdMoreVert,
  MdThumbDown,
  MdThumbDownOffAlt,
} from 'react-icons/md';
import { CommentResponse } from '@/api/generated/models/CommentResponse';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { useCommentTranslation } from '@/lib/i18n/hooks';

import { useCommentLike, useUpdateComment, useDeleteComment } from '../hooks/useComments';
import { LoginButton } from '@/shared/components/LoginButton';

import { CommentInput } from './CommentInput';

interface CommentItemProps {
  comment: CommentResponse;
  contentId: string;
  isReply?: boolean;
  onReplyCreated?: () => void;
}

export function CommentItem({
  comment,
  contentId,
  isReply = false,
  onReplyCreated,
}: CommentItemProps) {
  const { user } = useUser();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const commentLikeMutation = useCommentLike();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const tc = useCommentTranslation();

  // Check if current user is the comment author
  const isAuthor = user?.doc_id === comment.author_id;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? tc.time.now() : tc.time.minutesAgo(diffMinutes);
    } else if (diffDays < 1) {
      return tc.time.hoursAgo(diffHours);
    } else if (diffDays < 7) {
      return tc.time.daysAgo(diffDays);
    } else {
      return date.toLocaleDateString();
    }
  };

  // Handle like/dislike actions
  const handleLike = () => {
    if (!user) return;
    commentLikeMutation.mutate({
      commentId: comment.id,
      action: 'like',
      contentId,
    });
  };

  const handleDislike = () => {
    if (!user) return;
    commentLikeMutation.mutate({
      commentId: comment.id,
      action: 'dislike',
      contentId,
    });
  };

  // Handle edit comment
  const handleEdit = () => {
    if (editText.trim() && editText !== comment.text) {
      updateCommentMutation.mutate(
        {
          commentId: comment.id,
          text: editText.trim(),
          contentId,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            setShowMenu(false);
          },
        },
      );
    } else {
      setIsEditing(false);
    }
  };

  // Handle delete comment
  const handleDelete = () => {
    if (window.confirm(tc.item.deleteConfirm())) {
      deleteCommentMutation.mutate(
        {
          commentId: comment.id,
          contentId,
        },
        {
          onSuccess: () => {
            setShowMenu(false);
          },
        },
      );
    }
  };

  // Handle reply created
  const handleReplyCreated = () => {
    setShowReplyInput(false);
    onReplyCreated?.();
  };

  return (
    <div className={`flex space-x-3 ${isReply ? 'text-sm' : ''}`}>
      {/* Avatar */}
      <div
        className={`${
          isReply ? 'w-6 h-6' : 'w-8 h-8'
        } bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0`}
      >
        <span className="text-white font-semibold text-xs">
          {comment.author_id.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Comment header */}
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-white text-sm truncate">{comment.author_id}</span>
          <span className="text-xs text-zinc-400 flex-shrink-0">
            {formatDate(comment.created_at)}
          </span>
          {comment.is_edited && <span className="text-xs text-zinc-500">{tc.item.edited()}</span>}

          {/* Menu button for author */}
          {isAuthor && (
            <div className="relative ml-auto">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-zinc-700/50 rounded transition-colors"
              >
                <MdMoreVert className="w-4 h-4 text-zinc-400" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700/50 flex items-center space-x-2"
                  >
                    <MdEdit className="w-4 h-4" />
                    <span>{tc.item.edit()}</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-700/50 flex items-center space-x-2"
                  >
                    <MdDelete className="w-4 h-4" />
                    <span>{tc.item.delete()}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment text */}
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 text-sm bg-zinc-800/50 border border-zinc-600 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-zinc-400">{editText.length}/1000</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditText(comment.text);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  {tc.input.cancel()}
                </button>
                <Button
                  onClick={handleEdit}
                  disabled={
                    !editText.trim() || editText === comment.text || updateCommentMutation.isPending
                  }
                  variant="primary"
                  size="sm"
                >
                  {updateCommentMutation.isPending ? tc.input.posting() : tc.input.save()}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-zinc-200 mb-2 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
        )}

        {/* Comment actions */}
        {!isEditing && (
          <div className="flex items-center space-x-4 text-xs">
            {user ? (
              <>
                {/* Like button */}
                <button
                  onClick={handleLike}
                  disabled={commentLikeMutation.isPending}
                  className="flex items-center space-x-1 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <MdFavoriteBorder className="w-4 h-4" />
                  <span>{comment.likes || 0}</span>
                </button>

                {/* Dislike button */}
                <button
                  onClick={handleDislike}
                  disabled={commentLikeMutation.isPending}
                  className="flex items-center space-x-1 text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  <MdThumbDownOffAlt className="w-4 h-4" />
                  <span>{comment.dislikes || 0}</span>
                </button>

                {/* Reply button (only for top-level comments) */}
                {!isReply && (
                  <button
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    className="flex items-center space-x-1 text-zinc-400 hover:text-white transition-colors"
                  >
                    <MdReply className="w-4 h-4" />
                    <span>{tc.item.reply()}</span>
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-zinc-500 text-xs">로그인하여 상호작용</span>
                <LoginButton />
              </div>
            )}

            {/* Reply count */}
            {!isReply && comment.replies_count && comment.replies_count > 0 && (
              <span className="text-zinc-500">{tc.item.replies(comment.replies_count)}</span>
            )}
          </div>
        )}

        {/* Reply input */}
        {showReplyInput && !isReply && (
          <div className="mt-3">
            <CommentInput
              contentId={contentId}
              parentCommentId={comment.id}
              onCommentCreated={handleReplyCreated}
              placeholder={tc.input.replyPlaceholder()}
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}
