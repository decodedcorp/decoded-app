import React, { useState } from 'react';
import { useBookmarks, useBookmarkMutations } from '@/domains/bookmarks/hooks/useBookmarks';
import { useContentModalStore } from '@/store/contentModalStore';
import { useProfileTranslation } from '@/lib/i18n/hooks';
import { formatDateByContext } from '@/lib/utils/dateUtils';
import { ThumbnailFallback } from '@/components/FallbackImage';

export function BookmarksTab() {
  const openContentModal = useContentModalStore((state) => state.openModal);
  const t = useProfileTranslation();
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading, error } = useBookmarks({ offset, limit });
  const { removeBookmark } = useBookmarkMutations();

  const handleContentClick = async (contentId: string, contentPreview?: any) => {
    try {
      if (contentPreview) {
        const { unifyContent, convertToContentItem } = await import('@/lib/types/content');
        const unifiedContent = unifyContent(contentPreview);
        const contentItem = convertToContentItem(unifiedContent);
        openContentModal(contentItem);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  const loadMore = () => {
    if (data?.has_more) {
      setOffset((prev) => prev + limit);
    }
  };

  if (isLoading && offset === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t.bookmarks.failedToLoad()}</h3>
        <p className="text-zinc-400">{t.bookmarks.failedToLoadDescription()}</p>
      </div>
    );
  }

  const bookmarks = data?.bookmarks || [];

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
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
        <h3 className="text-xl font-semibold text-white mb-2">{t.bookmarks.noBookmarks()}</h3>
        <p className="text-zinc-400 mb-6">{t.bookmarks.noBookmarksDescription()}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          {t.bookmarks.count(data?.total_count ?? bookmarks.length)}
        </h2>
      </div>

      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.content_id}
            onClick={() => handleContentClick(bookmark.content_id, bookmark.content)}
            className="bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer border border-zinc-800 hover:border-zinc-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {bookmark.content?.thumbnail_url || bookmark.content?.link_preview_img_url ? (
                  <img
                    src={(bookmark.content.thumbnail_url || bookmark.content.link_preview_img_url)!}
                    alt="Content thumbnail"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <ThumbnailFallback size="lg" className="w-16 h-16" />
                )}

                <div>
                  <h3 className="font-medium text-white">
                    {bookmark.content?.link_preview_title ||
                      bookmark.content?.video_title ||
                      bookmark.content?.description ||
                      `Content ${bookmark.content_id}`}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {t.bookmarks.bookmarked()} {formatDateByContext(bookmark.bookmark_created_at)}
                  </p>
                  {bookmark.content?.channel_name && (
                    <p className="text-xs text-zinc-500">
                      {t.bookmarks.from()} {bookmark.content.channel_name}
                    </p>
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
                  aria-label={t.bookmarks.removeBookmark()}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </div>

      {/* Load More Button */}
      {data?.has_more && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? t.bookmarks.loading() : t.bookmarks.loadMore()}
          </button>
        </div>
      )}
    </div>
  );
}
