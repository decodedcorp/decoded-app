"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useRequestStore,
  getRequestActions,
  selectCurrentStep,
  selectHasImages,
  selectCanProceed,
  selectDetectedSpots,
  selectSelectedSpotId,
  type DetectedSpot,
} from "@/lib/stores/requestStore";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { RequestFlowHeader } from "@/lib/components/request/RequestFlowHeader";
import { DropZone } from "@/lib/components/request/DropZone";
import { DetectionView } from "@/lib/components/request/DetectionView";
import { SolutionInputForm } from "@/lib/components/request/SolutionInputForm";
import { Trash2, Plus } from "lucide-react";

export default function RequestUploadPage() {
  const router = useRouter();

  // 상태만 구독 (렌더링에 필요한 것만)
  const currentStep = useRequestStore(selectCurrentStep);
  const hasImages = useRequestStore(selectHasImages);
  const detectedSpots = useRequestStore(selectDetectedSpots);
  const selectedSpotId = useRequestStore(selectSelectedSpotId);

  // canProceed를 spots 기반으로 계산
  const canProceed = detectedSpots.length > 0;

  const { images, isMaxImages, handleFilesSelected, removeImage, retryUpload } =
    useImageUpload();

  // Action은 getRequestActions()로 접근 (구독 없이)
  const handleClose = useCallback(() => {
    getRequestActions().resetRequestFlow();
    router.push("/");
  }, [router]);

  const handleNext = () => {
    if (canProceed) {
      // TODO: Navigate to next step (e.g., /request/details)
      // For now, proceed to details page
      router.push("/request/details");
    }
  };

  // Spot creation handler
  const handleImageClick = useCallback((x: number, y: number) => {
    getRequestActions().addSpot(x, y);
  }, []);

  // Spot selection handler
  const handleSpotClick = useCallback((spot: DetectedSpot) => {
    getRequestActions().selectSpot(spot.id);
  }, []);

  // Spot deletion handler
  const handleRemoveSpot = useCallback((spotId: string) => {
    getRequestActions().removeSpot(spotId);
  }, []);

  // Solution save handler
  const handleSaveSolution = useCallback((spotId: string, solution: any) => {
    getRequestActions().setSpotSolution(spotId, solution);
    getRequestActions().selectSpot(null); // Deselect after saving
  }, []);

  // Solution cancel handler
  const handleCancelSolution = useCallback(() => {
    getRequestActions().selectSpot(null);
  }, []);

  // Check if image is uploaded
  const uploadedImage = images.find((img) => img.status === "uploaded");

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

        {hasImages && !uploadedImage && (
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            </div>
          </div>
        )}

        {uploadedImage && (
          <div className="flex-1 min-h-0 flex flex-col space-y-4 max-w-6xl mx-auto w-full">
            <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 overflow-hidden">
              {/* Image with spot markers */}
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <DetectionView
                  image={uploadedImage}
                  spots={detectedSpots}
                  isDetecting={false}
                  selectedSpotId={selectedSpotId}
                  onSpotClick={handleSpotClick}
                  onImageClick={handleImageClick}
                  layout="default"
                />
              </div>

              {/* Spot list panel */}
              <div className="w-full md:w-80 flex-shrink-0 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    Spots ({detectedSpots.length})
                  </h3>
                  {detectedSpots.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Tap spots to add info
                    </p>
                  )}
                </div>

                {detectedSpots.length === 0 && (
                  <div className="py-8 text-center space-y-2">
                    <Plus className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Tap on the image to add spots
                    </p>
                  </div>
                )}

                {detectedSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className={`
                      p-3 rounded-lg border transition-all
                      ${
                        selectedSpotId === spot.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background"
                      }
                    `}
                  >
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={() => handleSpotClick(spot)}
                        className={`
                          flex-shrink-0 w-6 h-6 rounded-full
                          flex items-center justify-center
                          text-xs font-bold transition-all
                          ${
                            selectedSpotId === spot.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/20 text-primary hover:bg-primary/30"
                          }
                        `}
                      >
                        {spot.index}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {spot.solution?.title || spot.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {spot.solution
                                ? "Info added"
                                : "Tap to add product info"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpot(spot.id)}
                            className="flex-shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove spot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {selectedSpotId === spot.id && (
                          <SolutionInputForm
                            spotId={spot.id}
                            initialData={spot.solution}
                            onSave={handleSaveSolution}
                            onCancel={handleCancelSolution}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
