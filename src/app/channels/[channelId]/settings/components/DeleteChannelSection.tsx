'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useDeleteChannel } from '@/domains/channels/hooks/useChannels';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';

interface DeleteChannelSectionProps {
  channel: ChannelResponse;
}

export function DeleteChannelSection({ channel }: DeleteChannelSectionProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const deleteChannelMutation = useDeleteChannel();

  const handleDelete = async () => {
    if (!channel.id || confirmText !== channel.name) return;

    try {
      await deleteChannelMutation.mutateAsync(channel.id);
      // 삭제 성공 후 홈으로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('Failed to delete channel:', error);
    }
  };

  const isConfirmValid = confirmText === channel.name;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h2>
        <p className="text-zinc-400 mb-6">
          Irreversible and destructive actions. Please proceed with caution.
        </p>
      </div>

      {/* Delete Channel */}
      <div className="border border-red-600/30 rounded-lg p-6 bg-red-900/10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-red-400 mb-2">Delete Channel</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Once you delete this channel, there is no going back. This action cannot be undone.
              All content, subscribers, and data associated with this channel will be permanently
              deleted.
            </p>

            {/* Warning List */}
            <div className="bg-red-900/20 border border-red-600/20 rounded-lg p-4 mb-4">
              <h4 className="text-red-400 font-medium mb-2">This will permanently delete:</h4>
              <ul className="text-sm text-zinc-300 space-y-1">
                <li>• All channel content and uploads</li>
                <li>• All subscriber relationships</li>
                <li>• All comments and interactions</li>
                <li>• Channel analytics and statistics</li>
                <li>• All manager relationships and invitations</li>
              </ul>
            </div>

            {/* Channel deletion is currently disabled */}
            {/* {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Channel
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type "<span className="font-mono text-red-400">{channel.name}</span>" to
                    confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder={`Type "${channel.name}" here`}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDelete}
                    disabled={!isConfirmValid || deleteChannelMutation.isPending}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {deleteChannelMutation.isPending ? 'Deleting...' : 'Delete Channel Forever'}
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      setConfirmText('');
                    }}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )} */}

            <div className="text-zinc-500 text-sm italic">
              Channel deletion is currently disabled
            </div>
          </div>
        </div>
      </div>

      {/* Additional Warnings */}
      <div className="bg-yellow-900/10 border border-yellow-600/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-yellow-400 mt-0.5">⚠️</div>
          <div>
            <h4 className="text-yellow-400 font-medium mb-1">Before deleting:</h4>
            <ul className="text-sm text-zinc-300 space-y-1">
              <li>• Consider transferring ownership to another user</li>
              <li>• Download any important content or data</li>
              <li>• Notify your subscribers about the deletion</li>
              <li>• Remove any external links pointing to this channel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
