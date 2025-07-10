import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClipboardList } from "lucide-react";
import { Separator } from "../ui/separator";
import StatusBadge from "../badge/status-badge";
import { format } from "date-fns";
import RoleBadge from "../badge/role-badge";
import type { UpdateRequestAccess } from "@/schemas/request-access-schema";
import { DeleteModal } from "./delete-modal";
import { UpdateModal } from "./update-modal";
import { IdToggle } from "../core/id-toggle";
import useRequestAccess from "@/queries/use-request-access";
import PermissionGuard from "../core/permission-guard";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { generateIdNumber } from "@/lib/utils";

export default function ReviewRequestAccessModal() {
  const { deleteRequestAccess, updateRequestAccess, getRequestAccessById } =
    useRequestAccess();
  const [requestAccessId, setRequestAccessId] =
    useQueryState("request_access_id");
  const [viewRequestAccess, setViewRequestAccess] = useQueryState(
    "view_request_access",
    parseAsBoolean,
  );
  const { data, isLoading } = getRequestAccessById(requestAccessId || "");
  const isDeleting = deleteRequestAccess.isPending;
  const isUpdating = updateRequestAccess.isPending;
  const [open, setOpen] = useState(!!viewRequestAccess);

  useEffect(() => {
    setOpen(!!viewRequestAccess);
  }, [viewRequestAccess]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setRequestAccessId(null);
        setViewRequestAccess(null);
      }, 300);
    }
  };

  const handleUpdate = async (id: string, data: UpdateRequestAccess) => {
    await updateRequestAccess.mutateAsync({
      id,
      data: { status: data.status, email: data.email },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteRequestAccess.mutateAsync(id);

    handleOpenChange(false);
  };

  if (!data || isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Request Access Info...</DialogTitle>
            <DialogDescription>
              Please wait while we load the data.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ClipboardList className="opacity-80" size={23} />
          </div>
          <DialogTitle>Access Request Review</DialogTitle>
          <DialogDescription>
            Review the details below and approve or reject the access request.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Request ID
            </p>
            <IdToggle id={`REQUEST-${generateIdNumber(data.id)}`} />
          </div>
          <StatusBadge status={data.status} />
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="">
            <p className="text-sm text-muted-foreground">Name</p>
            <p>{data.name}</p>
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{data.email}</p>
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground mb-2">Requested Role</p>
            <RoleBadge role={data.role} />
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground">Reason</p>
            <p className="p-4 text-sm bg-muted-foreground/5 rounded-md mt-2">
              {data.reason}
            </p>
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground">Requested At</p>
            <div className="capitalize">
              {format(new Date(data.createdAt), "eee, MMM d, yyyy")}
            </div>
          </div>
        </div>
        <PermissionGuard>
          <DialogFooter>
            {data.status === "approved" ? (
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="flex flex-row gap-1 items-center">
                  <DeleteModal
                    data={data}
                    buttonType="icon"
                    onDelete={handleDelete}
                    isPending={isDeleting}
                  />
                </div>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-6"
                />
                <UpdateModal
                  data={data}
                  buttonType="modal"
                  action="archive"
                  onUpdate={() =>
                    handleUpdate(data.id, {
                      status: "archived",
                      email: data.email,
                    })
                  }
                  isPending={isUpdating}
                />
              </div>
            ) : data.status === "rejected" ? (
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="flex flex-row gap-1 items-center">
                  <DeleteModal
                    data={data}
                    buttonType="icon"
                    onDelete={handleDelete}
                    isPending={isDeleting}
                  />
                </div>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-6"
                />
                <UpdateModal
                  data={data}
                  buttonType="modal"
                  action="archive"
                  onUpdate={() =>
                    handleUpdate(data.id, {
                      status: "archived",
                      email: data.email,
                    })
                  }
                  isPending={isUpdating}
                />
                <UpdateModal
                  data={data}
                  buttonType="modal"
                  action="restore"
                  onUpdate={() =>
                    handleUpdate(data.id, {
                      status: "pending",
                      email: data.email,
                    })
                  }
                  isPending={isUpdating}
                />
              </div>
            ) : data.status === "archived" ? (
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="flex flex-row gap-1 items-center">
                  <DeleteModal
                    data={data}
                    buttonType="icon"
                    onDelete={handleDelete}
                    isPending={isDeleting}
                  />
                </div>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-6"
                />
                <UpdateModal
                  data={data}
                  buttonType="modal"
                  action="restore"
                  onUpdate={() =>
                    handleUpdate(data.id, {
                      status: "pending",
                      email: data.email,
                    })
                  }
                  isPending={isUpdating}
                />
              </div>
            ) : (
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="flex flex-row gap-1 items-center">
                  <DeleteModal
                    data={data}
                    buttonType="icon"
                    onDelete={handleDelete}
                    isPending={isDeleting}
                  />
                  <UpdateModal
                    data={data}
                    buttonType="icon"
                    action="archive"
                    onUpdate={() =>
                      handleUpdate(data.id, {
                        status: "archived",
                        email: data.email,
                      })
                    }
                    isPending={isUpdating}
                  />
                </div>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-6"
                />
                <UpdateModal
                  data={data}
                  buttonType="modal"
                  action="reject"
                  onUpdate={() =>
                    handleUpdate(data.id, {
                      status: "rejected",
                      email: data.email,
                    })
                  }
                  isPending={isUpdating}
                />
                <UpdateModal
                  data={data}
                  buttonType="modal"
                  action="approve"
                  onUpdate={() =>
                    handleUpdate(data.id, {
                      status: "approved",
                      email: data.email,
                    })
                  }
                  isPending={isUpdating}
                />
              </div>
            )}
          </DialogFooter>
        </PermissionGuard>
      </DialogContent>
    </Dialog>
  );
}
