'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';

import { BasicInfoSection } from './BasicInfoSection';
import { ImageSection } from './ImageSection';
import { ManagerSection } from './ManagerSection';
import { DeleteChannelSection } from './DeleteChannelSection';

interface ChannelSettingsLayoutProps {
  channel: ChannelResponse;
}

type SettingsTab = 'basic' | 'images' | 'managers' | 'danger';

export function ChannelSettingsLayout({ channel }: ChannelSettingsLayoutProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('basic');

  const handleGoBack = () => {
    router.push(`/channels/${channel.id}`);
  };

  const tabs = [
    { 
      id: 'basic' as const, 
      label: 'Basic Info', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'images' as const, 
      label: 'Images', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'managers' as const, 
      label: 'Managers', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: 'danger' as const, 
      label: 'Danger Zone', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoSection channel={channel} />;
      case 'images':
        return <ImageSection channel={channel} />;
      case 'managers':
        return <ManagerSection channel={channel} />;
      case 'danger':
        return <DeleteChannelSection channel={channel} />;
      default:
        return <BasicInfoSection channel={channel} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                aria-label="Go back to channel"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M19 12H5M12 19l-7-7 7-7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold">Channel Settings</h1>
                <p className="text-zinc-400">{channel.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-zinc-700 text-white'
                      : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}