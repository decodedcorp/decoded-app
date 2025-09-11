'use client';

import React from 'react';

import type { UserProfileResponse } from '@/api/generated/models/UserProfileResponse';

import { ChannelEditorsStackedAvatars } from './ChannelEditorsStackedAvatars';

// 테스트용 mock 데이터
const mockEditors: UserProfileResponse[] = [
  {
    id: '1',
    aka: 'Alex Chen',
    email: 'alex@decoded.style',
    profile_image_url: 'https://picsum.photos/32/32?random=1',
    registration_date: '2024-01-01T00:00:00Z',
  },
  {
    id: '2', 
    aka: 'Sarah Kim',
    email: 'sarah@decoded.style',
    profile_image_url: 'https://picsum.photos/32/32?random=2',
    registration_date: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    aka: 'Mike Johnson',
    email: 'mike@decoded.style', 
    profile_image_url: 'https://picsum.photos/32/32?random=3',
    registration_date: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    aka: 'Emma Davis',
    email: 'emma@decoded.style',
    registration_date: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    aka: 'David Park',
    email: 'david@decoded.style',
    profile_image_url: 'https://picsum.photos/32/32?random=5',
    registration_date: '2024-01-05T00:00:00Z',
  }
];

export function ChannelEditorsStackedAvatarsTest() {
  return (
    <div className="p-8 bg-zinc-900 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-white mb-8">Stacked Avatars Test</h1>
        
        <div className="space-y-6">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Small Size (3 max)</h2>
            <ChannelEditorsStackedAvatars 
              editors={mockEditors}
              maxDisplay={3}
              size="sm"
              showTooltip={true}
            />
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Medium Size (4 max)</h2>
            <ChannelEditorsStackedAvatars 
              editors={mockEditors}
              maxDisplay={4}
              size="md"
              showTooltip={true}
            />
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Large Size (5 max)</h2>
            <ChannelEditorsStackedAvatars 
              editors={mockEditors}
              maxDisplay={5}
              size="lg"
              showTooltip={true}
            />
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Empty State</h2>
            <ChannelEditorsStackedAvatars 
              editors={[]}
              maxDisplay={3}
              size="md"
              showTooltip={true}
            />
            <p className="text-zinc-500 text-sm mt-2">Should show nothing when no editors</p>
          </div>
        </div>
      </div>
    </div>
  );
}