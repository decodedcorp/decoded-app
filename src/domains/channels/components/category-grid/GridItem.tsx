'use client';

import React from 'react';
import { cn } from '@/lib/utils/styles';
import Image from 'next/image';
import { GridItemProps } from '../../types/masonry';
import { getInitials } from '../../utils/editorUtils';
import { useChannelModalStore } from '@/store/channelModalStore';
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

  const handleChannelClick = () => {
    if (onChannelClick) {
      onChannelClick();
    } else {
      // GridItem에서 모달을 열기 위한 기본 채널 데이터 생성
      const channelData: ChannelData = {
        id: `temp-${Date.now()}`,
        name: title,
        description: `Explore ${title} - a curated collection of ${
          category?.toLowerCase() || 'content'
        }`,
        owner_id: 'temp-owner',
        thumbnail_url: imageUrl || null,
        subscriber_count: Math.floor(Math.random() * 10000) + 1000,
        content_count: Math.floor(Math.random() * 100) + 10,
        created_at: new Date().toISOString(),
        is_subscribed: false,
      };
      openModal(channelData);
    }
  };

  return (
    <div>
      {/* 카테고리 + 배지 */}
      <div className="flex items-start justify-between px-3 pt-3 pb-1 min-h-[28px]">
        <span className="text-xs font-thin text-zinc-400 tracking-wide uppercase">{category}</span>
        <div className="flex gap-1">
          {isNew && (
            <span className="px-2 py-0.5 rounded-full bg-green-600 text-xs text-white font-bold">
              NEW
            </span>
          )}
          {isHot && (
            <span className="px-2 py-0.5 rounded-full bg-pink-600 text-xs text-white font-bold">
              HOT
            </span>
          )}
        </div>
      </div>
      {/* 이미지 + hover overlay */}
      <div className="relative w-full aspect-[4/5] bg-zinc-900 flex items-center justify-center overflow-hidden group">
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
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                loading="lazy"
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
            {/* hover overlay - 썸네일 유무와 관계없이 항상 표시 */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                className="px-3 py-1.5 rounded-full bg-white/90 text-zinc-900 text-xs font-semibold shadow hover:bg-white"
                onClick={handleChannelClick}
              >
                View Details
              </button>
            </div>
          </>
        )}
      </div>
      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-2 px-3 py-2 flex-1">
        <div className="text-2xl font-semibold text-white leading-tight truncate">{title}</div>
        {/* Editors 아바타 스택 */}
        {editors && editors.length > 0 && (
          <div className="flex items-center mt-1 gap-1">
            {editors.slice(0, 5).map((editor, idx) => (
              <div
                key={editor.name + idx}
                className={cn(
                  'w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white font-thin -ml-2 first:ml-0 overflow-hidden border-2',
                  avatarBorder,
                )}
                style={{ zIndex: 10 - idx }}
                title={editor.name}
              >
                {editor.avatarUrl ? (
                  <img
                    src={editor.avatarUrl}
                    alt={editor.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{getInitials(editor.name)}</span>
                )}
              </div>
            ))}
            {editors.length > 5 && (
              <div
                className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-white font-thin -ml-2 border-2 border-zinc-700"
                style={{ zIndex: 4 }}
              >
                +{editors.length - 5}
              </div>
            )}
          </div>
        )}
        {date && <div className="text-xs font-thin text-zinc-500 mt-1">{date}</div>}
      </div>
    </div>
  );
}
