import type { ORSDirectionsResponse } from "@/lib/types";
import { create } from "zustand";

interface DirectionStore {
  directionData: ORSDirectionsResponse | null;
  setDirectionData: (data: ORSDirectionsResponse) => void;
  clearDirectionData: () => void;
}

export const useDirectionStore = create<DirectionStore>((set) => ({
  directionData: null,
  setDirectionData: (data) => set({ directionData: data }),
  clearDirectionData: () => set({ directionData: null }),
}));
