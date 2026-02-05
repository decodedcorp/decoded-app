/**
 * Post 생성 훅
 * React Query mutation을 사용하여 Post를 생성합니다.
 */

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createPost,
  storeToApiCoord,
  type CreatePostRequest,
  type CreatePostResponse,
} from "@/lib/api";
import {
  useRequestStore,
  selectImages,
  selectDetectedSpots,
  selectDescription,
  selectExtractedMetadata,
  selectMediaSource,
  selectArtistName,
  selectGroupName,
  selectContext,
} from "@/lib/stores/requestStore";
import { useCategoryCodeMap } from "./useCategories";

interface UseCreatePostOptions {
  onSuccess?: (response: CreatePostResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreatePost(options: UseCreatePostOptions = {}) {
  const router = useRouter();
  const categoryCodeMap = useCategoryCodeMap();

  // Store selectors
  const images = useRequestStore(selectImages);
  const detectedSpots = useRequestStore(selectDetectedSpots);
  const description = useRequestStore(selectDescription);
  const extractedMetadata = useRequestStore(selectExtractedMetadata);
  const mediaSource = useRequestStore(selectMediaSource);
  const artistName = useRequestStore(selectArtistName);
  const groupName = useRequestStore(selectGroupName);
  const context = useRequestStore(selectContext);

  // Store actions
  const setSubmitting = useRequestStore((s) => s.setSubmitting);
  const setSubmitError = useRequestStore((s) => s.setSubmitError);
  const resetRequestFlow = useRequestStore((s) => s.resetRequestFlow);

  const mutation = useMutation({
    mutationFn: async () => {
      // 업로드된 이미지 URL 가져오기
      const uploadedImage = images.find((img) => img.status === "uploaded");
      if (!uploadedImage?.uploadedUrl) {
        throw new Error("업로드된 이미지가 없습니다.");
      }

      // 필수 필드 검증
      if (!mediaSource?.type || !mediaSource?.title) {
        throw new Error("미디어 소스 정보가 필요합니다.");
      }

      // Spots를 API 형식으로 변환
      const spots = detectedSpots.map((spot) => {
        const categoryId = spot.categoryCode
          ? categoryCodeMap.get(spot.categoryCode)
          : undefined;

        if (!categoryId) {
          // 카테고리 ID를 찾을 수 없으면 기본값 사용 또는 에러
          console.warn(
            `Category not found for code: ${spot.categoryCode}, using first available`
          );
        }

        return {
          position_left: storeToApiCoord(spot.center.x),
          position_top: storeToApiCoord(spot.center.y),
          category_id: categoryId || "", // 빈 문자열은 서버에서 처리
        };
      });

      // 요청 데이터 구성
      const request: CreatePostRequest = {
        image_url: uploadedImage.uploadedUrl,
        media_source: mediaSource,
        spots: spots.filter((s) => s.category_id), // 유효한 카테고리만 포함
        ...(description && { description }),
        ...(extractedMetadata.length > 0 && {
          media_metadata: extractedMetadata,
        }),
        ...(artistName && { artist_name: artistName }),
        ...(groupName && { group_name: groupName }),
        ...(context && { context }),
      };

      return createPost(request);
    },
    onMutate: () => {
      setSubmitting(true);
      setSubmitError(null);
    },
    onSuccess: (response) => {
      setSubmitting(false);
      toast.success("Post가 성공적으로 생성되었습니다!");

      // 사용자 콜백 호출
      options.onSuccess?.(response);

      // 상태 초기화
      resetRequestFlow();

      // 생성된 Post 페이지로 이동
      if (response.slug) {
        router.push(`/post/${response.slug}`);
      } else if (response.id) {
        router.push(`/post/${response.id}`);
      }
    },
    onError: (error: Error) => {
      setSubmitting(false);
      setSubmitError(error.message);
      toast.error(error.message);

      // 사용자 콜백 호출
      options.onError?.(error);
    },
  });

  return {
    submit: mutation.mutate,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
