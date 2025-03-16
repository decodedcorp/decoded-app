'use client';

import { useState, useEffect, useRef } from 'react';
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
  
  const { 
    data: tabData,
    isLoading,
    error 
  } = useMyPageQuery(activeTab, isOpen);

  // 모달 열림/닫힘 상태 처리
  useEffect(() => {
    if (isOpen) {
      // 모달 열릴 때 바로 보이게 설정
      setIsVisible(true);
      // Add body style to prevent scrolling when modal is open
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    } else {
      // 닫힐 때는 애니메이션 후 상태 변경
      const timer = setTimeout(() => {
        setActiveTab('home');
        setIsVisible(false);
        // Restore scrolling when modal is closed
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 화면 크기 변경 감지 - 컴포넌트 마운트 시 즉시 실행
  useEffect(() => {
    // 초기값 설정
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      
      // 초기 렌더링 후 강제 리플로우 유도
      if (isOpen && modalRef.current) {
        const forceReflow = modalRef.current.offsetHeight;
      }
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Using useEffect to log when component renders for debugging
  useEffect(() => {
    console.log('MypageModal rendered, isOpen:', isOpen, 'isVisible:', isVisible, 'windowWidth:', windowWidth);
    
    // 모달이 열릴 때 강제로 DOM 업데이트 유도
    if (isOpen && modalRef.current) {
      const forceReflow = modalRef.current.offsetHeight;
      
      // 화면 크기가 작을 때 추가 재렌더링 유도
      if (windowWidth < 1025) {
        setTimeout(() => {
          if (modalRef.current) {
            // 강제 스타일 업데이트
            modalRef.current.style.opacity = '0.99';
            setTimeout(() => {
              if (modalRef.current) {
                modalRef.current.style.opacity = '1';
              }
            }, 10);
          }
        }, 10);
      }
    }
  }, [isOpen, isVisible, windowWidth]);

  // Exit early if modal is completely closed
  if (!isOpen && !isVisible) {
    return null;
  }

  // 화면 크기에 따른 스타일 결정
  const isMobile = windowWidth < 768; // 모바일 기준을 768px 미만으로 조정
  const isTablet = windowWidth >= 768 && windowWidth <= 1025; // 태블릿 중간 크기 범위 추가
  const isDesktop = windowWidth > 1025;
  
  // 모달 너비/높이 직접 계산 - 세 가지 크기로 세분화
  let modalWidth, modalHeight, modalMarginTop, modalBorderRadius;
  
  if (isMobile) {
    // 모바일: 전체 화면
    modalWidth = '100%';
    modalHeight = '100%';
    modalMarginTop = '0';
    modalBorderRadius = '0';
  } else if (isTablet) {
    // 태블릿: 중간 크기 (오른쪽 위치)
    modalWidth = '420px';
    modalHeight = '75vh';
    modalMarginTop = '48px';
    modalBorderRadius = '16px';
  } else {
    // 데스크톱: 작은 사이드 패널
    modalWidth = '360px';
    modalHeight = '65vh';
    modalMarginTop = '48px';
    modalBorderRadius = '16px';
  }
  
  return (
    // 전체 모달 컨테이너 - 반드시 표시
    <div className="mypage-modal-root" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0,
      bottom: 0, 
      pointerEvents: isOpen ? 'auto' : 'none', 
      zIndex: 100000, // zIndex 증가
      display: 'block', // 항상 표시
    }}>
      {/* Backdrop overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />
      
      {/* Modal panel */}
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
          zIndex: 100001, // 배경보다 높은 zIndex
          width: modalWidth,
          height: modalHeight,
          minWidth: isMobile ? '100%' : '350px',
          minHeight: isMobile ? '100%' : '500px',
          marginTop: modalMarginTop,
          borderTopLeftRadius: modalBorderRadius,
          borderBottomLeftRadius: modalBorderRadius,
          willChange: 'transform', // 성능 최적화
          transformOrigin: 'right center', // 오른쪽에서 변환 시작
        }}
      >
        <Tabs
          defaultValue="home"
          className="h-full flex flex-col"
          onValueChange={(value) => setActiveTab(value as TabType)}
        >
          {/* 헤더 영역 */}
          <div className="border-b border-white/5 flex-shrink-0">
            <div className="px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {t.mypage.tabs[activeTab]}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-white/5 transition-colors"
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

          {/* 하단 탭 네비게이션 */}
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
