import trashbinApi from "@/api/trashbin-api";
import { mockTruckData } from "@/lib/constants";
import { useTrashbinLiveStore } from "@/store/use-live-trashbin-store";
import type { Layer } from "@deck.gl/core";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";

export interface Map3DLayer {
  name: string;
  id: string;
  location: string;
  coordinates: [longitude: number, latitude: number];
}

interface TrashbinGLBData {
  id: string;
  coordinates: string[];
  wasteLevel: number;
}

export const tMockTrashbinData = async () => {
  const trashbins = await trashbinApi.getTrashbins();

  if (!trashbins) {
    return [];
  }

  return trashbins.map((bin) => ({
    ...bin,
    coordinates: [parseFloat(bin.longitude), parseFloat(bin.latitude)],
  }));
};

export async function createTrashbinLayer({
  onClick,
  onlyShowId,
}: {
  onClick: (info: { id: string }) => void;
  onlyShowId?: string;
}): Promise<Layer[]> {
  const liveData = useTrashbinLiveStore.getState().liveData;

  const tData = Object.values(liveData)
    .filter(
      (item) =>
        Number(item.trashbin.latitude) !== 0 &&
        Number(item.trashbin.longitude) !== 0,
    )
    .map((item) => ({
      id: item.trashbin.id,
      coordinates: [item.trashbin.longitude, item.trashbin.latitude],
      wasteLevel: item.status.wasteLevel,
    }));

  const filteredData = onlyShowId
    ? tData.filter((t) => t.id === onlyShowId)
    : tData;

  const binsByLevel = {
    overflowing: filteredData.filter((b) => b.wasteLevel >= 100),
    full: filteredData.filter((b) => b.wasteLevel >= 90 && b.wasteLevel < 100),
    almostFull: filteredData.filter(
      (b) => b.wasteLevel >= 70 && b.wasteLevel < 90,
    ),
    notFull: filteredData.filter((b) => b.wasteLevel < 70),
  };

  const createLayer = (id: string, data: TrashbinGLBData[], glbPath: string) =>
    new ScenegraphLayer({
      id,
      data,
      scenegraph: glbPath,
      getPosition: (d) => d.coordinates,
      sizeScale: onlyShowId ? 7 : 1,
      getScale: [0.1, 0.1, 0.1],
      getOrientation: [0, Math.random() * 1, 90],
      _lighting: "pbr",
      pickable: true,
      onClick: (info) => {
        if (info.object) onClick({ id: info.object.id });
      },
    });

  return [
    createLayer(
      "bin-layer-overflowing",
      binsByLevel.overflowing,
      "/models/overflowing.glb",
    ),
    createLayer("bin-layer-full", binsByLevel.full, "/models/full.glb"),
    createLayer(
      "bin-layer-almost-full",
      binsByLevel.almostFull,
      "/models/almost-full.glb",
    ),
    createLayer(
      "bin-layer-not-full",
      binsByLevel.notFull,
      "/models/not-full.glb",
    ),
  ];
}

export function createTruckLayer() {
  return new ScenegraphLayer<Map3DLayer>({
    id: "truck-layer",
    data: mockTruckData,
    getPosition: (l: Map3DLayer) => l.coordinates,
    getOrientation: [0, Math.random() * 100, 90],
    scenegraph: "/models/truck2.glb",
    getScale: [0.7, 0.7, 0.7],
    _lighting: "pbr",
    pickable: true,
  });
}
