import { useEffect, useState } from "react";
import Map, { useControl } from "react-map-gl/maplibre";
import { MapProvider } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";
import type { DeckProps, Layer } from "@deck.gl/core";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";

import MapZoom from "../map/map-zoom";
import ResetMapView from "../map/reset-map-view";
import UserLocationTracking from "../map/current-location";
import MapLayers from "../map/change-map-layers";

import { useMapLayerStore } from "@/store/use-map-layers";
import { parseAsBoolean, useQueryState } from "nuqs";
import { createTrashbinLayer } from "@/lib/layers";
import { INITIAL_VIEW_STATE } from "@/lib/constants";
import { useUserLocationStore } from "@/store/user-user-location";
import { calculateBearing } from "@/lib/utils";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

export default function DashboardMap() {
  const { layer, setLayer, setLayerImage } = useMapLayerStore();
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [, setViewTrashbin] = useQueryState("view_trashbin", parseAsBoolean);
  const userLocation = useUserLocationStore((state) => state.location);
  const previousLocation = useUserLocationStore(
    (state) => state.previousLocation,
  );
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

      setLayers([trashbinLayer]);
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

  useEffect(() => {
    if (!userLocation) return;

    const bearing =
      previousLocation && previousLocation !== userLocation
        ? calculateBearing(previousLocation, userLocation)
        : 0;

    const userTruckLayer = new ScenegraphLayer({
      id: "user-truck-layer",
      data: [userLocation],
      getPosition: (d) => [d.lng, d.lat],
      getOrientation: [0, bearing, 90],
      scenegraph: "/models/truck2.glb",
      getScale: [0.7, 0.7, 0.7],
      _lighting: "pbr",
      pickable: false,
      transitions: {
        getPosition: {
          duration: 500,
          easing: (t: number) => t,
        },
        getOrientation: {
          duration: 500,
          easing: (t: number) => t,
        },
      },
    });

    setLayers((prevLayers) => {
      const filtered = prevLayers.filter((l) => l.id !== "user-truck-layer");
      return [...filtered, userTruckLayer];
    });
  }, [userLocation, previousLocation]);

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
