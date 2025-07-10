import { format, formatDistanceToNow } from "date-fns";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import SortingTableButton from "./sorting-button-table";
import {
  batteryLevelStatusFilter,
  issueStatusFilter,
  permissionFilter,
  priorityStatusFilter,
  requestAccessStatusFilter,
  roleFilter,
  wasteLevelStatusFilter,
  weightLevelStatusFilter,
} from "./filters-table";
import StatusBadge from "../badge/status-badge";
import type { RequestAccess } from "@/schemas/request-access-schema";
import { RequestAccessActionsDropdown } from "../dropdown/request-access-actions-dropdown";
import { FilterTableButton } from "./filter-table-button";
import type { DateRange } from "react-day-picker";
import type { User } from "@/schemas/user-schema";
import { UserActionsDropdown } from "../dropdown/user-actions-dropdown";
import RoleBadge from "../badge/role-badge";
import PermissionBadge from "../badge/permission-badge";
import NameTable from "./name-table";
import type { History } from "@/schemas/history-schema";
import type { Issue } from "@/schemas/issue-schema";
import type { Trashbin } from "@/schemas/trashbin-schema";
import type { Collection } from "@/schemas/collection-schema";
import IssueStatusBadge from "../badge/issue-status-badge";
import PriorityScoreBadge from "../badge/priority-score-badge";
import { IssueActionDropdown } from "../dropdown/issue-action-dropdown";
import WasteStatusBadge from "../badge/waste-status-badge";
import { formatLabel, generateIdNumber, getWasteStatus } from "@/lib/utils";
import OperationalStatusBadge from "../badge/operational-badge";
import CommittedBy from "../core/committed-by";
import CollectionActionsDropdown from "../dropdown/collection-actions-dropdown";
import TrashbinActionsDropdown from "../dropdown/trashbin-actions-dropdown";
import { HistoryActionsDropdown } from "../dropdown/history-actions-dropdown";
import TrashbinStatusBadge from "../badge/trashbin-is-full-badge";
import type { Activity } from "@/schemas/activity-schema";
import { ActivityActionsDropdown } from "../dropdown/activity-actions-dropdown";

function selectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
        className="ml-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

function dateColumn<T extends Record<string, unknown>>(
  columnName: string,
): ColumnDef<T> {
  return {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortingTableButton label={columnName} column={column} />
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {format(new Date(row.getValue("createdAt")), "eee, MMM d, yyyy")}
      </div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = new Date(rowA.getValue(columnId)).getTime();
      const b = new Date(rowB.getValue(columnId)).getTime();
      return a - b;
    },
    filterFn: (row, columnId, filterValue: DateRange | undefined) => {
      if (!filterValue?.from || !filterValue?.to) return true;

      const date = new Date(row.getValue(columnId));
      const from = new Date(filterValue.from);
      const to = new Date(filterValue.to);

      return date >= from && date <= to;
    },
  };
}

function updatedColumn<T extends Record<string, unknown>>(): ColumnDef<T> {
  return {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <SortingTableButton label="Last Updated" column={column} />
    ),
    cell: ({ row }) => {
      const value = row.getValue("updatedAt");
      if (!value) return "—";

      return (
        <div className="text-muted-foreground">
          {formatDistanceToNow(new Date(value as string), { addSuffix: true })}
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = new Date(rowA.getValue(columnId)).getTime();
      const b = new Date(rowB.getValue(columnId)).getTime();
      return a - b;
    },
  };
}

export const requestAccessColumns: ColumnDef<RequestAccess>[] = [
  selectColumn(),
  {
    accessorKey: "id",
    header: ({ column }) => <SortingTableButton label="ID" column={column} />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const generatedNumber = generateIdNumber(id);
      return <div className="uppercase">REQUEST-{generatedNumber}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const id = row.getValue(columnId) as string;
      const formatted = `REQUEST-${generateIdNumber(id)}`.toLowerCase();
      return formatted.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortingTableButton label="Name" column={column} />,
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <SortingTableButton label="Email" column={column} />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column, table }) => (
      <FilterTableButton
        label="Status"
        table={table}
        columns={column}
        filterOptions={requestAccessStatusFilter}
      />
    ),
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />;
    },
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
  dateColumn("Requested At"),
  updatedColumn(),
  {
    id: "actions",
    cell: ({ row }) => {
      return <RequestAccessActionsDropdown data={row.original} />;
    },
  },
];

