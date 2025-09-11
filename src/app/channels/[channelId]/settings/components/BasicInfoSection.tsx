'use client';

import React, { useState } from 'react';

import { useUpdateChannel } from '@/domains/channels/hooks/useChannels';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useCommonTranslation } from '@/lib/i18n/hooks';

interface BasicInfoSectionProps {
  channel: ChannelResponse;
}

export function BasicInfoSection({ channel }: BasicInfoSectionProps) {
  const [name, setName] = useState(channel.name || '');
  const [description, setDescription] = useState(channel.description || '');
  const [hasChanges, setHasChanges] = useState(false);

  const updateChannelMutation = useUpdateChannel();
  const t = useCommonTranslation();

  const handleNameChange = (value: string) => {
    setName(value);
    setHasChanges(value !== channel.name);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setHasChanges(
      value !== channel.description || name !== channel.name
    );
  };

  const handleSave = async () => {
    if (!hasChanges || !channel.id) return;

    try {
      await updateChannelMutation.mutateAsync({
        channelId: channel.id,
        data: {
          name: name.trim(),
          description: description.trim() || null,
        },
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update channel:', error);
    }
  };

  const handleReset = () => {
    setName(channel.name || '');
    setDescription(channel.description || '');
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.ui.basicInformation()}</h2>
        <p className="text-zinc-400 mb-6">
          {t.ui.updateChannelBasicInfo()}
        </p>
      </div>

      {/* Channel Name */}
      <div>
        <label htmlFor="channel-name" className="block text-sm font-medium mb-2">
          {t.ui.channelName()}
        </label>
        <input
          id="channel-name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t.ui.enterChannelName()}
          maxLength={50}
        />
        <p className="text-xs text-zinc-400 mt-1">
          {name.length}/50 characters
        </p>
      </div>

      {/* Channel Description */}
      <div>
        <label htmlFor="channel-description" className="block text-sm font-medium mb-2">
          {t.ui.description()}
        </label>
        <textarea
          id="channel-description"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder={t.ui.describeChannel()}
          maxLength={500}
        />
        <p className="text-xs text-zinc-400 mt-1">
          {description.length}/500 characters
        </p>
      </div>

      {/* Channel Stats */}
      <div className="bg-zinc-800/50 rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3">{t.ui.channelStatistics()}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-400">{t.ui.subscribers()}</p>
            <p className="text-lg font-semibold">{channel.subscriber_count || 0}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-400">{t.ui.contentItems()}</p>
            <p className="text-lg font-semibold">{channel.content_count || 0}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-700">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
            disabled={updateChannelMutation.isPending}
          >
            {t.actions.reset()}
          </button>
          <button
            onClick={handleSave}
            disabled={updateChannelMutation.isPending || !name.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {updateChannelMutation.isPending ? t.states.saving() : t.actions.saveChanges()}
          </button>
        </div>
      )}
    </div>
  );
}