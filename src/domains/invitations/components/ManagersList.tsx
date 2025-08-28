'use client';

import React from 'react';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import type { UserProfileResponse } from '@/api/generated/models/UserProfileResponse';

interface ManagersListProps {
  channel: ChannelResponse;
  onRemoveManager?: (userId: string) => void;
}

export function ManagersList({ channel, onRemoveManager }: ManagersListProps) {
  const managers = channel.managers || [];

  if (managers.length === 0) {
    return (
      <div className="bg-zinc-800/30 rounded-lg border border-zinc-700/50 p-6 text-center">
        <div className="text-zinc-400 mb-2">👥</div>
        <h3 className="text-sm font-medium text-zinc-300 mb-1">No Managers Yet</h3>
        <p className="text-xs text-zinc-500">
          Invite users to help manage this channel
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {managers.map((manager: UserProfileResponse) => (
        <div
          key={manager.id}
          className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50"
        >
          <div className="flex items-center space-x-3">
            {/* Manager Avatar */}
            <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
              {manager.profile_picture_url && (
                <img
                  src={manager.profile_picture_url}
                  alt={manager.display_name || 'Manager'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Manager Info */}
            <div>
              <h4 className="font-medium text-white">
                {manager.display_name || manager.email}
              </h4>
              {manager.display_name && manager.email && (
                <p className="text-xs text-zinc-400">{manager.email}</p>
              )}
              <p className="text-xs text-green-400">Manager</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {onRemoveManager && (
              <button
                onClick={() => onRemoveManager(manager.id)}
                className="p-2 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors"
                title="Remove manager"
                aria-label={`Remove ${manager.display_name || manager.email} as manager`}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="text-xs text-zinc-500 text-center pt-2">
        {managers.length === 1 
          ? '1 manager' 
          : `${managers.length} managers`}
      </div>
    </div>
  );
}