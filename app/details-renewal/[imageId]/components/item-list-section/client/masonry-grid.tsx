'use client';

import * as React from 'react';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import Image from 'next/image';
import { 
  DummyItem, 
  fetchDummyItems, 
  getYouTubeThumbnail
} from '../server/data/dummy-data';
import { useEffect, useRef, useState } from 'react';
import throttle from 'lodash/throttle';  // lodash는 많은 프로젝트에서 이미 사용 중

// 타입 정의
interface GridItem extends DummyItem {
  key: number;
  groupKey: number;
}

// 재생 버튼 컴포넌트 - 비디오 타입에 따라 다른 디자인 적용
const PlayButton = ({ type }: { type: string }) => {
  // Shorts와 비디오에 따라 다른 아이콘 및 스타일 적용
  const isShorts = type === 'shorts';
  
  return (
    <div className="group relative flex items-center justify-center">
      {/* 배경 블러 효과 */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* 버튼 배경 */} 
      <div className={`
        relative w-14 h-14 rounded-full 
        ${isShorts ? 'bg-red-500' : 'bg-white/90'} 
        flex items-center justify-center 
        shadow-lg transform transition-all duration-300
        group-hover:scale-110 group-hover:shadow-xl
      `}>
        {isShorts ? (
          // Shorts 타입 아이콘
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
            <path d="M9.5 8.5L16.5 12L9.5 15.5V8.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          // 일반 비디오 아이콘
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black ml-1">
            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
          </svg>
        )}
      </div>
      
      {/* 비디오 타입 표시 */}
      <div className={`
        absolute -bottom-8 bg-black/70 text-white text-xs py-1 px-2 rounded-full
        opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 
        group-hover:translate-y-0 pointer-events-none
      `}>
        {isShorts ? 'Shorts' : 'Video'}
      </div>
    </div>
  );
};

// YouTube API 로드를 위한 컴포넌트
const YouTubeAPILoader = ({ children }: { children: React.ReactNode }) => {
  const [isAPILoaded, setIsAPILoaded] = React.useState(false);
  
  React.useEffect(() => {
    // 이미 API가 로드되었는지 확인
    if (window.YT) {
      setIsAPILoaded(true);
      return;
    }
    
    // 로드 중인지 확인
    if (document.getElementById('youtube-api')) {
      const checkYT = setInterval(() => {
        if (window.YT) {
          clearInterval(checkYT);
          setIsAPILoaded(true);
        }
      }, 100);
      return;
    }
    
    // API 로드
    const tag = document.createElement('script');
    tag.id = 'youtube-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    
    // API 로드 완료 체크
    window.onYouTubeIframeAPIReady = () => {
      setIsAPILoaded(true);
    };
  }, []);
  
  return <>{children}</>;
};

