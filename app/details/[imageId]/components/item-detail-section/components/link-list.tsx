'use client';

import { formatUrl } from '../utils';
import { 
  ChevronRight, 
  MoreVertical, 
  Youtube, 
  Play, 
  ShoppingBag,
  Store 
} from 'lucide-react';
import type { LinkInfo } from '../types';
import { useState } from 'react';

// Add Icons map to associate domains with their respective icons
const domainIcons: Record<string, React.ReactNode> = {
  'paramount.com': (
    <div className="bg-blue-600 rounded-lg flex items-center justify-center w-10 h-10">
      <Play className="w-6 h-6 text-white" />
    </div>
  ),
  'youtube.com': (
    <div className="bg-red-600 rounded-lg flex items-center justify-center w-10 h-10">
      <Youtube className="w-6 h-6 text-white" />
    </div>
  ),
  'talesofthetrip.com': (
    <div className="bg-purple-600 rounded-lg flex items-center justify-center w-10 h-10">
      <ShoppingBag className="w-6 h-6 text-white" />
    </div>
  ),
  'comedycentral.com': (
    <div className="bg-yellow-400 rounded-lg flex items-center justify-center w-10 h-10">
      <Store className="w-6 h-6 text-black" />
    </div>
  ),
  // Default icon for other domains
  'default': (
    <div className="w-10 h-10 rounded-lg bg-neutral-700 flex items-center justify-center text-white font-bold">
      L
    </div>
  )
};

// Helper function to get display name from URL
function getDisplayName(url: string): string {
  const domain = formatUrl(url);
  
  // Map of domains to display names
  const displayNames: Record<string, string> = {
    'paramount.com': 'Stream Comedy Central Shows on Paramount+',
    'talesofthetrip.com': 'Tales From The Trip Merch',
    'comedycentral.com': 'Comedy Central Merch Store',
    'youtube.com': 'Comedy Central YouTube'
  };
  
  return displayNames[domain] || domain;
}

// Helper function to get icon for a domain
function getIconForDomain(url: string): React.ReactNode {
  const domain = formatUrl(url);
  return domainIcons[domain] || domainIcons.default;
}

interface LinkListProps {
  links?: LinkInfo[];
  activeTab: 'sale' | 'related';
  status: 'pending' | 'confirmed';
}

export function LinkList({ links, activeTab, status }: LinkListProps) {
  // First filter confirmed links only
  const confirmedLinks = links?.filter(link => link.status === 'confirmed') || [];
  
  // Then filter by tab type
  const filteredLinks = confirmedLinks.filter(link => {
    if (activeTab === 'sale') {
      return link.label === 'sale';
    } else {
      // related 탭에서는 related 라벨이 있거나 라벨이 null인 항목 표시
      return link.label === 'related' || link.label === null;
    }
  });

  return (
    <div className="space-y-4">
      {filteredLinks.length === 0 && (
        <div className="text-center p-6 bg-neutral-800/30 rounded-lg flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-neutral-700/50 flex items-center justify-center mb-2">
            <ChevronRight className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="text-neutral-300 font-medium">
            {activeTab === 'sale' ? '판매 링크가 없습니다' : '관련 링크가 없습니다'}
          </p>
          <p className="text-neutral-500 text-sm">이 아이템에 대한 추가 정보를 기다려주세요</p>
        </div>
      )}
      {filteredLinks.map((link, index) => (
        <a
          key={index}
          href={link.value}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-700 transition-colors"
        >
          {/* Left: Icon */}
          {getIconForDomain(link.value)}
          
          {/* Middle: Text content */}
          <div className="flex-1 mx-4 text-center">
            <div className="text-white text-sm font-medium">
              {getDisplayName(link.value)}
            </div>
          </div>
          
          {/* Right: Menu button */}
          <button 
            className="text-neutral-400 hover:text-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Add menu functionality here
            }}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </a>
      ))}
    </div>
  );
}
