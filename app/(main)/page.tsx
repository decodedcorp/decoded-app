'use client';

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { ImageGridHeader } from './_components/ImageGridHeader';
import ImageItem from './_components/ImageItem';
import FabMenu from './_components/FabMenu';
import type { ImageItemData, ImageDetail } from './_types/image-grid';
import { useImageApi } from './_hooks/useImageApi';
import { useImageGrid } from './_hooks/useImageGrid';
import { useGridInteraction } from './_hooks/useGridInteraction';
import { useIsLike } from "@/app/details/utils/hooks/isLike";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";

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

  const handleImageClickForModal = (
    imageItem: ImageItemData,
    imageDetailFromItem: ImageDetail | null
  ) => {
    console.log('[page.tsx] handleImageClickForModal called with:', {
      imageItem,
      imageDetailFromItem,
    });
    setSelectedImageItemForModal(imageItem);
    if (imageItem.image_doc_id) {
      console.log(
        '[page.tsx] Fetching details for doc_id:',
        imageItem.image_doc_id
      );
      fetchImageDetail(imageItem.image_doc_id);
    }
    setIsModalOpen(true);
    console.log('[page.tsx] isModalOpen set to true');
  };

  const handleCloseModal = () => {
    console.log('[page.tsx] handleCloseModal called');
    setIsModalOpen(false);
    setSelectedImageItemForModal(null);
  };

  return (
    <>
      <Head>
        <title>Infinite Omnidirectional Scroll Grid - decoded</title>
        <meta
          name="description"
          content="Infinite omnidirectional scroll grid with API images"
        />
      </Head>
      <ImageGridHeader />
      <div className="w-full h-screen m-0 overflow-hidden flex flex-col font-sans bg-black relative">
        <div
          ref={scrollContainerRef}
          className="flex-grow w-full overflow-hidden relative cursor-grab bg-black"
          onMouseDown={handleMouseDown}
        >
          <div
            className="absolute"
            style={{
              willChange: 'transform',
              transform: `translate(${contentOffset.x}px, ${contentOffset.y}px)`,
            }}
          >
            {images.map((image) => {
              return (
                <ImageItem
                  key={image.id}
                  image={image}
                  hoveredItemId={hoveredItemId}
                  hoveredImageDetailData={hoveredImageDetailData}
                  isFetchingDetail={isFetchingDetail}
                  detailError={detailError}
                  onImageLoaded={onImageLoaded}
                  onMouseEnterItem={handleMouseEnterItem}
                  onMouseLeaveItem={handleMouseLeaveItem}
                  onToggleLike={handleToggleLike}
                  isLiked={likedStatusesMap[image.image_doc_id] || false}
                />
              );
            })}
          </div>
        </div>
        <FabMenu />
      </div>
    </>
  );
};

export default MainPage;
