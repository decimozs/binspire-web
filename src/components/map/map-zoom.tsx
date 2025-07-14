import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useMap } from "react-map-gl/maplibre";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MapZoom() {
  const { current: map } = useMap();
  const isMobile = useIsMobile();

  const handleZoomIn = () => {
    map?.zoomIn({ essential: true });
  };

  const handleZoomOut = () => {
    map?.zoomOut({ essential: true });
  };

  if (isMobile) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleZoomIn} variant="glassmorphismOutline">
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center" side="left">
          <p>Zoom in</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleZoomOut} variant="glassmorphismOutline">
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
