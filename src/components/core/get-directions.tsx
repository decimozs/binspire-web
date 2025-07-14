import { parseAsBoolean, useQueryState } from "nuqs";
import { Button } from "../ui/button";
import type { Trashbin } from "@/schemas/trashbin-schema";
import { useUserLocationStore } from "@/store/use-user-location-store";
import { useDirectionStore } from "@/store/use-direction-store";
import useDirection from "@/queries/use-direction";
import { useNavigate } from "@tanstack/react-router";

interface GetDirectionsProps {
  data: Trashbin;
  handleOpenChange: (open: boolean) => void;
}

export default function GetDirections({
  data,
  handleOpenChange,
}: GetDirectionsProps) {
  const navigate = useNavigate();
  const setUserLocation = useUserLocationStore((state) => state.setLocation);
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [, setCollectionStatus] = useQueryState("collection_status");
  const [viewDirections, setViewDirections] = useQueryState(
    "view_directions",
    parseAsBoolean,
  );
  const setDirectionData = useDirectionStore((state) => state.setDirectionData);
  const { getDirections } = useDirection();
  const handleSetDirections = () => {
    if (!data) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setUserLocation({ lat: latitude, lng: longitude });

        getDirections.mutate(
          {
            start: `${longitude},${latitude}`,
            end: `${data.longitude},${data.latitude}`,
          },
          {
            onSuccess: (directionData) => {
              if (!directionData) {
                console.warn("No direction data received");
                return;
              }

              handleOpenChange(false);
              setTimeout(() => {
                setDirectionData(directionData);
                setViewDirections(true);
                setTrashbinId(data.id);
                setCollectionStatus("in-progress");
              }, 300);

              navigate({ to: "/dashboard/map" });
            },
            onError: (error) => {
              console.error("Failed to fetch directions:", error);
            },
          },
        );
      },
      (error) => {
        console.error("Could not get current location:", error);
        alert("Please allow location access to get directions.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  if (viewDirections) {
    return <Button disabled={true}>Navigating</Button>;
  }

  return (
    <Button onClick={handleSetDirections} disabled={getDirections.isPending}>
      {getDirections.isPending
        ? "Navigating the best route..."
        : "Get directions"}
    </Button>
  );
}
