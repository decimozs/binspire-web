import trashbinApi from "@/api/trashbin-api";
import { mockTruckData } from "@/lib/constants";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";

export interface Map3DLayer {
  name: string;
  id: string;
  location: string;
  coordinates: [longitude: number, latitude: number];
}

const tMockTrashbinData = async () => {
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
}) {
  const tData = await tMockTrashbinData();

  const filteredData = onlyShowId
    ? tData.filter((t) => t.id === onlyShowId)
    : tData;

  return new ScenegraphLayer({
    id: "bin-layer",
    data: filteredData,
    getPosition: (l: Map3DLayer) => l.coordinates,
    scenegraph: "/models/bin.glb",
    sizeScale: onlyShowId ? 7 : 1,
    getScale: [0.1, 0.1, 0.1],
    getOrientation: [0, Math.random() * 1, 90],
    _lighting: "pbr",
    pickable: true,
    onClick: (info) => {
      if (info.object) onClick({ id: info.object.id });
    },
  });
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
