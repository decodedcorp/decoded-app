'use client';

import React from 'react';

interface AddChannelHeaderProps {
  onClose: () => void;
}

export function AddChannelHeader({ onClose }: AddChannelHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 5v14m-7-7h14"
              stroke="#52525b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Create New Channel</h2>
          <p className="text-zinc-400 text-sm">Add a new channel to your collection</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
        aria-label="Close modal"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