export const userColumns: ColumnDef<User>[] = [
  selectColumn(),
  {
    accessorKey: "id",
    header: ({ column }) => <SortingTableButton label="ID" column={column} />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const generatedNumber = generateIdNumber(id);
      return <div className="uppercase">USER-{generatedNumber}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const id = row.getValue(columnId) as string;
      const formatted = `USER-${generateIdNumber(id)}`.toLowerCase();
      return formatted.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortingTableButton label="Name" column={column} />,
    cell: ({ row }) => {
      return <NameTable row={row} />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <SortingTableButton label="Email" column={column} />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column, table }) => (
      <FilterTableButton
        label="Role"
        table={table}
        columns={column}
        filterOptions={roleFilter}
      />
    ),
    cell: ({ row }) => {
      return <RoleBadge role={row.getValue("role")} />;
    },
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "permission",
    header: ({ column, table }) => (
      <FilterTableButton
        label="Permission"
        table={table}
        columns={column}
        filterOptions={permissionFilter}
      />
    ),
    cell: ({ row }) => {
      return <PermissionBadge permission={row.getValue("permission")} />;
    },
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
  dateColumn("Joined At"),
  {
    id: "actions",
    cell: ({ row }) => {
      return <UserActionsDropdown data={row.original} />;
    },
  },
  {
    accessorKey: "isArchive",
    header: "Archived",
    enableHiding: true,
  },
];

export const activityColumns: ColumnDef<Activity>[] = [
  selectColumn(),
  {
    accessorKey: "id",
    header: ({ column }) => <SortingTableButton label="ID" column={column} />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const generatedNumber = generateIdNumber(id);
      return <div className="uppercase">HISTORY-{generatedNumber}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const id = row.getValue(columnId) as string;
      const formatted = `HISTORY-${generateIdNumber(id)}`.toLowerCase();
      return formatted.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "entity",
    header: ({ column }) => (
      <SortingTableButton label="Title" column={column} />
    ),
    cell: ({ row }) => {
      const original = row.original as { description: string; entity: string };
      return (
        <div className="flex flex-row gap-2 items-center">
          <p className="text-xs text-muted-foreground border bg-background rounded-sm px-2 py-0.5 capitalize inline-flex items-center">
            {formatLabel(original.entity)}
          </p>
          <p>{formatLabel(original.description)}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "actorId",
    header: ({ column }) => (
      <SortingTableButton label="Commited By" column={column} />
    ),
    cell: ({ row }) => {
      return <CommittedBy userId={row.getValue("actorId")} enableRole={true} />;
    },
  },
  dateColumn("Created At"),
  updatedColumn(),
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActivityActionsDropdown data={row.original} />;
    },
  },
  {
    accessorKey: "isArchive",
    header: "Archived",
    enableHiding: true,
  },
];

