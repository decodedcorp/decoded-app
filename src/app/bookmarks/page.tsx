'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  useBookmarks,
  useBookmarkStats,
  useBookmarkMutations,
} from '@/domains/bookmarks/hooks/useBookmarks';
import { useContentModalStore } from '@/store/contentModalStore';
import { ContentItem } from '@/lib/types/content';
import { useDateFormatters } from '@/lib/utils/dateUtils';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';

export default function BookmarksPage() {
  const t = useCommonTranslation();
  const { formatDateByContext } = useDateFormatters();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openContentModal = useContentModalStore((state) => state.openModal);

  const [offset, setOffset] = useState(0);
  const limit = 20;

  // Fetch bookmarks
  const {
    data: bookmarksData,
    isLoading,
    error,
  } = useBookmarks({
    offset,
    limit,
    enabled: isAuthenticated,
  });

  // Fetch bookmark stats
  const { data: statsData } = useBookmarkStats();

  // Bookmark mutations
  const { removeBookmark } = useBookmarkMutations();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {t.globalContentUpload.bookmarks.signInRequired()}
          </h1>
          <p className="text-zinc-400 mb-6">
            {t.globalContentUpload.bookmarks.signInRequiredDescription()}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-primary-on rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            {t.globalContentUpload.bookmarks.goToHome()}
          </button>
        </div>
      </div>
    );
  }

  const handleContentClick = async (contentId: string, contentPreview?: any) => {
    try {
      if (contentPreview) {
        // Use the content data we already have from the bookmark response
        const { unifyContent, convertToContentItem } = await import('@/lib/types/content');
        const unifiedContent = unifyContent(contentPreview);
        const contentItem = convertToContentItem(unifiedContent);

        openContentModal(contentItem);
      } else {
        console.warn('No content preview available for content:', contentId);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  const handleChannelClick = (channelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/channels/${channelId}`);
  };

  const loadMore = () => {
    if (bookmarksData?.has_more) {
      setOffset((prev) => prev + limit);
    }
  };

  const bookmarks = bookmarksData?.bookmarks || [];
  const hasBookmarks = bookmarks.length > 0;

  if (isLoading && offset === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="w-full py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {t.globalContentUpload.bookmarks.title()}
            </h1>
            <p className="text-zinc-400">{t.globalContentUpload.bookmarks.subtitle()}</p>
          </div>

          {/* Loading skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            {t.globalContentUpload.bookmarks.failedToLoad()}
          </h2>
          <p className="text-zinc-400 mb-6">
            {t.globalContentUpload.bookmarks.failedToLoadDescription()}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-on rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            {t.globalContentUpload.bookmarks.retry()}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t.globalContentUpload.bookmarks.title()}
          </h1>
          <div className="flex items-center space-x-6 text-zinc-400">
            <span>{t.globalContentUpload.bookmarks.subtitle()}</span>
            {statsData && (
              <span className="text-sm">
                {bookmarksData?.total_count || 0} {t.globalContentUpload.bookmarks.bookmarksCount()}
              </span>
            )}
          </div>
        </div>

        {hasBookmarks ? (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.content_id}
                onClick={() => handleContentClick(bookmark.content_id, bookmark.content)}
                className="bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer border border-zinc-800 hover:border-zinc-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {bookmark.content?.thumbnail_url || bookmark.content?.link_preview_img_url ? (
                        <img
                          src={
                            (bookmark.content.thumbnail_url ||
                              bookmark.content.link_preview_img_url)!
                          }
                          alt="Content thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                    </div>

                    <div>
                      <h3 className="font-medium text-white">
                        {bookmark.content?.link_preview_title ||
                          bookmark.content?.video_title ||
                          bookmark.content?.description ||
                          `Content ${bookmark.content_id}`}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {t.globalContentUpload.bookmarks.bookmarked()}{' '}
                        {formatDateByContext(bookmark.bookmark_created_at)}
                      </p>
                      {bookmark.content?.channel_name && bookmark.content?.channel_id && (
                        <button
                          onClick={(e) => handleChannelClick(bookmark.content!.channel_id, e)}
                          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center space-x-1"
                        >
                          <span>
                            {t.globalContentUpload.bookmarks.from()}{' '}
                            {bookmark.content!.channel_name}
                          </span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark.mutate(bookmark.content_id);
                      }}
                      disabled={removeBookmark.isPending}
                      className="p-2 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    <svg
                      className="w-4 h-4 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {bookmarksData?.has_more && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading
                    ? t.globalContentUpload.bookmarks.loading()
                    : t.globalContentUpload.bookmarks.loadMore()}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {t.globalContentUpload.bookmarks.noBookmarks()}
            </h2>
            <p className="text-zinc-400 mb-6">
              {t.globalContentUpload.bookmarks.noBookmarksDescription()}
            </p>
            <button
              onClick={() => router.push('/channels')}
              className="px-6 py-3 bg-primary text-primary-on rounded-lg font-medium hover:bg-primary-hover transition-colors"
            >
              {t.globalContentUpload.bookmarks.exploreChannels()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
