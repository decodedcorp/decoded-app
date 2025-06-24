'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

  const imageGridParams = {
    apiImageUrlListRef,
    currentApiImageIndexRef,
    allApiImagesFetchedRef,
    isFetchingApiImagesRef,
    apiImageCount,
    fetchAndCacheApiImages,
  };

  const {
    images,
    visibleImages,
    contentOffset,
    setContentOffset,
    onImageLoaded,
    isLoading,
  } = useImageGrid(imageGridParams);

  // 스크롤 컨테이너 ref 추가
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageItemForModal, setSelectedImageItemForModal] =
    useState<ImageItemData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [likedStatusesMap, setLikedStatusesMap] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // useGridInteraction 훅 추가
  const {
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    hoveredItemId,
    handleMouseEnterItem,
    handleMouseLeaveItem,
    isAnimating,
  } = useGridInteraction({
    scrollContainerRef,
    contentOffset,
    setContentOffset,
    fetchImageDetail: handleHoverImage,
    setScrollingState,
    isSidebarOpen,
  });

  const { checkInitialLikeStatus, toggleLike: originalToggleLike } = useIsLike();
  const { isLogin, isInitialized } = useAuth();

  // 선택된 이미지의 상세 데이터를 위한 상태 추가
  const [selectedImageDetail, setSelectedImageDetail] = useState<ImageDetail | null>(null);
  const [isSelectedImageLoading, setIsSelectedImageLoading] = useState(false);
  const [selectedImageError, setSelectedImageError] = useState<string | null>(null);

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
    onImageLoaded(imageId);
  }, [onImageLoaded]);

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
          {/* 기존 그리드 컨테이너로 복원 */}
          <div
            ref={scrollContainerRef}
            className={`h-full relative bg-black transition-all duration-300 ${
              isSidebarOpen ? 'w-[65%]' : 'w-full'
            }`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isAnimating ? 'grabbing' : 'grab' }}
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
                {images.length} images | {visibleImages.length} visible
              </div>
            )}

            {/* 기존 이미지 렌더링으로 복원 */}
            <div
              className="absolute origin-center"
              style={{
                willChange: 'transform',
                transform: `translate3d(${contentOffset.x}px, ${contentOffset.y}px, 0)`,
                backfaceVisibility: 'hidden',
                perspective: '1000px',
              }}
            >
              {visibleImages.map((image) => (
                <ImageItem
                  key={image.id}
                  image={image}
                  gridConfig={{
                    cellWidth: 300,
                    cellHeight: 300,
                    gap: 10
                  }}
                  hoveredItemId={getHoveredItemId()}
                  hoveredImageDetailData={hoveredImageDetailData}
                  isFetchingDetail={isFetchingDetail}
                  detailError={detailError}
                  onImageLoaded={handleImageLoaded}
                  onMouseEnterItem={handleMouseEnterItem}
                  onMouseLeaveItem={handleMouseLeaveItem}
                  onToggleLike={handleToggleLike}
                  isLiked={likedStatusesMap[image.image_doc_id] || false}
                  onClick={handleImageClick}
                  isSelected={selectedImageId === image.id}
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
