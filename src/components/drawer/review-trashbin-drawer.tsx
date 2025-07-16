import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { generateIdNumber } from "@/lib/utils";
import type { Collection } from "@/schemas/collection-schema";
import type { Trashbin } from "@/schemas/trashbin-schema";
import { formatDistanceToNowStrict } from "date-fns";
import { parseAsBoolean, useQueryState } from "nuqs";

interface ReviewTrashbinDrawerProps {
  data: Trashbin;
  latestCollection?: Collection;
}

export default function ReviewTrashbinDrawer({
  data,
  latestCollection,
}: ReviewTrashbinDrawerProps) {
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [, setViewTrashbin] = useQueryState("view_trashbin", parseAsBoolean);

  const handleSetParams = () => {
    setViewTrashbin(true);
    setTrashbinId(data.id);
  };

  const displayTime = data.isCollected
    ? (latestCollection?.createdAt ?? data.updatedAt)
    : (data.scheduledAt ?? data.updatedAt);

  return (
    <Drawer>
      <DrawerTrigger onClick={handleSetParams} asChild>
        <div className="p-4 border-[1px] border-input border-dashed rounded-md flex flex-row items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {`TRASHBIN-${generateIdNumber(data.id)}`}
            </p>
            <p>{data.name}</p>
            <p className="text-xs text-muted-foreground">
              {data.isCollected ? "Last collected" : "Scheduled for collection"}{" "}
              {formatDistanceToNowStrict(new Date(displayTime), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </DrawerTrigger>
    </Drawer>
  );
}
