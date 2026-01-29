"use client";

import { useRouter } from "next/navigation";
import {
  useRequestStore,
  selectCurrentStep,
  selectHasImages,
  selectCanProceed,
} from "@/lib/stores/requestStore";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { RequestFlowHeader } from "@/lib/components/request/RequestFlowHeader";
import { DropZone } from "@/lib/components/request/DropZone";
import { ImagePreviewGrid } from "@/lib/components/request/ImagePreviewGrid";

export default function RequestUploadPage() {
  const router = useRouter();
  const currentStep = useRequestStore(selectCurrentStep);
  const hasImages = useRequestStore(selectHasImages);
  const canProceed = useRequestStore(selectCanProceed);
  const resetRequestFlow = useRequestStore((s) => s.resetRequestFlow);

  const { images, isMaxImages, handleFilesSelected, removeImage, retryUpload } =
    useImageUpload();

  const handleClose = () => {
    resetRequestFlow();
    router.push("/");
  };

  const handleNext = () => {
    if (canProceed) {
      router.push("/request/detect");
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      <RequestFlowHeader
        title="Upload Images"
        currentStep={currentStep}
        onClose={handleClose}
      />

      <main className="flex-1 min-h-0 flex flex-col px-4 py-4 md:py-6">
        {!hasImages && (
          <DropZone
            onFilesSelected={handleFilesSelected}
            disabled={isMaxImages}
            className="flex-1 h-full"
          />
        )}

        {hasImages && (
          <div className="flex-1 min-h-0 flex flex-col space-y-4 max-w-4xl mx-auto w-full">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ImagePreviewGrid
                images={images}
                onRemove={removeImage}
                onRetry={retryUpload}
                onAddMore={handleFilesSelected}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border flex-shrink-0">
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
