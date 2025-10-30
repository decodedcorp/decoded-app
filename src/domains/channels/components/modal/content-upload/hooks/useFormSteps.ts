import { useState, useEffect } from 'react';
import { useContentUploadStore, selectContentUploadFormData } from '@/store/contentUploadStore';
import { ContentType } from '@/lib/types/ContentType';

export type FormStep = 'input' | 'analyzing' | 'preview' | 'details';

export const useFormSteps = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>('input');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');

  const formData = useContentUploadStore(selectContentUploadFormData);
  const updateFormData = useContentUploadStore((state) => state.updateFormData);

  // Set default type to LINK
  useEffect(() => {
    if (!formData.type) {
      updateFormData({ type: ContentType.LINK });
    }
  }, [formData.type, updateFormData]);

  return {
    currentStep,
    setCurrentStep,
    selectedTemplate,
    setSelectedTemplate,
  };
};
