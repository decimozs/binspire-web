import { DeleteModal } from "../modal/delete-modal";
import { ActionsDropdown } from "../core/actions-dropdown";
import { generateIdNumber } from "@/lib/utils";
import type { Activity } from "@/schemas/activity-schema";
import useActivity from "@/queries/use-activity";
import { UpdateModal } from "../modal/update-modal";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import PermissionGuard from "../core/permission-guard";
import { Eye } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

interface ActivityActionsDropdownProps {
  data: Activity;
}

export function ActivityActionsDropdown({
  data,
}: ActivityActionsDropdownProps) {
  const [, setActivityId] = useQueryState("activity_id");
  const [, setViewActivity] = useQueryState("view_activity", parseAsBoolean);
  const { id, ...items } = data;
  const generatedNumber = generateIdNumber(id);
  const tData = {
    id,
    name: `ACTIVITY-${generatedNumber}`,
    ...items,
  };
  const { deleteActivity, updateActivity } = useActivity();
  const isUpdating = updateActivity.isPending;
  const isDeleting = deleteActivity.isPending;

  const handleUpdate = async (id: string) => {
    await updateActivity.mutateAsync({
      id,
      data: { isArchive: !data.isArchive },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteActivity.mutateAsync(id);
  };

  const handleSetParams = () => {
    setViewActivity(true);
    setActivityId(data.id);
  };

  return (
    <ActionsDropdown>
      <PermissionGuard>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={handleSetParams}
        >
          <Eye />
          Review
        </DropdownMenuItem>
        <UpdateModal
          data={tData}
          buttonType="dropdown"
          action={data.isArchive ? "restore" : "archive"}
          onUpdate={() => handleUpdate(id)}
          isPending={isUpdating}
          resourceType="activity"
        />
        <DropdownMenuSeparator />
        <DeleteModal
          data={tData}
          buttonType="dropdown"
          onDelete={handleDelete}
          isPending={isDeleting}
          resourceType="activity"
        />
      </PermissionGuard>
    </ActionsDropdown>
  );
}
