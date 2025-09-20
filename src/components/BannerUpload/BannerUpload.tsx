'use client';

import React, { useState, useRef, useCallback } from 'react';

import {
  processBannerImage,
  validateBannerFile,
  validateBannerDimensions,
  getBannerPreviewUrl,
  formatFileSize,
  BANNER_CONSTRAINTS,
} from '@/lib/utils/bannerUtils';

export interface BannerUploadProps {
  currentBannerUrl?: string;
  onBannerChange: (base64: string) => void;
  onBannerRemove?: () => void;
  isLoading?: boolean;
  className?: string;
}

interface BannerState {
  isUploading: boolean;
  previewUrl: string | null;
  file: File | null;
  error: string | null;
  uploadProgress: number;
}

export const BannerUpload: React.FC<BannerUploadProps> = ({
  currentBannerUrl,
  onBannerChange,
  onBannerRemove,
  isLoading = false,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerState, setBannerState] = useState<BannerState>({
    isUploading: false,
    previewUrl: currentBannerUrl || null,
    file: null,
    error: null,
    uploadProgress: 0,
  });

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file: File) => {
      setBannerState((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
        uploadProgress: 0,
      }));

      try {
        // Validate file
        const fileValidation = validateBannerFile(file);
        if (!fileValidation.isValid) {
          throw new Error(fileValidation.error);
        }

        // Validate dimensions
        setBannerState((prev) => ({ ...prev, uploadProgress: 20 }));
        const dimensionValidation = await validateBannerDimensions(file);
        if (!dimensionValidation.isValid) {
          throw new Error(dimensionValidation.error);
        }

        // Create preview
        setBannerState((prev) => ({ ...prev, uploadProgress: 40 }));
        const previewUrl = await getBannerPreviewUrl(file);

        // Process image
        setBannerState((prev) => ({ ...prev, uploadProgress: 60 }));
        const base64 = await processBannerImage(file);

        setBannerState((prev) => ({
          ...prev,
          uploadProgress: 100,
          previewUrl,
          file,
          isUploading: false,
        }));

        // Call the callback with the processed image
        onBannerChange(base64);
      } catch (error) {
        setBannerState((prev) => ({
          ...prev,
          isUploading: false,
          error: error instanceof Error ? error.message : 'Failed to upload banner',
          uploadProgress: 0,
        }));
      }
    },
    [onBannerChange],
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith('image/'));

      if (imageFile) {
        handleFileSelect(imageFile);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle file input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  // Handle remove banner
  const handleRemoveBanner = useCallback(() => {
    setBannerState({
      isUploading: false,
      previewUrl: null,
      file: null,
      error: null,
      uploadProgress: 0,
    });

    if (onBannerRemove) {
      onBannerRemove();
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onBannerRemove]);

  // Open file dialog
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const hasPreview = bannerState.previewUrl || currentBannerUrl;
  const displayPreview = bannerState.previewUrl || currentBannerUrl;

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-4">
        {/* Banner Preview Area */}
        <div
          className={`relative w-full h-64 md:h-80 border-2 border-dashed border-gray-600 rounded-xl overflow-hidden transition-all duration-300 ${
            bannerState.isUploading ? 'border-primary bg-primary/10' : 'hover:border-gray-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Current/Preview Banner */}
          {hasPreview && (
            <div className="relative w-full h-full">
              <img
                src={displayPreview}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />

              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-3">
                  <button
                    onClick={openFileDialog}
                    disabled={bannerState.isUploading || isLoading}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Change Banner
                  </button>
                  {onBannerRemove && (
                    <button
                      onClick={handleRemoveBanner}
                      disabled={bannerState.isUploading || isLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {bannerState.isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="mb-2">
                      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                    <p className="text-sm">Processing banner...</p>
                    <div className="w-48 bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${bannerState.uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Area (when no banner) */}
          {!hasPreview && (
            <div
              className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer"
              onClick={openFileDialog}
            >
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Upload Banner Image</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Drag and drop an image or click to browse
                </p>
                <div className="text-xs text-gray-500">
                  <p>Recommended: 1920x1080 (16:9 ratio)</p>
                  <p>Max size: {formatFileSize(BANNER_CONSTRAINTS.MAX_SIZE_BYTES)}</p>
                  <p>Formats: JPEG, PNG, WebP</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {bannerState.error && (
          <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{bannerState.error}</p>
          </div>
        )}

        {/* File Info */}
        {bannerState.file && (
          <div className="p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-white font-medium">{bannerState.file.name}</p>
                <p className="text-gray-400">
                  {formatFileSize(bannerState.file.size)} • {bannerState.file.type}
                </p>
              </div>
              <div className="text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default BannerUpload;
