import {
  CircleAlert,
  CircleCheck,
  CirclePlus,
  Clock,
  Route,
} from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import length from "@turf/length";
import { lineString } from "@turf/helpers";
import { useDirectionStore } from "@/store/use-direction-store";
import { Badge } from "../ui/badge";
import { useMap } from "react-map-gl/maplibre";
import { INITIAL_VIEW_STATE } from "@/lib/constants";
import CollectTrashbinModal from "../modal/collect-trashbin-modal";
import ReportTrashbinModal from "../modal/report-trashbin-modal";
import { addMinutes, format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useTrashbin from "@/queries/use-trashbin";
import { generateIdNumber } from "@/lib/utils";
import { Separator } from "../ui/separator";
import CancelCollectionModal from "../modal/cancel-collection-modal";
import { useTrashbinLiveStore } from "@/store/use-live-trashbin-store";

export default function DirectionGuide() {
  const { getTrashbinById } = useTrashbin();
  const { current: map } = useMap();
  const [viewDirections, setViewDirections] = useQueryState(
    "view_directions",
    parseAsBoolean,
  );
  const [collectionStatus] = useQueryState("collection_status");
  const [trashbinId, setTrashbinId] = useQueryState("trashbin_id");
  const directionData = useDirectionStore((state) => state.directionData);
  const clearDirectionsData = useDirectionStore(
    (state) => state.clearDirectionData,
  );
  const [, setCollectionStatus] = useQueryState("collection_status");
  const liveData = useTrashbinLiveStore((state) => state.liveData);
  const trashbinLive = trashbinId ? liveData[trashbinId] : undefined;
  const { data, isLoading } = getTrashbinById(trashbinId ?? "");

  const clearDirections = () => {
    setViewDirections(null);
    setTrashbinId(null);
    clearDirectionsData();
    setCollectionStatus(null);
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
          <div className="">
            <div>
              <div className="flex flex-row items-center gap-3 ml-2">
                {collectionStatus === "in-progress" && (
                  <>
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                    </span>
                    <p className="text-lg mt-0.5">Navigating to Trashbin</p>
                  </>
                )}
                {collectionStatus === "complete" && (
                  <>
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                    </span>
                    <p className="text-lg mt-0.5">Collected Successfully</p>
                  </>
                )}
              </div>
              <div className="flex flex-row justify-start gap-1 ml-2 mt-0.5 mb-1">
                <Badge variant="outline">
                  <Route />
                  {totalDistance} KM
                </Badge>
                <Badge variant="outline">
                  <Clock />
                  ETA: {format(addMinutes(new Date(), durationMinutes), "p")}
                </Badge>
                <Badge variant="outline">
                  {collectionStatus === "in-progress" && (
                    <>
                      <CirclePlus />
                      In progress
                    </>
                  )}
                  {collectionStatus === "complete" && (
                    <>
                      <CircleCheck />
                      Complete
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
          <Accordion
            type="single"
            collapsible
            className="w-full px-2 -mt-1 -mb-2"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex flex-row items-center gap-2">
                  <CircleAlert size={15} />
                  {isLoading
                    ? "Loading collection information..."
                    : "Collection Information"}
                </div>
              </AccordionTrigger>
              {!data ? (
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>Loading data...</p>
                </AccordionContent>
              ) : (
                <AccordionContent className="flex flex-col gap-2 text-balance">
                  <Separator className="mb-2" />
                  <div className="flex flex-row items-center justify-between">
                    <p>Trashbin Id</p>
                    <p>TRASHBIN-{generateIdNumber(data?.id)}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <p>Name</p>
                    <p>{data.name}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <p>Location</p>
                    <p>{data.location}</p>
                  </div>
                  {trashbinLive ? (
                    <>
                      <Separator className="my-2" />
                      <div className="flex flex-row items-center justify-between">
                        <p>Waste Level</p>
                        <p>{trashbinLive.status.wasteLevel}%</p>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <p>Weight Level</p>
                        <p>{trashbinLive.status.weightLevel} kg</p>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <p>Battery Level</p>
                        <p>{trashbinLive.status.batteryLevel}%</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      No live data available
                    </p>
                  )}
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-50 w-full p-4">
        <div className="w-full flex items-center flex-row gap-2">
          <CancelCollectionModal onCancel={clearDirections} />
          <div className="flex-1">
            <CollectTrashbinModal trashbinId={trashbinId ?? ""} />
          </div>
          <ReportTrashbinModal type="icon" />
        </div>
      </div>
    </>
  );
}
