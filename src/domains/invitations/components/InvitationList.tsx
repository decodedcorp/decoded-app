'use client';

import React, { useState, useEffect } from 'react';
import { useInvitations } from '../hooks/useInvitations';
import { InvitationCard } from './InvitationCard';
import type { InvitationResponse } from '@/api/generated/models/InvitationResponse';

interface InvitationListProps {
  channelId: string;
  currentUserId?: string;
}

export function InvitationList({ channelId, currentUserId }: InvitationListProps) {
  const [includeExpired, setIncludeExpired] = useState(false);

  const { data: invitationsData, isLoading, error, isFetching, isStale } = useInvitations({
    includeExpired,
  });

  const invitations = invitationsData?.invitations || [];

  if (isLoading) {
    return (
      <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-zinc-700/50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
        <div className="text-center text-red-400">
          Failed to load invitations
        </div>
      </div>
    );
  }

  
  // 채널별로 필터링하고 보낸/받은 초대로 분류
  const channelInvitations = invitations.filter((inv: InvitationResponse) => 
    inv.channel_id === channelId
  );

  const sentInvitations = channelInvitations.filter((inv: InvitationResponse) => {
    const inviterId = inv.inviter?.id;
    return inviterId === currentUserId;
  });

  const currentInvitations = sentInvitations;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h4 className="text-sm font-medium text-white">
            Sent Invitations ({sentInvitations.length})
          </h4>
        </div>

        {/* Include Expired Toggle */}
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={includeExpired}
            onChange={(e) => setIncludeExpired(e.target.checked)}
            className="rounded border-zinc-600 bg-zinc-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900"
          />
          <span className="text-zinc-400">Show expired</span>
        </label>
      </div>

      {/* Invitations List */}
      <div className="space-y-3">
        {currentInvitations.length > 0 ? (
          currentInvitations.map((invitation: InvitationResponse) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              type="sent"
            />
          ))
        ) : (
          <div className="bg-zinc-800/30 rounded-lg border border-zinc-700/50 p-8 text-center">
            <div className="text-zinc-400 mb-2">📤</div>
            <h3 className="text-sm font-medium text-zinc-300 mb-1">
              No invitations sent
            </h3>
            <p className="text-xs text-zinc-500">
              Send invitations to users to manage this channel
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {currentInvitations.length > 0 && (
        <div className="text-xs text-zinc-500 text-center pt-2 border-t border-zinc-700">
          Showing {currentInvitations.length} sent invitation{currentInvitations.length !== 1 ? 's' : ''}
          {!includeExpired && ' (active only)'}
        </div>
      )}
    </div>
  );
}