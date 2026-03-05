"use client";

import { useCallback, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import type { Application } from "@splinetool/runtime";
import { useStudioStore } from "@/lib/stores/studioStore";
import { useMagazineStore } from "@/lib/stores/magazineStore";
import { useSplineBridge } from "./useSplineBridge";

const SCENE_URL =
  "https://prod.spline.design/o9G6bAmpXYYxRQxh/scene.splinecode";

export function SplineStudio() {
  const { splineApp, setSplineLoaded, setSplineApp, setCameraState, setEntryComplete } =
    useStudioStore();
  const collectionIssues = useMagazineStore((s) => s.collectionIssues);
  const focusedIssueId = useStudioStore((s) => s.focusedIssueId);
  const setFocusedIssueId = useStudioStore((s) => s.setFocusedIssueId);

  // Bridge: sync React state -> Spline variables + textures
  const focusedIndex = focusedIssueId
    ? collectionIssues.findIndex((i) => i.id === focusedIssueId)
    : null;
  useSplineBridge(splineApp, collectionIssues, focusedIndex === -1 ? null : focusedIndex);

  // Register Spline event listeners directly on app instance
  useEffect(() => {
    if (!splineApp) return;

    const onMouseDown = (e: any) => {
      const name = e?.target?.name;
      console.log("[SplineStudio] mouseDown event:", name, e);

      if (!name) {
        if (focusedIssueId) {
          setFocusedIssueId(null);
          setCameraState("browse");
        }
        return;
      }

      const match = name.match(/Magazine_(\d+)/i);
      if (match) {
        const index = parseInt(match[1], 10) - 1;
        const issue = collectionIssues[index];
        if (issue) {
          setFocusedIssueId(issue.id);
          setCameraState("focused");
        }
      } else if (focusedIssueId) {
        setFocusedIssueId(null);
        setCameraState("browse");
      }
    };

    const onMouseHover = (e: any) => {
      const name = e?.target?.name;
      const isMagazine = name && /Magazine_\d+/i.test(name);
      document.body.style.cursor = isMagazine ? "pointer" : "default";
    };

    splineApp.addEventListener("mouseDown", onMouseDown);
    splineApp.addEventListener("mouseHover", onMouseHover);

    return () => {
      splineApp.removeEventListener("mouseDown", onMouseDown);
      splineApp.removeEventListener("mouseHover", onMouseHover);
      document.body.style.cursor = "default";
    };
  }, [splineApp, focusedIssueId, collectionIssues, setFocusedIssueId, setCameraState]);

  // Escape key -> unfocus
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && focusedIssueId) {
        setFocusedIssueId(null);
        setCameraState("browse");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIssueId, setFocusedIssueId, setCameraState]);

  const handleLoad = useCallback(
    (app: Application) => {
      setSplineApp(app);
      setSplineLoaded(true);
      setCameraState("browse");
      setEntryComplete(true);

      // Ensure event system is active
      try { app.play(); } catch {}

      // Debug: list magazine objects
      try {
        const allObjects = app.getAllObjects();
        const names = allObjects.map((o: any) => o.name).filter(Boolean);
        const magazineObjects = names.filter((n: string) => /magazine/i.test(n));
        console.log("[SplineStudio] Magazine objects:", magazineObjects);
        console.log("[SplineStudio] Spline events:", app.getSplineEvents());
      } catch (err) {
        console.log("[SplineStudio] Init error:", err);
      }
    },
    [setSplineApp, setSplineLoaded, setCameraState, setEntryComplete]
  );

  return (
    <Spline
      scene={SCENE_URL}
      onLoad={handleLoad}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
