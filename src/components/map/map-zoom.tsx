import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useMap } from "react-map-gl/maplibre";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MapZoom() {
  const { current: map } = useMap();

  const handleZoomIn = () => {
    map?.zoomIn({ essential: true });
  };

  const handleZoomOut = () => {
    map?.zoomOut({ essential: true });
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" onClick={handleZoomIn}>
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center" side="left">
          <p>Zoom in</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" onClick={handleZoomOut}>
            <Minus />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center" side="left">
          <p>Zoom out</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
