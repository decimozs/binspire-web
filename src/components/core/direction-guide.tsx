import { ArrowUpRight, Clock, Route, RouteOff } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import length from "@turf/length";
import { lineString } from "@turf/helpers";
import { useDirectionStore } from "@/store/use-direction-store";
import { Badge } from "../ui/badge";
import { useMap } from "react-map-gl/maplibre";
import { INITIAL_VIEW_STATE } from "@/lib/constants";
import { Button } from "../ui/button";
import CollectTrashbinModal from "../modal/collect-trashbin-modal";
import ReportTrashbinModal from "../modal/report-trashbin-modal";

export default function DirectionGuide() {
  const { current: map } = useMap();
  const [viewDirections, setViewDirections] = useQueryState(
    "view_directions",
    parseAsBoolean,
  );
  const [trashbinId, setTrashbinId] = useQueryState("trashbin_id");
  const directionData = useDirectionStore((state) => state.directionData);
  const clearDirectionsData = useDirectionStore(
    (state) => state.clearDirectionData,
  );

  const clearDirections = () => {
    setViewDirections(null);
    setTrashbinId(null);
    clearDirectionsData();
    setTimeout(() => {
      map?.flyTo({
        center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
        zoom: INITIAL_VIEW_STATE.zoom,
        bearing: INITIAL_VIEW_STATE.bearing,
        pitch: INITIAL_VIEW_STATE.pitch,
        essential: true,
      });
    }, 300);
  };

  if (!viewDirections || !directionData) {
    return null;
  }

  const coordinates = directionData.features[0].geometry.coordinates;
  const routeLine = lineString(coordinates);
  const totalDistance = length(routeLine).toFixed(2);

  const route = lineString(directionData.features[0].geometry.coordinates);
  const distanceKm = length(route);
  const averageSpeedKph = 30;
  const durationHours = distanceKm / averageSpeedKph;
  const durationMinutes = durationHours * 60;

  return (
    <>
      <div className="absolute top-0 left-0 z-50 w-full p-4">
        <div className="bg-background/40 backdrop-blur-sm backdrop-filter p-2 rounded-md border-input border-[1px]">
          <div className="flex flex-row-reverse justify-between">
            <ArrowUpRight size={30} className="mt-0.5" />
            <div>
              <div className="flex flex-row items-center gap-3 ml-2">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                </span>
                <p className="text-lg mt-0.5">Navigating to Trashbin</p>
              </div>
              <div className="flex flex-row justify-end gap-1 ml-2 mt-0.5 mb-1">
                <Badge variant="outline">
                  <Route />
                  {totalDistance} KM
                </Badge>
                <Badge variant="outline">
                  <Clock /> ETA: {durationMinutes.toFixed(2)} minutes
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-50 w-full p-4">
        <div className="w-full flex items-center flex-row gap-2">
          <Button variant="destructive" onClick={clearDirections}>
            <RouteOff />
          </Button>
          <div className="flex-1">
            <CollectTrashbinModal trashbinId={trashbinId ?? ""} />
          </div>
          <ReportTrashbinModal type="icon" />
        </div>
      </div>
    </>
  );
}
