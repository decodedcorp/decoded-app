'use client';

import { useLocaleContext } from '@/lib/contexts/locale-context';
import { useState, useCallback } from 'react';

interface UseDragAndDropProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSizeInMB?: number;
}

interface UseDragAndDropReturn {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useDragAndDrop({
  onFileSelect,
  acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxSizeInMB = 5,
}: UseDragAndDropProps): UseDragAndDropReturn {
  const { t } = useLocaleContext();
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (!acceptedFileTypes.includes(file.type)) {
        alert(t.common.errors.invalidFileType);
        return false;
      }

      if (file.size > maxSizeInMB * 1024 * 1024) {
        alert(
          t.common.errors.fileSizeExceeded.replace(
            '{{count}}',
            maxSizeInMB.toString()
          )
        );
        return false;
      }

      return true;
    },
    [acceptedFileTypes, maxSizeInMB]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validateFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validateFile]
  );

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
  };
}
