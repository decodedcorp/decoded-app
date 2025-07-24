import React from 'react';
import { getInitials } from '../../utils/editorUtils';

interface Contributor {
  id: number;
  name: string;
  role: string;
  avatarUrl?: string;
}

export function ChannelModalContributors() {
  // Mock data for contributors with avatar URLs
  const contributors: Contributor[] = [
    {
      id: 1,
      name: 'Alex Chen',
      role: 'Creator',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 2,
      name: 'Sarah Kim',
      role: 'Curator',
      avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Editor',
      avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: 4,
      name: 'Emma Davis',
      role: 'Contributor',
      avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    {
      id: 5,
      name: 'David Park',
      role: 'Designer',
      avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
      id: 6,
      name: 'Lisa Wong',
      role: 'Photographer',
      avatarUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    {
      id: 7,
      name: 'Tom Wilson',
      role: 'Developer',
      avatarUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    {
      id: 8,
      name: 'Anna Lee',
      role: 'Designer',
      avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Contributors</h3>

      {/* Contributors Grid */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-2" style={{ minWidth: 'max-content' }}>
            {contributors.map((contributor) => (
              <div
                key={contributor.id}
                className="flex flex-col items-center space-y-2 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-700/50 transition-colors text-center group min-w-[120px]"
              >
                {/* Avatar */}
                <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-zinc-600 group-hover:border-zinc-500 transition-colors">
                  {contributor.avatarUrl ? (
                    <img
                      src={contributor.avatarUrl}
                      alt={contributor.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-zinc-300 text-sm font-medium">
                      {getInitials(contributor.name)}
                    </span>
                  )}
                </div>

                {/* Contributor Info */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="text-white font-medium text-sm truncate">{contributor.name}</div>
                  <div className="text-zinc-400 text-xs truncate">{contributor.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contributors Summary */}
      <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-zinc-300 text-sm font-medium">Total Contributors:</span>
            <span className="text-white font-semibold">{contributors.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 text-xs">Roles:</span>
            <div className="flex flex-wrap gap-1">
              {Array.from(new Set(contributors.map((c) => c.role))).map((role) => (
                <span
                  key={role}
                  className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
