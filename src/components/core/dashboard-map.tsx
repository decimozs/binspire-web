import { useEffect, useRef, useState } from "react";
import Map, { useControl, type MapRef } from "react-map-gl/maplibre";
import { MapProvider } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";
import type { DeckProps, Layer } from "@deck.gl/core";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import MapZoom from "../map/map-zoom";
import ResetMapView from "../map/reset-map-view";
import UserLocationTracking from "../map/current-location";
import MapLayers from "../map/change-map-layers";
import { parseAsBoolean, useQueryState } from "nuqs";
import { createTrashbinLayer } from "@/lib/layers";
import { INITIAL_VIEW_STATE } from "@/lib/constants";
import { calculateBearing, delay } from "@/lib/utils";
import { useMapLayerStore } from "@/store/use-map-layers-store";
import { useUserLocationStore } from "@/store/use-user-location-store";
import { useDirectionStore } from "@/store/use-direction-store";
import { GeoJsonLayer } from "@deck.gl/layers";
import DirectionGuide from "./direction-guide";
import { lineString, center as turfCenter } from "@turf/turf";
import length from "@turf/length";
import { useTrashbinLiveStore } from "@/store/use-live-trashbin-store";
import MapLegend from "../map/map-legend";
import { bearing } from "@turf/turf";
import { point } from "@turf/helpers";
import Loading from "./loading";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

export default function DashboardMap() {
  const { layer, setLayer, setLayerImage } = useMapLayerStore();
  const directionData = useDirectionStore((state) => state.directionData);
  const mapRef = useRef<MapRef>(null);
  const [viewDirections] = useQueryState("view_directions", parseAsBoolean);
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [, setViewTrashbin] = useQueryState("view_trashbin", parseAsBoolean);
  const [trashbinId] = useQueryState("trashbin_id");
  const userLocation = useUserLocationStore((state) => state.location);
  const liveData = useTrashbinLiveStore((state) => state.liveData);
  const [loadingMessage, setLoadingMessage] = useState("Waiting for live data");
  const [isLoading, setIsLoading] = useState(true);
  const previousLocation = useUserLocationStore(
    (state) => state.previousLocation,
  );
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    const loadTrashbinLayer = async () => {
      setLoadingMessage("Generating map layers");
      const trashbinLayer = await createTrashbinLayer({
        onClick: (info) => {
          if (info.id) {
            setTrashbinId(info.id);
            setViewTrashbin(true);
          }
        },
        onlyShowId: viewDirections && trashbinId ? trashbinId : undefined,
      });

      setLayers((prev) => {
        const withoutBinLayers = prev.filter(
          (l) => !l.id?.startsWith("bin-layer"),
        );
        return [...withoutBinLayers, ...trashbinLayer];
      });

      setLoadingMessage("Loading map");
      await delay(500);
      setIsLoading(false);
    };

    if (Object.keys(liveData).length > 0) {
      setLoadingMessage("Generating map data...");
      delay(800).then(() => loadTrashbinLayer());
    } else {
      setLoadingMessage("Waiting for live data");
      setIsLoading(true);
    }
  }, [viewDirections, trashbinId, liveData]);

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
      sizeScale: 10,
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

  useEffect(() => {
    setLayers((prev) => {
      const filtered = prev.filter((l) => l.id !== "route-layer");

      if (!viewDirections || !directionData) {
        return filtered;
      }

      const routeLayer = new GeoJsonLayer({
        id: "route-layer",
        data: directionData,
        getLineColor: [123, 225, 201],
        getLineWidth: 10,
        pickable: false,
      });

      return [...filtered, routeLayer];
    });
  }, [viewDirections, directionData]);

  useEffect(() => {
    if (
      !viewDirections ||
      !directionData ||
      !mapRef.current ||
      !directionData.features?.[0] ||
      !userLocation
    ) {
      return;
    }

    const coordinates = directionData.features[0].geometry.coordinates;
    const route = lineString(coordinates);
    const totalDistance = length(route);
    const zoom = totalDistance > 5 ? 13 : 14;

    const centerPoint = turfCenter(directionData);
    const [lng, lat] = centerPoint.geometry.coordinates;
    const screenHeight = window.innerHeight;

    const from = point([userLocation?.lng, userLocation?.lat]);
    const toCoords = coordinates[coordinates.length - 1];
    const to = point(toCoords);

    const angle = bearing(from, to);

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom,
      bearing: angle,
      pitch: 45,
      duration: 1000,
      padding: {
        top: screenHeight * 0.1,
        bottom: screenHeight * 0.4,
        left: 40,
        right: 40,
      },
    });
  }, [mapRef.current, directionData, viewDirections]);

  if (isLoading) {
    return <Loading type="screen" message={loadingMessage} />;
  }

  return (
    <MapProvider>
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
        mapStyle={`https://api.maptiler.com/maps/${layer}/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`}
      >
        <MapLegend />
        <DirectionGuide />
        <div
          className={`fixed ${viewDirections ? "bottom-24" : "bottom-8"} right-8 flex flex-col gap-2`}
        >
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
