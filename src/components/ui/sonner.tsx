import {
  CheckIcon,
  CircleAlert,
  CircleCheckIcon,
  HistoryIcon,
  ListFilter,
  LoaderCircleIcon,
  TriangleAlert,
  Undo2,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";
import { BatchDeleteModal } from "../modal/delete-modal";
import { BatchUpdateModal } from "../modal/update-modal";
import type { ResourceType } from "@/lib/types";

export function warningSonner(message: string) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <TriangleAlert
            className="mt-0.5 shrink-0 text-amber-500"
            size={16}
            aria-hidden="true"
          />{" "}
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  ));
}

export function errorSonner(message: string) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <CircleAlert
            className="mt-0.5 shrink-0 text-red-500"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  ));
}

export function successSonner(message: string, onViewLog?: () => void) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2 items-center">
        <div className="flex grow gap-3">
          <CircleCheckIcon
            className="mt-0.5 shrink-0 text-emerald-500"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
          </div>
        </div>
        {!onViewLog ? (
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => toast.dismiss(t)}
            aria-label="Close banner"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.dismiss(t);
              onViewLog();
            }}
          >
            <HistoryIcon size={14} />
            View Log
          </Button>
        )}
      </div>
    </div>
  ));
}

export function promiseSonner(message: string) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <LoaderCircleIcon
            className="-ms-1 animate-spin"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  ));
}

type FilteringSonnerProps<T> = {
  message?: string;
  table: Table<T>;
};

export function filteringSonner<T>(props: FilteringSonnerProps<T>) {
  const toastId = "filtering-sonner";
  const activeToasts = toast.getToasts();
  const alreadyVisible = activeToasts.some((t) => t.id === toastId);

  if (alreadyVisible) return;

  const handleResetFilter = (t: string | number) => {
    props.table.resetColumnFilters();
    toast.dismiss(t);
  };

  const message = props.message ?? "Filtering data table...";

  toast.custom(
    (t) => (
      <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            <ListFilter
              className="mt-0.5 shrink-0"
              size={16}
              aria-hidden="true"
            />{" "}
            <div className="flex grow justify-between gap-12">
              <p className="text-sm">{message}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => handleResetFilter(t)}
            aria-label="Close banner"
          >
            <Undo2
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    ),
    { id: toastId, duration: Infinity, position: "bottom-center" },
  );
}

type SelectionSonnerProps<T extends { id: string; name?: string }> = {
  table: Table<T>;
  currentCount: number;
  selectedData: T[];
  apiRoute: string;
  resourceType?: ResourceType;
};

export function selectionSonner<T extends { id: string; name?: string }>({
  table,
  currentCount,
  selectedData,
  apiRoute,
  resourceType = "request",
}: SelectionSonnerProps<T>) {
  const toastId = "selection-sonner";
  const activeToasts = toast.getToasts();
  const existingToast = activeToasts.find((t) => t.id === toastId);

  if (currentCount === 0) {
    if (existingToast) toast.dismiss(toastId);
    return;
  }

  const handleResetSelection = () => {
    table.resetRowSelection();
    toast.dismiss(toastId);
  };

  toast.custom(
    () => (
      <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="h-9 px-4 text-sm border border-muted rounded-md flex items-center justify-center">
              <p className="truncate">{currentCount} selected</p>
            </div>
          </div>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex gap-2 items-center">
            {resourceType === "request" && (
              <>
                <BatchUpdateModal
                  data={selectedData}
                  apiRoute={apiRoute}
                  table={table}
                  action="reject"
                  resourceType={resourceType}
                />
                <BatchUpdateModal
                  data={selectedData}
                  apiRoute={apiRoute}
                  table={table}
                  action="archive"
                  resourceType={resourceType}
                />
                <BatchUpdateModal
                  data={selectedData}
                  apiRoute={apiRoute}
                  table={table}
                  action="restore"
                  resourceType={resourceType}
                />
                <BatchDeleteModal
                  data={selectedData}
                  apiRoute={apiRoute}
                  table={table}
                  resourceType={resourceType}
                />
              </>
            )}
            {(resourceType === "collection" ||
              resourceType === "issue" ||
              resourceType === "history" ||
              resourceType === "user-management" ||
              resourceType === "trashbin-management") && (
              <BatchDeleteModal
                data={selectedData}
                apiRoute={apiRoute}
                table={table}
                resourceType={resourceType}
              />
            )}

            <Button
              size="icon"
              variant="ghost"
              onClick={handleResetSelection}
              title="Reset selection"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    ),
    { id: toastId, position: "bottom-center", duration: Infinity },
  );
}

export function copiedSonner(message: string) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <CheckIcon
            className="mt-0.5 shrink-0 text-emerald-500"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  ));
}
