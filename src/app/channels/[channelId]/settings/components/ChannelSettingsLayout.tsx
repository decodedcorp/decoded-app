'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useCommonTranslation } from '@/lib/i18n/hooks';

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
  const t = useCommonTranslation();

  const handleGoBack = () => {
    router.push(`/channels/${channel.id}`);
  };

  const tabs: Array<{
    id: SettingsTab;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
  }> = [
    {
      id: 'basic' as const,
      label: t.channelSettings.tabs.basicInfo(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: 'images' as const,
      label: t.channelSettings.tabs.images(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 'managers' as const,
      label: t.channelSettings.tabs.managers(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      disabled: true,
    },
    {
      id: 'danger' as const,
      label: t.channelSettings.tabs.dangerZone(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      disabled: true,
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
    <div className="w-full">
      {/* Header */}
      <div className="bg-surface-secondary border-b border-border-primary">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 rounded-lg bg-surface-tertiary hover:bg-surface-secondary transition-colors"
                aria-label={t.accessibility.goBack()}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M19 12H5M12 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-primary">{t.channelSettings.title()}</h1>
                <p className="text-secondary">{channel.name}</p>
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
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    tab.disabled
                      ? 'bg-surface-tertiary text-zinc-600 cursor-not-allowed opacity-50'
                      : activeTab === tab.id
                      ? 'bg-surface-secondary text-primary'
                      : 'bg-surface-tertiary text-secondary hover:bg-surface-secondary'
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
            <div className="bg-surface-secondary rounded-lg border border-border-primary p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
