import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "../modal/delete-modal";
import { ActionsDropdown } from "../core/actions-dropdown";
import { useSessionStore } from "@/store/use-session-store";
import type { Issue } from "@/schemas/issue-schema";
import useIssue from "@/queries/use-issue";
import { generateIdNumber } from "@/lib/utils";
import { UpdateModal } from "../modal/update-modal";
import { Eye } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

interface IssueActionDropdownProps {
  data: Issue;
}

export function IssueActionDropdown({ data }: IssueActionDropdownProps) {
  const [, setIssueId] = useQueryState("issue_id");
  const [, setViewIssue] = useQueryState("view_issue", parseAsBoolean);
  const { updateIssue, deleteIssue } = useIssue();
  const { id, ...items } = data;
  const generatedNumber = generateIdNumber(id);
  const tData = {
    id,
    name: `ISSUE-${generatedNumber}`,
    ...items,
  };
  const { session } = useSessionStore();
  const isUpdating = updateIssue.isPending;
  const isDeleting = deleteIssue.isPending;

  const handleArchive = async (id: string) => {
    await updateIssue.mutateAsync({
      id,
      data: { isArchive: !data.isArchive },
    });
  };

  const handleDelete = async (id: string) => {
    await deleteIssue.mutateAsync(id);
  };

  const handleSetParams = () => {
    setViewIssue(true);
    setIssueId(data.id);
  };

  return (
    <ActionsDropdown>
      {session?.permission &&
        ["superuser", "editor"].includes(session.permission) && (
          <>
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
              onUpdate={() => handleArchive(id)}
              isPending={isUpdating}
              resourceType="issue"
            />
            <DropdownMenuSeparator />
            <DeleteModal
              data={tData}
              buttonType="dropdown"
              onDelete={handleDelete}
              isPending={isDeleting}
              resourceType="issue"
            />
          </>
        )}
    </ActionsDropdown>
  );
}
