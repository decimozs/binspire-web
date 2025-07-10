import { Trash } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { ConfirmationModal } from "./confirmation-modal";
import { Button } from "../ui/button";
import { BatchConfirmationModal } from "./batch-confirmation-modal";
import type { Table } from "@tanstack/react-table";
import useBatching from "@/queries/use-batch";
import type { ResourceType } from "@/lib/types";

export type ModalButtonType = "dropdown" | "modal" | "icon";

interface DeleteModalProps<T extends { id: string; name: string }> {
  buttonType: ModalButtonType;
  onDelete: (id: string) => Promise<void>;
  data: T;
  isPending: boolean;
  resourceType?: ResourceType;
}

export function DeleteModal<T extends { id: string; name: string }>({
  buttonType,
  data,
  onDelete,
  isPending,
  resourceType,
}: DeleteModalProps<T>) {
  const trigger =
    buttonType === "dropdown" ? (
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => e.preventDefault()}
      >
        <Trash />
        Delete
      </DropdownMenuItem>
    ) : buttonType === "modal" ? (
      <Button className="flex-1" type="button" variant="outlineDestructive">
        Delete
      </Button>
    ) : buttonType === "icon" ? (
      <Button size="icon" variant="destructive">
        <Trash />
      </Button>
    ) : (
      <Button className="flex-1" type="button" variant="outlineDestructive">
        Delete
      </Button>
    );

  return (
    <ConfirmationModal
      data={data}
      action="delete"
      isPending={isPending}
      onSubmit={onDelete}
      trigger={trigger}
      resourceType={resourceType}
    />
  );
}

interface BatchDeleteModalProps<T extends { id: string; name?: string }> {
  apiRoute: string;
  data: T[];
  table: Table<T>;
  resourceType?: ResourceType;
}

export function BatchDeleteModal<T extends { id: string; name?: string }>({
  apiRoute,
  data,
  table,
  resourceType,
}: BatchDeleteModalProps<T>) {
  const { batchDelete } = useBatching<T>();
  const isPending = batchDelete.isPending;

  const handleBatchDelete = async () => {
    await batchDelete.mutateAsync({
      ids: data.map((i) => i.id),
      apiRoute,
      table,
    });
  };

  return (
    <BatchConfirmationModal
      data={data}
      action="delete"
      isPending={isPending}
      onSubmit={handleBatchDelete}
      resourceType={resourceType}
    />
  );
}
