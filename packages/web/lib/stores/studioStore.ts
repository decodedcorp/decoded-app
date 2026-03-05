import { create } from "zustand";
import type { Application } from "@splinetool/runtime";

export type CameraState = "loading" | "entry" | "browse" | "focused" | "exit";

interface StudioState {
  cameraState: CameraState;
  focusedIssueId: string | null;
  entryComplete: boolean;
  splineLoaded: boolean;
  splineApp: Application | null;

  setCameraState: (state: CameraState) => void;
  setFocusedIssueId: (id: string | null) => void;
  setEntryComplete: (complete: boolean) => void;
  setSplineLoaded: (loaded: boolean) => void;
  setSplineApp: (app: Application | null) => void;
  reset: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  cameraState: "loading",
  focusedIssueId: null,
  entryComplete: false,
  splineLoaded: false,
  splineApp: null,

  setCameraState: (state) => set({ cameraState: state }),
  setFocusedIssueId: (id) => set({ focusedIssueId: id }),
  setEntryComplete: (complete) => set({ entryComplete: complete }),
  setSplineLoaded: (loaded) => set({ splineLoaded: loaded }),
  setSplineApp: (app) => set({ splineApp: app }),
  reset: () =>
    set({
      cameraState: "loading",
      focusedIssueId: null,
      entryComplete: false,
      splineLoaded: false,
      splineApp: null,
    }),
}));
