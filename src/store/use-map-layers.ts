import { create } from "zustand";

interface MapLayerStore {
  layer: string;
  layerImage: string;
  setLayer: (layer: string) => void;
  setLayerImage: (image: string) => void;
}

export const useMapLayerStore = create<MapLayerStore>((set) => ({
  layer: "0197d4fd-eaa1-7158-974c-223908408a63",
  layerImage: "/images/map-layers-1.png",
  setLayer: (layer) => set({ layer: layer }),
  setLayerImage: (image) => set({ layerImage: image }),
}));
