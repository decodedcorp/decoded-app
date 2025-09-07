import { create } from 'zustand';
import { ContentType } from '@/lib/types/ContentType';

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

export interface GeneratedContent {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  created_at: string;
}

interface ContentUploadState {
  isOpen: boolean;
  formData: ContentUploadFormData;
  isLoading: boolean;
  error: string | null;

  // AI 생성 상태
  isGenerating: boolean;
  generatedContent: GeneratedContent | null;
  generationProgress: number; // 0-100
  generationError: string | null;

  // Actions
  openModal: (channelId: string) => void;
  closeModal: () => void;
  updateFormData: (data: Partial<ContentUploadFormData>) => void;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // AI 생성 관련 액션
  startGeneration: () => void;
  updateGenerationProgress: (progress: number) => void;
  setGeneratedContent: (content: GeneratedContent) => void;
  setGenerationError: (error: string | null) => void;
  resetGeneration: () => void;
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

  // AI 생성 상태 초기값
  isGenerating: false,
  generatedContent: null,
  generationProgress: 0,
  generationError: null,

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
      isGenerating: false,
      generatedContent: null,
      generationProgress: 0,
      generationError: null,
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
      isGenerating: false,
      generatedContent: null,
      generationProgress: 0,
      generationError: null,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  // AI 생성 관련 액션
  startGeneration: () => {
    set({
      isGenerating: true,
      generationProgress: 0,
      generationError: null,
      generatedContent: null,
    });
  },

  updateGenerationProgress: (progress) => {
    set({ generationProgress: progress });
  },

  setGeneratedContent: (content) => {
    set({
      generatedContent: content,
      isGenerating: false,
      generationProgress: 100,
      generationError: null,
    });
  },

  setGenerationError: (error) => {
    set({
      generationError: error,
      isGenerating: false,
      generationProgress: 0,
    });
  },

  resetGeneration: () => {
    set({
      isGenerating: false,
      generatedContent: null,
      generationProgress: 0,
      generationError: null,
    });
  },
}));

// Selectors for better performance
export const selectIsContentUploadModalOpen = (state: ContentUploadState) => state.isOpen;
export const selectContentUploadFormData = (state: ContentUploadState) => state.formData;
export const selectContentUploadError = (state: ContentUploadState) => state.error;
export const selectContentUploadLoading = (state: ContentUploadState) => state.isLoading;
export const selectIsGenerating = (state: ContentUploadState) => state.isGenerating;
export const selectGeneratedContent = (state: ContentUploadState) => state.generatedContent;
export const selectGenerationProgress = (state: ContentUploadState) => state.generationProgress;
export const selectGenerationError = (state: ContentUploadState) => state.generationError;
