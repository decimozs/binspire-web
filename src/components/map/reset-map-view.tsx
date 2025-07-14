import { RotateCw } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMap } from "react-map-gl/maplibre";
import { INITIAL_VIEW_STATE } from "@/lib/constants";

export default function ResetMapView() {
  const { current: map } = useMap();
  const handleResetMapView = () => {
    map?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      bearing: INITIAL_VIEW_STATE.bearing,
      pitch: INITIAL_VIEW_STATE.pitch,
      essential: true,
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          onClick={handleResetMapView}
          variant="glassmorphismOutline"
        >
          <RotateCw />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="center" side="left">
        <p>Reset Camera View</p>
      </TooltipContent>
    </Tooltip>
  );
}
