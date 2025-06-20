'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { ImageGridHeader } from './_components/header/ImageGridHeader';
import ImageItem from './_components/ImageItem';
import FabMenu from './_components/footer/FabMenu';
import type { ImageItemData, ImageDetail } from './_types/image-grid';
import { useImageApi } from './_hooks/useImageApi';
import { useImageGrid } from './_hooks/useImageGrid';
import { useGridInteraction } from './_hooks/useGridInteraction';
import { useIsLike } from "@/app/details/utils/hooks/isLike";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { ImageSidebar } from './_components/sidebar/ImageSidebar';
import { ScrollRemote } from './_components/ScrollRemote';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const MainPage = () => {
  const {
    apiImageUrlListRef,
    currentApiImageIndexRef,
    isFetchingApiImagesRef,
    apiImageCount,
    allApiImagesFetchedRef,
    fetchAndCacheApiImages,
    fetchImageDetail,
    hoveredImageDetailData,
    isFetchingDetail,
    detailError,
  } = useImageApi();

  const imageGridParams = {
    apiImageUrlListRef,
    currentApiImageIndexRef,
    allApiImagesFetchedRef,
    isFetchingApiImagesRef,
    apiImageCount,
    fetchAndCacheApiImages,
  };

  const {
    scrollContainerRef,
    images,
    contentOffset,
    setContentOffset,
    onImageLoaded,
  } = useImageGrid(imageGridParams);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageItemForModal, setSelectedImageItemForModal] =
    useState<ImageItemData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [likedStatusesMap, setLikedStatusesMap] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [focusedImageId, setFocusedImageId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // 줌 관련 상태 추가
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<{ x: number; y: number } | null>(null);
  const [originalContentOffset, setOriginalContentOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 중복 방지

  const {
    handleMouseDown,
    hoveredItemId,
    handleMouseEnterItem,
    handleMouseLeaveItem,
  } = useGridInteraction({
    scrollContainerRef,
    contentOffset,
    setContentOffset,
    fetchImageDetail,
  });

  const { checkInitialLikeStatus, toggleLike: originalToggleLike } = useIsLike();
  const { isLogin, isInitialized } = useAuth();

  // 선택된 이미지의 상세 데이터를 위한 상태 추가
  const [selectedImageDetail, setSelectedImageDetail] = useState<ImageDetail | null>(null);
  const [isSelectedImageLoading, setIsSelectedImageLoading] = useState(false);
  const [selectedImageError, setSelectedImageError] = useState<string | null>(null);

  // 줌 상태 변경 시 처리
  useEffect(() => {
    if (!isZooming && zoomLevel === 1) {
      // 줌이 완전히 리셋되었을 때 추가 정리 작업
      setZoomTarget(null);
    }
  }, [isZooming, zoomLevel]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      const storedUserId = window.sessionStorage.getItem("USER_DOC_ID");
      setUserId(storedUserId);
    }
  }, [isInitialized, isLogin]);

  useEffect(() => {
    if (userId && hoveredImageDetailData?.doc_id && likedStatusesMap[hoveredImageDetailData.doc_id] === undefined) {
      const fetchLikeStatusForHovered = async () => {
        const isLiked = await checkInitialLikeStatus('image', hoveredImageDetailData.doc_id, userId);
        setLikedStatusesMap(prevMap => ({
          ...prevMap,
          [hoveredImageDetailData.doc_id]: isLiked,
        }));
      };
      fetchLikeStatusForHovered();
    }
  }, [userId, hoveredImageDetailData, checkInitialLikeStatus]);

  const handleToggleLike = async (imageDocId: string) => {
    if (!userId) {
      console.warn("User not logged in, cannot toggle like.");
      return;
    }
    const currentStatus = likedStatusesMap[imageDocId] || false;
    const newStatus = !currentStatus;
    const success = await originalToggleLike('image', imageDocId, userId, currentStatus);
    if (success) {
      setLikedStatusesMap(prevMap => ({
        ...prevMap,
        [imageDocId]: newStatus,
      }));
    }
  };

  // 줌 애니메이션 함수
  const animateZoom = (targetZoom: number, targetX: number, targetY: number, duration: number = 800) => {
    if (isAnimating) {
      console.log('Animation already in progress, skipping...');
      return;
    }
    
    setIsAnimating(true);
    setIsZooming(true);
    const startZoom = zoomLevel;
    const startX = contentOffset.x;
    const startY = contentOffset.y;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 더 부드러운 이징 함수 (ease-out-quint)
      const easedProgress = 1 - Math.pow(1 - progress, 5);
      
      const newZoom = startZoom + (targetZoom - startZoom) * easedProgress;
      const newX = startX + (targetX - startX) * easedProgress;
      const newY = startY + (targetY - startY) * easedProgress;
      
      setZoomLevel(newZoom);
      setContentOffset({ x: newX, y: newY });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsZooming(false);
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // 줌 리셋 함수
  const resetZoom = () => {
    const targetZoom = 1;
    const targetX = originalContentOffset.x;
    const targetY = originalContentOffset.y;
    
    animateZoom(targetZoom, targetX, targetY, 800);
  };

  const handleImageClickForModal = async (
    imageItem: ImageItemData,
    imageDetailFromItem: ImageDetail | null
  ) => {
    // 애니메이션 중이거나 이미 사이드바가 열려있으면 무시
    if (isAnimating || isSidebarOpen) {
      console.log('Animation in progress or sidebar already open, ignoring click');
      return;
    }
    
    console.log('=== Image Click Debug ===');
    console.log('Clicked Image:', imageItem);
    console.log('Current contentOffset:', contentOffset);
    
    // 현재 상태를 원본으로 저장
    setOriginalContentOffset(contentOffset);
    
    setSelectedImageItemForModal(imageItem);
    setIsSidebarOpen(true);
    setIsSelectedImageLoading(true);
    setSelectedImageError(null);
    setSelectedImageId(imageItem.id);
    
    if (imageItem.image_doc_id) {
      try {
        const detail = await fetchImageDetail(imageItem.image_doc_id);
        setSelectedImageDetail(detail);
      } catch (error) {
        setSelectedImageError(error instanceof Error ? error.message : 'Failed to load image details');
      } finally {
        setIsSelectedImageLoading(false);
      }
    }
    
    // 화면 크기 계산
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const sidebarWidth = screenWidth * 0.3;
    const mainContentWidth = screenWidth - sidebarWidth;
    
    // 이미지 요소 가져오기
    const imageElement = document.querySelector(`[data-image-id="${imageItem.id}"]`) as HTMLElement;
    if (!imageElement) {
      console.error('Image element not found');
      return;
    }
    
    const imageRect = imageElement.getBoundingClientRect();
    console.log('Image rect:', imageRect);
    
    // 이미지의 현재 위치 계산
    const imageWidth = imageRect.width;
    const imageHeight = imageRect.height;
    const imageCenterX = imageRect.left + (imageWidth / 2);
    const imageCenterY = imageRect.top + (imageHeight / 2);
    
    console.log('Image position:', {
      imageWidth,
      imageHeight,
      imageCenterX,
      imageCenterY,
      imageRect
    });
    
    // 목표 위치 계산 (화면 중앙)
    const targetCenterX = mainContentWidth / 2;
    const targetCenterY = screenHeight / 2;
    
    console.log('Target position:', {
      targetCenterX,
      targetCenterY
    });
    
    // 이동해야 할 거리 계산
    const moveDistanceX = (targetCenterX - imageCenterX) * 1.2;
    const moveDistanceY = (targetCenterY - imageCenterY) * 1.2;
    
    console.log('Move distances:', {
      moveDistanceX,
      moveDistanceY
    });
    
    // 줌과 이동을 동시에 애니메이션
    const targetZoom = 1.2; // 약간의 줌 효과
    const targetX = contentOffset.x + moveDistanceX;
    const targetY = contentOffset.y + moveDistanceY;
    
    animateZoom(targetZoom, targetX, targetY, 1000);
  };

  const handleCloseSidebar = () => {
    // 애니메이션 중이면 무시
    if (isAnimating) {
      console.log('Animation in progress, ignoring close request');
      return;
    }
    
    setIsSidebarOpen(false);
    setSelectedImageItemForModal(null);
    setSelectedImageDetail(null);
    setSelectedImageError(null);
    setSelectedImageId(null);
    
    // 사이드바가 닫힐 때 줌도 리셋
    resetZoom();
  };

  const handleRemoteScroll = (direction: 'left' | 'right' | 'up' | 'down', customStep?: number) => {
    const scrollStep = customStep || 100; // 커스텀 스텝이 있으면 사용, 없으면 기본값
    const duration = 300;
    const startTime = performance.now();
    const startOffset = contentOffset;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuad 이징 함수 적용
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      
      const newOffset = { ...startOffset };
      switch (direction) {
        case 'left':
          newOffset.x = startOffset.x + (scrollStep * easedProgress);
          break;
        case 'right':
          newOffset.x = startOffset.x - (scrollStep * easedProgress);
          break;
        case 'up':
          newOffset.y = startOffset.y + (scrollStep * easedProgress);
          break;
        case 'down':
          newOffset.y = startOffset.y - (scrollStep * easedProgress);
          break;
      }
      
      setContentOffset(newOffset);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // hover 상태를 결정하는 함수
  const getHoveredItemId = () => {
    if (isSidebarOpen && selectedImageId) {
      return selectedImageId;
    }
    return hoveredItemId;
  };

  // 즉시 실행되는 클릭 핸들러 (중복 방지만)
  const handleImageClick = useCallback(
    (imageItem: ImageItemData, imageDetailFromItem: ImageDetail | null) => {
      if (isAnimating || isSidebarOpen) {
        console.log('Animation in progress or sidebar already open, ignoring click');
        return;
      }
      
      // 즉시 실행
      handleImageClickForModal(imageItem, imageDetailFromItem);
    },
    [isAnimating, isSidebarOpen, handleImageClickForModal]
  );

  return (
    <>
      <Head>
        <title>Infinite Omnidirectional Scroll Grid - decoded</title>
        <meta
          name="description"
          content="Infinite omnidirectional scroll grid with API images"
        />
      </Head>
      <ImageGridHeader isSidebarOpen={isSidebarOpen} />
      <div className="w-full h-screen m-0 overflow-hidden flex flex-col font-sans bg-black relative">
        <div className="flex w-full h-full relative">
          {/* 그리드 컨테이너 */}
          <div
            ref={scrollContainerRef}
            className={`h-full overflow-auto relative cursor-grab bg-black transition-all duration-300 ${
              isSidebarOpen ? 'w-[65%]' : 'w-full'
            }`}
            onMouseDown={handleMouseDown}
          >
            <div
              className="absolute origin-center"
              style={{
                willChange: 'transform',
                transform: `translate(${contentOffset.x}px, ${contentOffset.y}px) scale(${zoomLevel})`,
                transition: isZooming ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {images.map((image) => (
                <ImageItem
                  key={image.id}
                  image={image}
                  hoveredItemId={getHoveredItemId()}
                  hoveredImageDetailData={hoveredImageDetailData}
                  isFetchingDetail={isFetchingDetail}
                  detailError={detailError}
                  onImageLoaded={onImageLoaded}
                  onMouseEnterItem={handleMouseEnterItem}
                  onMouseLeaveItem={handleMouseLeaveItem}
                  onToggleLike={handleToggleLike}
                  isLiked={likedStatusesMap[image.image_doc_id] || false}
                  onClick={handleImageClick}
                />
              ))}
            </div>
          </div>

          {/* 사이드바 */}
          <div
            className={`h-full bg-white transition-all duration-300 overflow-hidden absolute right-0 ${
              isSidebarOpen ? 'w-[35%]' : 'w-0'
            }`}
          >
            <ImageSidebar
              isOpen={isSidebarOpen}
              onClose={handleCloseSidebar}
              imageDetail={selectedImageDetail}
              isFetchingDetail={isSelectedImageLoading}
              detailError={selectedImageError}
            />
          </div>

          {/* 사이드바 외부 버튼들 */}
          {isSidebarOpen && (
            <div 
              className="absolute right-[37%] bottom-8 flex flex-col gap-4 transition-all duration-300 ease-in-out"
              style={{
                opacity: isSidebarOpen ? 1 : 0,
                transform: `translateX(${isSidebarOpen ? '0' : '20px'})`
              }}
            >
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 shadow-xl transition-all duration-300 group"
                onClick={handleCloseSidebar}
              >
                <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 shadow-xl transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 transition-all duration-300 group-hover:scale-110"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                  />
                </svg>
              </Button>
            </div>
          )}
        </div>
        <FabMenu />
        {/* <ScrollRemote onScroll={handleRemoteScroll} /> */}
      </div>
    </>
  );
};

export default MainPage;
