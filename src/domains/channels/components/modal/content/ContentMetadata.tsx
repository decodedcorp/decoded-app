import React from 'react';
import { useCommonTranslation } from '../../../../../lib/i18n/hooks';

interface ContentMetadataProps {
  author?: string;
  date?: string;
  likes?: number;
  views?: number;
}

export function ContentMetadata({ author, date, likes, views }: ContentMetadataProps) {
  const { time } = useCommonTranslation();
  
  // 날짜를 더 간단하게 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return time.justNow();
    if (diffInHours < 24) return time.hoursAgo(diffInHours);
    if (diffInHours < 48) return time.yesterday();
    if (diffInHours < 168) return time.daysAgo(Math.floor(diffInHours / 24));
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-shrink-0 p-3 pt-4 border-t border-zinc-700/40">
      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
        {author && (
          <div className="flex items-center space-x-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{author}</span>
          </div>
        )}

        {date && (
          <div className="flex items-center space-x-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatDate(date)}</span>
          </div>
        )}

        {likes !== undefined && (
          <div className="flex items-center space-x-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{likes}</span>
          </div>
        )}

        {views !== undefined && (
          <div className="flex items-center space-x-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{views}</span>
          </div>
        )}
      </div>
    </div>
  );
}
