"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useRequestStore,
  selectImages,
  selectDetectedSpots,
  selectIsDetecting,
  selectIsRevealing,
  selectSelectedSpotId,
  selectCurrentStep,
} from "@/lib/stores/requestStore";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { RequestFlowHeader } from "@/lib/components/request/RequestFlowHeader";
import { MobileDetectionLayout } from "@/lib/components/request/MobileDetectionLayout";
import { DesktopDetectionLayout } from "@/lib/components/request/DesktopDetectionLayout";

export default function RequestDetectPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const images = useRequestStore(selectImages);
  const spots = useRequestStore(selectDetectedSpots);
  const isDetecting = useRequestStore(selectIsDetecting);
  const isRevealing = useRequestStore(selectIsRevealing);
  const selectedSpotId = useRequestStore(selectSelectedSpotId);
  const currentStep = useRequestStore(selectCurrentStep);

  const startDetection = useRequestStore((s) => s.startDetection);
  const selectSpot = useRequestStore((s) => s.selectSpot);
  const resetRequestFlow = useRequestStore((s) => s.resetRequestFlow);

  // Get the first uploaded image
  const uploadedImage = images.find((img) => img.status === "uploaded");

  // Redirect to upload if no images
  useEffect(() => {
    if (images.length === 0) {
      router.push("/request/upload");
    }
  }, [images, router]);

  // Start detection when page loads (only once)
  useEffect(() => {
    if (uploadedImage && spots.length === 0 && !isDetecting) {
      startDetection();
    }
  }, [uploadedImage, spots.length, isDetecting, startDetection]);

  const handleClose = () => {
    resetRequestFlow();
    router.push("/");
  };

  const handleBack = () => {
    router.push("/request/upload");
  };

  const handleSelectSpot = (spotId: string | null) => {
    selectSpot(spotId);
  };

  // Show nothing while redirecting
  if (!uploadedImage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - only show on desktop or when detecting */}
      {(!isMobile || isDetecting) && (
        <RequestFlowHeader
          title="Detecting Items"
          currentStep={currentStep}
          onClose={handleClose}
          onBack={handleBack}
        />
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <MobileDetectionLayout
          image={uploadedImage}
          spots={spots}
          isDetecting={isDetecting}
          isRevealing={isRevealing}
          selectedSpotId={selectedSpotId}
          onSelectSpot={handleSelectSpot}
        />
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <main className="pt-4">
          <DesktopDetectionLayout
            image={uploadedImage}
            spots={spots}
            isDetecting={isDetecting}
            isRevealing={isRevealing}
            selectedSpotId={selectedSpotId}
            onSelectSpot={handleSelectSpot}
          />
        </main>
      )}
    </div>
  );
}
