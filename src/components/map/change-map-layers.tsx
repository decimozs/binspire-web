import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMapLayerStore } from "@/store/use-map-layers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mapLayerItems } from "@/lib/constants";

export default function MapLayers() {
  const { setLayer, setLayerImage, layerImage } = useMapLayerStore();

  const handleSetMapLayer = (layer: string, layerImage: string) => {
    setLayer(layer);
    setLayerImage(layerImage);
    sessionStorage.setItem("mapLayer", JSON.stringify({ layer, layerImage }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="fixed bottom-8 ml-4 cursor-pointer">
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
