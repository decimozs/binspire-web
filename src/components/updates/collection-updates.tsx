import { Activity } from "lucide-react";
import WasteStatusBadge from "../badge/waste-status-badge";
import useCollection from "@/queries/use-collection";
import { generateIdNumber } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";

export default function CollectionUpdates() {
  const { getCollections } = useCollection();
  const { data, isLoading } = getCollections;

  if (isLoading || !data) {
    return (
      <div className="flex flex-col min-h-0 border-[1px] border-input border-dashed rounded-md p-4 w-full">
        <div className="flex flex-row items-center gap-4 mb-4 shrink-0">
          <Activity size={20} />
          <h1 className="text-xl font-semibold">Recent Updates</h1>
        </div>

        <div className="grow overflow-y-auto flex flex-col gap-4 max-h-[85vh]">
          <p>Loading Collection updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 border-[1px] border-input border-dashed rounded-md p-4 w-full">
      <div className="flex flex-row items-center gap-4 mb-4 shrink-0">
        <Activity size={20} />
        <h1 className="text-xl font-semibold">Recent Updates</h1>
      </div>

      <div className="grow overflow-y-auto flex flex-col gap-4 max-h-[85vh]">
        {[...data]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((collection) => (
            <div
              key={collection.id}
              className="p-4 bg-accent/40 border-input rounded-md flex flex-col gap-2 border-[1px]"
            >
              <p className="font-bold">
                COLLECTION-{generateIdNumber(collection.id)}
              </p>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <WasteStatusBadge status="low" metric="waste" />
                  <WasteStatusBadge status="high" metric="weight" />
                  <WasteStatusBadge status="medium" metric="battery" />
                </div>
                <div>
                  <p className="font-bold">
                    Collected on: {format(collection.createdAt, "MMM dd yyyy")}
                  </p>
                  <p className="text-right text-sm">
                    {formatDistanceToNow(new Date(collection.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}{" "}
      </div>
    </div>
  );
}
