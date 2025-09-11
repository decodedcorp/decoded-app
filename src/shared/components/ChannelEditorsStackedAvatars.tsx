'use client';

import React, { useState } from 'react';

import type { UserProfileResponse } from '@/api/generated/models/UserProfileResponse';
import type { ChannelUserProfile } from '@/api/generated/models/ChannelUserProfile';

interface ChannelEditorsStackedAvatarsProps {
  editors: UserProfileResponse[] | ChannelUserProfile[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

export function ChannelEditorsStackedAvatars({ 
  editors, 
  maxDisplay = 4, 
  size = 'md',
  className = '',
  showTooltip = true,
}: ChannelEditorsStackedAvatarsProps) {
  const [hoveredEditor, setHoveredEditor] = useState<string | null>(null);

  if (!editors || editors.length === 0) {
    return null;
  }

  const displayedEditors = editors.slice(0, maxDisplay);
  const remainingCount = Math.max(0, editors.length - maxDisplay);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const overlapClass = {
    sm: '-ml-2 first:ml-0',
    md: '-ml-2 first:ml-0', 
    lg: '-ml-3 first:ml-0',
  };

  const getInitials = (editor: UserProfileResponse | ChannelUserProfile): string => {
    if (editor.aka) {
      return editor.aka.substring(0, 2).toUpperCase();
    }
    if ('email' in editor && editor.email) {
      return editor.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = (editor: UserProfileResponse | ChannelUserProfile): string => {
    if (editor.aka) return editor.aka;
    if ('email' in editor && editor.email) return editor.email;
    return 'Unknown';
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* 겹쳐진 아바타들 */}
      <div className="flex items-center">
        {displayedEditors.map((editor, index) => (
          <div
            key={editor.id}
            className={`
              relative ${sizeClasses[size]} ${overlapClass[size]}
              rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700
              border-2 border-zinc-800 hover:border-zinc-500
              flex items-center justify-center
              text-zinc-200 font-medium
              transition-all duration-200
              hover:z-10 hover:scale-110
              cursor-pointer overflow-hidden
            `}
            style={{ zIndex: maxDisplay - index }}
            onMouseEnter={() => showTooltip && setHoveredEditor(editor.id)}
            onMouseLeave={() => setHoveredEditor(null)}
            title={showTooltip ? getDisplayName(editor) : undefined}
          >
            {editor.profile_image_url ? (
              <img
                src={editor.profile_image_url}
                alt={getDisplayName(editor)}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            ) : (
              <span className="select-none">{getInitials(editor)}</span>
            )}
            
            {/* 툴팁 */}
            {showTooltip && hoveredEditor === editor.id && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {getDisplayName(editor)}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-black/90" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

      </div>

    </div>
  );
}

export default ChannelEditorsStackedAvatars;