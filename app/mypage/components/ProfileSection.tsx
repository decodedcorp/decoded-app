"use client";

import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { useState, useEffect } from "react";
import { useMyPageQuery } from "@/lib/hooks/common/useMyPageQueries";
import { AccountData } from "@/components/Header/nav/modal/types/mypage";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { Settings } from "lucide-react";
import Link from "next/link";

export function ProfileSection() {
  const { t } = useLocaleContext();
  const { isLogin, isInitialized } = useAuth();
  const { isLoading } = useMyPageQuery("home", true) as { 
    data?: AccountData, 
    isLoading: boolean 
  };
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followerCount, setFollowerCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = window.sessionStorage.getItem("USER_EMAIL");
      const nickname = window.sessionStorage.getItem("USER_NICKNAME");
      setUserEmail(email);
      setUserNickname(nickname);
      
      // 팔로잉 및 팔로워 수를 API 또는 세션스토리지에서 가져오는 로직 추가 가능
      // 여기에서는 하드코딩된 값 사용
      setFollowingCount(2);
      setFollowerCount(0);
    }
  }, [isLogin, isInitialized]);

  if (!isInitialized) {
    return <ProfileSectionSkeleton />;
  }

  if (!isLogin) {
    return (
      <Card className="border-none shadow-none mb-8">
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

  // 이니셜 생성 (닉네임의 첫 글자)
  const getInitial = () => {
    return userNickname ? userNickname.charAt(0).toUpperCase() : "U";
  };

  return (
    <Card className="border-none shadow-none mb-8">
      <CardHeader>
        <CardTitle>{t.mypage.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ProfileSectionSkeleton />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white/20">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-full w-full flex items-center justify-center text-white text-xl font-semibold">
                    {getInitial()}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">{userNickname || userEmail}</h1>
                  <div className="flex items-center space-x-2 text-white/60 text-sm">
                    <span>팔로잉 {followingCount}명</span>
                    <span>•</span>
                    <span>팔로워 {followerCount}명</span>
                  </div>
                </div>
              </div>
              <Link href="/mypage/settings">
                <button className="p-2 rounded-full hover:bg-white/10">
                  <Settings className="h-5 w-5 text-white/60" />
                </button>
              </Link>
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
      <div className="flex items-center space-x-4 mt-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
} 