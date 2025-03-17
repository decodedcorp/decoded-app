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

interface MypageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MypageModal({ isOpen, onClose }: MypageModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { t } = useLocaleContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isProtectionActive, setIsProtectionActive] = useState<boolean>(false);
  const lastActionTimeRef = useRef<number>(0);
  
  const { 
    data: tabData,
    isLoading,
    error 
  } = useMyPageQuery(activeTab, isOpen);

  const handleClose = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    const now = Date.now();
    
    if (isProtectionActive) {
      console.log('모달 보호 기간 활성화 중, 닫기 무시');
      return;
    }
    
    if (now - lastActionTimeRef.current < 300) {
      console.log('액션 간격이 너무 짧음, 닫기 무시');
      return;
    }
    
    lastActionTimeRef.current = now;
    
    console.log('모달 닫기 실행');
    onClose();
  }, [onClose, isProtectionActive]);

  useEffect(() => {
    console.log(`모달 상태 변경: isOpen=${isOpen}`);
    
    const now = Date.now();
    lastActionTimeRef.current = now;
    
    if (isOpen) {
      setIsVisible(true);
      
      setIsProtectionActive(true);
      
      const protectionTimer = setTimeout(() => {
        console.log('모달 보호 기간 종료');
        setIsProtectionActive(false);
      }, 800);
      
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
      
      return () => clearTimeout(protectionTimer);
    } else {
      setIsProtectionActive(true);
      
      const closeTimer = setTimeout(() => {
        console.log('모달 닫기 애니메이션 완료, isVisible=false로 설정');
        setActiveTab('home');
        setIsVisible(false);
        setIsProtectionActive(false);
        
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
        }
      }, 300);
      return () => clearTimeout(closeTimer);
    }
  }, [isOpen]);

  useEffect(() => {
    console.log(`Modal is now visible, loading data for tab: ${activeTab}`);
  }, [isVisible, activeTab]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      
      if (isOpen && isVisible && modalRef.current) {
        const forceReflow = modalRef.current.offsetHeight;
      }
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, isVisible]);

  useEffect(() => {
    console.log('MypageModal rendered, isOpen:', isOpen, 'isVisible:', isVisible, 'windowWidth:', windowWidth);
    
    if (isOpen && isVisible && modalRef.current) {
      setTimeout(() => {
        if (modalRef.current) {
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

  if (!isOpen && !isVisible) {
    console.log('MypageModal early exit: both isOpen and isVisible are false');
    return null;
  }

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth <= 1025;
  const isDesktop = windowWidth > 1025;
  
  let modalWidth, modalHeight, modalMarginTop, modalBorderRadius;
  
  if (isMobile) {
    modalWidth = '100%';
    modalHeight = '100%';
    modalMarginTop = '0';
    modalBorderRadius = '0';
  } else if (isTablet) {
    modalWidth = '420px';
    modalHeight = '75vh';
    modalMarginTop = '48px';
    modalBorderRadius = '16px';
  } else {
    modalWidth = '360px';
    modalHeight = '65vh';
    modalMarginTop = '48px';
    modalBorderRadius = '16px';
  }
  
  return (
    <div className="mypage-modal-root" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0,
      bottom: 0, 
      pointerEvents: isOpen ? 'auto' : 'none', 
      zIndex: 100000,
      display: 'block',
    }}>
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={(e) => {
          if (isProtectionActive || !isOpen) {
            e.preventDefault();
            e.stopPropagation();
            console.log('배경 클릭 무시 (보호 기간 또는 닫는 중)');
            return;
          }
          handleClose(e);
        }}
      />
      
      <div 
        ref={modalRef}
        id="mypage-modal-panel"
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
          width: modalWidth,
          height: modalHeight,
          minWidth: isMobile ? '100%' : '350px',
          minHeight: isMobile ? '100%' : '500px',
          marginTop: modalMarginTop,
          borderTopLeftRadius: modalBorderRadius,
          borderBottomLeftRadius: modalBorderRadius,
          willChange: 'transform',
          transformOrigin: 'right center',
        }}
      >
        <Tabs
          defaultValue="home"
          className="h-full flex flex-col"
          onValueChange={(value) => setActiveTab(value as TabType)}
        >
          <div className="border-b border-white/5 flex-shrink-0">
            <div className="px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {t.mypage.tabs[activeTab]}
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
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

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="home" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <AccountSection 
                data={tabData as AccountData} 
                isLoading={isLoading}
                onClose={onClose}
              />
            </TabsContent>
            <TabsContent value="request" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <RequestSection 
                data={tabData as RequestData} 
                isLoading={isLoading}
                onClose={onClose}
              />
            </TabsContent>
            <TabsContent value="provide" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ProvideSection 
                data={tabData as ProvideData} 
                isLoading={isLoading}
                onClose={onClose}
              />
            </TabsContent>
            <TabsContent value="like" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <LikeSection 
                data={tabData as LikeData} 
                isLoading={isLoading}
                onClose={onClose}
              />
            </TabsContent>
          </div>

          <div className="border-t border-white/5 p-3 flex-shrink-0">
            <TabsList className="w-full h-10 bg-black/20 p-1 rounded-xl">
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
