'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { ImageGridHeader } from './_components/header/ImageGridHeader';
import ThiingsGrid, { type ItemConfig } from './_components/ThiingsGrid';
import ImageGridItem from './_components/ImageGridItem';
import FabMenu from './_components/footer/FabMenu';
import type { ImageItemData, ImageDetail } from './_types/image-grid';
import { useImageApi } from './_hooks/useImageApi';
import { useIsLike } from "@/app/details/utils/hooks/isLike";
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
    if (isSidebarOpen) {
      return;
    }
    
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
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedImageItemForModal(null);
    setSelectedImageDetail(null);
    setSelectedImageError(null);
    setSelectedImageId(null);
  };

  const getHoveredItemId = () => {
    if (isSidebarOpen && selectedImageId) {
      return selectedImageId;
    }
    return null;
  };

  const handleImageClick = useCallback(
    (imageItem: ImageItemData, imageDetailFromItem: ImageDetail | null) => {
      if (isSidebarOpen) {
        return;
      }
      handleImageClickForModal(imageItem, imageDetailFromItem);
    },
    [isSidebarOpen, handleImageClickForModal]
  );

  // 이미지 로드 핸들러
  const handleImageLoaded = useCallback((imageId: string) => {
    // 이미지 로드 완료 처리
    console.log('Image loaded:', imageId);
  }, []);

  // ThiingsGrid용 렌더 아이템 함수
  const renderGridItem = useCallback((config: ItemConfig) => {
    const apiImages = apiImageUrlListRef.current;
    
    if (!apiImages || apiImages.length === 0) {
      return (
        <div className="absolute inset-1 rounded-lg bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      );
    }

    // gridIndex를 사용하여 API 이미지를 찾습니다
    const imageIndex = config.gridIndex % apiImages.length;
    const apiImage = apiImages[imageIndex];
    
    if (!apiImage) {
      return (
        <div className="absolute inset-1 rounded-lg bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-sm">No Image</div>
        </div>
      );
    }

    // ImageItemData 형태로 변환
    const imageItem: ImageItemData = {
      id: `${config.position.x}_${config.position.y}`,
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

    return (
      <ImageGridItem
        image={imageItem}
        config={config}
        hoveredItemId={getHoveredItemId()}
        hoveredImageDetailData={hoveredImageDetailData}
        isFetchingDetail={isFetchingDetail}
        detailError={detailError}
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
  ]);

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
                {apiImageCount} API images loaded
              </div>
            )}

            {/* ThiingsGrid 컴포넌트 */}
            <ThiingsGrid
              ref={gridRef}
              gridWidth={CELL_WIDTH}
              gridHeight={CELL_HEIGHT}
              renderItem={renderGridItem}
              className="w-full h-full"
              initialPosition={{ x: 0, y: 0 }}
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
                className="h-10 w-10 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 shadow-xl transition-all duration-300 group flex items-center justify-center"
                onClick={handleCloseSidebar}
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <button
                className="h-10 w-10 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 shadow-xl transition-all duration-300 group flex items-center justify-center"
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
