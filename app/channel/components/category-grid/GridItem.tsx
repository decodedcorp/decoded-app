'use client';

import React from 'react';

interface Editor {
  name: string;
  avatarUrl?: string;
}

interface GridItemProps {
  imageUrl?: string;
  title: string;
  category?: string;
  editors?: Editor[];
  date?: string;
}

export function GridItem({ imageUrl, title, category, editors, date }: GridItemProps) {
  return (
    <div className="flex flex-col h-full border border-zinc-800 bg-black rounded-none p-0">
      {/* 카테고리 */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <span className="text-xs font-thin text-zinc-400 tracking-wide uppercase">{category}</span>
      </div>
      {/* 이미지 */}
      <div className="w-full aspect-[4/5] bg-zinc-900 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <span className="text-zinc-700 text-sm font-thin">No Image</span>
        )}
      </div>
      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-2 px-3 py-3 flex-1">
        <div className="text-2xl font-thin text-white leading-tight truncate">{title}</div>
        {/* Editors 아바타 스택 */}
        {editors && editors.length > 0 && (
          <div className="flex items-center mt-1">
            {editors.slice(0, 5).map((editor, idx) => (
              <div
                key={editor.name + idx}
                className="w-7 h-7 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-xs text-white font-thin -ml-2 first:ml-0 overflow-hidden"
                style={{ zIndex: 10 - idx }}
                title={editor.name}
              >
                {editor.avatarUrl ? (
                  <img src={editor.avatarUrl} alt={editor.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{getInitials(editor.name)}</span>
                )}
              </div>
            ))}
            {editors.length > 5 && (
              <div className="w-7 h-7 rounded-full border-2 border-black bg-zinc-700 flex items-center justify-center text-xs text-white font-thin -ml-2" style={{ zIndex: 4 }}>
                +{editors.length - 5}
              </div>
            )}
          </div>
        )}
        {date && (
          <div className="text-xs font-thin text-zinc-500">{date}</div>
        )}
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// ISO 국가코드를 국기 이모지로 변환
function countryCodeToFlag(code?: string) {
  if (!code) return null;
  return code
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
} 