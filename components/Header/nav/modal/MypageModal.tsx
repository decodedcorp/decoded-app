'use client';

import { useState, useEffect } from 'react';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { AccountSection } from './sections/AccountSection';
import { RequestSection } from './sections/RequestSection';
import { ProvideSection } from './sections/ProvideSection';
import { LikeSection } from './sections/LikeSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useMyPageQuery } from '@/lib/hooks/common/useMyPageQueries';
import type { LikeData, ProvideData, RequestData, AccountData, TabType } from '@/components/Header/nav/modal/types/mypage';

interface MypageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MypageModal({ isOpen, onClose }: MypageModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { t } = useLocaleContext();
  
  const { 
    data: tabData,
    isLoading,
    error 
  } = useMyPageQuery(activeTab, isOpen);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('home');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[360px] h-[calc(100vh-104px)] sm:h-[65vh]">
        <div className="animate-in slide-in-from-right duration-200 h-full">
          <div className="bg-gradient-to-b from-[#1A1A1A] to-black/95 sm:rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex flex-col h-full sm:h-[65vh] sm:mt-[48px]">
            <Tabs
              defaultValue="home"
              className="h-full flex flex-col"
              onValueChange={(value) => setActiveTab(value as TabType)}
            >
              {/* 헤더 영역 */}
              <div className="border-b border-white/5 flex-shrink-0">
                <div className="px-4 py-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    {t.mypage.tabs[activeTab]}
                  </h2>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-white/5 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 콘텐츠 영역 */}
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="home" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                  <AccountSection 
                    data={tabData as AccountData} 
                    isLoading={isLoading}
                    onClose={onClose}
                  />
                </TabsContent>
                <TabsContent value="request" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                  <RequestSection 
                    data={tabData as RequestData} 
                    isLoading={isLoading}
                    onClose={onClose}
                  />
                </TabsContent>
                <TabsContent value="provide" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                  <ProvideSection 
                    data={tabData as ProvideData} 
                    isLoading={isLoading}
                    onClose={onClose}
                  />
                </TabsContent>
                <TabsContent value="like" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                  <LikeSection 
                    data={tabData as LikeData} 
                    isLoading={isLoading}
                    onClose={onClose}
                  />
                </TabsContent>
              </div>

              {/* 하단 탭 네비게이션 */}
              <div className="border-t border-white/5 p-3 flex-shrink-0">
                <TabsList className="w-full h-10 bg-black/20 p-1 rounded-xl">
                  {(['home', 'request', 'provide', 'like'] as const).map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                    >
                      {t.mypage.tabs[tab]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
