import { create } from "zustand";

export const useSearchStore = create<{
  query: string;
  debouncedQuery: string;
  setQuery: (q: string) => void;
  setDebouncedQuery: (q: string) => void;
}>((set) => ({
  query: "",
  debouncedQuery: "",
  setQuery: (query) => set({ query }),
  setDebouncedQuery: (debouncedQuery) => set({ debouncedQuery }),
}));
