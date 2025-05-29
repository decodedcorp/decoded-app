"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import ImageGridHeader from "./_components/ImageGridHeader";
import ImageItem from "./_components/ImageItem";
import FabMenu from "./_components/FabMenu";
import type {
  ImageItemData,
  ImageDetail,
} from "./_types/image-grid";
import { useImageApi } from "./_hooks/useImageApi";
import { useImageGrid } from "./_hooks/useImageGrid";
import { useGridInteraction } from "./_hooks/useGridInteraction";

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
              willChange: "transform",
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
