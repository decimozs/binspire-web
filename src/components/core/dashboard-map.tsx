import Map, { useControl } from "react-map-gl/maplibre";
import { MapProvider } from "react-map-gl/maplibre";
import MapZoom from "../map/map-zoom";
import ResetMapView from "../map/reset-map-view";
import { INITIAL_VIEW_STATE } from "@/lib/constants";
import UserLocationTracking from "../map/current-location";
import MapLayers from "../map/change-map-layers";
import { useMapLayerStore } from "@/store/use-map-layers";
import { useEffect, useState } from "react";
import { MapboxOverlay } from "@deck.gl/mapbox";
import type { DeckProps, Layer } from "@deck.gl/core";
import { parseAsBoolean, useQueryState } from "nuqs";
import { createTrashbinLayer, createTruckLayer } from "@/lib/layers";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

export default function DashboardMap() {
  const { layer, setLayer, setLayerImage } = useMapLayerStore();
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [, setViewTrashbin] = useQueryState("view_trashbin", parseAsBoolean);
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    const loadLayers = async () => {
      const trashbinLayer = await createTrashbinLayer({
        onClick: (info) => {
          if (info.id) {
            setTrashbinId(info.id);
            setViewTrashbin(true);
          }
        },
      });
      const truckLayer = createTruckLayer();
      setLayers([truckLayer, trashbinLayer]);
    };

    loadLayers();
  }, []);

  useEffect(() => {
    const storedLayer = sessionStorage.getItem("mapLayer");
    if (storedLayer) {
      const { layer, layerImage } = JSON.parse(storedLayer);
      setLayer(layer);
      setLayerImage(layerImage);
    }
  }, []);

  return (
    <MapProvider>
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
        mapStyle={`https://api.maptiler.com/maps/${layer}/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`}
      >
        <div className="fixed bottom-8 right-8 flex flex-col gap-2">
          <UserLocationTracking />
          <MapZoom />
          <ResetMapView />
        </div>
        <MapLayers />
        <DeckGLOverlay layers={layers} />
      </Map>
    </MapProvider>
  );
}
