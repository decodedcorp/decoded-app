import { useState, useRef, useCallback } from "react";
import { throttle } from 'lodash';
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
  
  // Hover 최적화를 위한 ref들
  const lastHoveredDocIdRef = useRef<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAndCacheApiImages = useCallback(async () => {
    if (isFetchingApiImagesRef.current || allApiImagesFetchedRef.current) {
      return false;
    }

    isFetchingApiImagesRef.current = true;
    
    try {
      // 병렬 요청으로 성능 향상
      const url = nextApiPageIdRef.current
        ? `${API_BASE_URL}?next_id=${nextApiPageIdRef.current}`
        : API_BASE_URL;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

      const response = await fetch(url, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.status_code === 200 && data.data?.images?.length > 0) {
        // 배치 처리로 성능 향상
        const newImages = data.data.images.map((image, index) => ({
          ...image,
          // 이미지 사전 로딩을 위한 priority 설정
          priority: index < 10 ? 'high' : 'low'
        }));

        apiImageUrlListRef.current = [
          ...apiImageUrlListRef.current,
          ...newImages,
        ];
        
        setApiImageCount(apiImageUrlListRef.current.length);
        nextApiPageIdRef.current = data.data.maybe_next_id;
        allApiImagesFetchedRef.current = !data.data.maybe_next_id;
        
        // 캐시 크기 제한 (메모리 최적화)
        if (apiImageUrlListRef.current.length > 1000) {
          apiImageUrlListRef.current = apiImageUrlListRef.current.slice(-500);
        }
        
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
    // 캐시된 데이터가 있으면 즉시 반환
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

      const response = await fetch(`${API_BASE_URL}/${docId}`, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Details fetch failed: ${response.status}`);
      }

      const data: ImageDetailResponse = await response.json();
      
      if (data.status_code === 200 && data.data?.image) {
        // 캐시 크기 제한
        const cacheKeys = Object.keys(detailCacheRef.current);
        if (cacheKeys.length > 100) {
          const oldestKey = cacheKeys[0];
          delete detailCacheRef.current[oldestKey];
        }
        
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

  // 스크롤 상태를 추적하는 함수
  const setScrollingState = useCallback((scrolling: boolean) => {
    isScrollingRef.current = scrolling;
    
    // 스크롤 중일 때는 hover 요청을 지연시킴
    if (scrolling) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
      
      scrollEndTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 200); // 스크롤 후 200ms 대기
    }
  }, []);

  // 최적화된 hover 처리 함수
  const handleHoverImage = useCallback((docId: string) => {
    // 같은 이미지에 대해 중복 요청 방지
    if (lastHoveredDocIdRef.current === docId) {
      return;
    }

    // 스크롤 중일 때는 요청을 지연시킴
    if (isScrollingRef.current) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isScrollingRef.current) {
          lastHoveredDocIdRef.current = docId;
          fetchImageDetail(docId);
        }
      }, 300); // 스크롤 후 300ms 대기
      return;
    }

    // 이미 캐시된 데이터가 있으면 즉시 반환
    if (detailCacheRef.current[docId]) {
      lastHoveredDocIdRef.current = docId;
      setHoveredImageDetailData(detailCacheRef.current[docId]);
      setDetailError(null);
      setIsFetchingDetail(false);
      return;
    }

    // 새로운 요청
    lastHoveredDocIdRef.current = docId;
    fetchImageDetail(docId);
  }, [fetchImageDetail]);

  // Hover 해제 처리
  const handleLeaveImage = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    lastHoveredDocIdRef.current = null;
  }, []);

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
    
    // 최적화된 hover 처리
    handleHoverImage,
    handleLeaveImage,
    setScrollingState,
  };
} 