import { create } from "zustand";

type FilterKey = "all" | "latest" | "clothing" | "accessories" | "shoes" | "bags";

export const useFilterStore = create<{
  activeFilter: FilterKey;
  setFilter: (f: FilterKey) => void;
}>((set) => ({
  activeFilter: "all",
  setFilter: (f) => set({ activeFilter: f }),
}));

