import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { generateIdNumber } from "@/lib/utils";
import type { Trashbin } from "@/schemas/trashbin-schema";
import { formatDistanceToNow } from "date-fns";
import { parseAsBoolean, useQueryState } from "nuqs";

interface ReviewTrashbinDrawerProps {
  data: Trashbin;
}

export default function ReviewTrashbinDrawer({
  data,
}: ReviewTrashbinDrawerProps) {
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [, setViewTrashbin] = useQueryState("view_trashbin", parseAsBoolean);
  const handleSetParams = () => {
    setViewTrashbin(true);
    setTrashbinId(data.id);
  };

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
              {formatDistanceToNow(new Date(data.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </DrawerTrigger>
    </Drawer>
  );
}
