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
    <div className="min-h-screen bg-background">
      <RequestFlowHeader
        title="Upload Images"
        currentStep={currentStep}
        onClose={handleClose}
      />

      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {!hasImages && (
            <DropZone
              onFilesSelected={handleFilesSelected}
              disabled={isMaxImages}
              className="min-h-[300px]"
            />
          )}

          {hasImages && (
            <>
              <ImagePreviewGrid
                images={images}
                onRemove={removeImage}
                onRetry={retryUpload}
                onAddMore={handleFilesSelected}
              />

              <div className="flex justify-end pt-4 border-t border-border">
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
