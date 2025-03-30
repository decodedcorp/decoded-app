"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card } from "../../../components/ui/card";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { TabType } from "@/components/Header/nav/modal/types/mypage";

export function ActivityTabs() {
  const { t } = useLocaleContext();
  const [activeTab, setActiveTab] = useState<TabType>("request");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  return (
    <Tabs defaultValue="request" className="w-full" onValueChange={handleTabChange}>
      <TabsList className="w-full bg-[#1A1A1A] border-b border-white/5 rounded-none grid grid-cols-3">
        <TabsTrigger value="request" className="data-[state=active]:bg-black/20">
          {t.mypage.tabs.request}
        </TabsTrigger>
        <TabsTrigger value="provide" className="data-[state=active]:bg-black/20">
          {t.mypage.tabs.provide}
        </TabsTrigger>
        <TabsTrigger value="like" className="data-[state=active]:bg-black/20">
          {t.mypage.tabs.like}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="request" className="mt-4">
        <Card className="bg-[#1A1A1A] border-white/5 p-4">
          <p className="text-white/60 text-center py-8">
            {t.mypage.request.empty}
          </p>
        </Card>
      </TabsContent>
      
      <TabsContent value="provide" className="mt-4">
        <Card className="bg-[#1A1A1A] border-white/5 p-4">
          <p className="text-white/60 text-center py-8">
            {t.mypage.provide.empty}
          </p>
        </Card>
      </TabsContent>
      
      <TabsContent value="like" className="mt-4">
        <Card className="bg-[#1A1A1A] border-white/5 p-4">
          <p className="text-white/60 text-center py-8">
            {t.mypage.like.empty}
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 