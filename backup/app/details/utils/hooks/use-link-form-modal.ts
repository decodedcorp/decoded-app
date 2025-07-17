'use client';

import { useState } from 'react';
import { ProvideData } from '@/types/model.d';

interface UseLinkFormModal {
  showLinkForm: boolean;
  provideData: ProvideData | null;
  openModal: () => void;
  closeModal: () => void;
  setProvideData: (data: ProvideData | null) => void;
  resetForm: () => void;
}

export function useLinkFormModal(): UseLinkFormModal {
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [provideData, setProvideData] = useState<ProvideData | null>(null);

  const openModal = () => setShowLinkForm(true);
  const closeModal = () => setShowLinkForm(false);
  const resetForm = () => {
    setProvideData(null);
    closeModal();
  };

  return {
    showLinkForm,
    provideData,
    openModal,
    closeModal,
    setProvideData,
    resetForm,
  };
} 