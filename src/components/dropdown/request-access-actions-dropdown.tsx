import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "../modal/delete-modal";
import type { RequestAccess } from "@/schemas/request-access-schema";
import { ActionsDropdown } from "../core/actions-dropdown";
import { UpdateModal } from "../modal/update-modal";
import { useSessionStore } from "@/store/use-session-store";
import useRequestAccess from "@/queries/use-request-access";
import { Eye } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

interface RequestAccessActionsDropdownProps {
  data: RequestAccess;
}

export function RequestAccessActionsDropdown({
  data,
}: RequestAccessActionsDropdownProps) {
  const { session } = useSessionStore();
  const [, setRequestAccessId] = useQueryState("request_access_id");
  const [, setViewRequestAccess] = useQueryState(
    "view_request_access",
    parseAsBoolean,
  );
  const { deleteRequestAccess, updateRequestAccess } = useRequestAccess();
  const isDeleting = deleteRequestAccess.isPending;
  const isUpdating = updateRequestAccess.isPending;
  const isArchived = data.status === "archived" ? "restore" : "archive";

  const handleArchive = async (id: string) => {
    const isCurrentlyArchived = data.status === "archived";
    const newStatus = isCurrentlyArchived ? "pending" : "archived";

    await updateRequestAccess.mutateAsync({
      id,
      data: { status: newStatus, email: data.email },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteRequestAccess.mutateAsync(id);
  };

  const handleSetParams = () => {
    setViewRequestAccess(true);
    setRequestAccessId(data.id);
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
      {session?.permission &&
        ["superuser", "editor"].includes(session.permission) && (
          <>
            <UpdateModal
              data={data}
              buttonType="dropdown"
              action={isArchived}
              onUpdate={handleArchive}
              isPending={isUpdating}
            />
            <DropdownMenuSeparator />
            <DeleteModal
              data={data}
              buttonType="dropdown"
              onDelete={handleDelete}
              isPending={isDeleting}
            />
          </>
        )}
    </ActionsDropdown>
  );
}
