'use client';

import { useAuth } from '@/lib/hooks/features/auth/useAuth';
import { GoogleIcon } from '@/styles/icons/auth/google-icon';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { CustomTooltip } from "@/components/ui/custom-tooltip";

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
  onClose,
}: {
  data: AccountData;
  isLoading: boolean;
  onClose: () => void;
}) {
  const { t } = useLocaleContext();
  const { isLogin, handleGoogleLogin, handleDisconnect } = useAuth();
  const userEmail = window.sessionStorage.getItem('USER_EMAIL');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#EAFD66] border-r-2" />
      </div>
    );
  }

  // 로그아웃 핸들러 - 로그아웃 후 모달 닫기 처리
  const handleLogout = () => {
    handleDisconnect();
    
    // 로그아웃 후 약간의 지연을 두고 모달 닫기
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="h-full flex flex-col">
      {isLogin && data ? (
        <div className="flex-1 flex flex-col gap-4 p-4">
          {/* Current Account Section */}
          <div className="bg-[#1A1A1A] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GoogleIcon />
              <span className="text-white">{userEmail}</span>
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
                {data.points}P
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
                {data.active_ticket_num}
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-[#EAFD66] text-xl font-bold">
                  {data.provide_num}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t.mypage.home.metricSections.provides}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#EAFD66] text-xl font-bold">
                  {data.request_num}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t.mypage.home.metricSections.requests}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#EAFD66] text-xl font-bold">
                  {data.pending_num}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t.mypage.home.metricSections.pending}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              // 중복 클릭 방지
              const clickTime = Date.now();
              const lastClickTime = sessionStorage.getItem('LOGIN_BUTTON_CLICK_TIME');
              
              if (lastClickTime) {
                const timeDiff = clickTime - parseInt(lastClickTime, 10);
                if (timeDiff < 2000) {  // 3초에서 2초로 축소
                  const isDevMode = process.env.NODE_ENV === 'development';
                  if (isDevMode) {
                    console.log('[AccountSection] 최근 로그인 버튼 클릭 감지, 중복 클릭 무시');
                  }
                  return;
                }
              }
              
              // 현재 클릭 시간 기록
              sessionStorage.setItem('LOGIN_BUTTON_CLICK_TIME', clickTime.toString());
              
              try {
                const isDevMode = process.env.NODE_ENV === 'development';
                if (isDevMode) {
                  console.log('[AccountSection] 로그인 버튼 클릭, 의도적으로 모달 닫기 시작');
                }
                
                // 모달을 즉시 닫고 로그인 프로세스 시작 - 대기 시간 제거
                onClose();
                
                // 로그인 시작 - 대기 시간을 20ms로 최소화 (이벤트 버블링 방지 위한 최소값)
                await new Promise(resolve => setTimeout(resolve, 20));
                
                if (isDevMode) {
                  console.log('[AccountSection] 구글 로그인 시도 시작');
                }
                
                // 로그인 시도
                await handleGoogleLogin();
                
                if (isDevMode) {
                  console.log('[AccountSection] 로그인 프로세스 시작됨');
                }
              } catch (error) {
                console.error('[AccountSection] 로그인 실패:', error);
                
                // 에러 발생 시 타임스탬프 삭제하여 재시도 가능하게 함
                sessionStorage.removeItem('LOGIN_BUTTON_CLICK_TIME');
              }
            }}
            className="w-full px-6 py-4 rounded-xl text-sm font-medium
              bg-gradient-to-r from-white to-gray-100 text-gray-900 
              hover:from-gray-50 hover:to-gray-100
              transition-all duration-200 ease-out
              flex items-center justify-center gap-3
              shadow-lg shadow-black/5"
            // disabled 상태 추가 - 최근 클릭이 있었으면 비활성화
            disabled={(() => {
              const lastClickTime = sessionStorage.getItem('LOGIN_BUTTON_CLICK_TIME');
              if (lastClickTime) {
                const timeDiff = Date.now() - parseInt(lastClickTime, 10);
                return timeDiff < 2000; // 3초에서 2초로 축소
              }
              return false;
            })()}
          >
            <GoogleIcon />
            <span className="font-medium">{t.common.actions.login.google}</span>
          </button>
        </div>
      )}
    </div>
  );
}
