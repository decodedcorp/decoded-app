'use client';

import React from 'react';

import { cn } from '@/lib/utils/styles';
import { ProxiedImage } from '@/components/ProxiedImage';
import { useChannelModalStore } from '@/store/channelModalStore';

import { GridItemProps } from '../../types/masonry';
import { getInitials } from '../../utils/editorUtils';
import { ChannelData } from '../hero/heroData';

export function GridItem({
  imageUrl,
  title,
  category,
  editors,
  date,
  isNew,
  isHot,
  avatarBorder,
  isEmpty = false,
  onAddChannel,
  onChannelClick,
}: GridItemProps) {
  const openModal = useChannelModalStore((state) => state.openModal);

  const handleClick = () => {
    if (isEmpty && onAddChannel) {
      onAddChannel();
    } else if (onChannelClick) {
      onChannelClick();
    } else {
      // 채널 데이터로 모달 열기
      const channelData: ChannelData = {
        id: title, // 임시 ID
        name: title,
        description: 'Channel description',
        owner_id: 'temp-owner',
        thumbnail_url: imageUrl || null,
        subscriber_count: 1000,
        content_count: 50,
        created_at: new Date().toISOString(),
        is_subscribed: false,
      };
      openModal(channelData);
    }
  };

  return (
    <div className="w-full h-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
      {/* 이미지 + hover overlay */}
      <div className="relative w-full h-4/5 bg-zinc-900 flex items-center justify-center overflow-hidden group">
        {isEmpty ? (
          // 채널 추가 버튼 (간단한 버튼)
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <button
              onClick={onAddChannel}
              className="px-6 py-3 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-colors border border-zinc-600"
            >
              + Add Channel
            </button>
          </div>
        ) : (
          <>
            {imageUrl ? (
              <ProxiedImage
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              // 썸네일이 없을 때 기본 배경
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                  <rect width="32" height="32" rx="8" fill="#52525b" />
                  <path
                    d="M10 16h12M16 10v12"
                    stroke="#71717a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}

            {/* hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                className="px-3 py-1.5 rounded-full bg-white/90 text-zinc-900 text-xs font-semibold shadow hover:bg-white"
                onClick={handleClick}
              >
                View Details
              </button>
            </div>
          </>
        )}
      </div>
      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-2 px-3 py-2 h-1/5">
        {/* 제목과 카테고리 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
            {category && <p className="text-zinc-400 text-xs mt-1">{category}</p>}
          </div>
          {/* 상태 배지들 */}
          <div className="flex gap-1 flex-shrink-0">
            {isNew && (
              <span className="px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">New</span>
            )}
            {isHot && (
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">Hot</span>
            )}
          </div>
        </div>

        {/* 편집자 정보 */}
        {editors && editors.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {editors.slice(0, 3).map((editor, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 border-zinc-900 flex items-center justify-center text-xs font-medium',
                    avatarBorder || 'bg-zinc-700 text-zinc-300',
                  )}
                >
                  {editor.avatarUrl ? (
                    <ProxiedImage
                      src={editor.avatarUrl}
                      alt={editor.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    getInitials(editor.name)
                  )}
                </div>
              ))}
            </div>
            <span className="text-zinc-500 text-xs">
              {editors.length > 3
                ? `+${editors.length - 3} more`
                : editors.length === 1
                ? 'editor'
                : 'editors'}
            </span>
          </div>
        )}

        {/* 날짜 */}
        {date && <p className="text-zinc-500 text-xs">{date}</p>}
      </div>
    </div>
  );
}
