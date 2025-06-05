import { useState, useRef, useCallback } from "react";
import type {
  ApiImage,
  ApiResponse,
  ImageDetail,
  ImageDetailResponse,
} from "../_types/image-grid"; // 경로 수정
import { API_BASE_URL } from "../_constants/image-grid"; // 경로 수정

export function useImageApi() {
  // API 이미지 목록 관련
  const apiImageUrlListRef = useRef<ApiImage[]>([]);
  const currentApiImageIndexRef = useRef<number>(0);
  const nextApiPageIdRef = useRef<string | null>(null);
  const isFetchingApiImagesRef = useRef<boolean>(false);
  const [apiImageCount, setApiImageCount] = useState(0);
  const allApiImagesFetchedRef = useRef<boolean>(false);

  // 이미지 상세 정보 관련
  const [hoveredImageDetailData, setHoveredImageDetailData] =
    useState<ImageDetail | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const detailCacheRef = useRef<Record<string, ImageDetail>>({});

  const fetchAndCacheApiImages = useCallback(async () => {
    if (isFetchingApiImagesRef.current || allApiImagesFetchedRef.current) {
      return false;
    }

    isFetchingApiImagesRef.current = true;
    const url = nextApiPageIdRef.current
      ? `${API_BASE_URL}?next_id=${nextApiPageIdRef.current}`
      : API_BASE_URL;

    try {
      const response = await fetch(url, {
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.status_code === 200 && data.data?.images?.length > 0) {
        apiImageUrlListRef.current = [
          ...apiImageUrlListRef.current,
          ...data.data.images,
        ];
        setApiImageCount(apiImageUrlListRef.current.length);
        nextApiPageIdRef.current = data.data.maybe_next_id;
        allApiImagesFetchedRef.current = !data.data.maybe_next_id;
        return true;
      }

      allApiImagesFetchedRef.current = true;
      nextApiPageIdRef.current = null;
      return false;
    } catch (error) {
      console.error("Error fetching API images:", error);
      allApiImagesFetchedRef.current = true;
      nextApiPageIdRef.current = null;
      return false;
    } finally {
      isFetchingApiImagesRef.current = false;
    }
  }, []);

  const fetchImageDetail = async (docId: string): Promise<ImageDetail> => {
    if (detailCacheRef.current[docId]) {
      setHoveredImageDetailData(detailCacheRef.current[docId]);
      setDetailError(null);
      setIsFetchingDetail(false);
      return detailCacheRef.current[docId];
    }

    setIsFetchingDetail(true);
    setHoveredImageDetailData(null);
    setDetailError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/${docId}`, {
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Details fetch failed: ${response.status}`);
      }

      const data: ImageDetailResponse = await response.json();
      
      if (data.status_code === 200 && data.data?.image) {
        detailCacheRef.current[docId] = data.data.image;
        setHoveredImageDetailData(data.data.image);
        return data.data.image;
      } else {
        throw new Error(data.description || "Invalid data structure from detail API");
      }
    } catch (error: any) {
      setDetailError(error.message || "An unknown error occurred while fetching details.");
      setHoveredImageDetailData(null);
      throw error;
    } finally {
      setIsFetchingDetail(false);
    }
  };

  return {
    // API 이미지 목록 관련
    apiImageUrlListRef,
    currentApiImageIndexRef,
    nextApiPageIdRef,
    isFetchingApiImagesRef,
    apiImageCount,
    allApiImagesFetchedRef,
    fetchAndCacheApiImages,
    setApiImageCount,

    // 이미지 상세 정보 관련
    hoveredImageDetailData,
    isFetchingDetail,
    detailError,
    detailCacheRef,
    fetchImageDetail,
    setHoveredImageDetailData,
  };
} 