export const issueColumns: ColumnDef<Issue>[] = [
  selectColumn(),
  {
    accessorKey: "id",
    header: ({ column }) => <SortingTableButton label="ID" column={column} />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const generatedNumber = generateIdNumber(id);
      return <div className="uppercase">ISSUE-{generatedNumber}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const id = row.getValue(columnId) as string;
      const formatted = `ISSUE-${generateIdNumber(id)}`.toLowerCase();
      return formatted.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <SortingTableButton label="Title" column={column} />
    ),
    cell: ({ row }) => {
      const original = row.original as { title: string; category: string };
      return (
        <div className="flex flex-row gap-2 items-center">
          <p className="text-xs text-muted-foreground border bg-background rounded-sm px-2 py-0.5 capitalize inline-flex items-center">
            {row.getValue("category")}
          </p>
          <p>{original.title}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column, table }) => (
      <FilterTableButton
        label="Status"
        table={table}
        columns={column}
        filterOptions={issueStatusFilter}
      />
    ),
    cell: ({ row }) => {
      return <IssueStatusBadge issue={row.getValue("status")} />;
    },
  },
  {
    accessorKey: "priority",
    header: ({ column, table }) => (
      <FilterTableButton
        label="Priority"
        table={table}
        columns={column}
        filterOptions={priorityStatusFilter}
      />
    ),
    cell: ({ row }) => {
      return <PriorityScoreBadge priority={row.getValue("priority")} />;
    },
  },
  dateColumn("Issued At"),
  updatedColumn(),
  {
    id: "actions",
    cell: ({ row }) => {
      return <IssueActionDropdown data={row.original} />;
    },
  },
  {
    accessorKey: "isArchive",
    header: "Archived",
    enableHiding: true,
  },
];

export const trashbinColumns: ColumnDef<Trashbin>[] = [
  selectColumn(),
  {
    accessorKey: "id",
    header: ({ column }) => <SortingTableButton label="ID" column={column} />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const generatedNumber = generateIdNumber(id);
      return <div className="uppercase">TRASHBIN-{generatedNumber}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const id = row.getValue(columnId) as string;
      const formatted = `TRASHBIN-${generateIdNumber(id)}`.toLowerCase();
      return formatted.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortingTableButton label="Name" column={column} />,
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <SortingTableButton label="Location" column={column} />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("location")}</div>;
    },
  },
  {
    accessorKey: "isOperational",
    header: ({ column }) => (
      <SortingTableButton label="Operational" column={column} />
    ),
    cell: ({ row }) => {
      return (
        <OperationalStatusBadge isOperational={row.getValue("isOperational")} />
      );
    },
  },
  dateColumn("Created At"),
  updatedColumn(),
  {
    id: "actions",
    cell: ({ row }) => {
      return <TrashbinActionsDropdown data={row.original} />;
    },
  },
  {
    accessorKey: "isArchive",
    header: "Archived",
    enableHiding: true,
  },
];

