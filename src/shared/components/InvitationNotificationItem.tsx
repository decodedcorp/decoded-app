'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAcceptInvitation, useRejectInvitation } from '@/domains/invitations/hooks/useInvitations';
import type { InvitationResponse } from '@/api/generated/models/InvitationResponse';

interface InvitationNotificationItemProps {
  invitation: InvitationResponse;
}

export function InvitationNotificationItem({ invitation }: InvitationNotificationItemProps) {
  const acceptMutation = useAcceptInvitation();
  const rejectMutation = useRejectInvitation();

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    acceptMutation.mutate(invitation.id);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    rejectMutation.mutate(invitation.id);
  };

  const isPending = acceptMutation.isPending || rejectMutation.isPending;

  return (
    <div className="px-4 py-3 bg-orange-900/20 border-b border-orange-600/30 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Manager Invitation Icon */}
        <div className="mt-1">
          <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-1 text-xs bg-orange-600/20 text-orange-400 rounded-full font-medium">
              Manager Invitation
            </span>
          </div>
          
          <p className="text-sm text-zinc-200 mb-1">
            <span className="font-medium">{invitation.inviter?.display_name || invitation.inviter?.email}</span>
            {' '}invited you to manage a channel
          </p>
          
          {invitation.message && (
            <p className="text-xs text-zinc-400 bg-zinc-800/50 rounded p-2 mb-2">
              "{invitation.message}"
            </p>
          )}
          
          <p className="text-xs text-zinc-500 mb-3">
            Expires {formatDistanceToNow(new Date(invitation.expires_at), { addSuffix: true })}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAccept}
              disabled={isPending}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white text-xs rounded transition-colors font-medium"
            >
              {acceptMutation.isPending ? 'Accepting...' : 'Accept'}
            </button>
            <button
              onClick={handleReject}
              disabled={isPending}
              className="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-xs rounded transition-colors font-medium"
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Decline'}
            </button>
          </div>
        </div>

        {/* Always show as unread for invitations */}
        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2" />
      </div>
    </div>
  );
}