'use client';

import React from 'react';

import { useGlobalContentUploadStore } from '@/store/globalContentUploadStore';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface GlobalContentUploadHeaderProps {
  onClose: () => void;
}

export function GlobalContentUploadHeader({ onClose }: GlobalContentUploadHeaderProps) {
  const t = useCommonTranslation();
  const currentStep = useGlobalContentUploadStore((state) => state.currentStep);
  const selectedChannel = useGlobalContentUploadStore((state) => state.selectedChannel);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const getStepTitle = () => {
    if (currentStep === 'channel-selection') {
      return t.globalContentUpload.header.selectChannel();
    }
    return t.globalContentUpload.header.addContentToChannel(selectedChannel?.name || 'Channel');
  };

  const getStepDescription = () => {
    if (currentStep === 'channel-selection') {
      return t.globalContentUpload.header.chooseWhereToUpload();
    }
    return t.globalContentUpload.header.uploadToSelectedChannel();
  };

  if (isMobile) {
    return (
      <div className="p-4 border-b border-zinc-700/50">
        {/* 제목과 닫기 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-white">{getStepTitle()}</h2>
            <p className="text-gray-400 text-sm mt-1">{getStepDescription()}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 단계 표시기 - 아래로 배치 */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep === 'channel-selection'
                  ? 'bg-[#eafd66] text-black'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              1
            </div>
            <span
              className={`ml-2 text-sm ${
                currentStep === 'channel-selection' ? 'text-[#eafd66]' : 'text-zinc-500'
              }`}
            >
              {t.globalContentUpload.header.stepChannel()}
            </span>
          </div>

          <div className="w-8 h-0.5 bg-zinc-700"></div>

          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep === 'content-upload'
                  ? 'bg-[#eafd66] text-black'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              2
            </div>
            <span
              className={`ml-2 text-sm ${
                currentStep === 'content-upload' ? 'text-[#eafd66]' : 'text-zinc-500'
              }`}
            >
              {t.globalContentUpload.header.stepContent()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-semibold text-white">{getStepTitle()}</h2>
        <p className="text-gray-400 text-sm mt-1">{getStepDescription()}</p>
      </div>

      {/* 단계 표시기 */}
      <div className="flex items-center space-x-2 mx-6">
        <div className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              currentStep === 'channel-selection'
                ? 'bg-[#eafd66] text-black'
                : 'bg-zinc-700 text-zinc-300'
            }`}
          >
            1
          </div>
          <span
            className={`ml-1 text-xs ${
              currentStep === 'channel-selection' ? 'text-[#eafd66]' : 'text-zinc-500'
            }`}
          >
            {t.globalContentUpload.header.stepChannel()}
          </span>
        </div>

        <div className="w-8 h-0.5 bg-zinc-700"></div>

        <div className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              currentStep === 'content-upload'
                ? 'bg-[#eafd66] text-black'
                : 'bg-zinc-700 text-zinc-300'
            }`}
          >
            2
          </div>
          <span
            className={`ml-1 text-xs ${
              currentStep === 'content-upload' ? 'text-[#eafd66]' : 'text-zinc-500'
            }`}
          >
            {t.globalContentUpload.header.stepContent()}
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
