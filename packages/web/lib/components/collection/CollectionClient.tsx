"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMagazineStore } from "@/lib/stores/magazineStore";
import { useStudioStore } from "@/lib/stores/studioStore";
import { StudioLoader } from "./StudioLoader";
import { EmptyBookshelf } from "./EmptyBookshelf";

// Dynamic import for Spline — SSR disabled (WebGL).
// SplineStudio includes: Spline canvas + StudioHUD + IssueDetailPanel + EmptyStudio
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
  const { splineLoaded, focusedIssueId, setFocusedIssueId, reset } =
    useStudioStore();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(hasWebGL());
    loadCollection().then(() => setHasLoaded(true));
    return () => reset();
  }, [loadCollection, reset]);

  // Loading state — data not yet fetched
  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <StudioLoader />
      </div>
    );
  }

  // WebGL fallback: render CSS bookshelf with banner
  if (!webglSupported) {
    const FallbackView = dynamic(
      () =>
        import("./BookshelfViewFallback").then((mod) => ({
          default: mod.BookshelfViewFallback,
        })),
      { ssr: false }
    );
    return (
      <FallbackView
        issues={collectionIssues}
        activeIssueId={focusedIssueId}
        onSelectIssue={setFocusedIssueId}
      />
    );
  }

  // Empty state — show empty Spline room + bookshelf empty state overlay
  if (collectionIssues.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] relative">
        <div className="relative w-full h-screen">
          {/* SplineStudio includes EmptyStudio overlay */}
          <SplineStudio />
          {/* Also show legacy empty bookshelf for immediate feedback before Spline loads */}
          {!splineLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <EmptyBookshelf />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main 3D Studio view — SplineStudio self-contains all overlays
  return (
    <div className="min-h-screen bg-[#050505] relative">
      <div className="relative w-full h-screen">
        {!splineLoaded && <StudioLoader />}
        {/* SplineStudio renders: Spline canvas + StudioHUD + IssueDetailPanel + EmptyStudio */}
        <SplineStudio />
      </div>
    </div>
  );
}
