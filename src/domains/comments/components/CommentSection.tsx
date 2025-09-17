'use client';

import React, { useState } from 'react';

import { MdComment } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import { useComments, useCommentStats } from '../hooks/useComments';

import { CommentList } from './CommentList';
import { CommentInput } from './CommentInput';

interface CommentSectionProps {
  contentId: string;
  showHeader?: boolean;
}

export function CommentSection({ contentId, showHeader = true }: CommentSectionProps) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'most_liked'>('newest');

  // Translation hook
  const { t } = useTranslation('content');

  // Fetch comments and stats
  const { comments, isLoading, isLoadingMore, error, hasMore, totalCount, fetchMore, refetch } =
    useComments({
      contentId,
      sortOrder,
      includeReplies: true,
    });

  const { data: stats, isLoading: statsLoading } = useCommentStats(contentId);

  const handleSortChange = (newSort: 'newest' | 'oldest' | 'most_liked') => {
    setSortOrder(newSort);
  };

  return (
    <div className="flex flex-col h-full relative z-[10003]">
      {/* Comments Header - Only show if showHeader is true */}
      {showHeader && (
        <div className="p-4 border-b border-zinc-700/50 relative z-[10004]">
          <div className="mb-2">
            <h3 className="text-base font-medium text-white mb-1">{t('comments.title')}</h3>
            {!statsLoading && stats?.total_comments !== undefined && (
              <span className="text-sm text-zinc-400">
                ({t('comments.count', { count: stats.total_comments })})
              </span>
            )}
          </div>

          {/* Sort Options - temporarily hidden for debugging */}
          {false && (
            <div className="flex space-x-1">
              {(['newest', 'oldest', 'most_liked'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => handleSortChange(sort)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    sortOrder === sort
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                  }`}
                >
                  {sort === 'newest' && t('comments.sort.newest')}
                  {sort === 'oldest' && t('comments.sort.oldest')}
                  {sort === 'most_liked' && t('comments.sort.mostLiked')}
                </button>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {!statsLoading && stats && (
            <div className="text-xs text-zinc-400 space-x-4">
              {stats.recent_comments !== undefined && stats.recent_comments > 0 && (
                <span>{t('comments.recent', { count: stats.recent_comments })}</span>
              )}
              {stats.total_replies !== undefined && stats.total_replies > 0 && (
                <span>{t('comments.replies', { count: stats.total_replies })}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Comments List */}
      <div className="flex-1 min-h-0 overflow-y-auto relative z-[10004]">
        {error ? (
          <div className="p-4 text-center text-red-400">
            <p className="text-sm">{t('comments.error.loadFailed')}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-3 py-1 text-xs bg-zinc-800/50 hover:bg-zinc-700/50 rounded transition-colors"
            >
              {t('comments.error.tryAgain')}
            </button>
          </div>
        ) : isLoading ? (
          <div className="p-4">
            <CommentSkeleton />
          </div>
        ) : comments.length === 0 ? (
          <div className="p-4 text-center text-zinc-400">
            <MdComment className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t('comments.empty.title')}</p>
            <p className="text-xs mt-1 opacity-75">{t('comments.empty.subtitle')}</p>
          </div>
        ) : (
          <CommentList
            comments={comments}
            contentId={contentId}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={fetchMore}
          />
        )}
      </div>

      {/* Comment Input */}
      <div className="border-t border-zinc-700/50 relative z-[10005]">
        <CommentInput
          contentId={contentId}
          onCommentCreated={() => refetch()}
          placeholder={t('comments.input.placeholder')}
        />
      </div>
    </div>
  );
}

// Loading skeleton component
function CommentSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-zinc-700/50 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-20 h-3 bg-zinc-700/50 rounded"></div>
                <div className="w-12 h-3 bg-zinc-700/50 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="w-full h-3 bg-zinc-700/50 rounded"></div>
                <div className="w-3/4 h-3 bg-zinc-700/50 rounded"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-3 bg-zinc-700/50 rounded"></div>
                <div className="w-12 h-3 bg-zinc-700/50 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
