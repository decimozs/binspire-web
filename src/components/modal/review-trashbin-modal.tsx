import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Battery, Trash, Waves, Weight } from "lucide-react";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { IdToggle } from "../core/id-toggle";
import type { UpdateTrashbin } from "@/schemas/trashbin-schema";
import OperationalStatusBadge from "../badge/operational-badge";
import useTrashbin from "@/queries/use-trashbin";
import { UpdateModal } from "./update-modal";
import { DeleteModal } from "./delete-modal";
import { useForm } from "@tanstack/react-form";
import { updateIssueSchema } from "@/schemas/issue-schema";
import { Input } from "../ui/input";
import { FormFieldError } from "../form/form-field-error";
import PermissionGuard from "../core/permission-guard";
import { useEffect, useState } from "react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { generateIdNumber } from "@/lib/utils";
import { useMqtt } from "../provider/mqtt-provider";
import { useSessionStore } from "@/store/use-session-store";
import { useTrashbinLiveStore } from "@/store/use-live-trashbin-store";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import CollectedStatusBadge from "../badge/collected-badge";
import ReportTrashbinModal from "./report-trashbin-modal";
import GetDirections from "../core/get-directions";

export default function ReviewTrashbinModal() {
  const { deleteTrashbin, updateTrashbin, getTrashbinById } = useTrashbin();
  const isDeleting = deleteTrashbin.isPending;
  const isUpdating = updateTrashbin.isPending;
  const { client, isConnected } = useMqtt();
  const { session } = useSessionStore();
  const [trashbinId, setTrashbinId] = useQueryState("trashbin_id");
  const [viewTrashbin, setViewTrashbin] = useQueryState(
    "view_trashbin",
    parseAsBoolean,
  );
  const { liveData } = useTrashbinLiveStore();
  const currentLiveData = trashbinId ? liveData[trashbinId] : null;
  const { data, isLoading } = getTrashbinById(trashbinId || "");
  const [open, setOpen] = useState(!!viewTrashbin);
  const isMobile = useIsMobile();

  useEffect(() => {
    setOpen(!!viewTrashbin);
  }, [viewTrashbin]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setTrashbinId(null);
        setViewTrashbin(null);
      }, 300);
    }
  };

  const handleArchive = async (id: string) => {
    if (!data) return;

    await updateTrashbin.mutateAsync({
      id,
      data: { isArchive: !data.isArchive },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteTrashbin.mutateAsync(id);

    handleOpenChange(false);
  };

  const handleCollect = async (id: string) => {
    if (!data) return;

    await updateTrashbin.mutateAsync({
      id,
      data: { isCollected: true },
    });
  };

  const defaultValues: UpdateTrashbin = {
    name: data?.name,
    location: data?.location,
    isOperational: data?.isOperational,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: updateIssueSchema,
    },
    onSubmit: async ({ value }) => {
      await updateTrashbin.mutateAsync({
        id: data?.id || "",
        data: {
          name: value.name,
          isOperational: value.isOperational,
          location: value.location,
        },
      });
    },
  });

  useEffect(() => {
    if (!client || !isConnected) return;

    const handleMessage = (topic: string, message: Buffer) => {
      const match = topic.match(/^trashbin\/(.+)\/status$/);
      if (match) {
        const id = match[1];
        const data = JSON.parse(message.toString());
        useTrashbinLiveStore.getState().setLiveData(id, data);
      }
    };

    client.on("message", handleMessage);
    client.subscribe("trashbin/+/status");

    return () => {
      client.off("message", handleMessage);
      client.unsubscribe("trashbin/+/status");
    };
  }, [client, isConnected]);

  if (!data || isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Trashbin Info...</DialogTitle>
            <DialogDescription>
              Please wait while we load the data.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const tTrashbinId = `TRASHBIN-${generateIdNumber(data.id)}`;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="h-[80vh]">
          <DrawerHeader className="flex flex-row items-center gap-4">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <Trash className="opacity-80" size={23} />
            </div>
            <div className="flex flex-col text-left">
              <DrawerTitle>Trashbin</DrawerTitle>
              <DrawerDescription>
                View the current details of this trashbin.
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 overflow-y-auto h-full">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Trashbin ID
                </p>
                <IdToggle id={tTrashbinId} />
              </div>
              <div className="flex flex-row gap-2">
                <OperationalStatusBadge isOperational={data.isOperational} />
                <CollectedStatusBadge isCollected={data.isCollected} />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p>{data.name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <p>{data.location}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Created At</p>
              <div className="capitalize">
                {format(new Date(data.createdAt), "eee, MMM d, yyyy")}
              </div>
            </div>
            <Separator />
            <p>Status</p>
            {currentLiveData ? (
              <div className="grid grid-rows-3 gap-4">
                <div className="flex flex-row gap-4 border border-dashed rounded-md p-4">
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row gap-4 items-center">
                      <Waves className="mt-0.5" />
                      <span>Waste Level</span>
                    </div>
                    <span>{currentLiveData?.wasteLevel}%</span>
                  </div>
                </div>
                <div className="flex flex-row gap-4 border border-dashed rounded-md p-4">
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row gap-4 items-center">
                      <Weight className="mt-1.5" />
                      <span>Weight Level</span>
                    </div>
                    <span>{currentLiveData?.weightLevel} kg</span>
                  </div>
                </div>
                <div className="flex flex-row gap-4 border border-dashed rounded-md p-4">
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row gap-4 items-center">
                      <Battery className="mt-0.5" />
                      <span>Battery Level</span>
                    </div>
                    <span>{currentLiveData?.batteryLevel}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p>Trashbin status is loading...</p>
              </div>
            )}{" "}
          </div>
          <DrawerFooter>
            <GetDirections data={data} handleOpenChange={handleOpenChange} />
            <ReportTrashbinModal />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Trash className="opacity-80" size={23} />
          </div>
          <DialogTitle>Trashbin</DialogTitle>
          <DialogDescription>
            View the current details of this trashbin.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Trashbin ID
            </p>
            <IdToggle id={tTrashbinId} />
          </div>
          <OperationalStatusBadge isOperational={data.isOperational} />
        </div>

        <Separator />

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <form.Field name="name">
                {(f) => (
                  <>
                    <Input
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      aria-invalid={f.state.meta.errors.length > 0}
                      className="mt-1"
                    />
                    <FormFieldError field={f} />
                  </>
                )}
              </form.Field>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p>{data.location}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <div className="capitalize">
                {format(new Date(data.createdAt), "eee, MMM d, yyyy")}
              </div>
            </div>
          </div>
          <Separator />
          <p>Status</p>
          {currentLiveData ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-row gap-4 border border-dashed rounded-md p-4">
                <Waves className="mt-0.5" />
                <div className="flex flex-col gap-2">
                  <span>Waste Level</span>
                  <span>{currentLiveData?.wasteLevel}%</span>
                </div>
              </div>
              <div className="flex flex-row gap-4 border border-dashed rounded-md p-4">
                <Weight className="mt-1.5" />
                <div className="flex flex-col gap-2">
                  <span>Weight Level</span>
                  <span>{currentLiveData?.weightLevel} kg</span>
                </div>
              </div>
              <div className="flex flex-row gap-4 border border-dashed rounded-md p-4">
                <Battery className="mt-0.5" />
                <div className="flex flex-col gap-2">
                  <span>Battery Level</span>
                  <span>{currentLiveData?.batteryLevel}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p>Trashbin status is loading...</p>
            </div>
          )}{" "}
          <PermissionGuard>
            <DialogFooter>
              <form.Subscribe selector={(s) => s.values}>
                {(v) => {
                  const isUnchanged = v.name === data.name;
                  return (
                    <div className="flex flex-row gap-2 items-center w-full">
                      <div className="flex flex-row gap-2 items-center">
                        <UpdateModal
                          data={data}
                          buttonType="icon"
                          action={data.isArchive ? "restore" : "archive"}
                          onUpdate={() => handleArchive(data.id)}
                          isPending={isUpdating}
                          resourceType="user-management"
                        />
                        <DeleteModal
                          data={data}
                          buttonType="icon"
                          onDelete={handleDelete}
                          isPending={isDeleting}
                          resourceType="trashbin-management"
                        />
                      </div>
                      <Separator
                        orientation="vertical"
                        className="data-[orientation=vertical]:h-6"
                      />
                      {session?.role === "admin" && (
                        <UpdateModal
                          data={data}
                          buttonType="modal"
                          action="update"
                          label="Save Changes"
                          onUpdate={() => form.handleSubmit()}
                          isPending={isUpdating}
                          resourceType="trashbin-management"
                          disabled={isUnchanged}
                        />
                      )}
                      {session?.role === "collector" && (
                        <UpdateModal
                          data={data}
                          buttonType="modal"
                          action="update"
                          label={"Collect"}
                          onUpdate={() => handleCollect(data.id)}
                          isPending={isUpdating}
                          resourceType="trashbin-management"
                        />
                      )}
                    </div>
                  );
                }}
              </form.Subscribe>
            </DialogFooter>
          </PermissionGuard>
        </form>
      </DialogContent>
    </Dialog>
  );
}