// 완전히 독립적인 YouTube Player 컴포넌트
const StandaloneYouTubePlayer = ({ videoId, onReady }: { 
  videoId: string; 
  onReady?: () => void; 
}) => {
  const playerRef = React.useRef<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isPlayerReady, setIsPlayerReady] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  
  // 플레이어 초기화 함수
  const initializePlayer = React.useCallback(() => {
    if (!window.YT || !window.YT.Player || !containerRef.current) return;
    
    // 플레이어가 이미 존재한다면 제거
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.error("Error destroying player:", e);
      }
      playerRef.current = null;
    }
    
    try {
      const newPlayer = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          loop: 1,
          playlist: videoId,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            playerRef.current = event.target;
            setIsPlayerReady(true);
            if (onReady) onReady();
          },
          onError: (error: any) => {
            console.error("YouTube Player Error:", error);
          },
          onStateChange: (event: any) => {
            // 재생 상태 변경 시 필요한 처리
            if (event.data === window.YT.PlayerState.PLAYING) {
              // 재생 중
            }
          }
        }
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
    }
  }, [videoId, onReady]);
  
  // 플레이어 초기화
  React.useEffect(() => {
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      // YouTube API가 로드되면 플레이어 초기화
      const checkYouTubeAPI = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYouTubeAPI);
          initializePlayer();
        }
      }, 100);
      
      return () => clearInterval(checkYouTubeAPI);
    }
    
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player on unmount:", e);
        }
        playerRef.current = null;
      }
    };
  }, [initializePlayer]);
  
  // 음소거 토글 함수 - 플레이어 내부에서만 작동
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!playerRef.current) return;
    
    try {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(70);
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };
  
  return (
    <div className="w-full h-full relative bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {isPlayerReady && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors duration-200"
        >
          {isMuted ? (
            // 음소거 아이콘
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" />
              <path d="M23 9L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M17 9L23 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            // 소리 켜짐 아이콘
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" />
              <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.07 5.93C20.9447 7.80528 21.9979 10.3447 21.9979 13C21.9979 15.6553 20.9447 18.1947 19.07 20.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export const MasonryGrid = () => {
  const [items, setItems] = React.useState<GridItem[]>([]);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);  // 더 불러올 데이터가 있는지 여부
  const currentPage = useRef(0);
  const loadingRef = useRef(false);  // 실제 로딩 상태를 ref로 관리
  const containerRef = React.useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 20;

  // 화면 크기에 따른 아이템 너비 결정
  const getItemWidth = () => {
    return containerWidth < 640 ? 180 : 
           containerWidth < 1024 ? 220 : 
           containerWidth < 1440 ? 260 : 
           containerWidth < 1920 ? 240 :
           220; // 아주 큰 화면에서는 오히려 더 작게
  };

  // 컬럼 사이즈 결정
  const getColumnSize = () => {
    return containerWidth < 640 ? 3 : 
           containerWidth < 1024 ? 4 : 
           containerWidth < 1440 ? 5 : 
           containerWidth < 1920 ? 5 :
           6;
  };

  // 컨테이너 너비 업데이트 함수
  const updateContainerWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  };

  // throttle 적용된 로딩 함수
  const throttledLoadMore = useRef(
    throttle((groupKey) => {
      if (loadingRef.current || !hasMore) return;
      
      console.log("Loading more content, groupKey:", groupKey);
      loadingRef.current = true;
      setIsLoading(true);
      
      // API 호출이나 데이터 로드 로직
      setTimeout(() => {
        const nextGroupKey = groupKey + 1;
        currentPage.current = nextGroupKey;
        
        // 실제 API에서 새 데이터 가져오기
        const newItems = fetchDummyItems(nextGroupKey, PAGE_SIZE);
        
        // 더 불러올 데이터가 없는 경우 체크
        if (newItems.length === 0) {
          setHasMore(false);
        }
        
        setItems(prev => [...prev, ...newItems]);
        setIsLoading(false);
        loadingRef.current = false;
      }, 600);
    }, 800)  // 800ms 쓰로틀링 - 너무 자주 호출되는 것 방지
  ).current;

  // 초기 데이터 로드
  const loadInitialItems = () => {
    const initialItems = fetchDummyItems(0, PAGE_SIZE);
    setItems(initialItems);
    currentPage.current = 1; // 첫 페이지 로드 완료
  };

  // 초기 설정 및 리사이즈 이벤트 리스너
  React.useEffect(() => {
    updateContainerWidth();
    loadInitialItems();
    
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  // 화면 크기 변경 시 그리드 재계산을 위한 효과
  React.useEffect(() => {
    if (containerWidth > 0) {
      // 열 너비가 변경되면 강제 리렌더링
      const timeout = setTimeout(() => {
        setItems(prev => [...prev]);
      }, 200);
      
      return () => clearTimeout(timeout);
    }
  }, [containerWidth]);

  // 아이템 컴포넌트
  const Item = ({ type, imageUrl, videoId, title, num, groupKey }: { 
    type: string; 
    imageUrl: string;
    videoId?: string;
    title?: string;
    num: number;
    groupKey: number;
  }) => {
    // 비디오 관련 상태
    const [isHovering, setIsHovering] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isPlayerReady, setIsPlayerReady] = React.useState(false);
    const hoverTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    
    // 마우스 이벤트 핸들러
    const handleMouseEnter = () => {
      if (type === 'video' || type === 'shorts') {
        hoverTimerRef.current = setTimeout(() => {
          setIsHovering(true);
          // 호버 0.5초 후 재생 시작
          setTimeout(() => {
            setIsPlaying(true);
          }, 500);
        }, 500); // 0.5초 호버 후 썸네일 표시
      }
    };
    
    const handleMouseLeave = () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      setIsHovering(false);
      setIsPlaying(false);
    };
    
    // 비디오 클릭 핸들러
    const handleVideoClick = () => {
      if (videoId && (type === 'video' || type === 'shorts')) {
        const url = type === 'shorts' 
          ? `https://youtube.com/shorts/${videoId}`
          : `https://www.youtube.com/watch?v=${videoId}`;
        window.open(url, '_blank');
      }
    };
    
    // 플레이어 준비 완료 핸들러
    const handlePlayerReady = () => {
      setIsPlayerReady(true);
    };
    
    // 아이템 타입에 따른 비율 설정
    const aspectRatio = 
      type === 'portrait' ? '4/5' :
      type === 'video' ? '16/9' :
      type === 'shorts' ? '9/16' : '1/1';
    
    const itemWidth = getItemWidth();
    
    return (
      <div
        className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{
          width: `${itemWidth}px`,
          aspectRatio,
          borderRadius: '4px',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-grid-groupkey={groupKey}
      >
        <div 
          className={`relative w-full h-full ${(type === 'video' || type === 'shorts') ? 'cursor-pointer group' : ''}`}
          onClick={(type === 'video' || type === 'shorts') ? handleVideoClick : undefined}
        >
          {/* 비디오/쇼츠 타입이고 비디오 ID가 있는 경우 YouTube 썸네일 사용 */}
          {(type === 'video' || type === 'shorts') && videoId ? (
            <>
              {/* 재생 중이 아닐 때 썸네일 표시 */}
              {!isPlaying && (
                <Image
                  src={getYouTubeThumbnail(videoId, 'hq')}
                  alt={title || `${type} ${num}`}
                  className="w-full h-full object-cover"
                  unoptimized
                  width={itemWidth}
                  height={type === 'video' ? itemWidth * 9/16 : itemWidth * 16/9}
                />
              )}
              
              {/* 호버 중이고 재생 중일 때 YouTube 플레이어 표시 */}
              {isHovering && isPlaying && (
                <div className="absolute inset-0 bg-black">
                  <YouTubeAPILoader>
                    <StandaloneYouTubePlayer 
                      videoId={videoId} 
                      onReady={handlePlayerReady}
                    />
                  </YouTubeAPILoader>
                  
                  {/* 로딩 중일 때 표시 */}
                  {!isPlayerReady && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 호버 중이고 재생 대기 중일 때 로딩 표시 */}
              {isHovering && !isPlaying && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* 비디오 타입의 경우 재생 아이콘 표시 (호버 중이 아닐 때만) */}
              {!isHovering && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayButton type={type} />
                </div>
              )}
            </>
          ) : (
            /* 일반 이미지 아이템 */
            <Image
              src={imageUrl}
              alt={title || `Item ${num}`}
              className="w-full h-full object-cover"
              unoptimized
              width={itemWidth}
              height={itemWidth}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full">
      <MasonryInfiniteGrid
        className="w-full"
        style={{ width: '100%', margin: '0 auto' }}
        gap={12}
        column={getColumnSize()}
        useRecycle={false}
        scrollContainer="window"  // 문자열로 window 지정
        threshold={1000}  // 스크롤 끝에서 1000px 전에 로드 시작
        onRequestAppend={(e) => {
          console.log("onRequestAppend 호출됨", e);
          const nextGroupKey = (+e.groupKey! || 0) + 1;
          
          // 이미 로딩 중이면 무시
          if (loadingRef.current || !hasMore) {
            return;
          }
          
          e.wait();
          loadingRef.current = true;
          setIsLoading(true);
          
          // 타임아웃 안에서 데이터 로드 후 ready 호출
          setTimeout(() => {
            const newItems = fetchDummyItems(nextGroupKey, PAGE_SIZE);
            
            if (newItems.length === 0) {
              setHasMore(false);
            }
            
            setItems(prev => [...prev, ...newItems]);
            currentPage.current = nextGroupKey;
            setIsLoading(false);
            loadingRef.current = false;
            e.ready();
          }, 800);
        }}
      >
        {items.map((item, index) => (
          <Item
            key={`${item.groupKey}-${item.key}-${index}`}
            num={item.key}
            type={item.type}
            imageUrl={item.imageUrl}
            videoId={item.videoId}
            title={item.title}
            groupKey={item.groupKey}
          />
        ))}
      </MasonryInfiniteGrid>
      
      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>콘텐츠 불러오는 중...</span>
        </div>
      )}
      
      {/* 더 불러올 데이터가 없을 때 표시 */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          모든 콘텐츠를 불러왔습니다
        </div>
      )}
    </div>
  );
};

// TypeScript용 글로벌 선언
declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
} 