import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History as HistoryIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { format, formatDistanceToNow } from "date-fns";
import { IdToggle } from "../core/id-toggle";
import { formatLabel, generateIdNumber } from "@/lib/utils";
import { UpdateModal } from "./update-modal";
import { DeleteModal } from "./delete-modal";
import PermissionGuard from "../core/permission-guard";
import useHistory from "@/queries/use-history";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export default function ReviewHistoryModal() {
  const { updateHistory, deleteHistory, getHistoryById } = useHistory();
  const [historyId, setHistoryId] = useQueryState("history_id");
  const [viewHistory, setViewHistory] = useQueryState(
    "view_history",
    parseAsBoolean,
  );
  const { data, isLoading } = getHistoryById(historyId || "");
  const isDeleting = deleteHistory.isPending;
  const isUpdating = updateHistory.isPending;

  const [open, setOpen] = useState(!!viewHistory);

  useEffect(() => {
    setOpen(!!viewHistory);
  }, [viewHistory]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setHistoryId(null);
        setViewHistory(null);
      }, 300);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteHistory.mutateAsync(id);
    handleOpenChange(false);
  };

  const handleArchive = async (id: string) => {
    if (!data) return;

    await updateHistory.mutateAsync({
      id,
      isArchive: !data.isArchive,
    });
  };

  if (!data || isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading History Info...</DialogTitle>
            <DialogDescription>
              Please wait while we load the data.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const { id, ...items } = data;
  const tHistoryId = generateIdNumber(id);
  const tData = {
    id,
    name: `HISTORY-${tHistoryId}`,
    ...items,
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <HistoryIcon className="opacity-80" size={23} />
          </div>
          <DialogTitle>Review History</DialogTitle>
          <DialogDescription>Review the history details.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              History ID
            </p>
            <IdToggle id={`HISTORY-${tHistoryId}`} />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="capitalize">{formatLabel(data.description)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Entity</p>
            <p className="capitalize">{formatLabel(data.entity)}</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Created At</p>
            <div>
              <div className="capitalize">
                {format(new Date(data.createdAt), "eee, MMM d, yyyy")}
              </div>
              <div className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(data.updatedAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        </div>
        <PermissionGuard>
          <DialogFooter>
            <div className="flex flex-row gap-2 items-center w-full">
              <div className="flex flex-row gap-2 items-center">
                <DeleteModal
                  data={tData}
                  buttonType="icon"
                  onDelete={handleDelete}
                  isPending={isDeleting}
                  resourceType="history"
                />
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-6"
                />
              </div>
              <UpdateModal
                data={tData}
                buttonType="modal"
                action={data.isArchive ? "restore" : "archive"}
                onUpdate={() => handleArchive(data.id)}
                isPending={isUpdating}
                resourceType="history"
              />
            </div>
          </DialogFooter>
        </PermissionGuard>
      </DialogContent>
    </Dialog>
  );
}
