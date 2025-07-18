import type { Trashbin } from "@/schemas/trashbin-schema";
import { create } from "zustand";

interface TrashbinStatus {
  wasteLevel: number;
  weightLevel: number;
  batteryLevel: number;
}

interface TrashbinLiveData {
  trashbin: Trashbin;
  status: TrashbinStatus;
}

interface TrashbinLiveState {
  liveData: Record<string, TrashbinLiveData>;
  setLiveData: (id: string, data: TrashbinLiveData) => void;
  clearLiveData: (id: string) => void;
}

export const useTrashbinLiveStore = create<TrashbinLiveState>((set) => ({
  liveData: {},
  setLiveData: (id, data) =>
    set((state) => ({
      liveData: { ...state.liveData, [id]: data },
    })),
  clearLiveData: (id) =>
    set((state) => {
      const newData = { ...state.liveData };
      delete newData[id];
      return { liveData: newData };
    }),
}));
