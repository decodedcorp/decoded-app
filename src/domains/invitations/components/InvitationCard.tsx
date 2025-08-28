'use client';

import React from 'react';
import { formatDateByContext } from '@/lib/utils/dateUtils';
import { useAcceptInvitation, useRejectInvitation, useCancelInvitation } from '../hooks/useInvitations';
import type { InvitationResponse } from '@/api/generated/models/InvitationResponse';

interface InvitationCardProps {
  invitation: InvitationResponse;
  type: 'sent' | 'received';
}

export function InvitationCard({ invitation, type }: InvitationCardProps) {
  const acceptMutation = useAcceptInvitation();
  const rejectMutation = useRejectInvitation();
  const cancelMutation = useCancelInvitation();

  const handleAccept = () => {
    acceptMutation.mutate(invitation.id);
  };

  const handleReject = () => {
    rejectMutation.mutate(invitation.id);
  };

  const handleCancel = () => {
    cancelMutation.mutate(invitation.id);
  };

  const isExpired = invitation.is_expired;
  const isPending = acceptMutation.isPending || rejectMutation.isPending || cancelMutation.isPending;

  return (
    <div className={`bg-zinc-800/50 rounded-lg border p-4 ${isExpired ? 'border-red-600/30 bg-red-900/10' : 'border-zinc-700'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
            {(type === 'sent' ? invitation.invitee : invitation.inviter)?.profile_picture_url && (
              <img
                src={(type === 'sent' ? invitation.invitee : invitation.inviter)?.profile_picture_url}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Invitation Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-white">
                {type === 'sent' ? invitation.invitee?.display_name : invitation.inviter?.display_name}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                isExpired 
                  ? 'bg-red-600/20 text-red-400' 
                  : 'bg-blue-600/20 text-blue-400'
              }`}>
                {isExpired ? 'Expired' : 'Pending'}
              </span>
            </div>
            
            <p className="text-sm text-zinc-400 mb-2">
              {type === 'sent' 
                ? `Invited to manage your channel`
                : `Invited you to manage their channel`}
            </p>

            {/* Personal Message */}
            {invitation.message && (
              <div className="bg-zinc-700/50 rounded p-2 mb-2">
                <p className="text-sm text-zinc-300">{invitation.message}</p>
              </div>
            )}

            {/* Dates */}
            <div className="text-xs text-zinc-500 space-y-1">
              <p>Sent: {formatDateByContext(invitation.created_at)}</p>
              <p>Expires: {formatDateByContext(invitation.expires_at)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {type === 'received' && !isExpired && (
            <>
              <button
                onClick={handleAccept}
                disabled={isPending}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                disabled={isPending}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
              >
                Reject
              </button>
            </>
          )}
          
          {type === 'sent' && !isExpired && (
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}