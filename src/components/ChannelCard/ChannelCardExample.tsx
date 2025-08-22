'use client';

import React, { useState } from 'react';
import { ChannelCard, ChannelCardProps } from './ChannelCard';

// 예시 채널 데이터
const exampleChannels = [
  {
    id: '1',
    name: 'Sophie Bennett',
    description:
      'Product Designer who focuses on simplicity & usability. Creating intuitive digital experiences that users love.',
    profileImageUrl:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    isVerified: true,
    followerCount: 312,
    contentCount: 48,
    category: 'Design',
  },
  {
    id: '2',
    name: 'Alex Chen',
    description:
      'Frontend Developer passionate about React and modern web technologies. Building scalable applications with clean code.',
    profileImageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    isVerified: false,
    followerCount: 156,
    contentCount: 23,
    category: 'Development',
  },
  {
    id: '3',
    name: 'Maria Garcia',
    description:
      'UX Researcher exploring the intersection of technology and human behavior. Understanding users to create better products.',
    profileImageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face',
    isVerified: true,
    followerCount: 892,
    contentCount: 67,
    category: 'Research',
  },
  {
    id: '4',
    name: 'David Kim',
    description:
      'Backend engineer specializing in scalable microservices and cloud architecture. Building robust systems that scale.',
    profileImageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    isVerified: false,
    followerCount: 234,
    contentCount: 31,
    category: 'Engineering',
  },
  {
    id: '5',
    name: 'Emma Wilson',
    description:
      'Content Creator sharing insights about digital marketing and social media strategies. Helping brands grow online.',
    profileImageUrl:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    isVerified: true,
    followerCount: 567,
    contentCount: 89,
    category: 'Marketing',
  },
  {
    id: '6',
    name: 'James Rodriguez',
    description:
      'Data Scientist working on machine learning algorithms and predictive analytics. Turning data into actionable insights.',
    profileImageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    isVerified: false,
    followerCount: 189,
    contentCount: 42,
    category: 'Data Science',
  },
];

export const ChannelCardExample = () => {
  const [followingChannels, setFollowingChannels] = useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = useState<Set<string>>(new Set());

  // 팔로우/언팔로우 핸들러
  const handleFollow = async (channelId: string) => {
    setLoadingStates((prev) => new Set(prev).add(channelId));

    // 실제 API 호출을 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setFollowingChannels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(channelId)) {
        newSet.delete(channelId);
      } else {
        newSet.add(channelId);
      }
      return newSet;
    });

    setLoadingStates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(channelId);
      return newSet;
    });
  };

  // 카드 클릭 핸들러
  const handleCardClick = (channel: any) => {
    console.log('Channel clicked:', channel);
    // 여기서 채널 상세 페이지로 이동하거나 모달을 열 수 있습니다
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-8 text-center">ChannelCard Examples</h1>

        {/* 기본 카드들 */}
        <div className="mb-12">
          <h2 className="text-white text-xl font-semibold mb-6">Default Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onFollow={handleFollow}
                onCardClick={handleCardClick}
                isFollowing={followingChannels.has(channel.id)}
                isLoading={loadingStates.has(channel.id)}
              />
            ))}
          </div>
        </div>

        {/* 컴팩트 카드들 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-white">Compact Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {exampleChannels.slice(0, 4).map((channel) => (
              <ChannelCard
                key={`compact-${channel.id}`}
                channel={channel}
                variant="compact"
                onFollow={handleFollow}
                onCardClick={handleCardClick}
                isFollowing={followingChannels.has(channel.id)}
                isLoading={loadingStates.has(channel.id)}
              />
            ))}
          </div>
        </div>

        {/* 피처드 카드들 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-white">Featured Variant</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {exampleChannels.slice(0, 2).map((channel) => (
              <ChannelCard
                key={`featured-${channel.id}`}
                channel={channel}
                variant="featured"
                onFollow={handleFollow}
                onCardClick={handleCardClick}
                isFollowing={followingChannels.has(channel.id)}
                isLoading={loadingStates.has(channel.id)}
              />
            ))}
          </div>
        </div>

        {/* 소프트 UI 카드들 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-white">Soft UI Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleChannels.map((channel) => (
              <ChannelCard
                key={`soft-${channel.id}`}
                channel={channel}
                variant="soft"
                onFollow={handleFollow}
                onCardClick={handleCardClick}
                isFollowing={followingChannels.has(channel.id)}
                isLoading={loadingStates.has(channel.id)}
              />
            ))}
          </div>
        </div>

        {/* 사용법 설명 */}
        <div className="bg-zinc-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Usage Examples</h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="font-medium text-white">Basic Usage:</h4>
              <pre className="bg-zinc-800 p-3 rounded text-sm overflow-x-auto">
                {`<ChannelCard
  channel={channelData}
  onFollow={handleFollow}
  onCardClick={handleCardClick}
/>`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium text-white">With Variants:</h4>
              <pre className="bg-zinc-800 p-3 rounded text-sm overflow-x-auto">
                {`<ChannelCard
  channel={channelData}
  variant="compact" // or "featured" or "soft"
  isFollowing={true}
  isLoading={false}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
