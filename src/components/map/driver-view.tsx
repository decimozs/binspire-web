import { useMap } from "react-map-gl/maplibre";
import { useCallback } from "react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Button } from "../ui/button";

interface DriverViewProps {
  binCoordinates: { lng: number; lat: number };
}

export default function DriverView({ binCoordinates }: DriverViewProps) {
  const { current: map } = useMap();
  const [viewDirections] = useQueryState("view_directions", parseAsBoolean);

  const handleDriverView = useCallback(() => {
    if (!map) return;

    map.flyTo({
      center: [binCoordinates.lng, binCoordinates.lat],
      zoom: 17,
      pitch: 75,
      bearing: 180,
      duration: 1500,
    });
  }, [map, binCoordinates]);

  if (!viewDirections) return null;

  return (
    <Button
      onClick={handleDriverView}
      className="absolute bottom-50 right-4 bg-black text-white px-4 py-2 rounded-xl shadow-md hover:bg-gray-800 transition"
    >
      Driver View
    </Button>
  );
}
