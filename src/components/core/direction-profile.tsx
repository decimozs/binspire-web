import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import {
  ArrowUpRight,
  Car,
  Truck,
  Bike,
  Mountain,
  BatteryCharging,
  Footprints,
  Accessibility,
} from "lucide-react";
import { parseAsBoolean, parseAsStringEnum, useQueryState } from "nuqs";

const directionProfiles = [
  "driving-car",
  "driving-hgv",
  "cycling-regular",
  "cycling-road",
  "cycling-mountain",
  "cycling-electric",
  "foot-walking",
  "foot-hiking",
  "wheelchair",
];

type DirectionProfileType = (typeof directionProfiles)[number];

const profileIcons: Record<DirectionProfileType, React.ElementType> = {
  "driving-car": Car,
  "driving-hgv": Truck,
  "cycling-regular": Bike,
  "cycling-road": Bike,
  "cycling-mountain": Mountain,
  "cycling-electric": BatteryCharging,
  "foot-walking": Footprints,
  "foot-hiking": Footprints,
  wheelchair: Accessibility,
};

export default function DirectionProfile() {
  const [rawProfile, setSelectedProfile] = useQueryState(
    "profile",
    parseAsStringEnum(directionProfiles),
  );
  const [viewDirections] = useQueryState("view_directions", parseAsBoolean);

  const selectedProfile = rawProfile ?? "driving-car";
  const SelectedIcon = profileIcons[selectedProfile];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="glassmorphismOutline"
          className={`fixed ${viewDirections ? "bottom-37" : "bottom-8"} ml-4 cursor-pointer`}
        >
          <SelectedIcon size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center gap-4">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ArrowUpRight className="opacity-80" size={23} />
          </div>
          <div className="flex flex-col text-left">
            <DrawerTitle>Direction Profile</DrawerTitle>
            <DrawerDescription>
              Available direction profiles to choose from.
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-4 px-4 py-4">
          {directionProfiles.map((profile) => {
            const Icon = profileIcons[profile];
            return (
              <Button
                key={profile}
                variant={selectedProfile === profile ? "default" : "outline"}
                onClick={() => setSelectedProfile(profile)}
                className="flex flex-col gap-1 items-center"
              >
                <Icon size={22} />
                <span className="text-xs capitalize">
                  {profile.replace("-", " ")}
                </span>
              </Button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
