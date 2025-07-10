import { ActionsDropdown } from "../core/actions-dropdown";
import { useSessionStore } from "@/store/use-session-store";
import { DeleteModal } from "../modal/delete-modal";
import type { Trashbin } from "@/schemas/trashbin-schema";
import useTrashbin from "@/queries/use-trashbin";
import { UpdateModal } from "../modal/update-modal";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Eye } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import PermissionGuard from "../core/permission-guard";

interface TrashbinActionsDropdown {
  data: Trashbin;
}

export default function TrashbinActionDropdown({
  data,
}: TrashbinActionsDropdown) {
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [, setViewTrashbin] = useQueryState("view_trashbin", parseAsBoolean);
  const { session } = useSessionStore();
  const { deleteTrashbin, updateTrashbin } = useTrashbin();
  const isDeleting = deleteTrashbin.isPending;
  const isUpdating = updateTrashbin.isPending;

  const handleArchive = async (id: string) => {
    await updateTrashbin.mutateAsync({
      id,
      data: { isArchive: !data.isArchive },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteTrashbin.mutateAsync(id);
  };

  const handleSetParams = () => {
    setViewTrashbin(true);
    setTrashbinId(data.id);
  };

  return (
    <ActionsDropdown>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={handleSetParams}
      >
        <Eye />
        Review
      </DropdownMenuItem>
      <PermissionGuard>
        <>
          <UpdateModal
            data={data}
            buttonType="dropdown"
            action={data.isArchive ? "restore" : "archive"}
            onUpdate={handleArchive}
            isPending={isUpdating}
            resourceType="trashbin-management"
          />
          <DropdownMenuSeparator />
          <DeleteModal
            data={data}
            buttonType="dropdown"
            onDelete={handleDelete}
            isPending={isDeleting}
            resourceType="trashbin-management"
          />
        </>
      </PermissionGuard>
    </ActionsDropdown>
  );
}
