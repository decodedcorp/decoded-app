'use client';

import React from 'react';

import { useUpdateChannelThumbnail } from '@/domains/channels/hooks/useChannels';
import { useChannelBanner } from '@/domains/channels/hooks/useChannelBanner';
import { EditableImage } from '@/domains/channels/components/modal/channel/EditableImage';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useCommonTranslation } from '@/lib/i18n/hooks';

interface ImageSectionProps {
  channel: ChannelResponse;
}

export function ImageSection({ channel }: ImageSectionProps) {
  const t = useCommonTranslation();

  // 썸네일 업데이트 hook
  const updateThumbnailMutation = useUpdateChannelThumbnail();

  // 배너 업데이트 hook
  const { updateBanner, isUpdating: isBannerUpdating } = useChannelBanner({
    channelId: channel.id || '',
    onSuccess: () => {
      console.log('Banner updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update banner:', error);
    },
  });

  const handleThumbnailUpdate = async (base64: string) => {
    if (!channel.id) return;

    try {
      await updateThumbnailMutation.mutateAsync({
        channelId: channel.id,
        data: { thumbnail_base64: base64 },
      });
    } catch (error) {
      console.error('Failed to update thumbnail:', error);
    }
  };

  const handleBannerUpdate = (base64: string) => {
    if (!channel.id) return;
    updateBanner(base64);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.channelSettings.images.title()}</h2>
        <p className="text-zinc-400 mb-6">{t.channelSettings.images.subtitle()}</p>
      </div>

      {/* Thumbnail Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t.channelSettings.images.thumbnail.title()}</h3>
        <div className="bg-zinc-800/50 rounded-lg p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <EditableImage
                src={channel.thumbnail_url}
                alt={`${channel.name} thumbnail`}
                width={120}
                height={120}
                className="w-24 h-24 sm:w-30 sm:h-30 rounded-full border-4 border-zinc-700 bg-zinc-800"
                type="thumbnail"
                isOwner={true}
                onImageUpdate={handleThumbnailUpdate}
                isUploading={updateThumbnailMutation.isPending}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-2">
                {t.channelSettings.images.thumbnail.profilePicture()}
              </h4>
              <p className="text-zinc-400 text-sm mb-4">
                {t.channelSettings.images.thumbnail.description()}
              </p>
              <div className="text-xs text-zinc-500">
                <p>• {t.channelSettings.images.thumbnail.requirements.maxFileSize()}</p>
                <p>• {t.channelSettings.images.thumbnail.requirements.supportedFormats()}</p>
                <p>• {t.channelSettings.images.thumbnail.requirements.squareImages()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t.channelSettings.images.banner.title()}</h3>
        <div className="bg-zinc-800/50 rounded-lg p-6">
          <div className="space-y-4">
            <div className="aspect-[3/1] rounded-lg overflow-hidden bg-zinc-800 border-2 border-dashed border-zinc-600">
              <EditableImage
                src={channel.banner_url || channel.thumbnail_url}
                alt={`${channel.name} banner`}
                width={600}
                height={200}
                className="w-full h-full object-cover"
                type="banner"
                isOwner={true}
                onImageUpdate={handleBannerUpdate}
                isUploading={isBannerUpdating}
              />
            </div>
            <div>
              <h4 className="font-medium mb-2">{t.channelSettings.images.banner.bannerImage()}</h4>
              <p className="text-zinc-400 text-sm mb-4">
                {t.channelSettings.images.banner.description()}
              </p>
              <div className="text-xs text-zinc-500">
                <p>• {t.channelSettings.images.banner.requirements.maxFileSize()}</p>
                <p>• {t.channelSettings.images.banner.requirements.supportedFormats()}</p>
                <p>• {t.channelSettings.images.banner.requirements.aspectRatio()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t.channelSettings.images.preview.title()}</h3>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-zinc-400 text-sm mb-4">
            {t.channelSettings.images.preview.description()}
          </p>

          {/* Mini Channel Preview */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            {/* Mini Banner */}
            <div className="h-20 bg-zinc-700 relative overflow-hidden">
              {(channel.banner_url || channel.thumbnail_url) && (
                <img
                  src={channel.banner_url || channel.thumbnail_url || ''}
                  alt={t.channelSettings.images.preview.bannerPreview()}
                  className="w-full h-full object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>

            {/* Mini Header */}
            <div className="px-4 py-3 relative">
              <div className="flex items-center">
                <div className="relative -mt-6 mr-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-black bg-zinc-800 overflow-hidden">
                    {channel.thumbnail_url && (
                      <img
                        src={channel.thumbnail_url}
                        alt={t.channelSettings.images.preview.thumbnailPreview()}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{channel.name}</h4>
                  <p className="text-xs text-zinc-400">
                    {channel.subscriber_count || 0} {t.ui.followers()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
