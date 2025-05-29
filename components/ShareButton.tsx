"use client";

import { useState } from "react";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButton({
  url,
  title,
  description = "",
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  // 브라우저가 Web Share API를 지원하는지 확인
  const hasShareAPI =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const shareOptions = [
    {
      name: "카카오톡",
      icon: "/icons/kakao.svg",
      color: "bg-[#FEE500] hover:bg-[#E6CF00] text-black",
      handler: () => shareToKakao(url, title, description),
    },
    {
      name: "텔레그램",
      icon: "/icons/telegram.svg",
      color: "bg-[#0088cc] hover:bg-[#0077b3] text-white/80",
      handler: () => shareToTelegram(url, title),
    },
    {
      name: "메시지",
      icon: "/icons/message.svg",
      color: "bg-green-500 hover:bg-green-600 text-white/80",
      handler: () => shareToMessage(url, title),
    },
    {
      name: "X",
      icon: "/icons/x.svg",
      color: "bg-black hover:bg-gray-800 text-white/80",
      handler: () => shareToX(url, title),
    },
    {
      name: "URL 복사",
      icon: "/icons/link.svg",
      color:
        "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white/80",
      handler: () => copyToClipboard(url),
    },
  ];

  const handleShare = async () => {
    if (hasShareAPI) {
      try {
        setIsSharing(true);
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.error("공유하기에 실패했습니다:", error);
      } finally {
        setIsSharing(false);
      }
    }
  };

  return (
    <div className="relative">
      {/* 네이티브 공유 API 지원 시 표시 (주로 모바일) */}
      {hasShareAPI && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          disabled={isSharing}
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Share className="h-5 w-5" />
          <span className="sr-only">공유하기</span>
        </Button>
      )}

      {/* 네이티브 공유 API 미지원 시 표시 (주로 데스크톱) */}
      {!hasShareAPI && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Share className="h-5 w-5" />
              <span className="sr-only">공유하기</span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="w-56">
            {shareOptions.map((option) => (
              <DropdownMenu.Item
                key={option.name}
                onClick={option.handler}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${option.color}`}
              >
                <img src={option.icon} alt={option.name} className="h-5 w-5" />
                <span>{option.name}</span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
    </div>
  );
}

// 공유 함수들
function shareToKakao(url: string, title: string, description: string) {
  // 카카오톡 SDK 사용 필요
  if (window.Kakao) {
    try {
      // Kakao.Share 사용 (새로운 API)
      if (window.Kakao.Share) {
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title,
            description,
            imageUrl: "https://your-site.com/og-image.jpg",
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
          buttons: [
            {
              title: "자세히 보기",
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
            },
          ],
        });
      }
      // 이전 API 호환성 (사용하지 않음)
      else {
        console.error("카카오톡 Share API가 없습니다.");
      }
    } catch (error) {
      console.error("카카오톡 공유 실패:", error);
    }
  } else {
    console.error("카카오톡 SDK가 로드되지 않았습니다.");
  }
}

function shareToTelegram(url: string, title: string) {
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title)}`;
  window.open(telegramUrl, "_blank");
}

function shareToMessage(url: string, title: string) {
  // SMS 공유는 모바일에서 주로 사용
  // iOS
  const iOSUrl = `sms:&body=${encodeURIComponent(title + " " + url)}`;
  // Android
  const androidUrl = `sms:?body=${encodeURIComponent(title + " " + url)}`;

  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = iOSUrl;
  } else {
    window.location.href = androidUrl;
  }
}

function shareToX(url: string, title: string) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, "_blank");
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    // 여기서 토스트 메시지를 표시할 수 있습니다
    alert("URL이 클립보드에 복사되었습니다!");
  } catch (err) {
    console.error("클립보드 복사 실패:", err);
  }
}
