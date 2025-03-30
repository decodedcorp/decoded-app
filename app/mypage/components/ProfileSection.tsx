"use client";

import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { useState, useEffect } from "react";
import { useMyPageQuery } from "@/lib/hooks/common/useMyPageQueries";
import { AccountData } from "@/components/Header/nav/modal/types/mypage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function ProfileSection() {
  const { t } = useLocaleContext();
  const { isLogin, isInitialized } = useAuth();
  const { data, isLoading } = useMyPageQuery("home", true) as { 
    data?: AccountData, 
    isLoading: boolean 
  };
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = window.sessionStorage.getItem("USER_EMAIL");
      const nickname = window.sessionStorage.getItem("USER_NICKNAME");
      setUserEmail(email);
      setUserNickname(nickname);
    }
  }, [isLogin, isInitialized]);

  if (!isInitialized) {
    return <ProfileSectionSkeleton />;
  }

  if (!isLogin) {
    return (
      <Card className="bg-[#1A1A1A] border-white/5">
        <CardHeader>
          <CardTitle>{t.mypage.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/60">
            로그인 후 마이페이지를 이용할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1A1A1A] border-white/5">
      <CardHeader>
        <CardTitle>{t.mypage.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ProfileSectionSkeleton />
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white/80">{userNickname || userEmail}</h3>
              <p className="text-sm text-white/60">{userEmail}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="text-sm text-white/60">{t.mypage.home.activity.points}</div>
                <div className="text-2xl font-bold text-[#EAFD66]">{data?.points || 0}P</div>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="text-sm text-white/60">{t.mypage.home.activity.activityCounts}</div>
                <div className="text-2xl font-bold text-[#EAFD66]">{data?.active_ticket_num || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-black/20 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-xl font-bold text-[#EAFD66]">{data?.provide_num || 0}</div>
                <div className="text-xs text-white/60">{t.mypage.home.metricSections.provides}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#EAFD66]">{data?.request_num || 0}</div>
                <div className="text-xs text-white/60">{t.mypage.home.metricSections.requests}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#EAFD66]">{data?.pending_num || 0}</div>
                <div className="text-xs text-white/60">{t.mypage.home.metricSections.pending}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileSectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-48" />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      
      <Skeleton className="h-20 w-full rounded-lg mt-6" />
    </div>
  );
} 