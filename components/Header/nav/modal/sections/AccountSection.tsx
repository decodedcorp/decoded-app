"use client";

import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { GoogleIcon } from "@/styles/icons/auth/google-icon";
import { useLocaleContext } from "@/lib/contexts/locale-context";

interface AccountData {
  points: number;
  active_ticket_num: number;
  request_num: number;
  provide_num: number;
  pending_num: number;
}

export function AccountSection({
  data,
  isLoading,
}: {
  data: AccountData;
  isLoading: boolean;
}) {
  const { t } = useLocaleContext();
  const { isLogin, handleGoogleLogin, handleDisconnect } = useAuth();
  const userEmail = window.sessionStorage.getItem("USER_EMAIL");

  console.log(isLoading);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#EAFD66] border-r-2" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isLogin && data ? (
        <div className="space-y-6">
          {/* Current Account Section */}
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">CURRENT</div>
            <div className="bg-[#1A1A1A] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GoogleIcon />
                <span className="text-white">{userEmail}</span>
              </div>
              <button onClick={handleDisconnect}>
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
          </div>

          {/* My Page Section */}
          <div className="space-y-4">
            <div className="text-gray-400 text-sm">MY PAGE</div>

            {/* Points and Tickets */}
            <div className="bg-[#1A1A1A] rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-400">
                  {t.mypage.home.activity.points}
                </div>
                <div className="text-[#EAFD66] text-2xl font-bold">
                  {data.points}P
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-400">
                  {t.mypage.home.activity.activityCounts}
                </div>
                <div className="text-[#EAFD66] text-2xl font-bold">
                  {data.active_ticket_num}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 gap-2 bg-[#1A1A1A] rounded-xl p-4">
              <div className="text-center">
                <div className="text-[#EAFD66] text-lg font-bold">
                  {data.provide_num}
                </div>
                <div className="text-xs text-gray-400">
                  {t.mypage.home.metricSections.total}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#EAFD66] text-lg font-bold">
                  {data.request_num}
                </div>
                <div className="text-xs text-gray-400">
                  {t.mypage.home.metricSections.requests}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#EAFD66] text-lg font-bold">
                  {data.provide_num}
                </div>
                <div className="text-xs text-gray-400">
                  {t.mypage.home.metricSections.provides}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#EAFD66] text-lg font-bold">
                  {data.pending_num}
                </div>
                <div className="text-xs text-gray-400">
                  {t.mypage.home.metricSections.pending}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#EAFD66] text-lg font-bold">
                  {data.provide_num}
                </div>
                <div className="text-xs text-gray-400">
                  {t.mypage.home.metricSections.completed}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={async () => {
            try {
              await handleGoogleLogin();
            } catch (error) {
              console.error("로그인 실패:", error);
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
      )}
    </div>
  );
}
