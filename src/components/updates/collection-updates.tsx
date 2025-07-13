import { Activity } from "lucide-react";
import WasteStatusBadge from "../badge/waste-status-badge";

export default function CollectionUpdates() {
  return (
    <div className="flex flex-col min-h-0 border-[1px] border-input border-dashed rounded-md p-4 w-full">
      <div className="flex flex-row items-center gap-4 mb-4 shrink-0">
        <Activity size={20} />
        <h1 className="text-xl font-semibold">Recent Updates</h1>
      </div>

      <div className="grow overflow-y-auto flex flex-col gap-4 max-h-[85vh]">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-accent/40 border-input rounded-md flex flex-col gap-2 border-[1px]"
          >
            <p className="font-bold">COLLECTION-{3123 + i}</p>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <WasteStatusBadge status="low" metric="waste" />
                <WasteStatusBadge status="high" metric="weight" />
                <WasteStatusBadge status="medium" metric="battery" />
              </div>
              <p className="font-bold">Collected on: Jan 12, 2003</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
