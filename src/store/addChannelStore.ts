import { create } from 'zustand';

export interface AddChannelFormData {
  name: string;
  description: string;
  thumbnail_base64?: string;
}

interface AddChannelState {
  isOpen: boolean;
  formData: AddChannelFormData;
  isLoading: boolean;
  error: string | null;

  // Actions
  openModal: () => void;
  closeModal: () => void;
  updateFormData: (data: Partial<AddChannelFormData>) => void;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialFormData: AddChannelFormData = {
  name: '',
  description: '',
  thumbnail_base64: undefined,
};

export const useAddChannelStore = create<AddChannelState>((set) => ({
  isOpen: false,
  formData: initialFormData,
  isLoading: false,
  error: null,

  openModal: () => {
    set({ isOpen: true, error: null });
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
export const selectIsAddChannelModalOpen = (state: AddChannelState) => state.isOpen;
export const selectAddChannelFormData = (state: AddChannelState) => state.formData;
export const selectAddChannelLoading = (state: AddChannelState) => state.isLoading;
export const selectAddChannelError = (state: AddChannelState) => state.error;
