import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProfileTranslation } from '@/lib/i18n/hooks';
import { ChannelsTab } from './tabs/ChannelsTab';
import { SubscriptionsTab } from './tabs/SubscriptionsTab';
import { BookmarksTab } from './tabs/BookmarksTab';
import { CommentsTab } from './tabs/CommentsTab';

interface ProfileTabsProps {
  activeTab: string;
  userId: string;
  isMyProfile: boolean;
}

const getAvailableTabs = (isMyProfile: boolean, t: any) => {
  if (isMyProfile) {
    return [
      { id: 'channels', label: t.tabs.myChannels() },
      { id: 'subscriptions', label: t.tabs.subscriptions() },
      { id: 'bookmarks', label: t.tabs.bookmarks() },
      { id: 'comments', label: t.tabs.comments() },
    ];
  } else {
    return [{ id: 'comments', label: t.tabs.comments() }];
  }
};

export function ProfileTabs({ activeTab, userId, isMyProfile }: ProfileTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useProfileTranslation();
  const tabs = getAvailableTabs(isMyProfile, t);

  const handleTabChange = (tabId: string) => {
    router.push(`/profile/${userId}?tab=${tabId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'channels':
        return isMyProfile ? <ChannelsTab /> : null;
      case 'subscriptions':
        return isMyProfile ? <SubscriptionsTab /> : null;
      case 'bookmarks':
        return isMyProfile ? <BookmarksTab /> : null;
      case 'comments':
        return <CommentsTab userId={userId} isMyProfile={isMyProfile} />;
      default:
        // Default to first available tab
        const defaultTab = tabs[0]?.id;
        if (defaultTab && defaultTab !== activeTab) {
          handleTabChange(defaultTab);
          return null;
        }
        return isMyProfile ? (
          <ChannelsTab />
        ) : (
          <CommentsTab userId={userId} isMyProfile={isMyProfile} />
        );
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className=" mb-6 sm:mb-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-200
                border-b-2 whitespace-nowrap text-sm sm:text-base
                ${
                  activeTab === tab.id
                    ? 'text-[#EAFD66] border-[#EAFD66]'
                    : 'text-zinc-400 border-transparent hover:text-white hover:border-zinc-600 hover:border-b-2'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px] sm:min-h-[400px]">{renderTabContent()}</div>
    </div>
  );
}
