"use client";

import { useCallback } from "react";
import Spline from "@splinetool/react-spline";
import type { Application, SPEObject } from "@splinetool/runtime";
import { useStudioStore } from "@/lib/stores/studioStore";
import { useMagazineStore } from "@/lib/stores/magazineStore";

const SCENE_URL =
  "https://prod.spline.design/o9G6bAmpXYYxRQxh/scene.splinecode";

interface SplineStudioProps {
  onBookClick?: (issueIndex: number) => void;
}

export function SplineStudio({ onBookClick }: SplineStudioProps) {
  const { setSplineLoaded, setSplineApp, setCameraState, setEntryComplete } =
    useStudioStore();
  const collectionIssues = useMagazineStore((s) => s.collectionIssues);

  const handleLoad = useCallback(
    (splineApp: Application) => {
      setSplineApp(splineApp);
      setSplineLoaded(true);
      setCameraState("browse");
      setEntryComplete(true);

      // Bind magazine data to Spline variables (best-effort)
      collectionIssues.forEach((issue, i) => {
        const idx = i + 1;
        try {
          splineApp.setVariable(`Vol_Label_${idx}`, `Vol.${String(issue.issue_number).padStart(2, "0")}`);
          splineApp.setVariable(`Title_${idx}`, issue.title);
          splineApp.setVariable(`Visible_${idx}`, true);
        } catch {
          // Variables may not exist in Spline scene yet — skip silently
        }
      });
    },
    [setSplineApp, setSplineLoaded, setCameraState, setEntryComplete, collectionIssues]
  );

  const handleMouseDown = useCallback(
    (e: { target: { name: string } }) => {
      const name = e?.target?.name;
      if (!name) return;

      // Match magazine objects named "Magazine_1", "Magazine_2", etc.
      const match = name.match(/Magazine_(\d+)/i);
      if (match) {
        const index = parseInt(match[1], 10) - 1;
        onBookClick?.(index);
      }
    },
    [onBookClick]
  );

  return (
    <Spline
      scene={SCENE_URL}
      onLoad={handleLoad}
      onSplineMouseDown={handleMouseDown}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
