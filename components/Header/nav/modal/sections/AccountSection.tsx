"use client";

import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { GoogleIcon } from "@/styles/icons/auth/google-icon";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAccountData } from "@/lib/hooks/common/useAccountData";

// 조건부 로깅 - 에러 시에만 출력
const logError = (message: string, error?: any) => {
  if (process.env.NODE_ENV === "development") {
    console.error(message, error);
  }
};

interface AccountData {
  points: number;
  active_ticket_num: number;
  request_num: number;
  provide_num: number;
  pending_num: number;
}

export function AccountSection({
  isOpen,
  onClose,
  onLogout,
  onLoginSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  onLoginSuccess?: () => void;
}) {
  const { t } = useLocaleContext();
  const { isLogin, handleGoogleLogin, handleDisconnect } = useAuth();
  const userEmail = window.sessionStorage.getItem("USER_EMAIL");
  
  // 기존의 data, isLoading props 대신 useAccountData 훅 사용
  const { data, isLoading } = useAccountData(isOpen);

  // 로그인 성공 이벤트 리스너 추가
  useEffect(() => {
    // 로그인 성공 시 호출될 핸들러
    const handleLoginSuccess = () => {
      logError("[AccountSection] 로그인 성공 이벤트 감지");
      
      // 지연 후 모달 닫기
      setTimeout(() => {
        onClose();
        
        // 모달이 닫힌 후 약간의 지연을 둔 뒤 페이지 리로딩
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          // 페이지 리로딩
          window.location.reload();
        }, 300);
      }, 300);
    };

    // 이벤트 리스너 등록
    window.addEventListener("login:success", handleLoginSuccess);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("login:success", handleLoginSuccess);
    };
  }, [onClose, onLoginSuccess]);

  // 모달 닫고 페이지 이동
  const handleGoToMypage = () => {
    onClose();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#EAFD66] border-r-2" />
      </div>
    );
  }

  // 로그아웃 핸들러 - 커스텀 핸들러 사용 또는 기본 로직 실행
  const handleLogout = () => {
    if (onLogout) {
      // 부모 컴포넌트에서 전달된 로그아웃 핸들러 사용
      onLogout();
      // 모달 닫기
      onClose();
      // 페이지 리로딩 추가
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      // 기존 로그아웃 로직 사용
      handleDisconnect();

      // 필요한 추가 정리 작업
      window.sessionStorage.removeItem("USER_DOC_ID");
      window.sessionStorage.removeItem("SUI_ACCOUNT");
      window.sessionStorage.removeItem("ACCESS_TOKEN");
      window.sessionStorage.removeItem("USER_EMAIL");
      window.sessionStorage.removeItem("USER_NICKNAME");

      // 이벤트 발송
      window.dispatchEvent(new CustomEvent("auth:state-changed"));
      
      // 모달 닫기
      onClose();
      
      // 페이지 리로딩 추가
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // 데이터가 있는지 확인
  const hasData =
    data &&
    (data.points > 0 ||
      data.active_ticket_num > 0 ||
      data.request_num > 0 ||
      data.provide_num > 0 ||
      data.pending_num > 0);

  return (
    <div className="h-full flex flex-col">
      {isLogin ? (
        <div className="flex-1 flex flex-col gap-4 p-4">
          {/* Current Account Section */}
          <div className="bg-[#1A1A1A] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GoogleIcon />
              <span className="text-white/80">{userEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="hover:text-gray-200 transition-colors"
              aria-label="로그아웃"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            {/* Points Card */}
            <div className="bg-[#1A1A1A] rounded-xl p-4 space-y-2">
              <div className="text-gray-400 text-sm flex items-center gap-1">
                {t.mypage.home.activity.points}
                <CustomTooltip text="활동을 통해 획득한 포인트입니다.">
                  <svg
                    className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </CustomTooltip>
              </div>
              <div className="text-[#EAFD66] text-2xl font-bold">
                {data?.points || 0}P
              </div>
            </div>

            {/* Activity Tickets Card */}
            <div className="bg-[#1A1A1A] rounded-xl p-4 space-y-2">
              <div className="text-gray-400 text-sm flex items-center gap-1">
                {t.mypage.home.activity.activityCounts}
                <CustomTooltip text="현재 진행 중인 활동권 수입니다.">
                  <svg
                    className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </CustomTooltip>
              </div>
              <div className="text-[#EAFD66] text-2xl font-bold">
                {data?.active_ticket_num || 0}
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-[#EAFD66] text-xl font-bold">
                  {data?.provide_num || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t.mypage.home.metricSections.provides}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#EAFD66] text-xl font-bold">
                  {data?.request_num || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t.mypage.home.metricSections.requests}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#EAFD66] text-xl font-bold">
                  {data?.pending_num || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t.mypage.home.metricSections.pending}
                </div>
              </div>
            </div>
          </div>

          {/* 마이페이지 이동 버튼 */}
          <div className="mt-2">
            <Link href="/mypage" onClick={handleGoToMypage} className="w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 text-white/80 border-white/10"
              >
                <span>마이페이지로 이동</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              // 가장 단순한 형태로 직접 로그인 호출
              try {
                // 로그인 시작 - 로딩 상태 설정을 위한 이벤트 발생
                window.dispatchEvent(new CustomEvent("login:loading:start"));

                // 로그인 함수 직접 호출 - 이제 성공 처리는 이벤트 리스너에서 담당
                handleGoogleLogin()
                  .catch((error) => {
                    // 로그인 실패 시 로딩 상태 종료
                    window.dispatchEvent(new CustomEvent("login:loading:stop"));
                    logError("[AccountSection] 로그인 후처리 중 오류:", error);
                  });
              } catch (error) {
                window.dispatchEvent(new CustomEvent("login:loading:stop"));
                logError("[AccountSection] 로그인 시도 중 오류:", error);
              }
            }}
            className="w-full px-6 py-4 rounded-xl text-sm font-medium
              bg-gradient-to-r from-white to-gray-100 text-gray-900 
              hover:from-gray-50 hover:to-gray-100
              transition-all duration-200 ease-out
              flex items-center justify-center gap-3
              shadow-lg shadow-black/5"
          >
            <GoogleIcon />
            <span className="font-medium">{t.common.actions.login.google}</span>
          </button>
        </div>
      )}
    </div>
  );
}
