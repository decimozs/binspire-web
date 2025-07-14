import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { mapLayerItems } from "@/lib/constants";
import { useMapLayerStore } from "@/store/use-map-layers-store";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Layers } from "lucide-react";

export default function MapLayers() {
  const { setLayer, setLayerImage, layerImage } = useMapLayerStore();
  const [viewDirections] = useQueryState("view_directions", parseAsBoolean);
  const isMobile = useIsMobile();

  const handleSetMapLayer = (layer: string, layerImage: string) => {
    setLayer(layer);
    setLayerImage(layerImage);
    sessionStorage.setItem("mapLayer", JSON.stringify({ layer, layerImage }));
  };

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="glassmorphismOutline"
            className={`fixed ${viewDirections ? "bottom-24" : "bottom-8"} ml-4 cursor-pointer`}
          >
            <Layers />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex flex-row items-center gap-4">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <Layers className="opacity-80" size={23} />
            </div>
            <div className="flex flex-col text-left">
              <DrawerTitle>Map Layers</DrawerTitle>
              <DrawerDescription>
                Available map layers to choose from.
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4 flex flex-row items-center gap-4">
            {mapLayerItems.map((item) => (
              <div
                className="w-[90px] h-full rounded-md border-[1px] border-input cursor-pointer"
                onClick={() => handleSetMapLayer(item.layer, item.layerImage)}
                key={item.name}
              >
                <img
                  src={item.layerImage}
                  alt="layer-image"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`fixed ${viewDirections ? "bottom-24" : "bottom-8"} ml-4 cursor-pointer`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-[90px] h-[90px] rounded-md border-[1px] border-muted">
              <img
                src={layerImage}
                alt="layer-image"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent align="center" side="top">
            Map Layers
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        className="ml-4 flex flex-row gap-2 h-[90px] p-2 "
      >
        {mapLayerItems.map((item) => (
          <div
            className="w-[90px] h-full rounded-md border-[1px] border-input cursor-pointer"
            onClick={() => handleSetMapLayer(item.layer, item.layerImage)}
            key={item.name}
          >
            <img
              src={item.layerImage}
              alt="layer-image"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
