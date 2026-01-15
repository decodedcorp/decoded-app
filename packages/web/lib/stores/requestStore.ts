/**
 * Request Flow 상태 관리
 * 이미지 업로드 → AI 감지 → 태그 편집 → 요청 제출의 전체 흐름을 관리합니다.
 */

import { create } from "zustand";
import {
  createPreviewUrl,
  revokePreviewUrl,
} from "@/lib/utils/imageCompression";
import { UPLOAD_CONFIG } from "@/lib/utils/validation";

export type UploadStatus = "pending" | "uploading" | "uploaded" | "error";
export type RequestStep = 1 | 2 | 3 | 4;

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  status: UploadStatus;
  progress: number;
  error?: string;
}

interface RequestState {
  // Step 1: Upload
  images: UploadedImage[];
  currentStep: RequestStep;

  // Actions - Images
  addImage: (file: File) => string | null;
  addImages: (files: File[]) => string[];
  removeImage: (id: string) => void;
  updateImageStatus: (
    id: string,
    status: UploadStatus,
    progress?: number,
    error?: string
  ) => void;
  setImageUploadedUrl: (id: string, url: string) => void;
  clearImages: () => void;

  // Actions - Navigation
  setStep: (step: RequestStep) => void;
  canProceedToNextStep: () => boolean;

  // Actions - Reset
  resetRequestFlow: () => void;
}

function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const initialState = {
  images: [] as UploadedImage[],
  currentStep: 1 as RequestStep,
};

export const useRequestStore = create<RequestState>((set, get) => ({
  ...initialState,

  addImage: (file: File) => {
    const { images } = get();
    if (images.length >= UPLOAD_CONFIG.maxImages) {
      return null;
    }

    const id = generateId();
    const previewUrl = createPreviewUrl(file);

    const newImage: UploadedImage = {
      id,
      file,
      previewUrl,
      status: "pending",
      progress: 0,
    };

    set((state) => ({
      images: [...state.images, newImage],
    }));

    return id;
  },

  addImages: (files: File[]) => {
    const { images } = get();
    const remainingSlots = UPLOAD_CONFIG.maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newImages: UploadedImage[] = filesToAdd.map((file) => ({
      id: generateId(),
      file,
      previewUrl: createPreviewUrl(file),
      status: "pending" as const,
      progress: 0,
    }));

    set((state) => ({
      images: [...state.images, ...newImages],
    }));

    return newImages.map((img) => img.id);
  },

  removeImage: (id: string) => {
    const { images } = get();
    const imageToRemove = images.find((img) => img.id === id);

    if (imageToRemove) {
      revokePreviewUrl(imageToRemove.previewUrl);
    }

    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    }));
  },

  updateImageStatus: (id, status, progress, error) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? {
              ...img,
              status,
              progress: progress ?? img.progress,
              error: error ?? (status === "error" ? img.error : undefined),
            }
          : img
      ),
    }));
  },

  setImageUploadedUrl: (id, url) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? {
              ...img,
              uploadedUrl: url,
              status: "uploaded" as const,
              progress: 100,
            }
          : img
      ),
    }));
  },

  clearImages: () => {
    const { images } = get();
    images.forEach((img) => revokePreviewUrl(img.previewUrl));
    set({ images: [] });
  },

  setStep: (step) => {
    set({ currentStep: step });
  },

  canProceedToNextStep: () => {
    const { images, currentStep } = get();

    switch (currentStep) {
      case 1:
        // Step 1: 최소 1장 이상의 이미지가 업로드 완료되어야 함
        return images.some((img) => img.status === "uploaded");
      case 2:
        // Step 2: AI 감지 완료 (추후 구현)
        return true;
      case 3:
        // Step 3: 태그 선택 완료 (추후 구현)
        return true;
      case 4:
        // Step 4: 최종 단계
        return true;
      default:
        return false;
    }
  },

  resetRequestFlow: () => {
    const { images } = get();
    images.forEach((img) => revokePreviewUrl(img.previewUrl));
    set(initialState);
  },
}));

// Selector helpers
export const selectImages = (state: RequestState) => state.images;
export const selectCurrentStep = (state: RequestState) => state.currentStep;
export const selectCanProceed = (state: RequestState) =>
  state.canProceedToNextStep();
export const selectImageCount = (state: RequestState) => state.images.length;
export const selectHasImages = (state: RequestState) => state.images.length > 0;
export const selectIsMaxImages = (state: RequestState) =>
  state.images.length >= UPLOAD_CONFIG.maxImages;
