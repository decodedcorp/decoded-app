import { create } from "zustand";

type FilterKey = "all" | "newjeanscloset" | "blackpinkk.style";

export const useFilterStore = create<{
  activeFilter: FilterKey;
  setFilter: (f: FilterKey) => void;
}>((set) => ({
  activeFilter: "all",
  setFilter: (f) => set({ activeFilter: f }),
}));

