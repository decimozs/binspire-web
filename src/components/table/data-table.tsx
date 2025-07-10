import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import PaginationTable from "./pagination-table";
import SearchTable from "./search-table";
import { requestAccessColumns } from "./columns-table";
import NoResultsTable from "./no-results-table";
import ViewsTable from "./views-table";
import { selectionSonner } from "../ui/sonner";
import NavFilterTableButton from "./filter-table-button";
import { DateRangeFilterButton } from "../core/range-calendar";
import { ExportTableDataToExcel } from "../core/generate-excel-file";
import type { ResourceType } from "@/lib/types";
import { capitalizeFirstLetter, getWasteStatus } from "@/lib/utils";
import ShowArchivesTable from "./show-archives-table";
import { useIsMobile } from "@/hooks/use-mobile";

type DataTableProps<T extends { id: string; name?: string }> = {
  data: T[];
  searchPattern: keyof T & string;
  columns: ColumnDef<T, unknown>[];
  apiRoute: string;
  tableName: string;
  resourceType: ResourceType;
  viewsTable?: boolean;
};

export default function DataTable<T extends { id: string; name?: string }>({
  data,
  columns,
  searchPattern,
  apiRoute,
  tableName,
  resourceType,
  viewsTable = true,
}: DataTableProps<T>) {
  const isMobile = useIsMobile();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      isArchive: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [showArchives, setShowArchives] = React.useState(false);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getOptionalColumn = (columnId: string) =>
    table.getAllColumns().some((col) => col.id === columnId)
      ? table.getColumn(columnId)
      : undefined;

  const statusColumn = getOptionalColumn("status");
  const statusFilterOptions = statusColumn
    ? Array.from(statusColumn.getFacetedUniqueValues()?.keys() || []).map(
        (value) => ({
          navFilterValue: value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
        }),
      )
    : [];

  const roleColumn = getOptionalColumn("role");
  const roleFilterOptions = roleColumn
    ? Array.from(roleColumn.getFacetedUniqueValues()?.keys() || []).map(
        (value) => ({
          navFilterValue: value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
        }),
      )
    : [];

  const permissionColumn = getOptionalColumn("permission");
  const permissionFilterOptions = permissionColumn
    ? Array.from(permissionColumn.getFacetedUniqueValues()?.keys() || []).map(
        (value) => ({
          navFilterValue: value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
        }),
      )
    : [];

  const weightLevelColumn = getOptionalColumn("weightLevel");
  const weightLevelFilterOptions = weightLevelColumn
    ? Array.from(
        new Set(
          Array.from(
            weightLevelColumn.getFacetedUniqueValues()?.keys() || [],
          ).map((value) => {
            const num = typeof value === "number" ? value : parseFloat(value);
            return getWasteStatus(num);
          }),
        ),
      ).map((status) => ({
        navFilterValue: status,
        label: capitalizeFirstLetter(status),
      }))
    : [];

  const wasteLevelColumn = getOptionalColumn("wasteLevel");
  const wasteLevelFilterOptions = wasteLevelColumn
    ? Array.from(
        new Set(
          Array.from(
            wasteLevelColumn.getFacetedUniqueValues()?.keys() || [],
          ).map((value) => {
            const num = typeof value === "number" ? value : parseFloat(value);
            return getWasteStatus(num);
          }),
        ),
      ).map((status) => ({
        navFilterValue: status,
        label: capitalizeFirstLetter(status),
      }))
    : [];

  const batteryLevelColumn = getOptionalColumn("batteryLevel");
  const batteryLevelFilterOptions = batteryLevelColumn
    ? Array.from(
        new Set(
          Array.from(
            batteryLevelColumn.getFacetedUniqueValues()?.keys() || [],
          ).map((value) => {
            const num = typeof value === "number" ? value : parseFloat(value);
            return getWasteStatus(num);
          }),
        ),
      ).map((status) => ({
        navFilterValue: status,
        label: capitalizeFirstLetter(status),
      }))
    : [];

  const priorityColumn = getOptionalColumn("priority");
  const priorityFilterOptions = priorityColumn
    ? Array.from(priorityColumn.getFacetedUniqueValues()?.keys() || []).map(
        (value) => ({
          navFilterValue: value,
          label:
            typeof value === "string"
              ? value.charAt(0).toUpperCase() + value.slice(1)
              : value,
        }),
      )
    : [];

  const categoryColumn = getOptionalColumn("category");
  const categoryFilterOptions = categoryColumn
    ? Array.from(categoryColumn.getFacetedUniqueValues()?.keys() || []).map(
        (value) => ({
          navFilterValue: value,
          label:
            typeof value === "string"
              ? value.charAt(0).toUpperCase() + value.slice(1)
              : value,
        }),
      )
    : [];

  const entityColumn = getOptionalColumn("entity");
  const entityFilterOptions = entityColumn
    ? Array.from(entityColumn.getFacetedUniqueValues()?.keys() || []).map(
        (value) => ({
          navFilterValue: value,
          label:
            typeof value === "string"
              ? value.charAt(0).toUpperCase() + value.slice(1)
              : value,
        }),
      )
    : [];

  const actionColumn = getOptionalColumn("action");
  const actionFilterOptions = actionColumn
    ? Array.from(actionColumn.getFacetedUniqueValues()?.keys() || []).map(
        (value) => ({
          navFilterValue: value,
          label:
            typeof value === "string"
              ? value.charAt(0).toUpperCase() + value.slice(1)
              : value,
        }),
      )
    : [];

  useEffect(() => {
    const isArchiveColumn = table.getColumn("isArchive");
    const statusColumn = table.getColumn("status");

    if (isArchiveColumn) {
      isArchiveColumn.setFilterValue(showArchives);
    } else if (statusColumn) {
      statusColumn.setFilterValue(showArchives ? "archived" : undefined);
    }
  }, [showArchives]);

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const currentCount = selectedRows.length;
    const selectedData = selectedRows.map((row) => row.original);

    selectionSonner({
      table,
      selectedData,
      currentCount,
      apiRoute,
      resourceType,
    });
  }, [rowSelection]);

  return (
    <div className="w-full">
      {!isMobile ? (
        <div className="flex items-center flex-row justify-between mb-4">
          <div className="flex flex-row items-center gap-2">
            <SearchTable table={table} pattern={searchPattern} />
            {statusColumn && (
              <NavFilterTableButton
                label="Status"
                table={table}
                columns={statusColumn}
                navFilterOptions={statusFilterOptions}
              />
            )}
            {roleColumn && (
              <NavFilterTableButton
                label="Role"
                table={table}
                columns={roleColumn}
                navFilterOptions={roleFilterOptions}
              />
            )}
            {permissionColumn && (
              <NavFilterTableButton
                label="Permission"
                table={table}
                columns={permissionColumn}
                navFilterOptions={permissionFilterOptions}
              />
            )}
            {wasteLevelColumn && (
              <NavFilterTableButton
                label="Waste Level"
                table={table}
                columns={wasteLevelColumn}
                navFilterOptions={wasteLevelFilterOptions}
              />
            )}
            {weightLevelColumn && (
              <NavFilterTableButton
                label="Weight Level"
                table={table}
                columns={weightLevelColumn}
                navFilterOptions={weightLevelFilterOptions}
              />
            )}
            {batteryLevelColumn && (
              <NavFilterTableButton
                label="Battery Level"
                table={table}
                columns={batteryLevelColumn}
                navFilterOptions={batteryLevelFilterOptions}
              />
            )}
            {priorityColumn && (
              <NavFilterTableButton
                label="Priority"
                table={table}
                columns={priorityColumn}
                navFilterOptions={priorityFilterOptions}
              />
            )}
            {categoryColumn && (
              <NavFilterTableButton
                label="Category"
                table={table}
                columns={categoryColumn}
                navFilterOptions={categoryFilterOptions}
              />
            )}
            {entityColumn && (
              <NavFilterTableButton
                label="Entity"
                table={table}
                columns={entityColumn}
                navFilterOptions={entityFilterOptions}
              />
            )}
            {actionColumn && (
              <NavFilterTableButton
                label="Action"
                table={table}
                columns={actionColumn}
                navFilterOptions={actionFilterOptions}
              />
            )}
            <DateRangeFilterButton
              column={table.getColumn("createdAt")}
              table={table}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <ShowArchivesTable
              showArchives={showArchives}
              toggleArchives={() => setShowArchives((prev) => !prev)}
            />
            <ExportTableDataToExcel
              data={table.getRowModel().rows.map((row) => row.original)}
              filename={`${tableName}.xlsx`}
            />
            {viewsTable && <ViewsTable table={table} />}
          </div>
        </div>
      ) : (
        <div className="flex flex-col mb-4">
          <div className="flex flex-col gap-4">
            <SearchTable table={table} pattern={searchPattern} />
            <div className="flex flex-row gap-2 overflow-y-auto">
              {statusColumn && (
                <NavFilterTableButton
                  label="Status"
                  table={table}
                  columns={statusColumn}
                  navFilterOptions={statusFilterOptions}
                />
              )}
              {roleColumn && (
                <NavFilterTableButton
                  label="Role"
                  table={table}
                  columns={roleColumn}
                  navFilterOptions={roleFilterOptions}
                />
              )}
              {permissionColumn && (
                <NavFilterTableButton
                  label="Permission"
                  table={table}
                  columns={permissionColumn}
                  navFilterOptions={permissionFilterOptions}
                />
              )}
              {wasteLevelColumn && (
                <NavFilterTableButton
                  label="Waste Level"
                  table={table}
                  columns={wasteLevelColumn}
                  navFilterOptions={wasteLevelFilterOptions}
                />
              )}
              {weightLevelColumn && (
                <NavFilterTableButton
                  label="Weight Level"
                  table={table}
                  columns={weightLevelColumn}
                  navFilterOptions={weightLevelFilterOptions}
                />
              )}
              {batteryLevelColumn && (
                <NavFilterTableButton
                  label="Battery Level"
                  table={table}
                  columns={batteryLevelColumn}
                  navFilterOptions={batteryLevelFilterOptions}
                />
              )}
              {priorityColumn && (
                <NavFilterTableButton
                  label="Priority"
                  table={table}
                  columns={priorityColumn}
                  navFilterOptions={priorityFilterOptions}
                />
              )}
              {categoryColumn && (
                <NavFilterTableButton
                  label="Category"
                  table={table}
                  columns={categoryColumn}
                  navFilterOptions={categoryFilterOptions}
                />
              )}
              {entityColumn && (
                <NavFilterTableButton
                  label="Entity"
                  table={table}
                  columns={entityColumn}
                  navFilterOptions={entityFilterOptions}
                />
              )}
              {actionColumn && (
                <NavFilterTableButton
                  label="Action"
                  table={table}
                  columns={actionColumn}
                  navFilterOptions={actionFilterOptions}
                />
              )}
              <DateRangeFilterButton
                column={table.getColumn("createdAt")}
                table={table}
              />
              <ShowArchivesTable
                showArchives={showArchives}
                toggleArchives={() => setShowArchives((prev) => !prev)}
              />
              <ExportTableDataToExcel
                data={table.getRowModel().rows.map((row) => row.original)}
                filename={`${tableName}.xlsx`}
              />
              {viewsTable && <ViewsTable table={table} />}
            </div>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-15">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <NoResultsTable columns={requestAccessColumns} />
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationTable table={table} />
    </div>
  );
}
