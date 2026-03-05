/**
 * Magazine Store - Zustand state for magazine screens
 *
 * Manages daily editorial (SCR-MAG-01), personal issue (SCR-MAG-02),
 * and collection bookshelf (SCR-COL-01) state.
 *
 * Currently loads from mock JSON fixtures. Will switch to API calls
 * when backend is ready.
 */

import { create } from "zustand";
import type {
  MagazineIssue,
  PersonalStatus,
} from "../components/magazine/types";

import dailyEditorialData from "../components/magazine/mock/daily-editorial.json";
import personalIssueData from "../components/magazine/mock/personal-issue.json";
import collectionIssuesData from "../components/magazine/mock/collection-issues.json";

/** Simulate network delay for mock data loading */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface MagazineState {
  // Daily editorial (SCR-MAG-01)
  currentIssue: MagazineIssue | null;
  isLoading: boolean;
  error: string | null;

  // Personal issue (SCR-MAG-02)
  personalIssue: MagazineIssue | null;
  personalStatus: PersonalStatus;

  // Collection (SCR-COL-01)
  collectionIssues: MagazineIssue[];
  activeIssueId: string | null;

  // Actions
  loadDailyIssue: () => Promise<void>;
  loadPersonalIssue: () => Promise<void>;
  loadCollection: () => Promise<void>;
  setPersonalStatus: (status: PersonalStatus) => void;
  setActiveIssueId: (id: string | null) => void;
  clearError: () => void;
}

export const useMagazineStore = create<MagazineState>((set) => ({
  // Initial state
  currentIssue: null,
  isLoading: false,
  error: null,
  personalIssue: null,
  personalStatus: "idle",
  collectionIssues: [],
  activeIssueId: null,

  /**
   * Load today's daily editorial from mock data
   */
  loadDailyIssue: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay(500);
      set({
        currentIssue: dailyEditorialData as unknown as MagazineIssue,
        isLoading: false,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load daily editorial";
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Load personal issue from mock data
   */
  loadPersonalIssue: async () => {
    set({ isLoading: true, error: null, personalStatus: "checking" });
    try {
      await delay(500);
      set({
        personalIssue: personalIssueData as unknown as MagazineIssue,
        personalStatus: "ready",
        isLoading: false,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load personal issue";
      set({
        error: message,
        personalStatus: "error",
        isLoading: false,
      });
    }
  },

  /**
   * Load collection of saved issues from mock data
   */
  loadCollection: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay(500);
      set({
        collectionIssues: collectionIssuesData as unknown as MagazineIssue[],
        isLoading: false,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load collection";
      set({ error: message, isLoading: false });
    }
  },

  setPersonalStatus: (status: PersonalStatus) => {
    set({ personalStatus: status });
  },

  setActiveIssueId: (id: string | null) => {
    set({ activeIssueId: id });
  },

  clearError: () => {
    set({ error: null });
  },
}));
