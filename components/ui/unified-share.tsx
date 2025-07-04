"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Share } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// 공유 플랫폼 타입 정의
interface SharePlatform {
  name: string;
  icon: string;
  color: string;
  handler: (url: string, title: string, description?: string) => void;
}

interface ShareData {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

interface UnifiedShareProps {
  /** 공유할 URL (기본값: 현재 페이지 URL) */
  url?: string;
  /** 공유할 제목 (기본값: 페이지 제목) */
  title?: string;
  /** 공유할 설명 */
  description?: string;
  /** 공유할 이미지 URL */
  imageUrl?: string;
  /** 버튼 변형 */
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  /** 버튼 크기 */
  size?: "default" | "sm" | "lg" | "icon";
  /** 컴포넌트 표시 모드 */
  mode?: "button" | "dropdown" | "modal";
  /** 사용자 정의 클래스명 */
  className?: string;
  /** 카카오 앱 키 */
  kakaoAppKey?: string;
  /** 공유 성공 콜백 */
  onShareSuccess?: (platform: string) => void;
  /** 공유 실패 콜백 */
  onShareError?: (platform: string, error: Error) => void;
}

// 커스텀 훅: 공유 데이터 관리
function useShareData({ url, title, description, imageUrl }: Partial<ShareData>) {
  const [shareData, setShareData] = useState<ShareData>({
    url: "",
    title: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareData({
        url: url || window.location.href,
        title: title || document.title,
        description: description || "",
        imageUrl: imageUrl || findPageImage(),
      });
    }
  }, [url, title, description, imageUrl]);

  return shareData;
}

// 커스텀 훅: 카카오 SDK 관리
function useKakaoSDK(appKey?: string) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Kakao && appKey) {
      const kakao = window.Kakao;
      if (!kakao.isInitialized()) {
        try {
          kakao.init(appKey);
          setIsInitialized(true);
        } catch (error) {
          console.error("카카오 SDK 초기화 실패:", error);
        }
      } else {
        setIsInitialized(true);
      }
    }
  }, [appKey]);

  return isInitialized;
}

// 유틸리티 함수: 페이지 이미지 찾기
function findPageImage(): string {
  if (typeof window === "undefined") return "";

  // OG 이미지 검색
  const ogSelectors = [
    'meta[property="og:image"]',
    'meta[property="og:image:url"]',
    'meta[property="og:image:secure_url"]',
  ];

  for (const selector of ogSelectors) {
    const element = document.querySelector(selector);
    const content = element?.getAttribute("content");
    if (content) {
      return content.startsWith("http") 
        ? content 
        : new URL(content, window.location.origin).href;
    }
  }

  // 기본 이미지
  return "https://decoded.style/og-image.jpg";
}

// 공유 플랫폼 핸들러
const createShareHandlers = (
  kakaoInitialized: boolean,
  onSuccess?: (platform: string) => void,
  onError?: (platform: string, error: Error) => void
) => {
  const handleShare = async (
    platform: string,
    shareFunction: () => void | Promise<void>
  ) => {
    try {
      await shareFunction();
      onSuccess?.(platform);
    } catch (error) {
      console.error(`${platform} 공유 오류:`, error);
      onError?.(platform, error as Error);
    }
  };

  return {
    kakao: (url: string, title: string, description?: string, imageUrl?: string) =>
      handleShare("kakao", () => {
        if (typeof window !== "undefined" && window.Kakao && kakaoInitialized) {
          window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title,
              description: description || "",
              imageUrl: imageUrl || findPageImage(),
              link: { mobileWebUrl: url, webUrl: url },
            },
            buttons: [
              {
                title: "웹으로 보기",
                link: { mobileWebUrl: url, webUrl: url },
              },
            ],
          });
        } else {
          throw new Error("카카오 SDK를 사용할 수 없습니다");
        }
      }),

    telegram: (url: string, title: string) =>
      handleShare("telegram", () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(telegramUrl, "_blank");
      }),

    twitter: (url: string, title: string) =>
      handleShare("twitter", () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, "_blank");
      }),

    sms: (url: string, title: string) =>
      handleShare("sms", () => {
        const smsUrl = `sms:?&body=${encodeURIComponent(`${title}: ${url}`)}`;
        window.location.href = smsUrl;
      }),

    copy: (url: string) =>
      handleShare("copy", async () => {
        await navigator.clipboard.writeText(url);
        // 여기서 토스트 메시지 표시 가능
      }),

    native: (url: string, title: string, description?: string) =>
      handleShare("native", async () => {
        if (navigator.share) {
          await navigator.share({
            title,
            text: description || "",
            url,
          });
        } else {
          throw new Error("네이티브 공유를 지원하지 않습니다");
        }
      }),
  };
};

