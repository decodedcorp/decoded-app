"use client";

import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { useState, useEffect } from "react";
import { useMyPageQuery } from "@/lib/hooks/common/useMyPageQuery";
import { AccountData } from "@/components/Header/nav/modal/types/mypage";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { Settings, Copy, Check, ExternalLink } from "lucide-react";
import { pretendardSemiBold } from "@/lib/constants/fonts";
import { networkManager } from "@/lib/network/network";
import { useMediaQuery } from "@/lib/hooks/common/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProfileSettings } from "./ProfileSettings";
import Image from "next/image";
import { toast } from "sonner";
import { LogoutButton } from "../settings/components/LogoutButton";
import { Button } from "@/components/ui/button";

interface UserStats {
  points: number;
  active_ticket_num: number;
  request_num: number;
  provide_num: number;
  pending_num: number;
}

interface ProfileSectionProps {
  userDocId?: string;
}

export function ProfileSection({ userDocId }: ProfileSectionProps) {
  const { t } = useLocaleContext();
  const { isLogin, isInitialized } = useAuth();
  const { isLoading, data } = useMyPageQuery("home", isLogin) as {
    data?: AccountData;
    isLoading: boolean;
  };
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [suiAccount, setSuiAccount] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window === "undefined") return;

      const currentUserDocId = window.sessionStorage.getItem("USER_DOC_ID");

      // 표시할 대상 userDocId 결정
      const targetUserId = userDocId || currentUserDocId;

      // 자신의 프로필인지 다른 사람의 프로필인지 확인
      setIsOwnProfile(!userDocId || userDocId === currentUserDocId);
      if (isOwnProfile) {
        setUserEmail(window.sessionStorage.getItem("USER_EMAIL"));
      }

      if (!targetUserId) {
        console.error("User ID not found");
        return;
      }

      try {
        const response = await networkManager.request(
          `/user/${targetUserId}/profile`,
          "GET",
          null
        );

        if (response && response.data) {
          const profileData = response.data;
          setUserNickname(profileData.aka);
          setProfileImage(profileData.profile_image_url);
          setSuiAccount(profileData.sui_address);
        }
      } catch (error) {
        console.error("프로필 정보 가져오기 실패:", error);
      }

      getUserStats(targetUserId);
    };

    if (isLogin || userDocId) {
      fetchUserData();
    }
  }, [isLogin, isInitialized, userDocId, isOwnProfile]);

  const formatSuiAddress = (address: string | null) => {
    if (!address) return "연결된 계정 없음";
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // 주소 복사 함수
  const copyToClipboard = async () => {
    if (!suiAccount) return;

    try {
      await navigator.clipboard.writeText(suiAccount);
      setIsCopied(true);
      toast.success(t.common.actions.copySuccess);

      // 3초 후 복사 상태 초기화
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
      toast.error(t.common.actions.copyFailed);
    }
  };

  // 익스플로러 링크 열기
  const openExplorer = () => {
    if (!suiAccount) return;

    const explorerUrl = `https://www.suiscan.xyz/mainnet/account/${suiAccount}/portfolio`;
    window.open(explorerUrl, "_blank", "noopener,noreferrer");
  };

  async function getUserStats(userDocId: string) {
    try {
      const response = await networkManager.request(
        `/user/${userDocId}/mypage/home`,
        "GET",
        null
      );
      console.log("getUserStats response:", response);
      setUserStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  }

  if (isInitialized && !isLogin && !userDocId) {
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

  if ((!isInitialized && !userDocId) || (isLogin && isLoading && !userDocId)) {
    return (
      <Card className="border-none shadow-none mb-8">
        <CardContent>
          <ProfileSectionSkeleton />
        </CardContent>
      </Card>
    );
  }

  const getInitial = () => {
    return userNickname ? userNickname.charAt(0).toUpperCase() : "U";
  };

  const SettingsModal = isMobile ? (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className={`${pretendardSemiBold.className} text-gray-400 hover:text-[#eafd66] bg-transparent border-none hover:bg-transparent`}
        >
          {t.mypage.home.settings}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-4/5 rounded-t-3xl bg-black border-t-2 border-gray-900"
      >
        <SheetHeader>
          <SheetTitle className="text-[#eafd66]">
            {t.mypage.home.settings}
          </SheetTitle>
        </SheetHeader>
        <ProfileSettings
          userEmail={userEmail}
          userNickname={userNickname}
          onClose={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${pretendardSemiBold.className} text-gray-400 hover:text-[#eafd66] bg-transparent border-none hover:bg-transparent`}
        >
          {t.mypage.home.settings}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border-gray-900">
        <DialogHeader>
          <DialogTitle className="text-[#eafd66]">
            {t.mypage.home.settings}
          </DialogTitle>
        </DialogHeader>
        <ProfileSettings
          userEmail={userEmail}
          userNickname={userNickname}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="border-none shadow-none mt-20">
      <CardContent>
        <div className="flex flex-col items-center space-y-2">
          {/* 프로필 이미지 */}
          <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full overflow-hidden mb-3">
            {profileImage ? (
              <div className="relative h-full w-full">
                <Image
                  src={profileImage}
                  alt="프로필 이미지"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="bg-gray-900 h-full w-full flex items-center justify-center text-white text-2xl font-semibold">
                {getInitial()}
              </div>
            )}
          </div>

          {/* 프로필 정보 */}
          <div className="flex flex-col items-center text-center">
            <h1
              className={`text-xl sm:text-2xl ${pretendardSemiBold.className} mb-1 text-gray-400`}
            >
              {userNickname}
            </h1>

            <div className="flex items-center text-xs mb-3">
              <span className="text-[#eafd66] mr-2">
                {formatSuiAddress(suiAccount)}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={copyToClipboard}
                  className="p-0.5 text-gray-400 hover:text-[#eafd66] transition-colors"
                  title="주소 복사"
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={openExplorer}
                  className="p-0.5 text-gray-400 hover:text-[#eafd66] transition-colors"
                  title="익스플로러에서 보기"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* TODO feature/following-system */}
            {/* <div className="flex items-center space-x-2 text-white/60 text-sm">
              <span>팔로잉 {followingCount}명</span>
              <span>•</span>
              <span>팔로워 {followerCount}명</span>
            </div> */}
            {/* <div className="flex items-center space-x-2 text-white/60 text-sm mb-4">
              <span>요청 {userStats?.request_num}개</span>
              <span>•</span>
              <span>제공 {userStats?.provide_num}개</span>
            </div> */}
          </div>

          {isOwnProfile && (
            <div className="flex items-center space-x-2">
              {SettingsModal}
              <LogoutButton />
            </div>
          )}

          {/* TODO: feature/following-system */}
          {/* 팔로우 버튼 - 다른 사람의 프로필일 때만 표시 */}
          {/* {!isOwnProfile && isLogin && (
            <button className="mt-3 px-4 py-1.5 rounded-full border border-[#eafd66] text-[#eafd66] hover:bg-[#eafd66]/10 transition-colors text-sm font-medium">
              팔로우
            </button>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}
