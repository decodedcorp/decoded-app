'use client';

import React from 'react';

interface AddChannelHeaderProps {
  onClose: () => void;
  currentStep: number;
}

export function AddChannelHeader({ onClose, currentStep }: AddChannelHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
      <div className="flex space-x-6 justify-between w-full pr-2">
        <h2 className="text-2xl font-semibold text-white">Create Channel</h2>

        {/* Step Indicator */}
        <div className="flex items-center space-x-4">
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
              Basic Info
            </span>
          </div>

          <div className="w-16 h-0.5 bg-zinc-700"></div>

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
              Media Upload
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
