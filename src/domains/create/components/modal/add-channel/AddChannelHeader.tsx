'use client';

import React from 'react';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AddChannelHeaderProps {
  onClose: () => void;
  currentStep: number;
}

export function AddChannelHeader({ onClose, currentStep }: AddChannelHeaderProps) {
  const t = useCommonTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="p-4 border-b border-zinc-700/50">
        {/* 제목과 닫기 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {t.globalContentUpload.addChannel.title()}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Step Indicator - 아래로 배치 */}
        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 1
                  ? 'bg-gradient-to-br from-[#eafd66] to-[#d4e85c] text-black'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              1
            </div>
            <span
              className={`ml-1 text-xs ${currentStep >= 1 ? 'text-[#eafd66]' : 'text-zinc-500'}`}
            >
              {t.globalContentUpload.addChannel.steps.basicInfo()}
            </span>
          </div>

          <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-[#eafd66]' : 'bg-zinc-700'}`}></div>

          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 2
                  ? 'bg-gradient-to-br from-[#eafd66] to-[#d4e85c] text-black'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              2
            </div>
            <span
              className={`ml-1 text-xs ${currentStep >= 2 ? 'text-[#eafd66]' : 'text-zinc-500'}`}
            >
              {t.globalContentUpload.addChannel.steps.style()}
            </span>
          </div>

          <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-[#eafd66]' : 'bg-zinc-700'}`}></div>

          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 3
                  ? 'bg-gradient-to-br from-[#eafd66] to-[#d4e85c] text-black'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              3
            </div>
            <span
              className={`ml-1 text-xs ${currentStep >= 3 ? 'text-[#eafd66]' : 'text-zinc-500'}`}
            >
              {t.globalContentUpload.addChannel.steps.topics()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-700/50">
      <div className="flex space-x-6 justify-between w-full pr-2">
        <h2 className="text-2xl font-semibold text-white">
          {t.globalContentUpload.addChannel.title()}
        </h2>

        {/* Step Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1
                  ? 'bg-gradient-to-br from-[#eafd66] to-[#d4e85c] text-black'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              1
            </div>
            <span
              className={`ml-2 text-sm ${currentStep >= 1 ? 'text-[#eafd66]' : 'text-zinc-500'}`}
            >
              {t.globalContentUpload.addChannel.steps.basicInfo()}
            </span>
          </div>

          <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-[#eafd66]' : 'bg-zinc-700'}`}></div>

          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2
                  ? 'bg-gradient-to-br from-[#eafd66] to-[#d4e85c] text-black'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              2
            </div>
            <span
              className={`ml-2 text-sm ${currentStep >= 2 ? 'text-[#eafd66]' : 'text-zinc-500'}`}
            >
              {t.globalContentUpload.addChannel.steps.style()}
            </span>
          </div>

          <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-[#eafd66]' : 'bg-zinc-700'}`}></div>

          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3
                  ? 'bg-gradient-to-br from-[#eafd66] to-[#d4e85c] text-black'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              3
            </div>
            <span
              className={`ml-2 text-sm ${currentStep >= 3 ? 'text-[#eafd66]' : 'text-zinc-500'}`}
            >
              {t.globalContentUpload.addChannel.steps.topics()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
