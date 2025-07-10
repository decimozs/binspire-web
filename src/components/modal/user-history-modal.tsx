import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { History } from "lucide-react";
import { useSessionStore } from "@/store/use-session-store";
import useHistory from "@/queries/use-history";
import DataTable from "../table/data-table";
import { userHistoryColumns } from "../table/columns-table";
import { useIsMobile } from "@/hooks/use-mobile";

export default function UserHistoryModal() {
  const { session } = useSessionStore();
  const { getHistoryByUserId } = useHistory();
  const userId = session?.userId || "";
  const { data, isLoading } = getHistoryByUserId(userId);
  const isMobile = useIsMobile();

  if (!data || isLoading) {
    return (
      <div>
        <p>Loading user history...</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <History />
            History
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="max-h-[70vh] flex flex-col">
          <DialogHeader className="shrink-0 text-left">
            <DialogTitle>User Activity</DialogTitle>
            <DialogDescription>
              Review your recent actions and interactions within your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <DataTable
              data={data}
              columns={userHistoryColumns}
              searchPattern={"id"}
              apiRoute="histories"
              tableName="histories"
              resourceType="history"
              viewsTable={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <History />
          History
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="min-w-7xl max-h-[70vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>User Activity</DialogTitle>
          <DialogDescription>
            Review your recent actions and interactions within your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <DataTable
            data={data}
            columns={userHistoryColumns}
            searchPattern={"id"}
            apiRoute="histories"
            tableName="histories"
            resourceType="history"
            viewsTable={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
