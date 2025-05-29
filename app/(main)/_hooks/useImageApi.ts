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
        let responseBody = null;
        try {
          responseBody = await response.text();
        } catch (textError) {
          // silent fail for reading body
        }
        throw new Error(
          `API request failed: ${response.status} ${
            response.statusText
          }. Body: ${responseBody || "N/A"}`
        );
      }
      const data: ApiResponse = await response.json();
      if (data.status_code === 200 && data.data && data.data.images) {
        if (data.data.images.length > 0) {
          apiImageUrlListRef.current = [
            ...apiImageUrlListRef.current,
            ...data.data.images,
          ];
          setApiImageCount(apiImageUrlListRef.current.length); // 상태 업데이트 함수 사용
          nextApiPageIdRef.current = data.data.maybe_next_id;
          if (!data.data.maybe_next_id) {
            allApiImagesFetchedRef.current = true;
          }
          return true;
        } else {
          if (
            apiImageUrlListRef.current.length > 0 ||
            !data.data.maybe_next_id
          ) {
            allApiImagesFetchedRef.current = true;
          }
          nextApiPageIdRef.current = null;
          return false;
        }
      } else {
        allApiImagesFetchedRef.current = true;
        nextApiPageIdRef.current = null;
        return false;
      }
    } catch (error) {
      console.error("Error fetching API images:", error); // 에러 로깅 추가
      allApiImagesFetchedRef.current = true;
      nextApiPageIdRef.current = null;
      return false;
    } finally {
      isFetchingApiImagesRef.current = false;
    }
  }, [setApiImageCount]); // apiImageCount 대신 setApiImageCount를 의존성으로

  const fetchImageDetail = useCallback(
    async (docId: string) => {
      if (detailCacheRef.current[docId]) {
        setHoveredImageDetailData(detailCacheRef.current[docId]);
        setDetailError(null);
        setIsFetchingDetail(false);
        return;
      }

      setIsFetchingDetail(true);
      setHoveredImageDetailData(null);
      setDetailError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/${docId}`, {
          headers: { accept: "application/json" },
        });
        if (!response.ok) {
          let errorBody = "Failed to fetch image details";
          try {
            errorBody = await response.text();
          } catch {}
          console.error(
            "Error fetching image detail:",
            response.status,
            errorBody
          );
          throw new Error(
            `Details fetch failed: ${response.status}. ${errorBody}`
          );
        }
        const data: ImageDetailResponse = await response.json();
        if (data.status_code === 200 && data.data && data.data.image) {
          detailCacheRef.current[docId] = data.data.image;
          setHoveredImageDetailData(data.data.image);
        } else {
          console.error("Image detail API response error:", data);
          throw new Error(
            data.description || "Invalid data structure from detail API"
          );
        }
      } catch (error: any) {
        setDetailError(
          error.message || "An unknown error occurred while fetching details."
        );
        setHoveredImageDetailData(null);
      } finally {
        setIsFetchingDetail(false);
      }
    },
    [setHoveredImageDetailData, setDetailError, setIsFetchingDetail] // 상태 설정 함수들을 의존성으로
  );

  return {
    // API 이미지 목록 관련
    apiImageUrlListRef,
    currentApiImageIndexRef,
    nextApiPageIdRef,
    isFetchingApiImagesRef,
    apiImageCount,
    allApiImagesFetchedRef,
    fetchAndCacheApiImages,
    setApiImageCount, // MainPage에서 초기화 등에 필요할 수 있음

    // 이미지 상세 정보 관련
    hoveredImageDetailData,
    isFetchingDetail,
    detailError,
    detailCacheRef, // MainPage의 ImageItem에서 사용될 수 있음
    fetchImageDetail,
    setHoveredImageDetailData, // 외부에서 직접 호출할 일이 있다면 반환
    // setDetailError, // 보통 내부에서만 관리
    // setIsFetchingDetail, // 보통 내부에서만 관리
  };
} 