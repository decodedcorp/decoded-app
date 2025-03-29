"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./dialog";
import { Share as ShareIcon, X } from "lucide-react";

interface ShareButtonsProps {
  title?: string;
  description?: string;
  className?: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  kakaoAppKey?: string;
  thumbnailUrl?: string;
}

export function ShareButtons({
  title = "페이지 공유하기",
  description = "이 페이지를 친구들과 공유해보세요.",
  className = "",
  buttonVariant = "outline",
  kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "",
  thumbnailUrl = "",
}: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [canShare, setCanShare] = useState<boolean>(false);
  const [kakaoInitialized, setKakaoInitialized] = useState<boolean>(false);
  const [pageImage, setPageImage] = useState<string>("");

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    setCurrentUrl(window.location.href);
    setCurrentTitle(document.title);
    // Web Share API 지원 여부 확인
    setCanShare(!!navigator.share);

    // 페이지 이미지 찾기
    findPageImage();

    // 카카오 SDK 초기화
    if (typeof window !== "undefined" && window.Kakao && kakaoAppKey) {
      const kakao = window.Kakao;
      if (!kakao.isInitialized()) {
        try {
          kakao.init(kakaoAppKey);
          setKakaoInitialized(true);
          console.log("카카오 SDK 초기화 완료");
        } catch (error) {
          console.error("카카오 SDK 초기화 실패:", error);
        }
      } else {
        setKakaoInitialized(true);
      }
    }
  }, [kakaoAppKey]);

  // 페이지에서 사용할 이미지 찾기
  const findPageImage = () => {
    console.log("Finding page image for sharing...");

    // OG 이미지 URL 검색 로직 개선
    const ogImageSelectors = [
      'meta[property="og:image"]',
      'meta[property="og:image:url"]',
      'meta[property="og:image:secure_url"]',
    ];

    for (const selector of ogImageSelectors) {
      const ogImage = document.querySelector(selector);
      console.log(
        `${selector} found:`,
        ogImage ? "Yes" : "No",
        ogImage?.getAttribute("content")
      );
      if (ogImage && ogImage.getAttribute("content")) {
        const ogImageUrl = ogImage.getAttribute("content") || "";

        // 절대 URL 확인 및 변환 로직 개선
        const fullImageUrl = ogImageUrl.startsWith("http")
          ? ogImageUrl
          : new URL(ogImageUrl, window.location.origin).toString(); // toString() 사용

        console.log("Using OG image with absolute URL:", fullImageUrl);
        setPageImage(fullImageUrl);
        return;
      }
    }

    // Twitter 카드 메타 태그에서 이미지 찾기
    const twitterImageSelectors = [
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]',
    ];

    for (const selector of twitterImageSelectors) {
      const twitterImage = document.querySelector(selector);
      console.log(
        `${selector} found:`,
        twitterImage ? "Yes" : "No",
        twitterImage?.getAttribute("content")
      );
      if (twitterImage && twitterImage.getAttribute("content")) {
        const twitterImageUrl = twitterImage.getAttribute("content") || "";

        // 상대 경로를 절대 경로로 변환
        const fullImageUrl = twitterImageUrl.startsWith("http")
          ? twitterImageUrl
          : new URL(twitterImageUrl, window.location.origin).href;

        console.log("Using Twitter image:", fullImageUrl);
        setPageImage(fullImageUrl);
        return;
      }
    }

    // 3. 페이지에서 큰 이미지 찾기 (최소 200x200 이상)
    const images = Array.from(document.querySelectorAll("img"))
      .filter((img) => {
        // 이미지가 표시 중이고 최소 크기 이상인 경우 선택
        return (
          img.offsetWidth >= 200 &&
          img.offsetHeight >= 200 &&
          !img.src.includes("data:") && // base64 이미지 제외
          img.src && // 비어있지 않은 src
          img.complete && // 로드 완료
          img.naturalWidth > 0 // 유효한 이미지
        );
      })
      .sort((a, b) => {
        // 크기 기준 내림차순 정렬 (더 큰 이미지 우선)
        const areaA = a.offsetWidth * a.offsetHeight;
        const areaB = b.offsetWidth * b.offsetHeight;
        return areaB - areaA;
      });

    console.log(
      "Large images found:",
      images.length,
      images.length > 0 ? images[0].src : "None"
    );
    if (images.length > 0) {
      setPageImage(images[0].src);
      console.log("Using large image from page:", images[0].src);
      return;
    }

    // 4. 대표 이미지를 찾지 못한 경우 기본 썸네일 사용
    console.log(
      "No suitable images found, using default thumbnail:",
      thumbnailUrl
    );
    setPageImage(thumbnailUrl);
  };

  // 사용할 이미지 URL 결정
  const getImageUrl = (): string => {
    // 1. 외부에서 전달받은 썸네일 URL 사용
    if (thumbnailUrl) {
      console.log("Using provided thumbnailUrl:", thumbnailUrl);
      // 절대 URL 확보
      return thumbnailUrl.startsWith("http")
        ? thumbnailUrl
        : new URL(thumbnailUrl, window.location.origin).toString();
    }
    // 2. 페이지에서 찾은 이미지 사용
    if (pageImage) {
      console.log("Using pageImage:", pageImage);
      // 절대 URL 확보
      return pageImage.startsWith("http")
        ? pageImage
        : new URL(pageImage, window.location.origin).toString();
    }

    // 3. 메타데이터에서 정의된 기본 이미지 경로 사용 (하드코딩하여 확실하게)
    const defaultImage = "https://decoded.style/og-image.jpg";
    console.log("Using default image:", defaultImage);
    return defaultImage;
  };

  // 일반 카카오톡 공유 (로그인 불필요)
  const shareKakao = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      if (!kakaoInitialized) {
        console.error("카카오 SDK가 초기화되지 않았습니다.");
        openKakaoShareLink();
        return;
      }

      try {
        const imageUrl = getImageUrl();
        console.log("Sharing to Kakao with image:", imageUrl);

        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: currentTitle,
            description: description,
            imageUrl: imageUrl,
            link: {
              mobileWebUrl: currentUrl,
              webUrl: currentUrl,
            },
          },
          buttons: [
            {
              title: "웹으로 보기",
              link: {
                mobileWebUrl: currentUrl,
                webUrl: currentUrl,
              },
            },
          ],
        });
      } catch (error) {
        console.error("카카오 공유 오류:", error);
        openKakaoShareLink();
      }
    } else {
      openKakaoShareLink();
    }
  };

  // 카카오톡 직접 공유 링크 열기
  const openKakaoShareLink = () => {
    // 모바일에서는 카카오톡 앱으로, 데스크톱에서는 클립보드 복사
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 모바일 카카오톡 공유 URL (딥링크)
      // 카카오톡이 설치되어 있으면 앱으로 이동
      window.location.href = `intent://send?text=${encodeURIComponent(
        currentTitle + "\n" + currentUrl
      )}#Intent;scheme=kakaolink;package=com.kakao.talk;end`;

      // 딥링크 실패시 대비 타임아웃 처리
      setTimeout(() => {
        // 앱이 실행되지 않았으면 스토어로 이동
        const isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid) {
          window.location.href = "market://details?id=com.kakao.talk";
        } else {
          window.location.href = "https://itunes.apple.com/app/id362057947";
        }
      }, 1500);
    } else {
      // 데스크톱에서는 URL 복사 후 카카오톡으로 안내
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          if (
            confirm(
              "URL이 클립보드에 복사되었습니다. 카카오톡을 실행하시겠습니까?"
            )
          ) {
            window.open("https://talk.kakao.com", "_blank");
          }
        })
        .catch(() => {
          // 클립보드 복사 실패 시 대체 방법
          window.open(
            `https://sharer.kakao.com/talk/friends/picker/link?app_key=${kakaoAppKey}&meta={"title":"${encodeURIComponent(
              currentTitle
            )}","description":"${encodeURIComponent(
              description
            )}", "image_url":"${encodeURIComponent(
              getImageUrl()
            )}","link":{"web_url":"${encodeURIComponent(
              currentUrl
            )}","mobile_web_url":"${encodeURIComponent(currentUrl)}"}}`,
            "_blank"
          );
        });
    }
  };

  // 기본 공유 (Web Share API 사용)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentTitle,
          text: description,
          url: currentUrl,
        });
      } catch (error) {
        console.error("공유 중 오류가 발생했습니다:", error);
      }
    }
  };

  // 텔레그램 공유
  const shareTelegram = () => {
    const imageUrl = encodeURIComponent(getImageUrl());
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(currentTitle)}&image=${imageUrl}`;
    window.open(telegramShareUrl, "_blank");
  };

  // X(트위터) 공유
  const shareTwitter = () => {
    // X는 이미지를 직접 파라미터로 전달할 수 없지만,
    // 카드 미리보기를 위해 URL에 쿼리 파라미터를 추가하여 크롤링 유도
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      currentTitle
    )}&url=${encodeURIComponent(
      currentUrl + (currentUrl.includes("?") ? "&" : "?") + "_t=" + Date.now()
    )}`;
    window.open(twitterShareUrl, "_blank");
  };

  // 메시지(SMS) 공유
  const shareSMS = () => {
    const smsShareUrl = `sms:?&body=${encodeURIComponent(
      currentTitle + ": " + currentUrl
    )}`;
    window.location.href = smsShareUrl;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={className}>
          <ShareIcon className="mr-2 h-4 w-4" />
          공유하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black/90 dark:bg-black border-0 shadow-lg rounded-lg overflow-hidden p-0">
        <DialogHeader className="bg-black/80 dark:bg-black/90 px-4 h-14 border-b border-gray-700 dark:border-gray-800 relative flex items-center justify-center">
          <DialogTitle className="text-base font-medium text-white/80 m-0">
            {title}
          </DialogTitle>
          <DialogClose className="absolute right-4 text-white/80 hover:text-white/80/80 focus:outline-none transition-colors flex items-center justify-center w-8 h-8">
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </DialogClose>
        </DialogHeader>

        {/* 미리보기 이미지 영역 제거 */}

        <div className="grid grid-cols-3 gap-3 p-4">
          {canShare && (
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex flex-col items-center justify-center h-16 bg-black/50 hover:bg-black/70 border border-gray-700 hover:border-primary/50 rounded-lg transition-colors p-1"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white/80 rounded-full mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
              </div>
              <span className="text-xs font-medium text-white/80">
                기본 공유
              </span>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={shareKakao}
            className="flex flex-col items-center justify-center h-16 bg-black/50 hover:bg-black/70 border border-gray-700 hover:border-primary/50 rounded-lg transition-colors p-1"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-[#FEE500] text-black rounded-full mb-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M128 36C70.562 36 24 72.713 24 118c0 29.279 19.466 54.97 48.748 69.477-1.593 5.494-10.237 35.344-10.581 37.689 0 0-.207 1.762.934 2.434s2.483.15 2.483.15c3.272-.457 37.943-24.811 43.806-29.052 5.9.849 11.93 1.302 18.11 1.302 57.438 0 104-36.712 104-82c0-45.287-46.562-82-104-82z"
                  fill="#3A1D1D"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-white/80">카카오톡</span>
          </Button>

          {/* 텔레그램 버튼 */}
          <Button
            variant="outline"
            onClick={shareTelegram}
            className="flex flex-col items-center justify-center h-16 bg-black/50 hover:bg-black/70 border border-gray-700 hover:border-primary/50 rounded-lg transition-colors p-1"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-[#0088cc] text-white/80 rounded-full mb-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.132c-.173 1.855-.892 6.354-1.262 8.432-.16.855-.32 1.602-.612 2.053-.293.45-.674.601-1.116.601-.643 0-1.286-.358-1.925-.722-.97-.674-1.412-1.014-2.343-1.653-.964-.66-1.602-1.088-1.602-1.603 0-.257.077-.514.231-.771.41-.714 1.922-2.266 3.173-3.642.324-.36.593-.695.593-.926 0-.232-.168-.335-.335-.438-.168-.104-1.69-1.014-1.948-1.158-.258-.143-.552-.156-.695-.156-.45 0-.95.375-1.144.774-.452.939-1.237 2.77-1.237 2.77s-3.001 2.268-3.001 2.771c0 .232.104.412.209.592.232.412 6.166 5.5 7.428 6.514.335.271.892.463 1.34.463.796 0 1.603-.45 1.836-.9.387-.756 1.313-4.416 1.7-6.7.193-1.14.53-2.672.643-3.314.116-.642.077-1.284-.35-1.796-.424-.502-1.102-.709-1.7-.709-.694 0-1.582.207-1.975.579 0 0 .26-.207.603-.414.335-.206.963-.553 1.733-.553 1.04 0 1.976.463 1.976 1.451 0 .18-.56.72-.219 1.079z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-white/80">텔레그램</span>
          </Button>

          {/* X(트위터) 버튼 */}
          <Button
            variant="outline"
            onClick={shareTwitter}
            className="flex flex-col items-center justify-center h-16 bg-black/50 hover:bg-black/70 border border-gray-700 hover:border-primary/50 rounded-lg transition-colors p-1"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-black text-white/80 border border-gray-600 rounded-full mb-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-white/80">X</span>
          </Button>
        </div>

        <div className="px-4 pb-4 pt-0">
          <div className="flex items-center gap-2 p-2 bg-black/60 rounded-md border border-gray-700">
            <input
              type="text"
              value={currentUrl}
              readOnly
              className="flex-1 bg-transparent border-none text-xs focus:outline-none focus:ring-0 text-gray-300 truncate"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(currentUrl);
                alert("URL이 클립보드에 복사되었습니다");
              }}
              className="h-7 px-2 text-xs bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            >
              복사
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 타입 정의를 위한 인터페이스 추가 (전역 Window 인터페이스 확장)
declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: any) => void;
      };
      Auth?: {
        authorize: (options: any) => void;
        getAccessToken: () => string | null;
        setAccessToken: (token: string) => void;
      };
      Picker?: {
        selectFriends: (options: any) => Promise<any>;
      };
      API?: {
        request: (options: any) => Promise<any>;
      };
    };
  }
}
