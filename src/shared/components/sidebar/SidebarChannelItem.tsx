'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';

interface SidebarChannelItemProps {
  channel: ChannelResponse;
  isActive?: boolean;
  className?: string;
}

export function SidebarChannelItem({
  channel,
  isActive = false,
  className = '',
}: SidebarChannelItemProps) {
  const baseClasses = `
    flex items-center gap-3 px-3 py-2 rounded-lg
    text-sm font-normal transition-all duration-200
    ${
      isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
    }
    ${className}
  `;

  return (
    <Link href={`/channels/${channel.id}`} className={baseClasses}>
      {/* Channel thumbnail */}
      <div className="w-6 h-6 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
        {channel.thumbnail_url ? (
          <img
            src={channel.thumbnail_url}
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-600 flex items-center justify-center">
            <span className="text-xs font-medium text-zinc-300">
              {channel.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Channel name */}
      <span className="flex-1 truncate text-sm">{channel.name}</span>
    </Link>
  );
}
