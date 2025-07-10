import { create } from "zustand";

interface TrashbinLiveData {
  wasteLevel: number;
  weightLevel: number;
  batteryLevel: number;
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
