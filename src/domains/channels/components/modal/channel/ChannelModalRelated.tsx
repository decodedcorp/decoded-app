import React from 'react';

export function ChannelModalRelated() {
  const relatedChannels = [
    'Design Masters',
    'Art Collective',
    'Creative Hub',
    'Tech Innovators',
    'Digital Artists',
    'UX Pioneers',
  ];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Related Channels</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {relatedChannels.map((name, idx) => (
          <div
            key={name}
            className="flex items-center space-x-3 p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-700/50 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center">
              <span className="text-zinc-300 text-sm font-medium">{name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{name}</div>
              <div className="text-zinc-400 text-sm">{(idx + 1) * 5.2}K followers</div>
            </div>
            <button className="text-xs bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-full transition-colors whitespace-nowrap">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
