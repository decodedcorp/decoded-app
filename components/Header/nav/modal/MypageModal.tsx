'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { AccountSection } from './sections/AccountSection';
import { RequestSection } from './sections/RequestSection';
import { ProvideSection } from './sections/ProvideSection';
import { LikeSection } from './sections/LikeSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useMyPageQuery } from '@/lib/hooks/common/useMyPageQueries';
import type { LikeData, ProvideData, RequestData, AccountData, TabType } from '@/components/Header/nav/modal/types/mypage';
import { cn } from '@/lib/utils/style';

// 모달 컨트롤러 커스텀 훅
function useModalController({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isProtectionActive, setIsProtectionActive] = useState<boolean>(false);
  const lastActionTimeRef = useRef<number>(0);
  const prevIsOpenRef = useRef<boolean>(false);

  const handleClose = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault(); // 브라우저 기본 동작 방지
      e.stopPropagation(); // 이벤트 전파 중단
    }
    
    const now = Date.now();
    
    if (isProtectionActive) {
      return;
    }
    
    if (now - lastActionTimeRef.current < 300) {
      return;
    }
    
    lastActionTimeRef.current = now;
    
    onClose();
  }, [onClose, isProtectionActive]);

  // 외부에서 강제로 닫힘 감지
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      const now = Date.now();
      if (now - lastActionTimeRef.current > 100) {
        // 외부에서 강제로 닫힘 감지
        if (typeof document !== 'undefined') {
          // 스크롤 복원 (강제 닫힘 시에도 항상 적용)
          document.body.style.overflow = '';
        }
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, isProtectionActive]);

  // 모달 상태 관리
  useEffect(() => {
    const now = Date.now();
    lastActionTimeRef.current = now;
    
    if (isOpen) {
      setIsVisible(true);
      setIsProtectionActive(true);
      
      const protectionTimer = setTimeout(() => {
        setIsProtectionActive(false);
      }, 800);
      
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
      
      return () => clearTimeout(protectionTimer);
    } else {
      setIsProtectionActive(true);
      
      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsProtectionActive(false);
        
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
        }
      }, 300);
      
      // 항상 스크롤을 복원하기 위한 즉시 실행
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
      
      return () => clearTimeout(closeTimer);
    }
  }, [isOpen]);

  // 모달 효과에서 제거하지 못한 overflow 설정을 정리하는 클린업 함수
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 항상 스크롤 복원
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);
  
  // 전역 이벤트 핸들러 예외 처리 - useModalClose 대응
  useEffect(() => {
    if (isOpen && isVisible) {
      // 모달 내부 클릭을 감지하고 처리하는 핸들러
      const handleGlobalClick = (e: MouseEvent) => {
        // 모달 패널 내부 클릭인지 확인
        const modalPanel = document.getElementById('mypage-modal-panel');
        if (modalPanel && (modalPanel === e.target || modalPanel.contains(e.target as Node))) {
          // 이벤트를 취소하지 않고 사용자 정의 플래그만 설정 - 다른 핸들러가 실행되도록 허용
          (e as any).__handled = true;
        }
      };

      // 캡처 단계에서 이벤트 리스너 추가 (가장 먼저 실행되도록)
      document.addEventListener('click', handleGlobalClick, { capture: true });
      
      return () => {
        document.removeEventListener('click', handleGlobalClick, { capture: true });
      };
    }
  }, [isOpen, isVisible]);

  return {
    isVisible,
    isProtectionActive,
    handleClose
  };
}

// 반응형 스타일 관리 커스텀 훅
function useResponsiveModalStyles() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth <= 1025;
  const isDesktop = windowWidth > 1025;
  
  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    styles: {
      width: isMobile ? '100%' : isTablet ? '420px' : '360px',
      height: isMobile ? '100%' : isTablet ? '75vh' : '65vh',
      marginTop: isMobile ? '0' : '48px',
      borderRadius: isMobile ? '0' : '16px',
      minWidth: isMobile ? '100%' : '350px',
      minHeight: isMobile ? '100%' : '500px',
    }
  };
}

