'use client';

import { useAuth } from '@/lib/hooks/features/auth/useAuth';
import { GoogleIcon } from '@/styles/icons/auth/google-icon';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { HexBadge } from "@/components/ui/hex-badge";

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
  const userEmail = window.sessionStorage.getItem('USER_EMAIL');

  console.log(isLoading);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#EAFD66] border-r-2" />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      {isLogin && data ? (
        <div className="space-y-6 flex flex-col h-full justify-between gap-5">
          {/* Current Account Section */}
          <div className="space-y-2">
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
          <div className="space-y-6 flex flex-col h-full justify-between gap-5">
            {/* Tab buttons */}
            <div className="flex items-center gap-2 justify-center">
              <button className="px-4 py-2 bg-[#2A2A2A] rounded-full text-white text-sm">
                MY PAGE
              </button>
              <button className="px-4 py-2 text-gray-500 rounded-full text-sm">
                BADGE
              </button>
            </div>

            {/* Badge and Points Section */}
            <div className="flex w-full items-center justify-center gap-16 px-8">
              {/* Badge Section */}
              <div className="flex-shrink-0 w-32">
                <HexBadge text="BADGE" isActive={true}/>
              </div>

              {/* Points and Tickets */}
              <div className="flex-1 space-y-4 max-w-[200px]">
                <div className="space-y-1">
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
                  <div className="text-[#EAFD66] text-3xl font-bold tracking-wider">
                    {data.points}P
                  </div>
                </div>
                <div className="space-y-1">
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
                  <div className="text-[#EAFD66] text-3xl font-bold tracking-wider">
                    {data.active_ticket_num}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 bg-[#1A1A1A] rounded-xl p-4">
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
                  {data.request_num}
                </div>
                <div className="text-xs text-gray-400">
                  {t.mypage.home.metricSections.requests}
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
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={async () => {
            try {
              await handleGoogleLogin();
            } catch (error) {
              console.error('로그인 실패:', error);
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
