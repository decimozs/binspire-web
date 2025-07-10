import { DeleteModal } from "../modal/delete-modal";
import { ActionsDropdown } from "../core/actions-dropdown";
import { generateIdNumber } from "@/lib/utils";
import useHistory from "@/queries/use-history";
import { UpdateModal } from "../modal/update-modal";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import PermissionGuard from "../core/permission-guard";
import { Eye } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import type { History } from "@/schemas/history-schema";

interface HistoryActionsDropdownProps {
  data: History;
}

export function HistoryActionsDropdown({ data }: HistoryActionsDropdownProps) {
  const [, setHistoryId] = useQueryState("history_id");
  const [, setViewHistory] = useQueryState("view_history", parseAsBoolean);
  const { id, ...items } = data;
  const generatedNumber = generateIdNumber(id);
  const tData = {
    id,
    name: `HISTORY-${generatedNumber}`,
    ...items,
  };
  const { deleteHistory, updateHistory } = useHistory();
  const isUpdating = updateHistory.isPending;
  const isDeleting = deleteHistory.isPending;

  const handleUpdate = async (id: string) => {
    await updateHistory.mutateAsync({
      id,
      isArchive: !data.isArchive,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteHistory.mutateAsync(id);
  };

  const handleSetParams = () => {
    setViewHistory(true);
    setHistoryId(data.id);
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
          resourceType="history"
        />
        <DropdownMenuSeparator />
        <DeleteModal
          data={tData}
          buttonType="dropdown"
          onDelete={handleDelete}
          isPending={isDeleting}
          resourceType="history"
        />
      </PermissionGuard>
    </ActionsDropdown>
  );
}
