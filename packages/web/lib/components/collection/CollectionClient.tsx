"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useMagazineStore } from "@/lib/stores/magazineStore";
import { useStudioStore } from "@/lib/stores/studioStore";
import { StudioLoader } from "./StudioLoader";

import { IssueDetailPanel } from "./IssueDetailPanel";
import { EmptyBookshelf } from "./EmptyBookshelf";
import { StudioHUD } from "./StudioHUD";

// Dynamic import for Spline — SSR disabled (WebGL)
const SplineStudio = dynamic(
  () =>
    import("./studio/SplineStudio").then((mod) => ({
      default: mod.SplineStudio,
    })),
  {
    ssr: false,
    loading: () => <StudioLoader />,
  }
);

function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

export function CollectionClient() {
  const { collectionIssues, loadCollection } = useMagazineStore();
  const { splineLoaded, focusedIssueId, setFocusedIssueId, setCameraState, reset } =
    useStudioStore();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(hasWebGL());
    loadCollection().then(() => setHasLoaded(true));
    return () => reset();
  }, [loadCollection, reset]);

  const focusedIssue = focusedIssueId
    ? collectionIssues.find((i) => i.id === focusedIssueId) ?? null
    : null;

  const handleClose = useCallback(() => {
    setFocusedIssueId(null);
    setCameraState("browse");
  }, [setFocusedIssueId, setCameraState]);


  // Loading state
  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <StudioLoader />
      </div>
    );
  }

  // WebGL fallback: render CSS bookshelf
  if (!webglSupported) {
    const FallbackView = dynamic(
      () =>
        import("./BookshelfViewFallback").then((mod) => ({
          default: mod.BookshelfViewFallback,
        })),
      { ssr: false }
    );
    return (
      <div className="min-h-screen">
        <div>
          <p className="text-center text-white/30 text-xs py-2">
            3D studio requires WebGL. Showing classic view.
          </p>
          <FallbackView
            issues={collectionIssues}
            activeIssueId={focusedIssueId}
            onSelectIssue={setFocusedIssueId}
          />
        </div>
      </div>
    );
  }

  // Empty state
  if (collectionIssues.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] relative">

        <div className="relative w-full h-screen">
          <SplineStudio />
          <div className="absolute inset-0 flex items-center justify-center">
            <EmptyBookshelf />
          </div>
        </div>
      </div>
    );
  }

  // Main 3D Studio view
  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* Studio HUD: sticky header with back button, title, issue count */}
      <StudioHUD />

      {/* Spline 3D scene */}
      <div className="relative w-full h-screen">
        {!splineLoaded && <StudioLoader />}
        <SplineStudio />
      </div>

      {/* Issue detail panel overlay */}
      {focusedIssue && (
        <IssueDetailPanel
          issue={focusedIssue}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
