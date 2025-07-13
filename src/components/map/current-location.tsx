import { useEffect, useRef, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Locate, LocateOff } from "lucide-react";
import { INITIAL_VIEW_STATE } from "@/lib/constants";
import { useUserLocationStore } from "@/store/user-user-location";
import { useSessionStore } from "@/store/use-session-store";

export default function UserLocationTracking() {
  const { session } = useSessionStore();
  const { current: map } = useMap();
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const setUserLocation = useUserLocationStore((state) => state.setLocation);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setUserLocation(newLocation);

        map?.jumpTo({
          center: [longitude, latitude],
          zoom: INITIAL_VIEW_STATE.zoom,
          bearing: 0,
          pitch: 0,
        });
      },
      (error) => {
        console.error("Error watching position", error);
        alert("Unable to retrieve your location");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      },
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setUserLocation(null);
  };

  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
      setIsTracking(false);
    } else {
      startTracking();
      setIsTracking(true);
    }
  };

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  if (session?.role === "admin") {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" onClick={toggleTracking} className="mb-4">
          {isTracking ? <LocateOff /> : <Locate />}
        </Button>
      </TooltipTrigger>
      <TooltipContent align="center" side="left">
        <p>{isTracking ? "Stop Tracking" : "Track Location"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
