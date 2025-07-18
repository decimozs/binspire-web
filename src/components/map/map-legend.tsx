import { Circle, Compass } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

const wasteStatusLegend = [
  {
    label: "Not Full",
    color: "text-green-500",
  },
  {
    label: "Almost Full",
    color: "text-yellow-500",
  },
  {
    label: "Full",
    color: "text-orange-500",
  },
  {
    label: "Overflowing",
    color: "text-red-500",
  },
];

export default function MapLegend() {
  const [viewDirections] = useQueryState("view_directions", parseAsBoolean);

  if (viewDirections) return null;

  return (
    <div className="absolute top-4 p-2 rounded-md left-4 border bg-background/40 backdrop-blur-sm backdrop-filter hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
      <div className="flex flex-row items-center gap-2 mb-2">
        <Compass size={15} />
        <h3 className="font-semibold">Legend</h3>
      </div>
      {wasteStatusLegend.map((status) => (
        <div key={status.label} className="flex items-center gap-2">
          <Circle className={status.color} size={14} fill="currentColor" />
          <span>{status.label}</span>
        </div>
      ))}
    </div>
  );
}
