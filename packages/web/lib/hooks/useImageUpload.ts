/**
 * 이미지 업로드 로직 훅
 * 파일 검증, 압축, API를 통한 업로드를 처리합니다.
 *
 * 플로우: 이미지 선택 → 압축 → API 업로드 → AI 분석 자동 실행
 */

import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  useRequestStore,
  selectImages,
  selectIsMaxImages,
} from "@/lib/stores/requestStore";
import {
  validateImageFile,
  validateAddingImages,
  extractImageFromClipboard,
  UPLOAD_CONFIG,
} from "@/lib/utils/validation";
import { compressImage } from "@/lib/utils/imageCompression";
import { uploadImage } from "@/lib/api/posts";

export interface UseImageUploadOptions {
  autoUpload?: boolean;
  autoAnalyze?: boolean;
  onUploadComplete?: (id: string, url: string) => void;
  onUploadError?: (id: string, error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    autoUpload = true,
    autoAnalyze = true,
    onUploadComplete,
    onUploadError,
  } = options;

  const images = useRequestStore(selectImages);
  const isMaxImages = useRequestStore(selectIsMaxImages);
  const addImages = useRequestStore((s) => s.addImages);
  const removeImage = useRequestStore((s) => s.removeImage);
  const updateImageStatus = useRequestStore((s) => s.updateImageStatus);
  const setImageUploadedUrl = useRequestStore((s) => s.setImageUploadedUrl);
  const clearImages = useRequestStore((s) => s.clearImages);
  const startDetection = useRequestStore((s) => s.startDetection);

  /**
   * 단일 이미지 업로드 (API)
   * 업로드 완료 후 자동으로 AI 분석 시작
   */
  const uploadToStorage = useCallback(
    async (id: string, file: File) => {
      updateImageStatus(id, "uploading", 0);

      try {
        // 1. 이미지 압축
        updateImageStatus(id, "uploading", 10);
        const { file: compressedFile, wasCompressed } =
          await compressImage(file);

        if (wasCompressed) {
          console.log(`Image compressed: ${file.name}`);
        }

        // 2. API를 통해 백엔드에 업로드
        const { image_url } = await uploadImage({
          file: compressedFile,
          onProgress: (progress) => updateImageStatus(id, "uploading", progress),
        });

        // 3. 업로드 완료
        setImageUploadedUrl(id, image_url);
        onUploadComplete?.(id, image_url);
        updateImageStatus(id, "uploaded", 100);

        // 4. 자동 AI 분석 시작
        if (autoAnalyze) {
          // 약간의 딜레이 후 분석 시작 (UI 업데이트 대기)
          setTimeout(() => {
            startDetection();
          }, 100);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        updateImageStatus(id, "error", 0, errorMessage);
        onUploadError?.(id, errorMessage);
        toast.error(errorMessage);
      }
    },
    [
      updateImageStatus,
      setImageUploadedUrl,
      onUploadComplete,
      onUploadError,
      autoAnalyze,
      startDetection,
    ]
  );

  /**
   * 파일 추가 (검증 + 선택적 자동 업로드)
   */
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      // 개수 검증
      const countValidation = validateAddingImages(images.length, files.length);
      if (!countValidation.valid) {
        toast.error(countValidation.error);
        return;
      }

      const validFiles: File[] = [];
      const errors: string[] = [];

      // 각 파일 검증
      for (const file of files) {
        const validation = validateImageFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      }

      // 에러가 있으면 토스트 표시
      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
      }

      if (validFiles.length === 0) return;

      // 스토어에 추가
      const addedIds = addImages(validFiles);

      // 자동 업로드가 활성화되어 있으면 업로드 시작
      if (autoUpload) {
        for (let i = 0; i < addedIds.length; i++) {
          const id = addedIds[i];
          const file = validFiles[i];
          // 순차적으로 업로드 (병렬 업로드도 가능하지만 서버 부하 고려)
          uploadToStorage(id, file);
        }
      }
    },
    [images.length, addImages, autoUpload, uploadToStorage]
  );

  /**
   * 클립보드 붙여넣기 이벤트 핸들러
   */
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (isMaxImages) return;
      if (!e.clipboardData) return;

      const imageFile = extractImageFromClipboard(e.clipboardData);
      if (imageFile) {
        e.preventDefault();
        handleFilesSelected([imageFile]);
      }
    },
    [isMaxImages, handleFilesSelected]
  );

  /**
   * 재시도
   */
  const retryUpload = useCallback(
    (id: string) => {
      const image = images.find((img) => img.id === id);
      if (image && image.status === "error") {
        uploadToStorage(id, image.file);
      }
    },
    [images, uploadToStorage]
  );

  // 클립보드 붙여넣기 이벤트 등록
  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  return {
    images,
    isMaxImages,
    remainingSlots: UPLOAD_CONFIG.maxImages - images.length,
    handleFilesSelected,
    removeImage,
    retryUpload,
    clearImages,
    uploadToStorage,
  };
}
