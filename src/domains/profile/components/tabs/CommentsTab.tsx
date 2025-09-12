import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyComments } from '../../hooks/useProfileActivity';
import { formatDistanceToNow } from 'date-fns';

interface CommentsTabProps {
  userId: string;
  isMyProfile: boolean;
}

export function CommentsTab({ userId, isMyProfile }: CommentsTabProps) {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const limit = 20;
  
  const { data, isLoading, error } = useMyComments(limit, offset);
  
  const loadMore = () => {
    if (data?.has_more) {
      setOffset(prev => prev + limit);
    }
  };
  
  if (isLoading && offset === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-zinc-800 rounded w-1/4 mb-2" />
                <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Failed to load comments</h3>
        <p className="text-zinc-400">Something went wrong. Please try again.</p>
      </div>
    );
  }
  
  const comments = data?.comments || [];
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No comments yet</h3>
        <p className="text-zinc-400 mb-6">Your comments on content will appear here.</p>
        <p className="text-sm text-zinc-500">
          Note: Comments feature is coming soon!
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          {isMyProfile ? 'My Comments' : 'Comments'} ({data?.total_count || 0})
        </h2>
      </div>
      
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div
            key={comment.comment_id}
            className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-zinc-300">
                  {comment.user_nickname?.substring(0, 2).toUpperCase() || 'ME'}
                </span>
              </div>
              
              <div className="flex-1">
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-zinc-400">
                      On <span className="text-white font-medium">"{comment.content_title || 'Content'}"</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      {comment.channel_name && `in ${comment.channel_name} • `}
                      {comment.created_at 
                        ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
                        : 'recently'}
                    </p>
                  </div>
                  {comment.is_edited && (
                    <span className="text-xs text-zinc-500">(edited)</span>
                  )}
                </div>
                
                {/* Comment Text */}
                <p className="text-white mb-3 whitespace-pre-wrap">
                  {comment.text}
                </p>
                
                {/* Comment Actions */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-zinc-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{comment.like_count || 0} likes</span>
                  </div>
                  
                  {comment.reply_count > 0 && (
                    <div className="flex items-center gap-1 text-sm text-zinc-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>{comment.reply_count} replies</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      // Navigate to content with comment highlighted
                      if (comment.content_id) {
                        router.push(`/content/${comment.content_id}#comment-${comment.comment_id}`);
                      }
                    }}
                    className="text-sm text-[#EAFD66] hover:text-[#d9ec55] transition-colors ml-auto"
                  >
                    View Content →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {data?.has_more && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}