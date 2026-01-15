"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
  useRequestStore,
  selectCurrentStep,
  selectHasImages,
  selectCanProceed,
} from "@/lib/stores/requestStore";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { DropZone } from "./DropZone";
import { ImagePreviewGrid } from "./ImagePreviewGrid";
import { StepIndicator } from "./StepIndicator";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [mounted, setMounted] = useState(false);
  const currentStep = useRequestStore(selectCurrentStep);
  const hasImages = useRequestStore(selectHasImages);
  const canProceed = useRequestStore(selectCanProceed);
  const resetRequestFlow = useRequestStore((s) => s.resetRequestFlow);

  const { images, isMaxImages, handleFilesSelected, removeImage, retryUpload } =
    useImageUpload();

  // Client-side only mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasImages]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (hasImages) {
      const confirmed = window.confirm(
        "You have unsaved images. Are you sure you want to close?"
      );
      if (!confirmed) return;
    }
    resetRequestFlow();
    onClose();
  }, [hasImages, resetRequestFlow, onClose]);

  const handleNext = useCallback(() => {
    if (canProceed) {
      // TODO: Navigate to next step (detect)
      console.log("Navigate to detect step");
    }
  }, [canProceed]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-xl
                   bg-background md:border md:border-border md:shadow-lg
                   overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <div className="w-9" /> {/* Spacer for alignment */}
          <div className="flex flex-col items-center">
            <h1 id="request-modal-title" className="text-base font-medium">
              Upload Images
            </h1>
            <StepIndicator currentStep={currentStep} className="mt-1" />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 -mr-2 rounded-full hover:bg-foreground/5 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {!hasImages && (
              <DropZone
                onFilesSelected={handleFilesSelected}
                disabled={isMaxImages}
                className="min-h-[250px] md:min-h-[300px]"
              />
            )}

            {hasImages && (
              <ImagePreviewGrid
                images={images}
                onRemove={removeImage}
                onRetry={retryUpload}
                onAddMore={handleFilesSelected}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        {hasImages && (
          <footer className="flex justify-end px-4 py-3 border-t border-border flex-shrink-0">
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={`
                px-6 py-2.5 rounded-lg font-medium transition-all
                ${
                  canProceed
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-foreground/20 text-foreground/40 cursor-not-allowed"
                }
              `}
            >
              Next
            </button>
          </footer>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
