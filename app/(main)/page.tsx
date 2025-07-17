'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { ImageGridHeader } from './_components/header/ImageGridHeader';
import ThiingsGrid, { type ItemConfig } from './_components/ThiingsGrid';
import ImageGridItem from './_components/ImageGridItem';
import FabMenu from './_components/footer/FabMenu';
import type { ImageItemData, ImageDetail } from './_types/image-grid';
import { useImageApi } from './_hooks/useImageApi';
import { useIsLike } from "@/backup/app/details/utils/hooks/isLike";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { ImageSidebar } from './_components/sidebar/ImageSidebar';
import { CELL_WIDTH, CELL_HEIGHT } from './_constants/image-grid';

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
    handleHoverImage,
    handleLeaveImage,
    setScrollingState,
  } = useImageApi();

  const gridRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageItemForModal, setSelectedImageItemForModal] =
    useState<ImageItemData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [likedStatusesMap, setLikedStatusesMap] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 선택된 이미지의 상세 데이터를 위한 상태 추가
  const [selectedImageDetail, setSelectedImageDetail] = useState<ImageDetail | null>(null);
  const [isSelectedImageLoading, setIsSelectedImageLoading] = useState(false);
  const [selectedImageError, setSelectedImageError] = useState<string | null>(null);

  // 선택된 이미지의 그리드 위치를 추적하는 상태 추가
  const [selectedImagePosition, setSelectedImagePosition] = useState<{ x: number; y: number } | null>(null);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(1);

  const { checkInitialLikeStatus, toggleLike: originalToggleLike } = useIsLike();
  const { isLogin, isInitialized } = useAuth();

  // 초기 이미지 로딩
  useEffect(() => {
    const loadInitialImages = async () => {
      if (apiImageCount === 0 && !isFetchingApiImagesRef.current) {
        await fetchAndCacheApiImages();
      }
      setIsLoading(false);
    };

    loadInitialImages();
  }, [fetchAndCacheApiImages, apiImageCount]);

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

  const handleImageClickForModal = async (
    imageItem: ImageItemData,
    imageDetailFromItem: ImageDetail | null
  ) => {
    console.log('handleImageClickForModal called:', imageItem);
    setSelectedImageItemForModal(imageItem);
    setIsSidebarOpen(true);
    setIsSelectedImageLoading(true);
    setSelectedImageError(null);
    setSelectedImageId(imageItem.id); // 그리드 위치 기반 ID로 선택 상태 관리
    
    // 클릭한 이미지의 그리드 위치 계산 및 저장
    const gridX = Math.floor(imageItem.x / CELL_WIDTH);
    const gridY = Math.floor(imageItem.y / CELL_HEIGHT);
    setSelectedImagePosition({ x: gridX, y: gridY });
    
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
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedImagePosition(null); // 선택된 이미지 위치도 초기화
    handleLeaveImage();
    
    // 줌 리셋
    if (gridRef.current) {
      gridRef.current.resetZoom();
    }
  };

  // 사이드바와 선택된 이미지 정보를 완전히 초기화하는 함수
  const handleResetSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedImageItemForModal(null);
    setSelectedImageDetail(null);
    setSelectedImageError(null);
    setSelectedImageId(null);
    setSelectedImagePosition(null); // 선택된 이미지 위치도 초기화
    handleLeaveImage();
    
    // 줌 리셋
    if (gridRef.current) {
      gridRef.current.resetZoom();
    }
  };

  const getHoveredItemId = () => {
    // 사이드바가 열려있을 때는 선택된 이미지의 그리드 위치 ID를 반환
    if (isSidebarOpen && selectedImageId) {
      return selectedImageId;
    }
    return null;
  };

  const handleImageClick = useCallback(
    (imageItem: ImageItemData, imageDetailFromItem: ImageDetail | null) => {
      console.log('handleImageClick called:', { imageItem, isSidebarOpen, selectedImageId });
      
      // 사이드바가 닫혀있으면 열고, 열려있으면 다른 이미지 클릭 시 해당 이미지로 변경
      if (!isSidebarOpen) {
        console.log('Opening sidebar...');
        handleImageClickForModal(imageItem, imageDetailFromItem);
      } else {
        // 사이드바가 이미 열려있고, 다른 이미지를 클릭한 경우
        if (selectedImageId !== imageItem.id) {
          console.log('Changing to different image...');
          // 새로운 이미지로 사이드바 내용 변경
          handleImageClickForModal(imageItem, imageDetailFromItem);
        } else {
          console.log('Closing sidebar...');
          // 같은 이미지를 다시 클릭한 경우 사이드바 닫기
          handleResetSidebar();
        }
      }
    },
    [isSidebarOpen, selectedImageId, handleImageClickForModal, handleResetSidebar]
  );

  // 이미지 로드 핸들러
  const handleImageLoaded = useCallback((imageId: string) => {
    // 이미지 로드 완료 처리
    console.log('Image loaded:', imageId);
  }, []);

  // ThiingsGrid용 렌더 아이템 함수 (극한 최적화)
  const renderGridItem = useCallback((config: ItemConfig) => {
    const apiImages = apiImageUrlListRef.current;
    
    if (!apiImages || apiImages.length === 0) {
      return (
        <div className="absolute inset-0 bg-black flex items-center justify-center border border-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#EAFD66] border-t-transparent"></div>
        </div>
      );
    }

    // gridIndex를 사용하여 API 이미지를 찾습니다
    const imageIndex = config.gridIndex % apiImages.length;
    const apiImage = apiImages[imageIndex];
    
    if (!apiImage) {
      return (
        <div className="absolute inset-0 bg-black flex items-center justify-center border border-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#EAFD66] border-t-transparent"></div>
        </div>
      );
    }

    // ImageItemData 형태로 변환
    const imageItem: ImageItemData = {
      id: `${apiImage.image_doc_id}_${config.position.x}_${config.position.y}`,
      row: config.position.y,
      col: config.position.x,
      src: apiImage.image_url,
      alt: `Image ${config.position.x},${config.position.y} (ID: ${apiImage.image_doc_id.slice(-6)})`,
      left: config.position.x * CELL_WIDTH,
      top: config.position.y * CELL_HEIGHT,
      x: config.position.x * CELL_WIDTH,
      y: config.position.y * CELL_HEIGHT,
      loaded: false,
      image_doc_id: apiImage.image_doc_id,
    };

    // 스크롤 중일 때는 최소한의 props만 전달
    if (config.isMoving) {
      return (
        <ImageGridItem
          key={imageItem.id}
          image={imageItem}
          config={config}
          hoveredItemId={null} // 스크롤 중에는 hover 비활성화
          hoveredImageDetailData={null}
          isFetchingDetail={false}
          detailError={null}
          onImageLoaded={() => {}} // 스크롤 중에는 비활성화
          onMouseEnterItem={() => {}} // 스크롤 중에는 비활성화
          onMouseLeaveItem={() => {}} // 스크롤 중에는 비활성화
          onToggleLike={() => {}} // 스크롤 중에는 비활성화
          isLiked={false} // 스크롤 중에는 비활성화
          onClick={() => {}} // 스크롤 중에는 비활성화
          isSelected={false} // 스크롤 중에는 선택 상태 비활성화
        />
      );
    }

    return (
      <ImageGridItem
        key={imageItem.id}
        image={imageItem}
        config={config}
        hoveredItemId={getHoveredItemId()}
        hoveredImageDetailData={selectedImageId === imageItem.id ? selectedImageDetail : hoveredImageDetailData}
        isFetchingDetail={selectedImageId === imageItem.id ? isSelectedImageLoading : isFetchingDetail}
        detailError={selectedImageId === imageItem.id ? selectedImageError : detailError}
        onImageLoaded={handleImageLoaded}
        onMouseEnterItem={handleHoverImage}
        onMouseLeaveItem={handleLeaveImage}
        onToggleLike={handleToggleLike}
        isLiked={likedStatusesMap[apiImage.image_doc_id] || false}
        onClick={handleImageClick}
        isSelected={selectedImageId === imageItem.id}
      />
    );
  }, [
    apiImageUrlListRef,
    getHoveredItemId,
    hoveredImageDetailData,
    isFetchingDetail,
    detailError,
    handleImageLoaded,
    handleHoverImage,
    handleLeaveImage,
    handleToggleLike,
    likedStatusesMap,
    handleImageClick,
    selectedImageId,
    selectedImageDetail,
    selectedImageError,
    isSelectedImageLoading,
  ]);

  // 스크롤 상태 감지 및 최적화
  const handleScrollStateChange = useCallback((isScrolling: boolean) => {
    setScrollingState(isScrolling);
  }, [setScrollingState]);

  // ESC 키로 사이드바 완전 초기화
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isSidebarOpen) {
          // 사이드바가 열려있을 때만 완전 초기화
          handleResetSidebar();
        } else {
          // 사이드바가 닫혀있을 때는 hover 상태만 초기화
          handleLeaveImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, handleResetSidebar, handleLeaveImage]);

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
          {/* 새로운 ThiingsGrid 컨테이너 */}
          <div
            className={`h-full relative bg-black transition-all duration-300 ${
              isSidebarOpen ? 'w-[65%]' : 'w-full'
            }`}
          >
            {/* 로딩 인디케이터 */}
            {isLoading && (
              <div className="absolute top-4 right-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                Loading images...
              </div>
            )}

            {/* 그리드 정보 디버그 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {apiImageCount} API images loaded | Zoom: {currentZoomLevel.toFixed(2)}
              </div>
            )}

            {/* ThiingsGrid 컴포넌트 */}
            <ThiingsGrid
              ref={gridRef}
              gridWidth={CELL_WIDTH}
              gridHeight={CELL_HEIGHT}
              renderItem={renderGridItem}
              className="w-full h-full"
              viewportMargin={800}
              onScrollStateChange={handleScrollStateChange}
              selectedImagePosition={selectedImagePosition}
              onImageCentered={() => {
                console.log('Image centered successfully');
              }}
              isSidebarOpen={isSidebarOpen}
              enableZoom={true}
              onZoomChange={setCurrentZoomLevel}
            />
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
              <button
                className="h-10 w-10 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-xl transition-all duration-300 group flex items-center justify-center"
                onClick={handleResetSidebar}
                title="완전 초기화"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <FabMenu />
      </div>
    </>
  );
};

export default MainPage;