export function UnifiedShare({
  url,
  title,
  description,
  imageUrl,
  variant = "outline",
  size = "sm",
  mode = "dropdown",
  className = "",
  kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "",
  onShareSuccess,
  onShareError,
}: UnifiedShareProps) {
  const shareData = useShareData({ url, title, description, imageUrl });
  const kakaoInitialized = useKakaoSDK(kakaoAppKey);
  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  // 공유 핸들러 메모화
  const shareHandlers = useMemo(
    () => createShareHandlers(kakaoInitialized, onShareSuccess, onShareError),
    [kakaoInitialized, onShareSuccess, onShareError]
  );

  // 공유 플랫폼 설정
  const platforms: SharePlatform[] = useMemo(() => [
    {
      name: "카카오톡",
      icon: "/icons/kakao.svg",
      color: "bg-[#FEE500] hover:bg-[#E6CF00] text-black",
      handler: () => shareHandlers.kakao(shareData.url, shareData.title, shareData.description, shareData.imageUrl),
    },
    {
      name: "텔레그램",
      icon: "/icons/telegram.svg", 
      color: "bg-[#0088cc] hover:bg-[#0077b3] text-white",
      handler: () => shareHandlers.telegram(shareData.url, shareData.title),
    },
    {
      name: "X",
      icon: "/icons/x.svg",
      color: "bg-black hover:bg-gray-800 text-white",
      handler: () => shareHandlers.twitter(shareData.url, shareData.title),
    },
    {
      name: "메시지",
      icon: "/icons/message.svg",
      color: "bg-green-500 hover:bg-green-600 text-white",
      handler: () => shareHandlers.sms(shareData.url, shareData.title),
    },
    {
      name: "URL 복사",
      icon: "/icons/link.svg",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white",
      handler: () => shareHandlers.copy(shareData.url),
    },
  ], [shareHandlers, shareData]);

  // 네이티브 공유 핸들러
  const handleNativeShare = useCallback(() => {
    shareHandlers.native(shareData.url, shareData.title, shareData.description);
  }, [shareHandlers, shareData]);

  // 공유 버튼 컴포넌트
  const ShareButton = (
    <Button variant={variant} size={size} className={className}>
      <Share className="h-4 w-4 mr-2" />
      공유하기
    </Button>
  );

  // 모드별 렌더링
  if (mode === "button" && hasNativeShare) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleNativeShare}
        className={className}
      >
        <Share className="h-4 w-4 mr-2" />
        공유하기
      </Button>
    );
  }

  if (mode === "dropdown") {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          {ShareButton}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" className="w-56">
          {platforms.map((platform) => (
            <DropdownMenu.Item
              key={platform.name}
              onClick={platform.handler}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${platform.color}`}
            >
              <img src={platform.icon} alt={platform.name} className="h-5 w-5" />
              <span>{platform.name}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }

  // 모달 모드
  return (
    <Dialog>
      <DialogTrigger asChild>
        {ShareButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>공유하기</DialogTitle>
          <DialogClose />
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-3 p-4">
          {hasNativeShare && (
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="flex flex-col items-center justify-center h-16 p-1"
            >
              <Share className="h-6 w-6 mb-1" />
              <span className="text-xs">기본 공유</span>
            </Button>
          )}
          
          {platforms.map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              onClick={platform.handler}
              className="flex flex-col items-center justify-center h-16 p-1"
            >
              <img src={platform.icon} alt={platform.name} className="h-6 w-6 mb-1" />
              <span className="text-xs">{platform.name}</span>
            </Button>
          ))}
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
            <input
              type="text"
              value={shareData.url}
              readOnly
              className="flex-1 bg-transparent border-none text-xs focus:outline-none truncate"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => shareHandlers.copy(shareData.url)}
              className="h-7 px-2 text-xs"
            >
              복사
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 전역 Window 타입 확장
declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: any) => void;
      };
    };
  }
}