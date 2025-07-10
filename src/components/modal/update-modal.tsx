import { ConfirmationModal } from "./confirmation-modal";
import { Button } from "../ui/button";
import type { ModalButtonType } from "./delete-modal";
import type { ActionType, ResourceType } from "@/lib/types";
import { actionIconMap, actionToStatusMap } from "@/lib/constants";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { BatchConfirmationModal } from "./batch-confirmation-modal";
import useBatching from "@/queries/use-batch";

interface UpdateModalProps<T extends { id: string; name: string }> {
  data: T;
  buttonType: ModalButtonType;
  onUpdate: (id: string) => Promise<void>;
  isPending: boolean;
  action: ActionType;
  label?: string;
  resourceType?: ResourceType;
  disabled?: boolean;
}

export function UpdateModal<T extends { id: string; name: string }>({
  buttonType,
  data,
  onUpdate,
  action,
  isPending,
  resourceType,
  label = action,
  disabled = false,
}: UpdateModalProps<T>) {
  const Icon = actionIconMap[action];

  const trigger =
    buttonType === "dropdown" ? (
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        className="capitalize"
      >
        <Icon />
        {label}
      </DropdownMenuItem>
    ) : buttonType === "modal" ? (
      <Button
        className="flex-1 capitalize"
        type="button"
        variant="outline"
        disabled={disabled}
      >
        {label}
      </Button>
    ) : buttonType === "icon" ? (
      <Button size="icon" variant="secondary">
        <Icon />
      </Button>
    ) : (
      <Button className="capitalize flex-1" type="button" disabled={disabled}>
        {label}
      </Button>
    );

  return (
    <ConfirmationModal
      data={data}
      action={action}
      isPending={isPending}
      onSubmit={onUpdate}
      trigger={trigger}
      resourceType={resourceType}
    />
  );
}

interface BatchUpdateModalProps<T extends { id: string; name?: string }> {
  apiRoute: string;
  data: T[];
  table: Table<T>;
  action: ActionType;
  resourceType?: ResourceType;
}

export function BatchUpdateModal<T extends { id: string; name?: string }>({
  apiRoute,
  data,
  table,
  action,
  resourceType,
}: BatchUpdateModalProps<T>) {
  const { batchUpdate } = useBatching<T>();
  const isPending = batchUpdate.isPending;
  const status = actionToStatusMap[action];

  const handleBatchUpdate = async () => {
    await batchUpdate.mutateAsync({
      ids: data.map((i) => i.id),
      apiRoute,
      data: { status },
      table,
    });
  };

  return (
    <BatchConfirmationModal
      data={data}
      action={action}
      isPending={isPending}
      onSubmit={handleBatchUpdate}
      resourceType={resourceType}
    />
  );
}
