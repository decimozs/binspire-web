import { TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Trashbin } from "@/schemas/trashbin-schema";
import ReviewTrashbinDrawer from "../drawer/review-trashbin-drawer";
import useCollection from "@/queries/use-collection";

type TrashbinStatus = "not-collected" | "collected";

interface TrashbinTabProps {
  data?: Trashbin[];
  isLoading: boolean;
}

export default function TrashbinTab({ data, isLoading }: TrashbinTabProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<TrashbinStatus>("not-collected");
  const { getCollections } = useCollection();
  const { data: latestCollectedTime, isLoading: loadingCollectionTime } =
    getCollections;

  if (isLoading || loadingCollectionTime) {
    return (
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Loading trashbins...
        </p>
      </TabsContent>
    );
  }

  if (!data || !latestCollectedTime) {
    return (
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-xs">
          No trashbins found.
        </p>
      </TabsContent>
    );
  }

  const latestCollectionsMap = new Map<
    string,
    (typeof latestCollectedTime)[0]
  >();

  latestCollectedTime
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .forEach((collection) => {
      if (!latestCollectionsMap.has(collection.trashbinId)) {
        latestCollectionsMap.set(collection.trashbinId, collection);
      }
    });

  const filteredTrashbin = data
    .filter((trashbin) => {
      if (!trashbin.isOperational) return false;
      return selectedStatus === "not-collected"
        ? !trashbin.isCollected && trashbin.isScheduled
        : trashbin.isCollected &&
            !trashbin.isScheduled &&
            !trashbin.scheduledAt;
    })
    .sort((a, b) => {
      if (selectedStatus === "not-collected") {
        const dateA = new Date(
          a.scheduledAt ?? a.updatedAt ?? a.createdAt,
        ).getTime();
        const dateB = new Date(
          b.scheduledAt ?? b.updatedAt ?? b.createdAt,
        ).getTime();
        return dateB - dateA;
      } else {
        const collectionA = latestCollectionsMap.get(a.id);
        const collectionB = latestCollectionsMap.get(b.id);

        const dateA = collectionA
          ? new Date(collectionA.createdAt).getTime()
          : new Date(a.updatedAt ?? a.createdAt).getTime();

        const dateB = collectionB
          ? new Date(collectionB.createdAt).getTime()
          : new Date(b.updatedAt ?? b.createdAt).getTime();

        return dateB - dateA;
      }
    });

  return (
    <TabsContent value="tab-2" className="pb-20">
      <div className="flex flex-col gap-2">
        {filteredTrashbin.map((trashbin) => {
          const latestCollection = latestCollectionsMap.get(trashbin.id);
          return (
            <ReviewTrashbinDrawer
              key={trashbin.id}
              data={trashbin}
              latestCollection={latestCollection}
            />
          );
        })}
        {filteredTrashbin.length === 0 && (
          <p className="text-muted-foreground p-4 text-center text-xs">
            No trashbins found.
          </p>
        )}
      </div>
      <div
        className={`${data.length === 0 ? "hidden" : "fixed"} bottom-0 left-0 p-4 w-full flex flex-row items-center justify-evenly
        bg-background/40 backdrop-blur-xl backdrop-filter text-muted-foreground text-sm`}
      >
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setSelectedStatus("not-collected")}
        >
          <Trash2
            className={selectedStatus === "not-collected" ? "text-primary" : ""}
          />
          <p
            className={selectedStatus === "not-collected" ? "text-primary" : ""}
          >
            Not collected
          </p>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setSelectedStatus("collected")}
        >
          <CheckCircle2
            className={selectedStatus === "collected" ? "text-primary" : ""}
          />
          <p className={selectedStatus === "collected" ? "text-primary" : ""}>
            Collected
          </p>
        </button>
      </div>
    </TabsContent>
  );
}
