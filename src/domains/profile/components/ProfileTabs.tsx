import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChannelsTab } from './tabs/ChannelsTab';
import { SubscriptionsTab } from './tabs/SubscriptionsTab';
import { BookmarksTab } from './tabs/BookmarksTab';
import { CommentsTab } from './tabs/CommentsTab';

interface ProfileTabsProps {
  activeTab: string;
  userId: string;
  isMyProfile: boolean;
}

const getAvailableTabs = (isMyProfile: boolean) => {
  if (isMyProfile) {
    return [
      { id: 'channels', label: 'My Channels' },
      { id: 'subscriptions', label: 'Subscriptions' },
      { id: 'bookmarks', label: 'Bookmarks' },
      { id: 'comments', label: 'Comments' },
    ];
  } else {
    return [
      { id: 'comments', label: 'Comments' },
    ];
  }
};

export function ProfileTabs({ activeTab, userId, isMyProfile }: ProfileTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = getAvailableTabs(isMyProfile);
  
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
        return isMyProfile ? <ChannelsTab /> : <CommentsTab userId={userId} isMyProfile={isMyProfile} />;
    }
  };
  
  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-zinc-800 mb-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                px-6 py-3 font-medium transition-all duration-200
                border-b-2 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'text-[#EAFD66] border-[#EAFD66]' 
                  : 'text-zinc-400 border-transparent hover:text-white hover:border-zinc-600'
                }
              `}
            >
{tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
}