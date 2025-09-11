'use client';

import React, { useEffect, useRef } from 'react';

import { CommentResponse } from '@/api/generated/models/CommentResponse';

import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: CommentResponse[];
  contentId: string;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function CommentList({
  comments,
  contentId,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
}: CommentListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll setup
  useEffect(() => {
    if (!hasMore || isLoadingMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Group comments by parent/child relationship
  const topLevelComments = comments.filter(comment => !comment.parent_comment_id);
  const replyMap = new Map<string, CommentResponse[]>();
  
  comments.forEach(comment => {
    if (comment.parent_comment_id) {
      const replies = replyMap.get(comment.parent_comment_id) || [];
      replies.push(comment);
      replyMap.set(comment.parent_comment_id, replies);
    }
  });

  const handleReplyCreated = () => {
    // Scroll to bottom to show new reply
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <div ref={scrollRef} className="flex flex-col">
      <div className="space-y-4 p-4">
        {topLevelComments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Top level comment */}
            <CommentItem
              comment={comment}
              contentId={contentId}
              onReplyCreated={handleReplyCreated}
            />
            
            {/* Replies */}
            {replyMap.get(comment.id) && (
              <div className="ml-6 space-y-3 border-l border-zinc-700/30 pl-4">
                {replyMap.get(comment.id)!.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    contentId={contentId}
                    isReply
                    onReplyCreated={handleReplyCreated}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Load more trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="py-4 text-center">
            {isLoadingMore ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-zinc-400">Loading more comments...</span>
              </div>
            ) : (
              <button
                onClick={onLoadMore}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-colors"
              >
                Load more comments
              </button>
            )}
          </div>
        )}

        {/* No more comments indicator */}
        {!hasMore && comments.length > 0 && (
          <div className="py-2 text-center">
            <span className="text-xs text-zinc-500">No more comments</span>
          </div>
        )}
      </div>
    </div>
  );
}