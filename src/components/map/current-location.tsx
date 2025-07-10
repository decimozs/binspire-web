import { useEffect, useRef, useState } from "react";
import { Marker, useMap } from "react-map-gl/maplibre";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Locate, LocateOff } from "lucide-react";
import { INITIAL_VIEW_STATE } from "@/lib/constants";

export default function UserLocationTracking() {
  const { current: map } = useMap();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        map?.flyTo({
          center: [longitude, latitude],
          zoom: INITIAL_VIEW_STATE.zoom,
          bearing: INITIAL_VIEW_STATE.bearing,
          pitch: INITIAL_VIEW_STATE.pitch,
          essential: true,
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

  return (
    <>
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

      {userLocation && (
        <Marker
          longitude={userLocation.lng}
          latitude={userLocation.lat}
          anchor="center"
        >
          <div className="bg-blue-600 h-4 w-4 rounded-full border-2 border-white" />
        </Marker>
      )}
    </>
  );
}
