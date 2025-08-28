'use client';

import React, { useState } from 'react';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useUser } from '@/domains/auth/hooks/useAuth';

import { InviteManagerModal } from '@/domains/invitations/components/InviteManagerModal';
import { ManagersList } from '@/domains/invitations/components/ManagersList';
import { InvitationList } from '@/domains/invitations/components/InvitationList';

interface ManagerSectionProps {
  channel: ChannelResponse;
}

export function ManagerSection({ channel }: ManagerSectionProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { user } = useUser();

  const handleInviteManager = () => {
    setIsInviteModalOpen(true);
  };

  const handleRemoveManager = (userId: string) => {
    // TODO: 관리자 제거 API 구현 후 연결
    console.log('Remove manager:', userId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Channel Managers</h2>
        <p className="text-zinc-400 mb-6">
          Managers can upload content, moderate comments, and help manage your channel. Only channel
          owners can invite or remove managers.
        </p>
      </div>

      {/* Current Managers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Current Managers</h3>
          <button
            onClick={handleInviteManager}
            className="px-4 py-2 bg-zinc-800 hover:bg-[#eafd66] text-white hover:text-black rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Invite Manager</span>
          </button>
        </div>

        <ManagersList channel={channel} onRemoveManager={handleRemoveManager} />
      </div>

      {/* Manager Permissions Info */}
      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Manager Permissions</span>
        </h4>
        <div className="text-sm text-zinc-300 space-y-1">
          <p>• Upload and manage channel content</p>
          <p>• Pin and unpin content items</p>
          <p>• Moderate comments and interactions</p>
          <p>• Edit channel description (if permitted)</p>
          <p>• Cannot delete channel or remove other managers</p>
        </div>
      </div>

      {/* Invitations */}
      <div>
        <h3 className="text-lg font-medium mb-4">Manager Invitations</h3>
        <InvitationList
          channelId={channel.id || ''}
          currentUserId={user?.doc_id || ''}
        />
      </div>

      {/* Best Practices */}
      <div className="bg-yellow-900/10 border border-yellow-600/30 rounded-lg p-4">
        <h4 className="text-yellow-400 font-medium mb-2 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>Best Practices</span>
        </h4>
        <div className="text-sm text-zinc-300 space-y-1">
          <p>• Only invite trusted users as managers</p>
          <p>• Set clear expectations and guidelines</p>
          <p>• Regularly review manager activity</p>
          <p>• Consider trial periods for new managers</p>
          <p>• Communicate channel goals and vision</p>
        </div>
      </div>

      {/* Statistics */}
      {channel.manager_ids && channel.manager_ids.length > 0 && (
        <div className="bg-zinc-800/30 rounded-lg p-4">
          <h4 className="font-medium mb-3">Manager Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-400">Total Managers</p>
              <p className="text-lg font-semibold">{channel.manager_ids.length}</p>
            </div>
            <div>
              <p className="text-zinc-400">Channel Content</p>
              <p className="text-lg font-semibold">{channel.content_count || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <InviteManagerModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        channel={channel}
      />
    </div>
  );
}
