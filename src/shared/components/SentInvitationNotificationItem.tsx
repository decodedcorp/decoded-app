'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

import { useCancelInvitation } from '@/domains/invitations/hooks/useInvitations';
import type { InvitationResponse } from '@/api/generated/models/InvitationResponse';

interface SentInvitationNotificationItemProps {
  invitation: InvitationResponse;
}

export function SentInvitationNotificationItem({
  invitation,
}: SentInvitationNotificationItemProps) {
  const cancelMutation = useCancelInvitation();

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancelMutation.mutate(invitation.id);
  };

  const isPending = cancelMutation.isPending;

  return (
    <div className="px-4 py-3 bg-zinc-800/30 border-b border-zinc-600/30 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Sent Invitation Icon */}
        <div className="mt-1">
          <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-1 text-xs bg-zinc-600/20 text-zinc-300 rounded-full font-medium">
              Invitation Sent
            </span>
          </div>

          <p className="text-sm text-zinc-200 mb-1">
            You invited{' '}
            <span className="font-medium">
              {invitation.invitee?.aka || invitation.invitee?.email}
            </span>{' '}
            to manage a channel
          </p>

          {invitation.message && (
            <p className="text-xs text-zinc-400 bg-zinc-800/50 rounded p-2 mb-2">
              Message: "{invitation.message}"
            </p>
          )}

          <p className="text-xs text-zinc-500 mb-3">
            Expires {formatDistanceToNow(new Date(invitation.expires_at), { addSuffix: true })}
          </p>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-xs rounded transition-colors font-medium"
            >
              {cancelMutation.isPending ? 'Canceling...' : 'Cancel Invitation'}
            </button>
          </div>
        </div>

        {/* Always show as unread for sent invitations */}
        <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2" />
      </div>
    </div>
  );
}
