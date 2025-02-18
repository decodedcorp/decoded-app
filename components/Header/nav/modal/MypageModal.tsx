'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { AccountSection } from './sections/AccountSection';
import { RequestSection } from './sections/RequestSection';
import { ProvideSection } from './sections/ProvideSection';
import { LikeSection } from './sections/LikeSection';
import { NotificationSection } from './sections/NotificationSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { networkManager } from '@/lib/network/network';

interface MypageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TabData {
  home: any | null;
  requests: any | null;
  provides: any | null;
  likes: any | null;
  notifications: any | null;
}

export function MypageModal({ isOpen, onClose }: MypageModalProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [tabData, setTabData] = useState<TabData>({
    home: null,
    requests: null,
    provides: null,
    likes: null,
    notifications: null,
  });
  console.log(tabData);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLocaleContext();

  const fetchTabData = useCallback(async (tab: keyof TabData) => {
    // 캐시된 데이터가 있는지 확인
    const hasCachedData = await new Promise<boolean>((resolve) => {
      setTabData((prev) => {
        resolve(prev[tab] !== null);
        return prev;
      });
    });

    // 캐시된 데이터가 있으면 로딩 스킵
    if (hasCachedData) {
      return;
    }

    setIsLoading(true);

    const userDocId = sessionStorage.getItem('USER_DOC_ID');
    if (!userDocId) {
      setIsLoading(false);
      return;
    }

    if (tab === 'likes') {
      try {
        const [imagesResponse, itemsResponse] = await Promise.all([
          networkManager.request(`user/${userDocId}/mypage/likes/image`, 'GET'),
          networkManager.request(`user/${userDocId}/mypage/likes/item`, 'GET'),
        ]);

        if (
          imagesResponse.status_code === 200 &&
          itemsResponse.status_code === 200
        ) {
          setTabData((prev) => ({
            ...prev,
            likes: {
              images: imagesResponse.data,
              items: itemsResponse.data,
            },
          }));
        }
      } catch (error) {
        console.error(`${tab} 데이터 로딩 실패:`, error);
      } finally {
        setIsLoading(false);
      }
    } else if (tab === 'provides') {
      try {
        const response = await networkManager.request(
          `user/${userDocId}/mypage/provides`,
          'GET'
        );
        if (response.status_code === 200) {
          setTabData((prev) => ({
            ...prev,
            provides: response.data,
          }));
        }
      } catch (error) {
        console.error(`${tab} 데이터 로딩 실패:`, error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await networkManager.request(
          `user/${userDocId}/mypage/${tab}`,
          'GET'
        );
        if (response.status_code === 200) {
          setTabData((prev) => ({
            ...prev,
            [tab]: response.data,
          }));
        }
      } catch (error) {
        console.error(`${tab} 데이터 로딩 실패:`, error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []); // 의존성 배열은 비워둠

  useEffect(() => {
    if (isOpen) {
      fetchTabData(activeTab as keyof TabData);
    } else {
      setActiveTab('home');
      setTabData({
        home: null,
        requests: null,
        provides: null,
        likes: null,
        notifications: null,
      });
    }
  }, [isOpen, activeTab, fetchTabData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-20 px-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[400px]">
        <div className="animate-in slide-in-from-right duration-200">
          <div className="bg-gradient-to-b from-[#1A1A1A] to-black/95 rounded-2xl overflow-hidden shadow-2xl border border-white/5 h-[calc(100vh-400px)] flex flex-col">
            <Tabs
              defaultValue="home"
              className="h-full flex flex-col"
              onValueChange={(value) => setActiveTab(value as keyof TabData)}
            >
              {/* 헤더 영역 */}
              <div className="border-b border-white/5 flex-shrink-0">
                <div className="px-6 py-2 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    {activeTab === 'home' && t.mypage.tabs.home}
                    {activeTab === 'requests' && t.mypage.tabs.request}
                    {activeTab === 'provides' && t.mypage.tabs.provide}
                    {activeTab === 'likes' && t.mypage.tabs.like}
                    {activeTab === 'notifications' &&
                      t.mypage.tabs.notification}
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
                <div className="px-6 py-4 h-full">
                  <TabsContent value="home">
                    <AccountSection data={tabData.home} isLoading={isLoading} />
                  </TabsContent>
                  <TabsContent value="requests">
                    <RequestSection
                      data={tabData.requests}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                  <TabsContent value="provides">
                    <ProvideSection
                      data={tabData.provides}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                  <TabsContent value="likes">
                    <LikeSection data={tabData.likes} isLoading={isLoading} />
                  </TabsContent>
                </div>
              </div>

              {/* 하단 탭 네비게이션 */}
              <div className="border-t border-white/5 p-4 flex-shrink-0">
                <TabsList className="w-full h-12 bg-black/20 p-1 rounded-xl">
                  <TabsTrigger
                    value="home"
                    className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                  >
                    {t.mypage.tabs.home}
                  </TabsTrigger>
                  <TabsTrigger
                    value="requests"
                    className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                  >
                    {t.mypage.tabs.request}
                  </TabsTrigger>
                  <TabsTrigger
                    value="provides"
                    className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                  >
                    {t.mypage.tabs.provide}
                  </TabsTrigger>
                  <TabsTrigger
                    value="likes"
                    className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                  >
                    {t.mypage.tabs.like}
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