export const collectionColumns: ColumnDef<Collection>[] = [
  selectColumn(),
  {
    accessorKey: "id",
    header: ({ column }) => <SortingTableButton label="ID" column={column} />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const generatedNumber = generateIdNumber(id);
      return <div className="uppercase">COLLECTION-{generatedNumber}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const id = row.getValue(columnId) as string;
      const formatted = `COLLECTION-${generateIdNumber(id)}`.toLowerCase();
      return formatted.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "trashbinId",
    header: ({ column }) => (
      <SortingTableButton label="Trashbin Id" column={column} />
    ),
    cell: ({ row }) => {
      const id = row.getValue("trashbinId") as string;
      const generatedNumber = generateIdNumber(id);
      return <div className="uppercase">TRASHBIN-{generatedNumber}</div>;
    },
  },
  {
    accessorKey: "wasteLevel",
    header: ({ column, table }) => (
      <FilterTableButton
        label="Waste Level"
        table={table}
        columns={column}
        filterOptions={wasteLevelStatusFilter}
      />
    ),
    cell: ({ row }) => {
      const level = row.getValue<number>("wasteLevel");
      return <WasteStatusBadge status={getWasteStatus(level)} metric="waste" />;
    },
    filterFn: (row, columnId, filterValue) => {
      const level = row.getValue<number>(columnId);
      const status = getWasteStatus(level);

      if (Array.isArray(filterValue)) {
        return filterValue.includes(status);
      }

      return status === filterValue;
    },
  },
  {
    accessorKey: "weightLevel",
    header: ({ column, table }) => (
      <FilterTableButton
        label="Weight Level"
        table={table}
        columns={column}
        filterOptions={weightLevelStatusFilter}
      />
    ),
    cell: ({ row }) => {
      const weight = parseFloat(row.getValue("weightLevel"));
      return (
        <WasteStatusBadge status={getWasteStatus(weight)} metric="weight" />
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const level = row.getValue<number>(columnId);
      const status = getWasteStatus(level);

      if (Array.isArray(filterValue)) {
        return filterValue.includes(status);
      }

      return status === filterValue;
    },
  },
  {
    accessorKey: "batteryLevel",
    header: ({ column, table }) => (
      <FilterTableButton
        label="Battery Level"
        table={table}
        columns={column}
        filterOptions={batteryLevelStatusFilter}
      />
    ),
    cell: ({ row }) => {
      const battery = row.getValue<number>("batteryLevel");
      return (
        <WasteStatusBadge status={getWasteStatus(battery)} metric="battery" />
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const level = row.getValue<number>(columnId);
      const status = getWasteStatus(level);

      if (Array.isArray(filterValue)) {
        return filterValue.includes(status);
      }

      return status === filterValue;
    },
  },
  {
    accessorKey: "isFull",
    header: ({ column }) => (
      <SortingTableButton label="Is Full" column={column} />
    ),
    cell: ({ row }) => {
      return <TrashbinStatusBadge isFull={row.getValue("isFull")} />;
    },
  },
  dateColumn("Collected At"),
  {
    id: "actions",
    cell: ({ row }) => {
      return <CollectionActionsDropdown data={row.original} />;
    },
  },
  {
    accessorKey: "isArchive",
    header: "Archived",
    enableHiding: true,
  },
];

export const userHistoryColumns: ColumnDef<History>[] = [
  selectColumn(),
  {
    accessorKey: "id",
    header: ({ column }) => <SortingTableButton label="ID" column={column} />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const generatedNumber = generateIdNumber(id);
      return <div className="uppercase">HISTORY-{generatedNumber}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const id = row.getValue(columnId) as string;
      const formatted = `HISTORY-${generateIdNumber(id)}`.toLowerCase();
      return formatted.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "entity",
    header: ({ column }) => (
      <SortingTableButton label="Title" column={column} />
    ),
    cell: ({ row }) => {
      const original = row.original as { description: string; entity: string };
      return (
        <div className="flex flex-row gap-2 items-center">
          <p className="text-xs text-muted-foreground border bg-background rounded-sm px-2 py-0.5 capitalize inline-flex items-center">
            {formatLabel(original.entity)}
          </p>
          <p>{formatLabel(original.description)}</p>
        </div>
      );
    },
  },
  dateColumn("Created At"),
  {
    id: "actions",
    cell: ({ row }) => {
      return <HistoryActionsDropdown data={row.original} />;
    },
  },
  {
    accessorKey: "isArchive",
    header: "Archived",
    enableHiding: true,
  },
];

export const historyColumns: ColumnDef<History>[] = [
  selectColumn(),
  {
    accessorKey: "id",
    header: ({ column }) => <SortingTableButton label="ID" column={column} />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const generatedNumber = generateIdNumber(id);
      return <div className="uppercase">HISTORY-{generatedNumber}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const id = row.getValue(columnId) as string;
      const formatted = `HISTORY-${generateIdNumber(id)}`.toLowerCase();
      return formatted.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "entity",
    header: ({ column }) => (
      <SortingTableButton label="Title" column={column} />
    ),
    cell: ({ row }) => {
      const original = row.original as { description: string; entity: string };
      return (
        <div className="flex flex-row gap-2 items-center">
          <p className="text-xs text-muted-foreground border bg-background rounded-sm px-2 py-0.5 capitalize inline-flex items-center">
            {formatLabel(original.entity)}
          </p>
          <p>{formatLabel(original.description)}</p>
        </div>
      );
    },
  },
  dateColumn("Created At"),
  updatedColumn(),
  {
    id: "actions",
    cell: ({ row }) => {
      return <HistoryActionsDropdown data={row.original} />;
    },
  },
  {
    accessorKey: "isArchive",
    header: "Archived",
    enableHiding: true,
  },
];
