'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useDeleteChannel } from '@/domains/channels/hooks/useChannels';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useCommonTranslation } from '@/lib/i18n/hooks';

interface DeleteChannelSectionProps {
  channel: ChannelResponse;
}

export function DeleteChannelSection({ channel }: DeleteChannelSectionProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const t = useCommonTranslation();

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
        <h2 className="text-xl font-semibold mb-4 text-red-400">
          {t.channelSettings.dangerZone.title()}
        </h2>
        <p className="text-zinc-400 mb-6">{t.channelSettings.dangerZone.subtitle()}</p>
      </div>

      {/* Delete Channel */}
      <div className="border border-red-600/30 rounded-lg p-6 bg-red-900/10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-red-400 mb-2">
              {t.channelSettings.dangerZone.deleteChannel.title()}
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
              {t.channelSettings.dangerZone.deleteChannel.description()}
            </p>

            {/* Warning List */}
            <div className="bg-red-900/20 border border-red-600/20 rounded-lg p-4 mb-4">
              <h4 className="text-red-400 font-medium mb-2">
                {t.channelSettings.dangerZone.deleteChannel.willDelete()}
              </h4>
              <ul className="text-sm text-zinc-300 space-y-1">
                <li>• {t.channelSettings.dangerZone.deleteChannel.allContent()}</li>
                <li>• {t.channelSettings.dangerZone.deleteChannel.allSubscribers()}</li>
                <li>• {t.channelSettings.dangerZone.deleteChannel.allComments()}</li>
                <li>• {t.channelSettings.dangerZone.deleteChannel.allAnalytics()}</li>
                <li>• {t.channelSettings.dangerZone.deleteChannel.allManagers()}</li>
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
              {t.channelSettings.dangerZone.deleteChannel.currentlyDisabled()}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Warnings */}
      <div className="bg-yellow-900/10 border border-yellow-600/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-yellow-400 mt-0.5">⚠️</div>
          <div>
            <h4 className="text-yellow-400 font-medium mb-1">
              {t.channelSettings.dangerZone.beforeDeleting.title()}
            </h4>
            <ul className="text-sm text-zinc-300 space-y-1">
              <li>• {t.channelSettings.dangerZone.beforeDeleting.transferOwnership()}</li>
              <li>• {t.channelSettings.dangerZone.beforeDeleting.downloadContent()}</li>
              <li>• {t.channelSettings.dangerZone.beforeDeleting.notifySubscribers()}</li>
              <li>• {t.channelSettings.dangerZone.beforeDeleting.removeLinks()}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
