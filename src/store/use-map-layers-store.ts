import { create } from "zustand";

interface MapLayerStore {
  layer: string;
  layerImage: string;
  setLayer: (layer: string) => void;
  setLayerImage: (image: string) => void;
}

export const useMapLayerStore = create<MapLayerStore>((set) => ({
  layer: "019806b1-7482-71db-96b3-1ee247f83d51",
  layerImage: "/images/map-layers-1.png",
  setLayer: (layer) => set({ layer: layer }),
  setLayerImage: (image) => set({ layerImage: image }),
}));
