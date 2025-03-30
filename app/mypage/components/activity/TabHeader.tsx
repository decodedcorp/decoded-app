"use client";

import { motion } from "framer-motion";
import { TabType } from "@/components/Header/nav/modal/types/mypage";

interface TabHeaderProps {
  activeTab: TabType;
  handleTabChange: (tab: TabType) => void;
  filterIcons: Record<TabType, JSX.Element>;
  t: any;
}

export const TabHeader = ({ activeTab, handleTabChange, filterIcons, t }: TabHeaderProps) => {
  // 탭 메뉴를 동적으로 생성
  const tabsConfig = [
    { id: 'like' as TabType, title: t.mypage.tabs.like, icon: filterIcons.like },
    { id: 'request' as TabType, title: t.mypage.tabs.request, icon: filterIcons.request },
    { id: 'provide' as TabType, title: t.mypage.tabs.provide, icon: filterIcons.provide },
    { id: 'board' as TabType, title: t.mypage.tabs.board, icon: filterIcons.board },
    { id: 'comment' as TabType, title: t.mypage.tabs.comment, icon: filterIcons.comment },
  ];

  return (
    <div className="mb-4 border-b border-white/10">
      <div className="flex overflow-x-auto pb-2 hide-scrollbar">
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-3 py-2 mr-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="flex-shrink-0">
              {tab.icon}
            </span>
            <span className="whitespace-nowrap">{tab.title}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                initial={false}
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}; 