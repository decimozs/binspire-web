import { DeckGL } from "@deck.gl/react";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { INITIAL_VIEW_STATE } from "@/lib/constants";

type BartStation = {
  name: string;
  coordinates: [longitude: number, latitude: number];
};

export default function TrashbinMarker() {
  const layer = new ScenegraphLayer<BartStation>({
    id: "ScenegraphLayer",
    data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json",

    getPosition: (d: BartStation) => d.coordinates,
    getOrientation: [0, Math.random() * 180, 90],
    scenegraph:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb",
    sizeScale: 500,
    _animations: {
      "*": { speed: 5 },
    },
    _lighting: "pbr",
    pickable: true,
  });

  return (
    <DeckGL
      initialViewState={{
        longitude: INITIAL_VIEW_STATE.longitude,
        latitude: INITIAL_VIEW_STATE.latitude,
        zoom: 11,
      }}
      layers={[layer]}
    />
  );
}
