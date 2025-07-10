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
import CommittedBy from "../core/committed-by";
import useActivity from "@/queries/use-activity";
import type { EntityType } from "@/lib/types";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { DeletedChanges, UpdatedChanges } from "../core/history-changes";

export default function ReviewActivityModal() {
  const { updateActivity, deleteActivity, getActivityById } = useActivity();
  const [activityId, setActivityId] = useQueryState("activity_id");
  const [viewActivity, setViewActivity] = useQueryState(
    "view_activity",
    parseAsBoolean,
  );
  const { data, isLoading } = getActivityById(activityId || "");
  const isDeleting = deleteActivity.isPending;
  const isUpdating = updateActivity.isPending;

  const [open, setOpen] = useState(!!viewActivity);

  useEffect(() => {
    setOpen(!!viewActivity);
  }, [viewActivity]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setActivityId(null);
        setViewActivity(null);
      }, 300);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteActivity.mutateAsync(id);
    handleOpenChange(false);
  };

  const handleArchive = async (id: string) => {
    if (!data) return;

    await updateActivity.mutateAsync({
      id,
      data: { isArchive: !data.isArchive },
    });
  };

  if (!data || isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Activity Info...</DialogTitle>
            <DialogDescription>
              Please wait while we load the data.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const { id, ...items } = data;
  const tActivityId = generateIdNumber(id);
  const tData = {
    id,
    name: `ACTIVITY-${tActivityId}`,
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
          <DialogTitle>Review Activity</DialogTitle>
          <DialogDescription>Review the activity details.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Issue ID
            </p>
            <IdToggle id={`ACTIVITY-${tActivityId}`} />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="">
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="capitalize">{formatLabel(data.description)}</p>
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground">Entity</p>
            <p className="capitalize">{formatLabel(data.entity)}</p>
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground">Changes</p>
            <div className="p-4 text-sm bg-muted-foreground/5 rounded-md mt-2 flex items-center justify-center gap-6">
              {data.action === "update" &&
                data.changes?.before &&
                data.changes?.after && (
                  <UpdatedChanges
                    entity={data.entity as EntityType}
                    changes={{
                      before: data.changes.before as Record<string, string>,
                      after: data.changes.after as Record<string, string>,
                    }}
                  />
                )}

              {data.action === "delete" &&
              data.changes &&
              data.changes.before?.status &&
              data.changes.after?.status ? (
                <DeletedChanges
                  entity={data.entity as EntityType}
                  changes={data.changes}
                />
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Committed By</p>
              <div className="cursor-pointer border border-dashed rounded-md py-2 px-4 w-fit">
                <CommittedBy userId={data.actorId} enableRole={true} />
              </div>
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
                  resourceType="activity"
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
                resourceType="activity"
              />
            </div>
          </DialogFooter>
        </PermissionGuard>
      </DialogContent>
    </Dialog>
  );
}
