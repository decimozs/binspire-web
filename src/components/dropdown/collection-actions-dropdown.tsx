import type { Collection } from "@/schemas/collection-schema";
import { ActionsDropdown } from "../core/actions-dropdown";
import { useSessionStore } from "@/store/use-session-store";
import { DeleteModal } from "../modal/delete-modal";
import useCollection from "@/queries/use-collection";
import { generateIdNumber } from "@/lib/utils";
import { UpdateModal } from "../modal/update-modal";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import PermissionGuard from "../core/permission-guard";

interface CollectionActionsDropdownProps {
  data: Collection;
}

export default function CollectionActionsDropdown({
  data,
}: CollectionActionsDropdownProps) {
  const { session } = useSessionStore();
  const { id, ...items } = data;
  const generatedNumber = generateIdNumber(id);
  const tData = {
    id,
    name: `COLLECTION-${generatedNumber}`,
    ...items,
  };
  const { deleteCollection, updateCollection } = useCollection();
  const isDeleting = deleteCollection.isPending;
  const isUpdating = updateCollection.isPending;

  const handleArchive = async (id: string) => {
    await updateCollection.mutateAsync({
      id,
      data: { isArchive: !data.isArchive },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteCollection.mutateAsync(id);
  };

  if (session?.role === "collector") {
    return null;
  }

  return (
    <ActionsDropdown>
      <PermissionGuard>
        <>
          <UpdateModal
            data={tData}
            buttonType="dropdown"
            action={data.isArchive ? "restore" : "archive"}
            onUpdate={handleArchive}
            isPending={isUpdating}
            resourceType="collection"
          />
          <DropdownMenuSeparator />
          <DeleteModal
            data={tData}
            buttonType="dropdown"
            onDelete={handleDelete}
            isPending={isDeleting}
            resourceType="collection"
          />
        </>
      </PermissionGuard>
    </ActionsDropdown>
  );
}
