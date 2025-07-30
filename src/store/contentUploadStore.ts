import { create } from 'zustand';
import { ContentType } from '@/api/generated';

export interface ContentUploadFormData {
  type: ContentType;
  title: string;
  description: string;
  channel_id: string;

  // 이미지 콘텐츠용
  img_url?: string;
  base64_img_url?: string;

  // 비디오 콘텐츠용
  video_url?: string;
  thumbnail_url?: string;

  // 링크 콘텐츠용
  url?: string;

  // 파일 업로드용
  file?: File;
  filePreview?: string;
}

interface ContentUploadState {
  isOpen: boolean;
  formData: ContentUploadFormData;
  isLoading: boolean;
  error: string | null;

  // Actions
  openModal: (channelId: string) => void;
  closeModal: () => void;
  updateFormData: (data: Partial<ContentUploadFormData>) => void;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialFormData: ContentUploadFormData = {
  type: ContentType.IMAGE,
  title: '',
  description: '',
  channel_id: '',
};

export const useContentUploadStore = create<ContentUploadState>((set) => ({
  isOpen: false,
  formData: initialFormData,
  isLoading: false,
  error: null,

  openModal: (channelId: string) => {
    set({
      isOpen: true,
      error: null,
      formData: { ...initialFormData, channel_id: channelId },
    });
  },

  closeModal: () => {
    set({
      isOpen: false,
      formData: initialFormData,
      error: null,
      isLoading: false,
    });
  },

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      error: null, // 폼 업데이트 시 에러 초기화
    }));
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      error: null,
      isLoading: false,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },
}));

// Selectors for better performance
export const selectIsContentUploadModalOpen = (state: ContentUploadState) => state.isOpen;
export const selectContentUploadFormData = (state: ContentUploadState) => state.formData;
export const selectContentUploadError = (state: ContentUploadState) => state.error;
export const selectContentUploadLoading = (state: ContentUploadState) => state.isLoading;
