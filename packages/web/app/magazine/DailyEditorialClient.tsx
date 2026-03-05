"use client";

import { useEffect } from "react";
import { useMagazineStore } from "@/lib/stores/magazineStore";
import {
  MagazineRenderer,
  MagazineSkeleton,
} from "@/lib/components/magazine";
import { GenerateMyEdition } from "@/lib/components/magazine/GenerateMyEdition";
import { RefreshCw } from "lucide-react";

/**
 * Client component for the daily editorial page (SCR-MAG-01).
 * Loads the daily issue from the magazine store and renders it
 * via MagazineRenderer with GSAP animations.
 */
export function DailyEditorialClient() {
  const currentIssue = useMagazineStore((s) => s.currentIssue);
  const isLoading = useMagazineStore((s) => s.isLoading);
  const error = useMagazineStore((s) => s.error);
  const loadDailyIssue = useMagazineStore((s) => s.loadDailyIssue);
  const clearError = useMagazineStore((s) => s.clearError);

  useEffect(() => {
    loadDailyIssue();
  }, [loadDailyIssue]);

  if (isLoading) {
    return <MagazineSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mag-bg px-6">
        <div className="max-w-sm rounded-lg border border-mag-accent/30 bg-mag-bg p-8 text-center">
          <p className="mb-4 text-mag-text/70">{error}</p>
          <button
            type="button"
            onClick={() => {
              clearError();
              loadDailyIssue();
            }}
            className="inline-flex items-center gap-2 rounded-md border border-mag-accent px-4 py-2 text-sm font-medium text-mag-accent transition-colors hover:bg-mag-accent/10"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentIssue) {
    return null;
  }

  return (
    <>
      <MagazineRenderer issue={currentIssue} />
      <GenerateMyEdition />
    </>
  );
}