interface MypageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MypageModal({ isOpen, onClose }: MypageModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { t } = useLocaleContext();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 커스텀 훅 사용
  const { isVisible, isProtectionActive, handleClose } = useModalController({ isOpen, onClose });
  const { windowWidth, isMobile, styles } = useResponsiveModalStyles();
  
  // 탭 데이터 로딩
  const { 
    data: tabData,
    isLoading,
    error 
  } = useMyPageQuery(activeTab, isOpen);

  // 렌더링 최적화를 위한 포스 리플로우
  useEffect(() => {
    if (isOpen && isVisible && modalRef.current) {
      setTimeout(() => {
        if (modalRef.current) {
          // 포스 리플로우
          const forceReflow = modalRef.current.offsetHeight;
          
          if (windowWidth < 1025) {
            modalRef.current.style.opacity = '0.99';
            setTimeout(() => {
              if (modalRef.current) {
                modalRef.current.style.opacity = '1';
              }
            }, 10);
          }
        }
      }, 0);
    }
  }, [isOpen, isVisible, windowWidth]);

  // 모달 외부 클릭 핸들러
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    // 배경 클릭 이벤트만 처리 (실제로 모달 외부 영역을 클릭한 경우만)
    if (e.target === e.currentTarget) {
      handleClose(e);
    }
    // 더 이상 e.stopPropagation()을 호출하지 않음 - 이벤트가 내부 컴포넌트로 전달될 수 있도록 함
  }, [handleClose]);
  
  // 모달이 보이지 않고 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen && !isVisible) {
    return null;
  }
  
  return (
    <div 
      className="mypage-modal-root" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0,
        bottom: 0, 
        pointerEvents: isOpen ? 'auto' : 'none', 
        zIndex: 100000
      }}
      onClick={handleBackgroundClick}
    >
      {/* 배경 오버레이 - 이제 이벤트 핸들러 제거 */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          pointerEvents: 'none', // 이벤트를 항상 통과시킴
          zIndex: 100000 
        }}
      />
      
      {/* 모달 패널 */}
      <div 
        ref={modalRef}
        id="mypage-modal-panel"
        data-modal-container="true"
        data-no-close-on-click="true"
        className={cn(
          "fixed top-0 right-0 bottom-0 flex flex-col overflow-hidden",
          "border border-white/5 shadow-lg",
          "transition-transform duration-300 ease-out",
          "bg-gradient-to-b from-[#1A1A1A] to-black/95",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
          }
        )}
        style={{ 
          pointerEvents: isOpen ? 'auto' : 'none', 
          zIndex: 100001,
          width: styles.width,
          height: styles.height,
          minWidth: styles.minWidth,
          minHeight: styles.minHeight,
          marginTop: styles.marginTop,
          borderTopLeftRadius: styles.borderRadius,
          borderBottomLeftRadius: styles.borderRadius,
          willChange: 'transform',
          transformOrigin: 'right center',
        }}
      >
        <Tabs
          defaultValue="home"
          className="h-full flex flex-col"
          onValueChange={(value) => setActiveTab(value as TabType)}
        >
          {/* 헤더 영역 */}
          <div 
            className="border-b border-white/5 flex-shrink-0"
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {t.mypage.tabs[activeTab]}
              </h2>
              <button
                onClick={(e) => {
                  // 닫기 버튼은 이벤트 전파를 중단해서 패널 클릭 핸들러가 실행되지 않도록 함
                  e.stopPropagation();
                  handleClose(e);
                }}
                className="rounded-full p-2 hover:bg-white/5 transition-colors"
                disabled={isProtectionActive}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div 
            className="flex-1 overflow-y-auto"
            data-no-close-on-click="true"
          >
            <TabsContent value="home" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <AccountSection 
                data={tabData as AccountData} 
                isLoading={isLoading}
                onClose={handleClose}
              />
            </TabsContent>
            <TabsContent value="request" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <RequestSection 
                data={tabData as RequestData} 
                isLoading={isLoading}
                onClose={handleClose}
              />
            </TabsContent>
            <TabsContent value="provide" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ProvideSection 
                data={tabData as ProvideData} 
                isLoading={isLoading}
                onClose={handleClose}
              />
            </TabsContent>
            <TabsContent value="like" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <LikeSection 
                data={tabData as LikeData} 
                isLoading={isLoading}
                onClose={handleClose}
              />
            </TabsContent>
          </div>

          {/* 탭 네비게이션 */}
          <div 
            className="border-t border-white/5 p-3 flex-shrink-0"
            data-no-close-on-click="true"
          >
            <TabsList 
              className="w-full h-10 bg-black/20 p-1 rounded-xl"
            >
              {(['home', 'request', 'provide', 'like'] as const).map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-[#EAFD66]/10 data-[state=active]:text-[#EAFD66] text-gray-400"
                >
                  {t.mypage.tabs[tab]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
