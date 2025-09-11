import React, { useState } from 'react';

import { useUpdateChannel } from '@/domains/channels/hooks/useChannels';
import { useChannelTranslation, useErrorTranslation } from '@/lib/i18n/hooks';

interface ChannelUpdateTestProps {
  channelId: string;
  currentName?: string;
  currentDescription?: string;
}

export function ChannelUpdateTest({
  channelId,
  currentName = '',
  currentDescription = '',
}: ChannelUpdateTestProps) {
  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription);
  const [thumbnailBase64, setThumbnailBase64] = useState<string>('');
  const [bannerBase64, setBannerBase64] = useState<string>('');

  const updateChannelMutation = useUpdateChannel();
  
  const { labels, validation, actions, status, placeholders, images, api } = useChannelTranslation();
  const { general } = useErrorTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!channelId) {
      alert(validation.idRequired());
      return;
    }

    try {
      const updateData = {
        name: name || undefined,
        description: description || undefined,
        thumbnail_base64: thumbnailBase64 || undefined,
        banner_base64: bannerBase64 || undefined,
      };

      console.log('Updating channel with data:', updateData);

      await updateChannelMutation.mutateAsync({
        channelId,
        data: updateData,
      });

      alert(status.updateSuccess());

      // 성공 후 입력 필드 초기화
      setThumbnailBase64('');
      setBannerBase64('');
    } catch (error) {
      console.error('Channel update failed:', error);
      alert(`${status.error(actions.update())}: ${error instanceof Error ? error.message : general.unknown()}`);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'thumbnail' | 'banner',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === 'thumbnail') {
        setThumbnailBase64(result);
      } else {
        setBannerBase64(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-700">
      <h3 className="text-lg font-semibold text-white mb-4">
PUT /channels/{channelId} API Test
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 채널 이름 */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">{labels.name()}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholders.newName()}
          />
        </div>

        {/* 채널 설명 */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">{labels.description()}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholders.newDescription()}
          />
        </div>

        {/* 썸네일 업로드 */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {labels.thumbnail()} (Base64)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'thumbnail')}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {thumbnailBase64 && (
            <div className="mt-2">
              <img
                src={thumbnailBase64}
                alt="Thumbnail preview"
                className="w-20 h-20 object-cover rounded border border-zinc-600"
              />
              <p className="text-xs text-zinc-400 mt-1">
                {labels.thumbnail()} 미리보기 (Base64 길이: {thumbnailBase64.length})
              </p>
            </div>
          )}
        </div>

        {/* 배너 업로드 */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {labels.banner()} (Base64)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'banner')}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {bannerBase64 && (
            <div className="mt-2">
              <img
                src={bannerBase64}
                alt="Banner preview"
                className="w-40 h-20 object-cover rounded border border-zinc-600"
              />
              <p className="text-xs text-zinc-400 mt-1">
                {labels.banner()} 미리보기 (Base64 길이: {bannerBase64.length})
              </p>
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={updateChannelMutation.isPending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateChannelMutation.isPending ? status.updating() : actions.update()}
        </button>
      </form>

      {/* 상태 표시 */}
      {updateChannelMutation.isSuccess && (
        <div className="mt-4 p-3 bg-green-900 border border-green-700 rounded-md">
          <p className="text-green-300">✅ {status.updateSuccess()}</p>
        </div>
      )}

      {updateChannelMutation.isError && (
        <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-md">
          <p className="text-red-300">❌ {status.error(actions.update())}</p>
          <p className="text-red-400 text-sm mt-1">
            {updateChannelMutation.error?.message || general.unknown()}
          </p>
        </div>
      )}

      {/* API 정보 */}
      <div className="mt-6 p-4 bg-zinc-800 rounded-md">
        <h4 className="text-sm font-medium text-zinc-300 mb-2">{api.info()}</h4>
        <div className="text-xs text-zinc-400 space-y-1">
          <p>
            <strong>{api.method()}:</strong> PUT
          </p>
          <p>
            <strong>{api.endpoint()}:</strong> /channels/{channelId}
          </p>
          <p>
            <strong>{api.body()}:</strong> {`{ name?, description?, thumbnail_base64?, banner_base64? }`}
          </p>
          <p>
            <strong>{api.auth()}:</strong> {api.authRequired()}
          </p>
        </div>
      </div>
    </div>
  );
}
