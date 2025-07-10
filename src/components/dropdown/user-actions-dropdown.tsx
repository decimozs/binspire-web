import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "../modal/delete-modal";
import { ActionsDropdown } from "../core/actions-dropdown";
import { useSessionStore } from "@/store/use-session-store";
import type { User } from "@/schemas/user-schema";
import useUser from "@/queries/use-user";
import { UpdateModal } from "../modal/update-modal";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Eye } from "lucide-react";

interface UserActionsDropdownProps {
  data: User;
}

export function UserActionsDropdown({ data }: UserActionsDropdownProps) {
  const [, setUserId] = useQueryState("user_id");
  const [, setViewUser] = useQueryState("view_user", parseAsBoolean);
  const { session } = useSessionStore();
  const { deleteUser, updateUser } = useUser();
  const isDeleting = deleteUser.isPending;
  const isUpdating = updateUser.isPending;

  const handleArchive = async (id: string) => {
    await updateUser.mutateAsync({
      id,
      data: { isArchive: !data.isArchive },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteUser.mutateAsync(id);
  };

  const handleSetParams = () => {
    setViewUser(true);
    setUserId(data.id);
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
              action={data.isArchive ? "restore" : "archive"}
              onUpdate={() => handleArchive(data.id)}
              isPending={isUpdating}
              resourceType="user-management"
            />
            <DropdownMenuSeparator />
            <DeleteModal
              data={data}
              buttonType="dropdown"
              onDelete={handleDelete}
              isPending={isDeleting}
              resourceType="user-management"
            />
          </>
        )}
    </ActionsDropdown>
  );
}
