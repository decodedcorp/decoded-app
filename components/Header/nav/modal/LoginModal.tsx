"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { AccountSection } from "./sections/AccountSection";
import { RequestSection } from "./sections/RequestSection";
import { ProvideSection } from "./sections/ProvideSection";
import { LikeSection } from "./sections/LikeSection";
import { NotificationSection } from "./sections/NotificationSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { networkManager } from "@/lib/network/network";

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
  const [activeTab, setActiveTab] = useState("home");
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
    // 현재 탭의 데이터 상태를 즉시 확인
    const currentTabData = await new Promise((resolve) => {
      setTabData((prev) => {
        resolve(prev[tab]);
        return prev;
      });
    });

    // 이미 데이터가 있으면 리턴
    if (currentTabData !== null) {
      console.log("Already Fetched");
      return;
    }

    const userDocId = sessionStorage.getItem("USER_DOC_ID");
    if (!userDocId) return;

    setIsLoading(true);

    if (tab === "likes") {
      try {
        const [imagesResponse, itemsResponse] = await Promise.all([
          networkManager.request(`user/${userDocId}/mypage/likes/image`, "GET"),
          networkManager.request(`user/${userDocId}/mypage/likes/item`, "GET"),
        ]);

        if (imagesResponse.status_code === 200) {
          setTabData((prev) => ({
            ...prev,
            likes: {
              ...prev.likes,
              images: imagesResponse.data,
            },
          }));
        }

        if (itemsResponse.status_code === 200) {
          setTabData((prev) => ({
            ...prev,
            likes: {
              ...prev.likes,
              items: itemsResponse.data,
            },
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
          "GET"
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
      setActiveTab("home");
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
      <div className="relative w-[400px] max-h-[calc(100vh-100px)]">
        <div className="animate-in slide-in-from-right duration-200">
          <div className="bg-gradient-to-b from-[#1A1A1A] to-black/95 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
            {/* Header */}
            <div className="relative px-8 pt-14 text-center">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/5 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
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

              {/* Decorative Elements */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#EAFD66]/20 to-transparent" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#EAFD66]/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="flex flex-col h-[600px]">
              <div className="flex-1 overflow-hidden">
                <Tabs
                  defaultValue="home"
                  className="h-full flex flex-col"
                  onValueChange={(value) =>
                    setActiveTab(value as keyof TabData)
                  }
                >
                  <div className="px-6 flex-1 overflow-y-auto">
                    <TabsContent value="home">
                      <h2 className="text-lg font-bold text-white mb-4">
                        {t.mypage.tabs.home}
                      </h2>
                      <AccountSection
                        data={tabData.home}
                        isLoading={isLoading}
                      />
                    </TabsContent>
                    <TabsContent value="requests">
                      <h2 className="text-lg font-bold text-white mb-4">
                        {t.mypage.tabs.request}
                      </h2>
                      <RequestSection
                        data={tabData.requests}
                        isLoading={isLoading}
                      />
                    </TabsContent>
                    <TabsContent value="provides">
                      <h2 className="text-lg font-bold text-white mb-4">
                        {t.mypage.tabs.provide}
                      </h2>
                      <ProvideSection
                        data={tabData.provides}
                        isLoading={isLoading}
                      />
                    </TabsContent>
                    <TabsContent value="likes">
                      <h2 className="text-lg font-bold text-white mb-4">
                        {t.mypage.tabs.like}
                      </h2>
                      <LikeSection data={tabData.likes} isLoading={isLoading} />
                    </TabsContent>
                    <TabsContent value="notifications">
                      <h2 className="text-lg font-bold text-white mb-4">
                        {t.mypage.tabs.notification}
                      </h2>
                      <NotificationSection
                        data={tabData.notifications}
                        isLoading={isLoading}
                      />
                    </TabsContent>
                  </div>

                  {/* Tabs Navigation - Fixed at the bottom */}
                  <div className="border-t border-white/5 mt-8 bg-black/40 backdrop-blur-sm">
                    <div className="px-6 py-4">
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
                        <TabsTrigger
                          value="notifications"
                          className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                        >
                          {t.mypage.tabs.notification}
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
